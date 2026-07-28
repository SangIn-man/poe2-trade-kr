const test = require('node:test');
const assert = require('node:assert/strict');
const { parseNodeIds, parseMasteryEffects, resolveSpecIndex, compareSpecs } = require('../pob-compare.js');
const poe1Tree = require('../data/poe1-passive-tree-3.28.json');

test('parseNodeIds ignores empty values and removes duplicates', () => {
  assert.deepEqual([...parseNodeIds('1, 2,2,65536')], ['1', '2', '65536']);
  assert.equal(parseNodeIds('').size, 0);
});

test('parseMasteryEffects reads PoB mastery tuples', () => {
  assert.deepEqual([...parseMasteryEffects('{100,7},{ 200, 9 }')], [['100', '7'], ['200', '9']]);
});

test('resolveSpecIndex uses an explicit selection and otherwise falls back to the active spec', () => {
  assert.equal(resolveSpecIndex(4, '3', '1'), 1);
  assert.equal(resolveSpecIndex(4, '3', ''), 2);
  assert.equal(resolveSpecIndex(4, '99', ''), 0);
  assert.equal(resolveSpecIndex(0, '1', ''), -1);
});

test('compareSpecs reports node and mastery differences', () => {
  const result = compareSpecs(
    { nodes: '30,10,20', masteries: '{10,1},{20,2}' },
    { nodes: '10,30,40', masteries: '{10,3},{40,4}' }
  );
  assert.deepEqual(result.onlyFirst, ['20']);
  assert.deepEqual(result.onlySecond, ['40']);
  assert.deepEqual(result.masteryChanges, [
    { nodeId: '10', firstEffect: '1', secondEffect: '3' },
    { nodeId: '20', firstEffect: '2', secondEffect: null },
    { nodeId: '40', firstEffect: null, secondEffect: '4' }
  ]);
});

test('generated PoE1 3.28 tree contains official node metadata', () => {
  assert.equal(poe1Tree.treeVersion, '3.28');
  assert.ok(Object.keys(poe1Tree.nodes).length > 3000);
  assert.equal(poe1Tree.nodes['52349'].name, "The King's Contempt");
  assert.equal(poe1Tree.nodes['52349'].koName, '왕의 경멸');
  assert.ok(poe1Tree.nodes['52349'].stats.length > 0);
  assert.ok(poe1Tree.nodes['52349'].koStats[0].includes('단련의 오라 효과'));
  assert.equal(poe1Tree.source.koreanNameMatches, Object.keys(poe1Tree.nodes).length);
  assert.equal(poe1Tree.source.koreanFallbackMatches, 7);
  assert.equal(poe1Tree.nodes['42469'].koName, '치명적인 번창');
  const masteryEffects = Object.values(poe1Tree.nodes).flatMap(node => node.masteryEffects || []);
  assert.equal(poe1Tree.source.koreanMasteryEffectMatches, masteryEffects.length);
  assert.ok(masteryEffects.length > 1800);
  assert.ok(masteryEffects.every(effect => effect.koStats?.length));
  assert.equal(poe1Tree.nodes['89'].masteryEffects.length, 6);
  assert.ok(poe1Tree.nodes['89'].masteryEffects.some(effect => effect.koStats.includes('지뢰는 피해를 받지 않음')));
});
