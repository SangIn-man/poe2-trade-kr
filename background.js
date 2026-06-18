// in-page iframe 사이드바 방식으로 전환됨.
// 툴바 아이콘 클릭 시 활성 탭의 content script에 토글 메시지를 보낸다.
// (거래소 페이지가 아니면 content script가 없어 sendMessage가 조용히 실패한다.)
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' }).catch(() => {});
});

const DEFAULT_LEAGUE = 'Runes of Aldur';
const DEBUG_LOG_KEY = 'debugLogs';
const DEFAULT_BUILD_NAME = '기본 빌드';

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

function inferTargetTabKey(filter) {
  const category = String(filter?.category || '').toLowerCase();
  const name = String(filter?.name || '').toLowerCase();
  const itemName = String(filter?.itemName || '').toLowerCase();
  const typeLine = String(filter?.typeLine || '').toLowerCase();
  const haystack = `${category} ${name} ${itemName} ${typeLine}`;

  if (/(tablet|slate|waystone|map|서판|지도)/i.test(haystack)) {
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

function appendDebugLog(entry, sendResponse) {
  chrome.storage.local.get([DEBUG_LOG_KEY], (result) => {
    const logs = Array.isArray(result[DEBUG_LOG_KEY]) ? result[DEBUG_LOG_KEY].slice() : [];
    logs.push({
      loggedAt: new Date().toISOString(),
      ...entry
    });
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    chrome.storage.local.set({ [DEBUG_LOG_KEY]: logs }, () => {
      sendResponse({ ok: true, count: logs.length });
    });
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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

  if (msg.type === 'GET_DEBUG_LOGS') {
    chrome.storage.local.get([DEBUG_LOG_KEY], (result) => {
      sendResponse({ ok: true, logs: result[DEBUG_LOG_KEY] || [] });
    });
    return true;
  }

  if (msg.type === 'CLEAR_DEBUG_LOGS') {
    chrome.storage.local.set({ [DEBUG_LOG_KEY]: [] }, () => {
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
