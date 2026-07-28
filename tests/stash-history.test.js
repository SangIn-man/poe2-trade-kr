const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('../stash-history.js');

function snapshot(timestamp, items) {
  const totalDivine = Object.values(items).reduce(
    (total, item) => total + item.quantity * item.unitValue,
    0
  );
  return { id: String(timestamp), timestamp, totalDivine, items };
}

test('stash delta separates quantity gains from market price movement', () => {
  const previous = snapshot(1_000, {
    a: { quantity: 10, unitValue: 1 },
    b: { quantity: 5, unitValue: 2 }
  });
  const current = snapshot(3_601_000, {
    a: { quantity: 12, unitValue: 1.5 },
    b: { quantity: 2, unitValue: 2 },
    c: { quantity: 3, unitValue: 4 }
  });

  const delta = history.calculateDelta(previous, current);
  assert.equal(delta.quantityDelta, 9);
  assert.equal(delta.marketDelta, 5);
  assert.equal(delta.totalDelta, 14);
  assert.equal(delta.quantityDelta + delta.marketDelta, delta.totalDelta);
  assert.equal(delta.elapsedMs, 3_600_000);
});

test('item deltas value gained and consumed quantities at the ending price', () => {
  const previous = snapshot(1_000, {
    juice: { name: '야생 생기 결정', category: '화폐', quantity: 9_520, unitValue: 0.001 },
    scarab: { name: '갑충석', category: '갑충석', quantity: 12, unitValue: 0.5 }
  });
  const current = snapshot(2_000, {
    juice: { name: '야생 생기 결정', category: '화폐', quantity: 40_000, unitValue: 0.0012 }
  });

  const deltas = history.buildItemDeltas(previous, current);
  assert.equal(deltas.juice.key, 'juice');
  assert.equal(deltas.juice.name, '야생 생기 결정');
  assert.equal(deltas.juice.category, '화폐');
  assert.equal(deltas.juice.previousQuantity, 9_520);
  assert.equal(deltas.juice.currentQuantity, 40_000);
  assert.equal(deltas.juice.quantityDelta, 30_480);
  assert.equal(deltas.juice.unitValue, 0.0012);
  assert.ok(Math.abs(deltas.juice.valueDelta - 36.576) < 1e-9);
  assert.equal(deltas.scarab.quantityDelta, -12);
  assert.equal(deltas.scarab.currentQuantity, 0);
  assert.equal(deltas.scarab.valueDelta, -6);
});

test('inventory-value series accumulates quantity changes without market movement', () => {
  const first = snapshot(1_000, { a: { quantity: 10, unitValue: 1 } });
  const second = snapshot(2_000, { a: { quantity: 10, unitValue: 2 } });
  const third = snapshot(3_000, { a: { quantity: 12, unitValue: 2 } });

  const series = history.buildSeries([third, first, second]);
  assert.deepEqual(series.map(point => point.inventoryValue), [10, 10, 14]);
  assert.deepEqual(series.map(point => point.snapshot.timestamp), [1_000, 2_000, 3_000]);
});

test('snapshots within five minutes replace the latest point unless it is a session baseline', () => {
  const first = snapshot(1_000_000, { a: { quantity: 1, unitValue: 1 } });
  const refresh = snapshot(1_120_000, { a: { quantity: 2, unitValue: 1 } });

  const replaced = history.upsertSnapshot([first], refresh, 0, 1_120_000);
  assert.deepEqual(replaced.map(item => item.id), [refresh.id]);

  const preserved = history.upsertSnapshot([first], refresh, first.timestamp, 1_120_000);
  assert.deepEqual(preserved.map(item => item.id), [first.id, refresh.id]);
});

test('snapshot rows are compacted by stable raw item name', () => {
  const result = history.createSnapshot({
    timestamp: 10_000,
    accountName: 'Account#1234',
    league: 'Standard',
    selected: [{ index: 2, filter: 'scarab' }, { index: 2, filter: 'fragment' }],
    rows: [{ rawName: 'Divine Orb', name: '신성한 오브', category: '커런시', quantity: 3, unitValue: 1 }]
  });

  assert.equal(result.totalDivine, 3);
  assert.equal(result.scopeKey, '2:fragment|2:scarab');
  assert.deepEqual(result.items['divine orb'], {
    name: '신성한 오브',
    category: '커런시',
    quantity: 3,
    unitValue: 1
  });
  assert.equal(result.schemaVersion, history.SNAPSHOT_SCHEMA_VERSION);
});

test('unpriced inventory remains in snapshots without creating a false quantity gain later', () => {
  const first = history.createSnapshot({
    timestamp: 10_000,
    rows: [{
      inventoryKey: 'gem:서리점멸|l:20|q:0|c:0',
      name: '서리점멸',
      quantity: 1,
      unitValue: 0
    }]
  });
  const second = history.createSnapshot({
    timestamp: 20_000,
    rows: [{
      inventoryKey: 'gem:서리점멸|l:20|q:0|c:0',
      name: '서리점멸',
      quantity: 1,
      unitValue: 0.02
    }],
    fallbackItems: first.items
  });

  assert.equal(first.items['gem:서리점멸|l:20|q:0|c:0'].quantity, 1);
  assert.deepEqual(history.buildItemDeltas(first, second), {});
});

