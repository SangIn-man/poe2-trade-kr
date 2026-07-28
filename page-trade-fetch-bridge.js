(function installPoe2TqTradeFetchBridge() {
  'use strict';

  if (window.__POE2TQ_TRADE_FETCH_BRIDGE__) return;
  window.__POE2TQ_TRADE_FETCH_BRIDGE__ = true;

  window.addEventListener('message', async event => {
    const data = event.data || {};
    if (data.type !== 'POE2TQ_TRADE_FETCH') return;

    const requestId = data.requestId || '';
    try {
      const sourceUrl = String(data.url || '');
      const isTradeApi = /^https:\/\/poe\.game\.daum\.net\/api\/trade(?:\/|$)/i.test(sourceUrl);
      const isKakaoProfile = /^https:\/\/poe\.kakaogames\.com\/api\/profile(?:\?|$)/i.test(sourceUrl);
      const isKakaoStash = /^https:\/\/poe\.kakaogames\.com\/character-window\/get-stash-items(?:\?|$)/i.test(sourceUrl);
      const isKakaoCharacter = /^https:\/\/poe\.kakaogames\.com\/character-window\/(?:get-characters|get-items)(?:\?|$)/i.test(sourceUrl);
      if (!isTradeApi && !isKakaoProfile && !isKakaoStash && !isKakaoCharacter) {
        throw new Error('허용되지 않은 한국 거래소 요청입니다');
      }
      const url = new URL(sourceUrl);
      const fetchUrl = `${url.pathname}${url.search}`;

      const options = data.options || {};
      const response = await fetch(fetchUrl, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || undefined,
        credentials: 'include'
      });
      const payload = await response.json().catch(() => ({}));
      event.source?.postMessage({
        type: 'POE2TQ_TRADE_FETCH_RESULT',
        requestId,
        ok: true,
        responseOk: response.ok,
        status: response.status,
        statusText: response.statusText || '',
        retryAfter: response.headers.get('retry-after') || '',
        payload
      }, event.origin || '*');
    } catch (error) {
      event.source?.postMessage({
        type: 'POE2TQ_TRADE_FETCH_RESULT',
        requestId,
        ok: false,
        error: error?.message || String(error),
        name: error?.name || ''
      }, event.origin || '*');
    }
  });
})();
