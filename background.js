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

// 마지막으로 활성화된 거래소 탭 ID 추적 (패널 상태 완전 제거용)
let _lastTradeTabId = null;

// non-trade 탭 전환 시 CLOSE_SIDE_PANEL 딜레이 타이머 (거래소 탭으로 빠르게 복귀할 때 취소용)
let _closePanelTimeout = null;

// 탭 URL 메모리 캐시 (onActivated에서 비동기 콜백 없이 즉시 URL 확인용)
// chrome.tabs.get() 콜백은 비동기라 user gesture context가 소멸 → sidePanel.open() 실패
// 미리 URL을 캐싱해두면 onActivated에서 동기적으로 즉시 확인 가능
const _tabUrls = {};
chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => { if (tab.url) _tabUrls[tab.id] = tab.url; });
});
chrome.tabs.onRemoved.addListener((tabId) => { delete _tabUrls[tabId]; });

// settings 메모리 캐시 (gesture context 유지용)
// chrome.sidePanel.open()은 user gesture 컨텍스트에서만 동작하므로,
// await chrome.storage.local.get() 이후에는 gesture context가 소멸함.
// 캐시를 사용하면 await 없이 즉시 확인해 gesture context를 유지할 수 있음.
let _cachedSettings = {};
chrome.storage.local.get('settings', (r) => {
  _cachedSettings = r.settings || {};
  console.log('[AutoPanel] 캐시 초기화:', _cachedSettings);
});
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    _cachedSettings = changes.settings.newValue || {};
    console.log('[AutoPanel] 캐시 업데이트:', _cachedSettings);
  }
});

// 탭 전환 시 — _tabUrls 캐시에서 즉시 URL 확인해 gesture context를 유지한 채 사이드패널 열기/닫기
// (비동기 chrome.tabs.get 콜백 제거 → gesture context 유지 → sidePanel.open() 정상 동작)
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  console.log('[AutoPanel] onActivated 진입, tabId:', tabId, 'windowId:', windowId);
  console.log('[AutoPanel] onActivated - autoOpenPanel:', _cachedSettings?.autoOpenPanel);
  if (!_cachedSettings?.autoOpenPanel) return;

  const url = _tabUrls[tabId] || '';
  console.log('[AutoPanel] _tabUrls 캐시 url:', url, 'isTradeUrl:', isTradeUrl(url));

  if (isTradeUrl(url)) {
    console.log('[AutoPanel] onActivated - 거래소 탭, sidePanel.open 호출, tabId:', tabId);
    _lastTradeTabId = tabId;
    if (_closePanelTimeout) {
      clearTimeout(_closePanelTimeout);
      _closePanelTimeout = null;
    }
    chrome.sidePanel.open({ windowId });
  } else {
    console.log('[AutoPanel] non-trade 탭 전환 - setOptions enabled:false 호출, tabId:', tabId);
    chrome.sidePanel.setOptions({ tabId, enabled: false });

    // 패널이 완전히 로드된 후 닫히도록 딜레이 추가 (거래소 탭으로 빠르게 복귀하면 취소됨)
    _closePanelTimeout = setTimeout(() => {
      _closePanelTimeout = null;
      chrome.runtime.sendMessage({ type: 'CLOSE_SIDE_PANEL' }).catch(() => {});
    }, 300);
  }
});

// 탭 내 URL 변경 시 — 로드 완료 후 거래소 여부에 따라 사이드패널 활성화 상태 조정
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  console.log('[AutoPanel] onUpdated - autoOpenPanel:', _cachedSettings?.autoOpenPanel);
  if (!_cachedSettings?.autoOpenPanel) return;

  const url = tab?.url || '';
  if (url) _tabUrls[tabId] = url;
  console.log('[AutoPanel] onUpdated - url:', url, '/ isTradeUrl:', isTradeUrl(url));
  if (isTradeUrl(url)) {
    console.log('[AutoPanel] onUpdated - setOptions enabled:true, tabId:', tabId);
    // setOptions는 fire-and-forget, open()은 동기적으로 같은 프레임에서 호출
    // (콜백 안에서 호출하면 user gesture context가 소멸하여 open()이 실패함)
    chrome.sidePanel.setOptions({ tabId, enabled: true, path: 'sidepanel.html' });
    if (tab.active) {
      console.log('[AutoPanel] onUpdated - 활성 탭 거래소 URL 전환, sidePanel.open 호출, windowId:', tab.windowId);
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  } else {
    console.log('[AutoPanel] onUpdated - setOptions enabled:false, tabId:', tabId);
    chrome.sidePanel.setOptions({ tabId, enabled: false });
  }
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
  if (msg.type === 'TRADE_PAGE_LOADED') {
    // await 없이 캐시에서 즉시 확인 후 바로 open 호출
    if (_cachedSettings?.autoOpenPanel) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
    sendResponse({});
    return true;
  }

  if (msg.type === 'TRADE_TAB_VISIBLE') {
    if (_cachedSettings?.autoOpenPanel) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
    sendResponse({});
    return true;
  }

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
    }
    sendResponse({ ok: true });
    return true;
  }
});
