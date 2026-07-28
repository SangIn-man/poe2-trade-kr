(function initPobCompare(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.POE2TQPobCompare = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPobCompare() {
  'use strict';

  function parseNodeIds(value) {
    const result = new Set();
    const matches = String(value || '').match(/\d+/g) || [];
    for (const id of matches) result.add(id);
    return result;
  }

  function parseMasteryEffects(value) {
    const result = new Map();
    const text = String(value || '');
    const pattern = /\{\s*(\d+)\s*,\s*(\d+)\s*\}/g;
    let match;
    while ((match = pattern.exec(text))) result.set(match[1], match[2]);
    return result;
  }

  function resolveSpecIndex(specCount, activeSpec, selectedIndex) {
    const count = Number(specCount) || 0;
    if (count <= 0) return -1;
    const requested = Number.parseInt(selectedIndex, 10);
    if (Number.isInteger(requested) && requested >= 0 && requested < count) return requested;
    const activeIndex = Number.parseInt(activeSpec, 10) - 1;
    return Number.isInteger(activeIndex) && activeIndex >= 0 && activeIndex < count ? activeIndex : 0;
  }

  function compareSpecs(first, second) {
    const firstNodes = first?.nodes instanceof Set ? first.nodes : parseNodeIds(first?.nodes);
    const secondNodes = second?.nodes instanceof Set ? second.nodes : parseNodeIds(second?.nodes);
    const firstMasteries = first?.masteries instanceof Map ? first.masteries : parseMasteryEffects(first?.masteries);
    const secondMasteries = second?.masteries instanceof Map ? second.masteries : parseMasteryEffects(second?.masteries);
    const onlyFirst = [];
    const onlySecond = [];
    const masteryChanges = [];

    for (const id of firstNodes) if (!secondNodes.has(id)) onlyFirst.push(id);
    for (const id of secondNodes) if (!firstNodes.has(id)) onlySecond.push(id);

    const masteryIds = new Set([...firstMasteries.keys(), ...secondMasteries.keys()]);
    for (const nodeId of masteryIds) {
      const firstEffect = firstMasteries.get(nodeId) || null;
      const secondEffect = secondMasteries.get(nodeId) || null;
      if (firstEffect !== secondEffect) masteryChanges.push({ nodeId, firstEffect, secondEffect });
    }

    const numericSort = (a, b) => Number(a) - Number(b);
    onlyFirst.sort(numericSort);
    onlySecond.sort(numericSort);
    masteryChanges.sort((a, b) => numericSort(a.nodeId, b.nodeId));
    return { onlyFirst, onlySecond, masteryChanges };
  }

  return { parseNodeIds, parseMasteryEffects, resolveSpecIndex, compareSpecs };
});
