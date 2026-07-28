importScripts('trade-compat.js', 'league-data.js');

// in-page iframe 사이드바 방식으로 전환됨.
// 클린 설치 직후 이미 열려 있던 거래소 탭에는 content script가 없을 수 있으므로,
// 메시지 실패 시 content.js/content.css를 즉시 주입한 뒤 다시 토글한다.
function isTradeTabUrl(url) {
  return /^https:\/\/(?:poe\.kakaogames\.com|poe\.game\.daum\.net|www\.pathofexile\.com)\//i.test(String(url || ''));
}

function isInjectablePageUrl(url) {
  return /^(?:https?|file):\/\//i.test(String(url || ''));
}

function getStoredSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get(['settings'], result => resolve(result.settings || {}));
  });
}

function isSidebarAllowedOnUrl(url, settings) {
  return isTradeTabUrl(url) || !!settings.allowGlobalSidebar;
}

async function sendSidebarToggle(tabId) {
  await chrome.tabs.sendMessage(tabId, { type: 'TOGGLE_SIDEBAR' });
}

async function sendSidebarOpen(tabId) {
  await chrome.tabs.sendMessage(tabId, { type: 'OPEN_SIDEBAR' });
}

async function injectSidebarContentScript(tabId) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    files: ['content.css']
  });
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['trade-compat.js', 'content.js']
  });
}

chrome.action.onClicked.addListener((tab) => {
  handleActionClick(tab);
});

async function handleActionClick(tab) {
  const settings = await getStoredSettings();
  if (!tab?.id || !isInjectablePageUrl(tab.url) || !isSidebarAllowedOnUrl(tab.url, settings)) {
    appendDebugLogEntry({
      kind: 'action-click-ignored',
      reason: !tab?.id
        ? 'missing-tab-id'
        : (!isInjectablePageUrl(tab.url) ? 'unsupported-url' : 'global-sidebar-disabled'),
      tabUrl: tab?.url || ''
    });
    return;
  }
  sendSidebarToggle(tab.id)
    .then(() => appendDebugLogEntry({
      kind: 'sidebar-toggle-sent',
      tabId: tab.id,
      tabUrl: tab.url || ''
    }))
    .catch(async (firstError) => {
      appendDebugLogEntry({
        kind: 'sidebar-toggle-missed',
        tabId: tab.id,
        tabUrl: tab.url || '',
        error: serializeDebugError(firstError)
      });
      try {
        await injectSidebarContentScript(tab.id);
        appendDebugLogEntry({
          kind: 'sidebar-content-injected',
          tabId: tab.id,
          tabUrl: tab.url || ''
        });
        await sendSidebarOpen(tab.id);
        appendDebugLogEntry({
          kind: 'sidebar-open-sent-after-inject',
          tabId: tab.id,
          tabUrl: tab.url || ''
        });
      } catch (injectError) {
        appendDebugLogEntry({
          kind: 'sidebar-inject-failed',
          tabId: tab.id,
          tabUrl: tab.url || '',
          error: serializeDebugError(injectError)
        });
      }
    });
}

const DEFAULT_LEAGUE = 'Runes of Aldur';
const TRADE_REALM_POE1 = 'poe1';
const TRADE_REALM_POE2 = 'poe2';
const DEBUG_LOG_KEY = 'debugLogs';
const ERROR_LOG_KEY = 'errorLogs';
const DEFAULT_BUILD_NAME = '기본 빌드';
const APP_STATE_REVISION_KEY = 'appStateRevision';
let appStateMutationQueue = Promise.resolve();
const TRADE_LEAGUE_CACHE_TTL_MS = 30 * 60 * 1000;
const tradeLeagueCache = new Map();

async function fetchTradeLeagues(realm, forceRefresh = false) {
  const normalizedRealm = POE2TQLeagueData.normalizeRealm(realm);
  const cached = tradeLeagueCache.get(normalizedRealm);
  if (!forceRefresh && cached && Date.now() - cached.fetchedAt < TRADE_LEAGUE_CACHE_TTL_MS) {
    return cached.leagues.slice();
  }

  const url = normalizedRealm === TRADE_REALM_POE1
    ? 'https://poe.game.daum.net/api/trade/data/leagues'
    : 'https://poe.kakaogames.com/api/trade2/data/leagues';
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  const leagues = POE2TQLeagueData.normalizeLeagueResponse(payload, normalizedRealm);
  tradeLeagueCache.set(normalizedRealm, { leagues, fetchedAt: Date.now() });
  return leagues.slice();
}