test('temporarily missing prices carry forward without changing inventory value', () => {
  const first = history.createSnapshot({
    timestamp: 10_000,
    rows: [{ inventoryKey: 'item:악을 쓰는 에센스', name: '악을 쓰는 에센스', quantity: 3, unitValue: 0.01 }]
  });
  const second = history.createSnapshot({
    timestamp: 20_000,
    rows: [{ inventoryKey: 'item:악을 쓰는 에센스', name: '악을 쓰는 에센스', quantity: 3, unitValue: 0 }],
    fallbackItems: first.items
  });

  assert.equal(second.items['item:악을 쓰는 에센스'].unitValue, 0.01);
  assert.equal(second.totalDivine, first.totalDivine);
  assert.deepEqual(history.buildItemDeltas(first, second), {});
});

test('a different selected-tab scope creates a separate history point', () => {
  const first = { ...snapshot(1_000_000, {}), scopeKey: '1:all' };
  const changedScope = { ...snapshot(1_120_000, {}), scopeKey: '2:scarab' };
  const result = history.upsertSnapshot([first], changedScope, 0, 1_120_000);
  assert.equal(result.length, 2);
});

test('latest comparison snapshot is selected from the same stash scope', () => {
  const olderMatching = { ...snapshot(1_000, {}), scopeKey: '1:all' };
  const newerOtherScope = { ...snapshot(3_000, {}), scopeKey: '2:all' };
  const latestMatching = { ...snapshot(2_000, {}), scopeKey: '1:all' };
  const result = history.findLatestSnapshotForScope(
    [newerOtherScope, olderMatching, latestMatching],
    '1:all'
  );
  assert.equal(result.id, latestMatching.id);
});

test('chart downsampling keeps endpoints and limits dense refresh points', () => {
  const series = Array.from({ length: 100 }, (_, index) => ({
    snapshot: {
      id: String(index),
      timestamp: index * 1_000,
      totalDivine: index === 51 ? 999 : index
    }
  }));
  const result = history.downsampleChartSeries(series, 12);
  assert.equal(result.length, 12);
  assert.equal(result[0], series[0]);
  assert.equal(result[result.length - 1], series[series.length - 1]);
  assert.equal(result.some(point => point.snapshot.totalDivine === 999), true);
});

test('graph snapshots require the configured value change from the last recorded point', () => {
  const threshold = { unit: 'chaos', value: 1 };
  const first = { ...snapshot(1_000, {}), totalDivine: 10, chaosRate: 200 };
  const below = { ...snapshot(2_000, {}), totalDivine: 10.004, chaosRate: 200 };
  const enough = { ...snapshot(3_000, {}), totalDivine: 10.005, chaosRate: 200 };
  assert.equal(history.shouldRecordValueSnapshot(null, first, threshold), true);
  assert.equal(history.shouldRecordValueSnapshot(first, below, threshold), false);
  assert.equal(history.shouldRecordValueSnapshot(first, enough, threshold), true);
  assert.deepEqual(
    history.filterSnapshotsByValueChange([first, below, enough], threshold).map(item => item.id),
    [first.id, enough.id]
  );
});

test('core farming stash tabs include the eight default wealth categories', () => {
  const coreTypes = [
    'CurrencyStash',
    'FragmentStash',
    'EssenceStash',
    'DivinationCardStash',
    'GemStash',
    'MapStash',
    'DeliriumStash'
  ];
  coreTypes.forEach(type => assert.equal(history.isCoreFarmingStashTab({ type }), true, type));
  assert.equal(history.isCoreFarmingStashTab({ type: 'PremiumStash', n: '갑충석' }), true);
  assert.equal(history.isCoreFarmingStashTab({ type: 'PremiumStash', n: '환영' }), true);
  assert.equal(history.isCoreFarmingStashTab({ type: 'DelveStash', n: '화석' }), false);
  assert.equal(history.isCoreFarmingStashTab({ type: 'BlightStash', n: '성유' }), false);
  assert.equal(history.isCoreFarmingStashTab({ type: 'MapStash', hidden: true }), false);
});

test('wealth tab picker keeps specialized tabs and removes ordinary storage tabs', () => {
  ['CurrencyStash', 'FragmentStash', 'GemStash', 'DeliriumStash', 'DelveStash', 'BlightStash', 'UniqueStash']
    .forEach(type => assert.equal(history.isSpecializedWealthStashTab({ type }), true, type));
  assert.equal(history.isSpecializedWealthStashTab({ type: 'NormalStash', n: '판매용' }), false);
  assert.equal(history.isSpecializedWealthStashTab({ type: 'PremiumStash', n: '잡템' }), false);
  assert.equal(history.isSpecializedWealthStashTab({ type: 'QuadStash', n: '덤프' }), false);
  assert.equal(history.isSpecializedWealthStashTab({ type: 'PremiumStash', n: '환영' }), true);
});

test('stash tab fetch plan only loads newly selected tabs unless refresh is forced', () => {
  assert.deepEqual(history.getStashTabFetchPlan([1, 2, 3], [1, 2]), [3]);
  assert.deepEqual(history.getStashTabFetchPlan([1, 2], [1, 2, 3]), []);
  assert.deepEqual(history.getStashTabFetchPlan([1, 2], [1, 2, 3], true), [1, 2]);
});
