'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const mapRegex = require('../map-regex.js');

test('PoE1 numeric thresholds use compact stash-search patterns', () => {
  assert.equal(mapRegex.buildCompactPercentAtLeastRegex(30), '([3-9].|[1-9]..)%');
  assert.equal(mapRegex.buildCompactPercentAtLeastRegex(80), '([8-9].|[1-9]..)%');
  assert.equal(mapRegex.buildCompactPercentAtLeastRegex(85), '(8[5-9]|9.|[1-9]..)%');
  assert.equal(mapRegex.buildCompactPercentAtLeastRegex(''), '');
});

test('PoE1 curated exclusion patterns fit inside the stash search limit', () => {
  const patterns = mapRegex.POE1_GROUPS.flatMap(group => group.items.map(item => item.pattern));
  const allExclusions = `!${[...new Set(patterns)].join('|')}`;
  const state = mapRegex.getLengthState(allExclusions);
  assert.equal(state.overLimit, false);
  assert.ok(state.length < 200, `expected compact output, got ${state.length} characters`);
});

test("length state uses PoE stash's 250 character limit", () => {
  assert.deepEqual(mapRegex.getLengthState('x'.repeat(250)), { length: 250, max: 250, overLimit: false });
  assert.equal(mapRegex.getLengthState('x'.repeat(251)).overLimit, true);
});
