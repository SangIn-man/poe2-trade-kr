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
    files: ['content.js']
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
const DEBUG_LOG_KEY = 'debugLogs';
const ERROR_LOG_KEY = 'errorLogs';
const DEFAULT_BUILD_NAME = '기본 빌드';

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

function getMigratedFiltersByLeague(result) {
  let filtersByLeague = result.filtersByLeague || {};
  if (Array.isArray(result.filters) && result.filters.length && !result.filtersByLeague) {
    const league = getCurrentLeague(result);
    filtersByLeague = { ...filtersByLeague, [league]: result.filters };
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

function makeBuild(name) {
  const equipTab = makeBuildTab('장비', 'equipment', 'equipment');
  const slateTab = makeBuildTab('서판', 'slate', 'slate');
  return {
    id: makeId('build'),
    name: name || DEFAULT_BUILD_NAME,
    tabs: [equipTab, slateTab],
    activeTabId: equipTab.id,
    savedAt: new Date().toISOString()
  };
}

function ensureBuildState(league, filtersByLeague, buildsByLeague, buildUiByLeague) {
  const filters = filtersByLeague[league] || [];
  const builds = Array.isArray(buildsByLeague[league]) ? buildsByLeague[league].slice() : [];
  const ui = { ...(buildUiByLeague[league] || {}) };
  let changed = false;

  if (!builds.length) {
    builds.push(makeBuild(DEFAULT_BUILD_NAME));
    changed = true;
  }

  builds.forEach(build => {
    if (!Array.isArray(build.tabs) || !build.tabs.length) {
      const next = makeBuild(build.name || DEFAULT_BUILD_NAME);
      build.tabs = next.tabs;
      build.activeTabId = next.activeTabId;
      changed = true;
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

  buildsByLeague[league] = builds;
  buildUiByLeague[league] = ui;

  const selectedBuild = builds.find(build => build.id === ui.selectedBuildId) || builds[0];
  const activeTab = selectedBuild.tabs.find(tab => tab.id === selectedBuild.activeTabId) || selectedBuild.tabs[0];

  return { buildsByLeague, buildUiByLeague, selectedBuild, activeTab, changed };
}

function getFilterSearchText(filter) {
  const category = String(filter?.category || '').toLowerCase();
  const name = String(filter?.name || '').toLowerCase();
  const itemName = String(filter?.itemName || '').toLowerCase();
  const typeLine = String(filter?.typeLine || '').toLowerCase();
  const note = String(filter?.note || '').toLowerCase();
  const stats = (filter?.stats || []).map(stat => [
    stat?.label,
    stat?.id,
    stat?.fallbackId
  ].filter(Boolean).join(' ')).join(' ');
  const equipment = (filter?.equipment || []).map(entry => [
    entry?.label,
    entry?.id
  ].filter(Boolean).join(' ')).join(' ');
  return `${category} ${name} ${itemName} ${typeLine} ${note} ${stats} ${equipment}`.toLowerCase();
}

function inferTargetTabKey(filter) {
  const category = String(filter?.category || '').toLowerCase();
  const haystack = getFilterSearchText(filter);

  if (/(tablet|slate|waystone|map|ritual|abyss|expedition|sanctum|breach|delirium|서판|지도|의식|심연|탐험|사원|균열|환영)/i.test(haystack)) {
    return 'slate';
  }

  if (
    /^(weapon|armour|accessory)\./.test(category)
    || /^(jewel|flask)$/.test(category)
    || /(helmet|gloves|boots|belt|ring|amulet|quiver|shield|focus|buckler|wand|sceptre|spear|flail|claw|dagger|sword|axe|mace|staff|crossbow|활|반지|목걸이|장갑|투구|장화|갑옷|방패|주얼|플라스크)/i.test(haystack)
  ) {
    return 'equipment';
  }

  return '';
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

  if (msg.type === 'SAVE_FILTER') {
    chrome.storage.local.get(['filters', 'filtersByLeague', 'buildsByLeague', 'buildUiByLeague', 'settings'], (result) => {
      const league = msg.league || msg.filter?.league || getCurrentLeague(result);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const buildsByLeague = result.buildsByLeague || {};
      const buildUiByLeague = result.buildUiByLeague || {};
      const buildState = ensureBuildState(league, filtersByLeague, buildsByLeague, buildUiByLeague);
      const arr = (filtersByLeague[league] || []).slice();
      const savedFilter = { ...msg.filter, league };
      arr.push(savedFilter);
      filtersByLeague[league] = arr;
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
        buildUiByLeague: buildState.buildUiByLeague
      };
      chrome.storage.local.set(writes, () => {
        if (Array.isArray(result.filters)) chrome.storage.local.remove('filters');
        sendResponse({
          ok: true,
          total: arr.length,
          league,
          buildId: buildState.selectedBuild?.id || '',
          tabId: targetTab?.id || ''
        });
      });
    });
    return true;
  }

  if (msg.type === 'CHECK_DUPLICATE') {
    chrome.storage.local.get(['filters', 'filtersByLeague', 'settings'], (result) => {
      const league = msg.league || getCurrentLeague(result);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const arr = filtersByLeague[league] || [];
      const dup = arr.find(f => f.sourceHash === msg.hash);
      sendResponse({ duplicate: !!dup, name: dup?.name, league });
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
    const url = `https://poe.ninja/poe2/api/economy/exchange/current/overview?league=${encodeURIComponent(league)}&type=${encodeURIComponent(itemType)}&withItems=true`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => sendResponse({ ok: true, data }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
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
    fetch(`https://www.pathofexile.com/api/trade2/fetch/${msg.itemId}?query=&realm=poe2`)
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true;
  }
});
