chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// 거래소 URL 체크 함수
function isTradeUrl(url) {
  return url && (
    url.includes('poe.kakaogames.com/trade2') ||
    url.includes('pathofexile.com/trade2')
  );
}

// 자동 열기 처리 함수
async function handleAutoPanel(tabId, url) {
  try {
    // URL이 아직 확정되지 않은 경우(빈 문자열, undefined, chrome:// 등)는 건너뜀
    // — onActivated 시점에 탭이 아직 로드 중이면 url이 비어있을 수 있으며,
    //   이때 isTradeUrl(url)이 false → setOptions(enabled:false) 를 잘못 호출해
    //   이후 거래소로 이동해도 패널이 영구적으로 비활성화되는 버그 방지
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) return;

    const result = await chrome.storage.local.get('settings');
    if (!result.settings || !result.settings.autoOpenPanel) return;

    if (isTradeUrl(url)) {
      // enabled true로 설정만 함 — 실제 open()은 content.js의 TRADE_PAGE_LOADED 메시지로 처리
      // (background에서 직접 sidePanel.open() 호출은 사용자 이벤트 컨텍스트가 없어 실패할 수 있음)
      await chrome.sidePanel.setOptions({ tabId, enabled: true, path: 'sidepanel.html' });
    } else {
      await chrome.sidePanel.setOptions({ tabId, enabled: false });
    }
  } catch (e) {}
}

// 탭 전환 시
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    // pendingUrl이 있으면 우선 사용 (로딩 중인 탭의 목적지 URL)
    const url = tab.pendingUrl || tab.url || '';
    await handleAutoPanel(tabId, url);
  } catch (e) {}
});

// URL 변경 시
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  try {
    await handleAutoPanel(tabId, tab.url);
  } catch (e) {}
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
      const league = getCurrentLeague(result);
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
      const league = getCurrentLeague(result);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const arr = filtersByLeague[league] || [];
      const dup = arr.find(f => f.sourceHash === msg.hash);
      sendResponse({ duplicate: !!dup, name: dup?.name, league });
    });
    return true;
  }

  if (msg.type === 'TRADE_PAGE_LOADED') {
    // content.js가 거래소 페이지 로드 완료 시 전송하는 메시지
    // content script의 메시지 컨텍스트는 "사용자가 페이지를 연" 것으로 인정되어
    // chrome.sidePanel.open() 호출이 허용됨
    (async () => {
      try {
        const result = await chrome.storage.local.get('settings');
        if (!result.settings?.autoOpenPanel) { sendResponse({}); return; }
        const tabId = sender.tab?.id;
        if (!tabId) { sendResponse({}); return; }
        await chrome.sidePanel.setOptions({ tabId, enabled: true, path: 'sidepanel.html' });
        await chrome.sidePanel.open({ tabId });
      } catch (e) {}
      sendResponse({});
    })();
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

  if (msg.type === 'AUTO_PANEL_CHANGED') {
    // 설정이 꺼질 때 현재 탭의 sidePanel을 다시 활성화 (열린 패널은 유지)
    if (!msg.enabled) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs && tabs[0]) {
          try {
            await chrome.sidePanel.setOptions({ tabId: tabs[0].id, enabled: true, path: 'sidepanel.html' });
          } catch (e) {}
        }
      });
    } else {
      // 설정이 켜질 때 현재 탭 상태 재체크
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs && tabs[0]) {
          try {
            await handleAutoPanel(tabs[0].id, tabs[0].url);
          } catch (e) {}
        }
      });
    }
    sendResponse({ ok: true });
    return true;
  }
});
