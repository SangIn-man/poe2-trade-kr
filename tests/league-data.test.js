'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const leagueData = require('../league-data.js');

test('PoE1 league response keeps PC leagues and ignores console leagues', () => {
  const leagues = leagueData.normalizeLeagueResponse({ result: [
    { id: 'Standard', realm: 'pc' },
    { id: 'New Challenge', realm: 'pc' },
    { id: 'Console Challenge', realm: 'xbox' }
  ] }, 'poe1');

  assert.deepEqual(leagues, ['Standard', 'New Challenge', 'Hardcore']);
});

test('PoE2 league response accepts poe2 realm and removes duplicates', () => {
  const leagues = leagueData.normalizeLeagueResponse({ result: [
    { id: 'New Dawn', realm: 'poe2' },
    { id: 'New Dawn', realm: 'poe2' },
    { id: 'Standard', realm: 'poe2' }
  ] }, 'poe2');

  assert.deepEqual(leagues, [
    'New Dawn', 'Standard', 'Hardcore'
  ]);
});

test('malformed response falls back to the built-in realm list', () => {
  assert.deepEqual(
    leagueData.normalizeLeagueResponse(null, 'poe1'),
    ['Standard', 'Hardcore']
  );
});

test('character list keeps only non-deleted characters in the configured league', () => {
  const characters = [
    { name: 'LeagueHero', league: 'New Challenge', level: 90 },
    { name: 'StandardHero', league: 'Standard', level: 100 },
    { name: 'DeletedHero', league: 'New Challenge', deleted: true }
  ];

  assert.deepEqual(
    leagueData.filterCharactersByLeague(characters, 'New Challenge'),
    [characters[0]]
  );
  assert.deepEqual(leagueData.filterCharactersByLeague(characters, ''), []);
  assert.deepEqual(leagueData.filterCharactersByLeague(null, 'Standard'), []);
});