function enqueueAppStateMutation(task) {
  const operation = appStateMutationQueue.then(task, task);
  appStateMutationQueue = operation.catch(() => {});
  return operation;
}

function getLegacyFiltersForRealm(filtersByLeague, league, realm) {
  return (filtersByLeague?.[league] || []).filter(filter => {
    return normalizeTradeRealm(filter?.tradeRealm) === normalizeTradeRealm(realm);
  });
}

function mergeConcurrentFilters(incomingMaps, currentMaps, baseRevision) {
  return POE2TQTradeCompat.mergeConcurrentFilters(incomingMaps, currentMaps, baseRevision);
}

function carryForwardFilterRevisions(nextMaps, currentMaps, nextRevision) {
  return POE2TQTradeCompat.carryForwardFilterRevisions(nextMaps, currentMaps, nextRevision);
}

function getDuplicateFilter(filtersByLeague, storageKey, league, realm, sourceHash) {
  if (!sourceHash) return null;
  const scoped = filtersByLeague?.[storageKey] || [];
  return scoped.find(filter => filter?.sourceHash === sourceHash)
    || getLegacyFiltersForRealm(filtersByLeague, league, realm).find(filter => filter?.sourceHash === sourceHash)
    || null;
}

function getExtensionVersion() {
  try {
    return chrome.runtime.getManifest().version || '';
  } catch (_) {
    return '';
  }
}

function serializeDebugError(error) {
  if (!error) return { message: '' };
  if (typeof error === 'string') return { message: error };
  return {
    name: error.name || '',
    message: error.message || String(error),
    stack: error.stack || ''
  };
}

function makeLogEntry(entry) {
  return {
    loggedAt: new Date().toISOString(),
    extensionVersion: getExtensionVersion(),
    ...entry
  };
}

function isErrorLogEntry(entry) {
  const kind = String(entry?.kind || '');
  if (entry?.severity === 'error') return true;
  if (/(?:^|-)error$|(?:^|-)failed$|fatal|exception|unhandled/i.test(kind)) return true;
  return [
    'content-error',
    'sidepanel-init-error',
    'sidepanel-runtime-error',
    'sidepanel-unhandled-rejection',
    'search-error',
    'search-eval-error',
    'sidebar-inject-failed',
    'trade-query-hydrate-failed'
  ].includes(kind);
}

function getCurrentLeague(result) {
  return (result.settings && result.settings.league) || DEFAULT_LEAGUE;
}

function normalizeTradeRealm(realm) {
  return realm === TRADE_REALM_POE1 ? TRADE_REALM_POE1 : TRADE_REALM_POE2;
}

function getRealmLeagueStorageKey(realm, league) {
  return POE2TQTradeCompat.makeRealmLeagueKey(normalizeTradeRealm(realm), league);
}

function buildTradeFetchUrl(itemId, realm, queryId = '') {
  const normalizedRealm = normalizeTradeRealm(realm);
  const apiBase = normalizedRealm === TRADE_REALM_POE1
    ? 'https://www.pathofexile.com/api/trade'
    : 'https://www.pathofexile.com/api/trade2';
  const baseUrl = `${apiBase}/fetch/${encodeURIComponent(itemId)}?query=${encodeURIComponent(queryId)}`;
  return normalizedRealm === TRADE_REALM_POE2 ? `${baseUrl}&realm=poe2` : baseUrl;
}

const POE1_ITEM_ICON_CACHE_TTL_MS = 30 * 60 * 1000;
const poe1ItemIconCatalogCache = new Map();
let poe1BundledFlaskIconsPromise = null;

