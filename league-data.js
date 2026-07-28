(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.POE2TQLeagueData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const FALLBACK_LEAGUES = Object.freeze({
    poe1: Object.freeze(['Standard', 'Hardcore']),
    poe2: Object.freeze(['Runes of Aldur', 'HC Runes of Aldur', 'Standard', 'Hardcore'])
  });
  const PERMANENT_LEAGUES = Object.freeze(['Standard', 'Hardcore']);

  function normalizeRealm(realm) {
    return realm === 'poe1' ? 'poe1' : 'poe2';
  }

  function getFallbackLeagues(realm) {
    return FALLBACK_LEAGUES[normalizeRealm(realm)].slice();
  }

  function normalizeLeagueResponse(payload, realm) {
    const normalizedRealm = normalizeRealm(realm);
    const apiRealm = normalizedRealm === 'poe1' ? 'pc' : 'poe2';
    const rows = Array.isArray(payload?.result)
      ? payload.result
      : (Array.isArray(payload) ? payload : []);
    const seen = new Set();
    const leagues = [];

    for (const row of rows) {
      if (row?.realm && row.realm !== apiRealm) continue;
      const id = String(row?.id || row?.name || '').trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      leagues.push(id);
    }

    if (leagues.length === 0) return getFallbackLeagues(normalizedRealm);

    for (const fallback of PERMANENT_LEAGUES) {
      if (seen.has(fallback)) continue;
      seen.add(fallback);
      leagues.push(fallback);
    }
    return leagues;
  }

  function filterCharactersByLeague(characters, league) {
    if (!Array.isArray(characters)) return [];
    const targetLeague = String(league || '').trim();
    if (!targetLeague) return [];
    return characters.filter(character => (
      character
      && !character.deleted
      && String(character.league || '').trim() === targetLeague
    ));
  }

  return Object.freeze({
    FALLBACK_LEAGUES,
    filterCharactersByLeague,
    getFallbackLeagues,
    normalizeLeagueResponse,
    normalizeRealm
  });
});
