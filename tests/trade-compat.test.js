'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const compat = require('../trade-compat.js');

test('PoE item icon identity ignores host, generated path, extension, and query string', () => {
  assert.equal(
    compat.getItemIconIdentity('https://web.poecdn.com/gen/image/opaque/VaalImmortalCall.png?scale=1&w=1&h=1'),
    'vaalimmortalcall'
  );
  assert.equal(
    compat.getItemIconIdentity('https://another.example/items/VaalImmortalCall.webp'),
    'vaalimmortalcall'
  );
});

test('gem variant fallback selects matching corruption and closest level and quality', () => {
  const variants = [
    { level: 21, quality: 20, corrupted: true, id: '21/20c' },
    { level: 20, quality: 20, corrupted: false, id: '20/20' },
    { level: 20, quality: 0, corrupted: false, id: '20' },
    { level: 1, quality: 0, corrupted: false, id: '1' }
  ];
  assert.equal(
    compat.selectClosestGemVariant(variants, { level: 20, quality: 0, corrupted: false }).id,
    '20'
  );
  assert.equal(
    compat.selectClosestGemVariant(variants, { level: null, quality: 20, corrupted: false }).id,
    '20/20'
  );
});

test('logged-in profile account name supports direct and nested API payloads', () => {
  assert.equal(compat.getProfileAccountName({ name: 'Account#1234' }), 'Account#1234');
  assert.equal(compat.getProfileAccountName({ profile: { accountName: 'Nested#5678' } }), 'Nested#5678');
  assert.equal(compat.getProfileAccountName(null), '');
});

test('realm and storage keys keep PoE1 Standard separate from PoE2 Standard', () => {
  assert.equal(compat.makeRealmLeagueKey('poe1', 'Standard'), 'poe1::Standard');
  assert.equal(compat.makeRealmLeagueKey('poe2', 'Standard'), 'poe2::Standard');
  assert.deepEqual(compat.parseRealmLeagueKey('poe1::Standard'), { realm: 'poe1', league: 'Standard' });
  assert.equal(compat.parseRealmLeagueKey('Standard'), null);
});

test('build tab routing separates PoE1 maps and all Heist missions', () => {
  assert.equal(compat.getPreferredBuildTabKey({ category: 'map', typeLine: 'Cemetery Map' }, 'poe1'), 'map');
  assert.equal(compat.getPreferredBuildTabKey({ typeLine: 'Contract: Underbelly' }, 'poe1'), 'contract');
  assert.equal(compat.getPreferredBuildTabKey({ typeLine: 'Blueprint: Unusual Gems' }, 'poe1'), 'contract');
  assert.equal(compat.getPreferredBuildTabKey({ category: 'armour.helmet', typeLine: 'Hubris Circlet' }, 'poe1'), 'equipment');
});

test('PoE2 map-like filters continue routing to the slate tab', () => {
  assert.equal(compat.getPreferredBuildTabKey({ category: 'map.waystone', typeLine: 'Waystone' }, 'poe2'), 'slate');
});

test('PoE1 equipment values are emitted into the API groups accepted by PoE1', () => {
  const groups = compat.buildEquipmentFilterGroups('poe1', [
    { id: 'dps', min: 450, max: null, active: true },
    { id: 'es', min: 300, max: 500, active: true },
    { id: 'sockets', min: 6, max: null, active: true },
    { id: 'rune_sockets', min: 2, max: null, active: true }
  ]);
  assert.deepEqual(groups, {
    weapon_filters: { filters: { dps: { min: 450 } } },
    armour_filters: { filters: { es: { min: 300, max: 500 } } },
    socket_filters: { filters: { sockets: { min: 6 } } }
  });
});

test('PoE2 equipment values remain in equipment_filters', () => {
  assert.deepEqual(
    compat.buildEquipmentFilterGroups('poe2', [
      { id: 'dps', min: 450, active: true },
      { id: 'rune_sockets', min: 2, active: true }
    ]),
    { equipment_filters: { filters: { dps: { min: 450 }, rune_sockets: { min: 2 } } } }
  );
});

test('template equipment filters honor disabled and cleared entries', () => {
  const filters = {
    weapon_filters: { filters: { dps: { min: 100 }, aps: { min: 1.2 } } },
    armour_filters: { filters: { es: { min: 200 } } }
  };
  compat.applyEquipmentToTemplateFilters(filters, [
    { id: 'dps', min: 450, active: false },
    { id: 'aps', min: null, max: null, active: true },
    { id: 'es', min: 350, max: 500, active: true }
  ]);
  assert.deepEqual(filters, {
    weapon_filters: { filters: { dps: { disabled: true }, aps: { disabled: true } } },
    armour_filters: { filters: { es: { min: 350, max: 500, disabled: false } } }
  });
});

test('PoE1 Heavy Belt is mapped to accessory.belt', () => {
  const item = {
    typeLine: 'Heavy Belt',
    baseType: 'Heavy Belt',
    icon: 'https://web.poecdn.com/gen/image/example/Belt5.png'
  };
  assert.equal(compat.inferItemCategory(item, 'poe1', 'accessory'), 'accessory.belt');
  assert.equal(compat.normalizeCategoryForRealm('armour.belt', 'poe1'), 'accessory.belt');
});