function normalizePoe1ItemIconKey(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function fetchPoe1NinjaItemLines(league, itemType) {
  const url = `https://poe.ninja/poe1/api/economy/stash/current/item/overview?league=${encodeURIComponent(league)}&type=${encodeURIComponent(itemType)}&withItems=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${itemType}: HTTP ${response.status}`);
  const payload = await response.json();
  return Array.isArray(payload?.lines) ? payload.lines : [];
}

function loadPoe1BundledFlaskIcons() {
  if (!poe1BundledFlaskIconsPromise) {
    poe1BundledFlaskIconsPromise = fetch(chrome.runtime.getURL('data/poe1-flask-icons.json'))
      .then(response => {
        if (!response.ok) throw new Error(`플라스크 이미지 데이터: HTTP ${response.status}`);
        return response.json();
      })
      .catch(() => ({}));
  }
  return poe1BundledFlaskIconsPromise;
}

async function loadPoe1ItemIconCatalog(league) {
  const cacheKey = String(league || 'Standard');
  const cached = poe1ItemIconCatalogCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < POE1_ITEM_ICON_CACHE_TTL_MS) return cached.catalog;
  if (cached?.promise) return cached.promise;

  const promise = (async () => {
    const types = ['BaseType', 'UniqueWeapon', 'UniqueArmour', 'UniqueAccessory', 'UniqueJewel', 'UniqueFlask'];
    const [settled, bundledFlaskIcons] = await Promise.all([
      Promise.allSettled(types.map(type => fetchPoe1NinjaItemLines(cacheKey, type))),
      loadPoe1BundledFlaskIcons()
    ]);
    const baseIcons = new Map();
    const uniqueIcons = new Map();
    Object.entries(bundledFlaskIcons || {}).forEach(([name, icon]) => {
      const key = normalizePoe1ItemIconKey(name);
      if (key && icon) baseIcons.set(key, String(icon));
    });
    settled.forEach((result, index) => {
      if (result.status !== 'fulfilled') return;
      const target = types[index] === 'BaseType' ? baseIcons : uniqueIcons;
      result.value.forEach(line => {
        const icon = String(line?.icon || line?.image || '').trim();
        if (!icon) return;
        const values = types[index] === 'BaseType'
          ? [line?.name, line?.baseType]
          : [line?.name];
        values.forEach(value => {
          const key = normalizePoe1ItemIconKey(value);
          if (key && !target.has(key)) target.set(key, icon);
        });
      });
    });
    if (!baseIcons.size && !uniqueIcons.size) {
      const reasons = settled
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message || String(result.reason));
      throw new Error(reasons.join(', ') || '아이콘 카탈로그가 비어 있습니다.');
    }
    const catalog = { baseIcons, uniqueIcons };
    poe1ItemIconCatalogCache.set(cacheKey, { catalog, fetchedAt: Date.now() });
    return catalog;
  })();
  poe1ItemIconCatalogCache.set(cacheKey, { promise, fetchedAt: Date.now() });
  try {
    return await promise;
  } catch (error) {
    poe1ItemIconCatalogCache.delete(cacheKey);
    throw error;
  }
}

async function resolvePoe1ItemIcons(league, items) {
  const catalog = await loadPoe1ItemIconCatalog(league);
  return (Array.isArray(items) ? items : []).map(item => {
    const nameKey = normalizePoe1ItemIconKey(item?.name);
    const baseKey = normalizePoe1ItemIconKey(item?.baseType || item?.typeLine);
    const isUnique = Number(item?.frameType) === 3 || Number(item?.frameType) === 9;
    return (isUnique ? catalog.uniqueIcons.get(nameKey) : '')
      || catalog.baseIcons.get(baseKey)
      || catalog.uniqueIcons.get(nameKey)
      || '';
  });
}

