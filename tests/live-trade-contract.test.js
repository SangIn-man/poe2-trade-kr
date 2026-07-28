'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const compat = require('../trade-compat.js');

const live = process.env.RUN_LIVE_TRADE_TESTS === '1';
const endpoint = 'https://www.pathofexile.com/api/trade/search/Standard';

async function postSearch(filters, extraQuery = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'poe2-trade-kr-compat-test/1.3.0 (local contract verification)',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      query: {
        status: { option: 'any' },
        filters,
        stats: [{ type: 'and', filters: [] }],
        ...extraQuery
      },
      sort: { price: 'asc' }
    })
  });
  const payload = await response.json().catch(() => ({}));
  assert.equal(response.status, 200, JSON.stringify(payload));
  assert.equal(typeof payload.id, 'string');
  return payload;
}

test('live PoE1 accepts realm-specific weapon, armour, and socket groups', { skip: !live }, async () => {
  const filters = compat.buildEquipmentFilterGroups('poe1', [
    { id: 'dps', min: 1, active: true },
    { id: 'es', min: 1, active: true },
    { id: 'sockets', min: 1, active: true }
  ]);
  await postSearch(filters);
});

test('live PoE1 accepts the corrected Heavy Belt category and base type', { skip: !live }, async () => {
  const payload = await postSearch(
    { type_filters: { filters: { category: { option: 'accessory.belt' }, type: { option: 'Heavy Belt' } } } }
  );
  assert.ok(Array.isArray(payload.result) && payload.result.length > 0);
  const response = await fetch(
    `https://www.pathofexile.com/api/trade/fetch/${encodeURIComponent(payload.result[0])}?query=${encodeURIComponent(payload.id)}`,
    { headers: { 'User-Agent': 'poe2-trade-kr-compat-test/1.3.0 (local contract verification)' } }
  );
  const fetched = await response.json().catch(() => ({}));
  assert.equal(response.status, 200, JSON.stringify(fetched));
  assert.ok(fetched.result?.[0]?.item);
});

test('live PoE1 accepts a unique name together with its base type', { skip: !live }, async () => {
  await postSearch(
    { type_filters: { filters: { rarity: { option: 'unique' }, type: { option: 'Leather Belt' } } } },
    { name: 'Headhunter' }
  );
});

test('live PoE1 poe.ninja currency data normalizes to usable rates', { skip: !live }, async () => {
  const response = await fetch('https://poe.ninja/poe1/api/economy/exchange/current/overview?league=Standard&type=Currency&withItems=true');
  assert.equal(response.status, 200);
  const data = await response.json();
  const rates = compat.buildRatesPerDivine('poe1', data);
  assert.ok(rates.chaos > 0);
  assert.ok(rates.exalted > 0);
});