test('PoE1 socket summary preserves colours, groups, socket count, and max links', () => {
  const item = {
    sockets: [
      { group: 0, sColour: 'R' },
      { group: 0, sColour: 'G' },
      { group: 0, sColour: 'B' },
      { group: 1, sColour: 'W' }
    ]
  };
  assert.deepEqual(compat.getSocketSummary(item, 'poe1'), {
    sockets: 4,
    links: 3,
    colours: { r: 1, g: 1, b: 1, w: 1 },
    linkColours: { r: 1, g: 1, b: 1 },
    runeSockets: 0,
    text: 'R-G-B W'
  });
});

test('PoE1 socket filters preserve total colours and the largest linked group colours', () => {
  const allLinked = compat.getSocketSummary({
    sockets: [
      { group: 0, attr: 'S' }, { group: 0, attr: 'S' },
      { group: 0, attr: 'D' },
      { group: 0, attr: 'I' }, { group: 0, attr: 'I' }, { group: 0, attr: 'I' }
    ]
  }, 'poe1');
  assert.equal(allLinked.links, 6);
  assert.deepEqual(allLinked.colours, { r: 2, g: 1, b: 3 });
  assert.deepEqual(allLinked.linkColours, { r: 2, g: 1, b: 3 });

  const summary = compat.getSocketSummary({
    sockets: [
      { group: 0, attr: 'S' },
      { group: 0, attr: 'S' },
      { group: 0, attr: 'D' },
      { group: 1, attr: 'I' },
      { group: 1, attr: 'I' },
      { group: 1, attr: 'I' }
    ]
  }, 'poe1');
  assert.deepEqual(summary.colours, { r: 2, g: 1, b: 3 });
  assert.equal(summary.links, 3);
  assert.deepEqual(summary.linkColours, { r: 2, g: 1 });
  assert.deepEqual(compat.buildEquipmentFilterGroups('poe1', [
    { id: 'sockets', min: 6, active: true, socketColours: summary.colours },
    { id: 'links', min: 3, active: true, socketColours: summary.linkColours }
  ]), {
    socket_filters: {
      filters: {
        sockets: { min: 6, r: 2, g: 1, b: 3 },
        links: { min: 3, r: 2, g: 1 }
      }
    }
  });
});

test('trade rarity uses the current rarity field and only falls back to searchable frame rarities', () => {
  assert.equal(compat.getTradeRarity({ rarity: 'Unique', frameType: 10 }), 'unique');
  assert.equal(compat.getTradeRarity({ frameType: 2 }), 'rare');
  assert.equal(compat.getTradeRarity({ frameType: 6 }), '');
});

test('PoE1 poe.ninja chaos-based values are normalized to divine values', () => {
  const data = {
    core: { rates: { divine: 1 / 600 } },
    lines: [
      { id: 'chaos', primaryValue: 1 },
      { id: 'divine', primaryValue: 600 },
      { id: 'exalted', primaryValue: 10 }
    ]
  };
  assert.deepEqual(compat.buildRatesPerDivine('poe1', data), {
    divine: 1,
    chaos: 600,
    exalted: 60
  });
  assert.equal(compat.getLineValueInDivine('poe1', data.lines[2], data), 1 / 60);
});

test('PoE1 poe.ninja stash item divine values are used directly', () => {
  const data = {
    lines: [
      { id: 'divine', primaryValue: 600 },
      { id: 1, name: 'Example Unique', chaosValue: 120, divineValue: 0.2 },
      { id: 2, name: 'Example Base', chaosValue: 60 }
    ]
  };
  assert.equal(compat.getLineValueInDivine('poe1', data.lines[1], data), 0.2);
  assert.equal(compat.getLineValueInDivine('poe1', data.lines[2], data), 0.1);
});

test('PoE1 poe.ninja exchange overview core rates convert chaos primary values', () => {
  const data = {
    core: {
      primary: 'chaos',
      secondary: 'divine',
      rates: { divine: 0.001 }
    },
    lines: [
      { id: 'deafening-essence-of-misery', primaryValue: 130 },
      { id: 'golden-oil', chaosValue: 50 }
    ]
  };
  assert.equal(compat.buildRatesPerDivine('poe1', data).chaos, 1000);
  assert.equal(compat.getLineValueInDivine('poe1', data.lines[0], data), 0.13);
  assert.equal(compat.getLineValueInDivine('poe1', data.lines[1], data), 0.05);
});

test('stale sidepanel persistence keeps filters saved concurrently by the background', () => {
  const key = 'poe1::Standard';
  const merged = compat.mergeConcurrentFilters(
    { [key]: [{ id: 'old', _storageRevision: 1 }] },
    { [key]: [{ id: 'old', _storageRevision: 1 }, { id: 'new', _storageRevision: 4 }] },
    3
  );
  assert.deepEqual(merged[key].map(filter => filter.id), ['old', 'new']);

  compat.carryForwardFilterRevisions(merged, { [key]: [{ id: 'new', _storageRevision: 4 }] }, 5);
  assert.equal(merged[key].find(filter => filter.id === 'old')._storageRevision, 1);
  assert.equal(merged[key].find(filter => filter.id === 'new')._storageRevision, 4);
});

test('realm-scoped persistence does not resurrect intentionally deleted old filters', () => {
  const key = 'poe2::Standard';
  const merged = compat.mergeConcurrentFilters(
    { [key]: [] },
    { [key]: [{ id: 'deleted', _storageRevision: 2 }] },
    2
  );
  assert.deepEqual(merged[key], []);
});