function getMigratedFiltersByLeague(result) {
  let filtersByLeague = result.filtersByLeague || {};
  if (Array.isArray(result.filters) && result.filters.length && !result.filtersByLeague) {
    const league = getCurrentLeague(result);
    filtersByLeague = {
      ...filtersByLeague,
      [getRealmLeagueStorageKey(TRADE_REALM_POE2, league)]: result.filters
    };
  }
  return filtersByLeague;
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function makeBuildTab(name, type, key) {
  return {
    id: makeId(type || 'tab'),
    key: key || '',
    name,
    type: type || 'custom',
    filterIds: []
  };
}

function getMandatoryBuildTabSpecs(realm) {
  return normalizeTradeRealm(realm) === TRADE_REALM_POE1
    ? [
        { key: 'equipment', name: '장비', type: 'equipment' },
        { key: 'map', name: '지도', type: 'map' },
        { key: 'contract', name: '계약', type: 'contract' }
      ]
    : [
        { key: 'equipment', name: '장비', type: 'equipment' },
        { key: 'slate', name: '서판', type: 'slate' }
      ];
}

function makeBuild(name, realm) {
  const tabs = getMandatoryBuildTabSpecs(realm).map(spec => makeBuildTab(spec.name, spec.type, spec.key));
  return {
    id: makeId('build'),
    name: name || DEFAULT_BUILD_NAME,
    tabs,
    activeTabId: tabs[0].id,
    savedAt: new Date().toISOString()
  };
}

function ensureBuildState(league, filtersByLeague, buildsByLeague, buildUiByLeague) {
  const filters = filtersByLeague[league] || [];
  const builds = Array.isArray(buildsByLeague[league]) ? buildsByLeague[league].slice() : [];
  const ui = { ...(buildUiByLeague[league] || {}) };
  const realm = POE2TQTradeCompat.parseRealmLeagueKey(league)?.realm || TRADE_REALM_POE2;
  const mandatorySpecs = getMandatoryBuildTabSpecs(realm);
  let changed = false;

  if (!builds.length) {
    builds.push(makeBuild(DEFAULT_BUILD_NAME, realm));
    changed = true;
  }

  builds.forEach(build => {
    if (!Array.isArray(build.tabs) || !build.tabs.length) {
      const next = makeBuild(build.name || DEFAULT_BUILD_NAME, realm);
      build.tabs = next.tabs;
      build.activeTabId = next.activeTabId;
      changed = true;
    }
    const retiredTabs = realm === TRADE_REALM_POE1
      ? build.tabs.filter(tab => tab.key === 'slate' || tab.type === 'slate')
      : [];
    const mandatoryTabs = mandatorySpecs.map(spec => {
      let tab = build.tabs.find(entry => entry.key === spec.key || entry.type === spec.type);
      if (!tab) {
        tab = makeBuildTab(spec.name, spec.type, spec.key);
        build.tabs.push(tab);
        changed = true;
      }
      tab.key = spec.key;
      tab.type = spec.type;
      if (!tab.name) tab.name = spec.name;
      return tab;
    });
    if (retiredTabs.length) {
      const equipmentTab = mandatoryTabs.find(tab => tab.key === 'equipment');
      equipmentTab.filterIds = Array.from(new Set([
        ...(equipmentTab.filterIds || []),
        ...retiredTabs.flatMap(tab => tab.filterIds || [])
      ].map(String)));
      const mandatoryIds = new Set(mandatoryTabs.map(tab => tab.id));
      const retiredIds = new Set(retiredTabs.map(tab => tab.id));
      build.tabs = mandatoryTabs.concat(build.tabs.filter(tab => !mandatoryIds.has(tab.id) && !retiredIds.has(tab.id)));
      changed = true;
    } else {
      const mandatoryIds = new Set(mandatoryTabs.map(tab => tab.id));
      build.tabs = mandatoryTabs.concat(build.tabs.filter(tab => !mandatoryIds.has(tab.id)));
    }
    if (!build.tabs.some(tab => tab.id === build.activeTabId)) {
      build.activeTabId = build.tabs[0].id;
      changed = true;
    }
    build.tabs.forEach(tab => {
      if (!Array.isArray(tab.filterIds)) {
        tab.filterIds = [];
        changed = true;
      }
    });
  });

  if (!ui.selectedBuildId || !builds.some(build => build.id === ui.selectedBuildId)) {
    ui.selectedBuildId = builds[0].id;
    changed = true;
  }

  const firstBuild = builds[0];
  const firstTab = firstBuild.tabs[0];
  const assigned = new Set();
  builds.forEach(build => build.tabs.forEach(tab => (tab.filterIds || []).forEach(id => assigned.add(String(id)))));
  filters.forEach(filter => {
    const filterId = String(filter.id);
    if (!assigned.has(filterId)) {
      firstTab.filterIds.push(filterId);
      assigned.add(filterId);
      changed = true;
    }
  });

  const filterById = new Map(filters.map(filter => [String(filter.id), filter]));
  builds.forEach(build => {
    const mandatoryKeys = new Set(mandatorySpecs.map(spec => spec.key));
    const mandatoryTabs = new Map(build.tabs.filter(tab => mandatoryKeys.has(tab.key)).map(tab => [tab.key, tab]));
    mandatoryTabs.forEach((tab, tabKey) => {
      [...(tab.filterIds || [])].forEach(filterId => {
        const preferredKey = inferTargetTabKey(filterById.get(String(filterId)));
        if (!preferredKey || preferredKey === tabKey || !mandatoryTabs.has(preferredKey)) return;
        tab.filterIds = tab.filterIds.filter(id => String(id) !== String(filterId));
        const target = mandatoryTabs.get(preferredKey);
        if (!target.filterIds.some(id => String(id) === String(filterId))) target.filterIds.push(String(filterId));
        changed = true;
      });
    });
  });

  buildsByLeague[league] = builds;
  buildUiByLeague[league] = ui;

  const selectedBuild = builds.find(build => build.id === ui.selectedBuildId) || builds[0];
  const activeTab = selectedBuild.tabs.find(tab => tab.id === selectedBuild.activeTabId) || selectedBuild.tabs[0];

  return { buildsByLeague, buildUiByLeague, selectedBuild, activeTab, changed };
}

function inferTargetTabKey(filter) {
  return POE2TQTradeCompat.getPreferredBuildTabKey(filter, filter?.tradeRealm);
}

function resolveTargetTab(selectedBuild, activeTab, filter) {
  if (!selectedBuild || !Array.isArray(selectedBuild.tabs) || !selectedBuild.tabs.length) {
    return activeTab || null;
  }
  const preferredKey = inferTargetTabKey(filter);
  if (preferredKey) {
    const matched = selectedBuild.tabs.find(tab => tab.key === preferredKey || tab.type === preferredKey);
    if (matched) return matched;
  }
  return activeTab || selectedBuild.tabs.find(tab => tab.id === selectedBuild.activeTabId) || selectedBuild.tabs[0] || null;
}

function appendStoredLog(key, entry, done) {
  chrome.storage.local.get([key], (result) => {
    if (chrome.runtime.lastError) {
      done?.({ ok: false, error: chrome.runtime.lastError.message });
      return;
    }
    const logs = Array.isArray(result[key]) ? result[key].slice() : [];
    logs.push(entry);
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    chrome.storage.local.set({ [key]: logs }, () => {
      if (chrome.runtime.lastError) {
        done?.({ ok: false, error: chrome.runtime.lastError.message });
        return;
      }
      done?.({ ok: true, count: logs.length });
    });
  });
}

function appendDebugLogEntry(entry, done) {
  const logEntry = makeLogEntry(entry);
  appendStoredLog(DEBUG_LOG_KEY, logEntry, (result) => {
    if (isErrorLogEntry(logEntry)) {
      appendStoredLog(ERROR_LOG_KEY, logEntry);
    }
    done?.(result);
  });
}

function appendErrorLogEntry(entry, done) {
  appendStoredLog(ERROR_LOG_KEY, makeLogEntry(entry), done);
}

function appendDebugLog(entry, sendResponse) {
  appendDebugLogEntry(entry, sendResponse);
}

chrome.runtime.onInstalled.addListener((details) => {
  appendDebugLogEntry({
    kind: 'runtime-installed',
    reason: details.reason || '',
    previousVersion: details.previousVersion || ''
  });
});

chrome.runtime.onStartup.addListener(() => {
  appendDebugLogEntry({
    kind: 'runtime-startup'
  });
});

chrome.tabs.onZoomChange.addListener((info) => {
  if (!info?.tabId) return;
  chrome.tabs.sendMessage(info.tabId, {
    type: 'TAB_ZOOM_CHANGED',
    zoomFactor: info.newZoomFactor || 1
  }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'FETCH_TRADE_LEAGUES') {
    fetchTradeLeagues(msg.realm, msg.forceRefresh === true)
      .then(leagues => sendResponse({ ok: true, leagues }))
      .catch(error => sendResponse({
        ok: false,
        leagues: POE2TQLeagueData.getFallbackLeagues(msg.realm),
        error: serializeDebugError(error).message
      }));
    return true;
  }

  if (msg.type === 'GET_TAB_ZOOM') {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ ok: false, error: 'missing-tab-id' });
      return false;
    }
    chrome.tabs.getZoom(tabId)
      .then(zoom => sendResponse({ ok: true, zoom: zoom || 1 }))
      .catch(error => sendResponse({ ok: false, error: serializeDebugError(error).message }));
    return true;
  }

  if (msg.type === 'INSTALL_TRADE_FETCH_BRIDGE') {
    const tabId = sender?.tab?.id;
    if (!tabId) {
      sendResponse({ ok: false, error: 'missing-tab-id' });
      return false;
    }
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['page-trade-fetch-bridge.js'],
      world: 'MAIN'
    })
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ ok: false, error: serializeDebugError(error).message }));
    return true;
  }

  if (msg.type === 'SAVE_FILTER') {
    enqueueAppStateMutation(async () => {
      const result = await chrome.storage.local.get([
        'filters', 'filtersByLeague', 'buildsByLeague', 'buildUiByLeague', 'settings', APP_STATE_REVISION_KEY
      ]);
      const league = msg.league || msg.filter?.league || getCurrentLeague(result);
      const realm = normalizeTradeRealm(msg.realm || msg.filter?.tradeRealm || result.settings?.tradeRealm);
      const storageKey = getRealmLeagueStorageKey(realm, league);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const buildsByLeague = result.buildsByLeague || {};
      const buildUiByLeague = result.buildUiByLeague || {};
      const duplicate = getDuplicateFilter(filtersByLeague, storageKey, league, realm, msg.filter?.sourceHash);
      if (duplicate) {
        return { ok: true, duplicate: true, name: duplicate.name, league, realm };
      }
      const nextRevision = Number(result[APP_STATE_REVISION_KEY] || 0) + 1;
      const buildState = ensureBuildState(storageKey, filtersByLeague, buildsByLeague, buildUiByLeague);
      const arr = (filtersByLeague[storageKey] || []).slice();
      const savedFilter = { ...msg.filter, league, tradeRealm: realm, _storageRevision: nextRevision };
      arr.push(savedFilter);
      filtersByLeague[storageKey] = arr;
      const targetTab = resolveTargetTab(buildState.selectedBuild, buildState.activeTab, savedFilter);
      const filterId = String(savedFilter.id);
      if (targetTab && !targetTab.filterIds.includes(filterId)) {
        targetTab.filterIds.push(filterId);
      }
      if (targetTab && buildState.selectedBuild) {
        buildState.selectedBuild.activeTabId = targetTab.id;
      }
      const writes = {
        filtersByLeague,
        buildsByLeague: buildState.buildsByLeague,
        buildUiByLeague: buildState.buildUiByLeague,
        [APP_STATE_REVISION_KEY]: nextRevision
      };
      await chrome.storage.local.set(writes);
      if (Array.isArray(result.filters)) await chrome.storage.local.remove('filters');
      return {
        ok: true,
        total: arr.length,
        league,
        realm,
        revision: nextRevision,
        buildId: buildState.selectedBuild?.id || '',
        tabId: targetTab?.id || ''
      };
    }).then(sendResponse).catch(error => {
      sendResponse({ ok: false, error: serializeDebugError(error).message });
    });
    return true;
  }

  if (msg.type === 'CHECK_DUPLICATE') {
    appStateMutationQueue.then(async () => {
      const result = await chrome.storage.local.get(['filters', 'filtersByLeague', 'settings']);
      const league = msg.league || getCurrentLeague(result);
      const realm = normalizeTradeRealm(msg.realm || result.settings?.tradeRealm);
      const storageKey = getRealmLeagueStorageKey(realm, league);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const duplicate = getDuplicateFilter(filtersByLeague, storageKey, league, realm, msg.hash);
      return { duplicate: !!duplicate, name: duplicate?.name, league, realm };
    }).then(sendResponse).catch(error => {
      sendResponse({ duplicate: false, error: serializeDebugError(error).message });
    });
    return true;
  }

  if (msg.type === 'PERSIST_APP_STATE') {
    enqueueAppStateMutation(async () => {
      const result = await chrome.storage.local.get([
        'filtersByLeague', 'buildsByLeague', 'buildUiByLeague', 'settings', APP_STATE_REVISION_KEY
      ]);
      const currentRevision = Number(result[APP_STATE_REVISION_KEY] || 0);
      const baseRevision = Number(msg.baseRevision || 0);
      const incomingFilters = msg.filtersByLeague || {};
      const filtersByLeague = currentRevision > baseRevision
        ? mergeConcurrentFilters(incomingFilters, result.filtersByLeague || {}, baseRevision)
        : incomingFilters;
      const nextRevision = currentRevision + 1;
      carryForwardFilterRevisions(filtersByLeague, result.filtersByLeague || {}, nextRevision);

      const buildsByLeague = msg.buildsByLeague || {};
      const buildUiByLeague = msg.buildUiByLeague || {};
      Object.keys(filtersByLeague).forEach(storageKey => {
        ensureBuildState(storageKey, filtersByLeague, buildsByLeague, buildUiByLeague);
      });

      await chrome.storage.local.set({
        filtersByLeague,
        buildsByLeague,
        buildUiByLeague,
        settings: msg.settings || result.settings || {},
        [APP_STATE_REVISION_KEY]: nextRevision
      });
      return { ok: true, revision: nextRevision };
    }).then(sendResponse).catch(error => {
      sendResponse({ ok: false, error: serializeDebugError(error).message });
    });
    return true;
  }

  if (msg.type === 'APPEND_DEBUG_LOG') {
    appendDebugLog(msg.entry || {}, sendResponse);
    return true;
  }

  if (msg.type === 'APPEND_ERROR_LOG') {
    appendErrorLogEntry(msg.entry || {}, sendResponse);
    return true;
  }

  if (msg.type === 'GET_DEBUG_LOGS') {
    chrome.storage.local.get([DEBUG_LOG_KEY], (result) => {
      sendResponse({ ok: true, logs: result[DEBUG_LOG_KEY] || [] });
    });
    return true;
  }

  if (msg.type === 'GET_ERROR_LOGS') {
    chrome.storage.local.get([ERROR_LOG_KEY], (result) => {
      sendResponse({ ok: true, logs: result[ERROR_LOG_KEY] || [] });
    });
    return true;
  }

  if (msg.type === 'CLEAR_DEBUG_LOGS') {
    chrome.storage.local.set({ [DEBUG_LOG_KEY]: [] }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === 'CLEAR_ERROR_LOGS') {
    chrome.storage.local.set({ [ERROR_LOG_KEY]: [] }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === 'FETCH_NINJA') {
    const league = msg.league || 'Runes of Aldur';
    const itemType = msg.itemType || 'Currency';
    const realm = normalizeTradeRealm(msg.realm);
    const endpoint = msg.endpoint || 'exchange';
    const path = realm === TRADE_REALM_POE1 && endpoint === 'stash-item'
      ? 'stash/current/item'
      : 'exchange/current';
    const url = `https://poe.ninja/${realm}/api/economy/${path}/overview?league=${encodeURIComponent(league)}&type=${encodeURIComponent(itemType)}&withItems=true`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => sendResponse({ ok: true, data }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  }

  if (msg.type === 'FETCH_POE1_ITEM_ICONS') {
    resolvePoe1ItemIcons(msg.league || 'Standard', msg.items)
      .then(icons => sendResponse({ ok: true, icons }))
      .catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }

  if (msg.type === 'FETCH_IMAGE') {
    fetch(msg.url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }))
      .then(dataUrl => sendResponse({ ok: true, dataUrl }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  }

  if (msg.type === 'FETCH_POB') {
    fetch(buildTradeFetchUrl(msg.itemId, msg.realm, msg.queryId), { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => sendResponse({ ok: true, data }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  }
});
