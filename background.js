chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

const DEFAULT_LEAGUE = 'Runes of Aldur';
const DEBUG_LOG_KEY = 'debugLogs';

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
    chrome.storage.local.get(['filters', 'filtersByLeague', 'settings'], (result) => {
      const league = getCurrentLeague(result);
      const filtersByLeague = getMigratedFiltersByLeague(result);
      const arr = (filtersByLeague[league] || []).slice();
      arr.push({ ...msg.filter, league });
      filtersByLeague[league] = arr;
      const writes = { filtersByLeague };
      chrome.storage.local.set(writes, () => {
        if (Array.isArray(result.filters)) chrome.storage.local.remove('filters');
        sendResponse({ ok: true, total: arr.length, league });
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
    const league = msg.league || 'Standard';
    const tryFetch = (url) => fetch(url).then(r => r.json());
    tryFetch(`https://poe.ninja/api/data/currencyoverview?league=${encodeURIComponent(league)}&type=Currency`)
      .then(data => {
        if (data && Array.isArray(data.lines) && data.lines.length > 0) {
          sendResponse({ ok: true, data });
        } else {
          return tryFetch(`https://poe.ninja/api/data/currencyoverview?league=Standard&type=Currency`)
            .then(data2 => sendResponse({ ok: true, data: data2 }));
        }
      })
      .catch(() =>
        tryFetch(`https://poe.ninja/api/data/currencyoverview?league=Standard&type=Currency`)
          .then(data => sendResponse({ ok: true, data }))
          .catch(e => sendResponse({ ok: false, error: e.message }))
      );
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
