(function initStashHistory(globalScope) {
  'use strict';

  const SNAPSHOT_REPLACE_WINDOW_MS = 5 * 60 * 1000;
  const HISTORY_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
  const MAX_SNAPSHOTS = 720;
  const SNAPSHOT_SCHEMA_VERSION = 2;

  function normalizeKeyPart(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getContextKey(accountName, league) {
    return `${normalizeKeyPart(accountName)}::${normalizeKeyPart(league)}`;
  }

  function compactRows(rows, fallbackItems = null) {
    const items = {};
    for (const row of rows || []) {
      const key = normalizeKeyPart(row.inventoryKey || row.rawName || row.name);
      const quantity = Number(row.quantity);
      const currentUnitValue = Number(row.unitValue);
      const fallbackUnitValue = Number(fallbackItems?.[key]?.unitValue);
      const unitValue = currentUnitValue > 0
        ? currentUnitValue
        : (fallbackUnitValue > 0 ? fallbackUnitValue : 0);
      if (!key || !(quantity > 0)) continue;
      items[key] = {
        name: String(row.name || row.rawName || key),
        category: String(row.category || ''),
        quantity,
        unitValue
      };
    }
    return items;
  }

  function getSelectionKey(selected) {
    return [...(selected || [])]
      .map(selection => `${Number(selection?.index)}:${String(selection?.filter || 'all')}`)
      .sort()
      .join('|');
  }

  function isCoreFarmingStashTab(tab) {
    if (!tab || tab.hidden || tab.metadata?.folder) return false;
    const type = String(tab.type || tab.stashType || '');
    const name = String(tab.n || tab.name || '');
    if (/(remove.only|제거만 가능)/i.test(name)) return false;
    return /(currency|fragmentstash|scarab|essence|divination|cardstash|gemstash|skillgem|mapstash|deliriumstash)/i.test(`${type} ${name}`)
      || /(화폐|조각|갑충|에센스|점술\s*카드|스킬\s*젬|지도|환영)/i.test(name);
  }

  function isSpecializedWealthStashTab(tab) {
    if (!tab || tab.hidden || tab.metadata?.folder) return false;
    const type = String(tab.type || tab.stashType || '');
    const name = String(tab.n || tab.name || '');
    if (/(remove.only|제거만 가능)/i.test(name)) return false;
    if (isCoreFarmingStashTab(tab)) return true;
    return /(delve|blight|delirium|ultimatum|metamorph|unique|flask)stash/i.test(type)
      || /(환영|화석|공명기|성유|오일|결전|변형|고유|플라스크)/i.test(name);
  }

  function getStashTabFetchPlan(selectedIndexes, cachedIndexes, forceRefresh = false) {
    const selected = [...new Set((selectedIndexes || []).map(Number).filter(Number.isInteger))];
    if (forceRefresh) return selected;
    const cached = new Set((cachedIndexes || []).map(Number).filter(Number.isInteger));
    return selected.filter(index => !cached.has(index));
  }

  function createSnapshot(options) {
    const timestamp = Number(options?.timestamp) || Date.now();
    const items = compactRows(options?.rows, options?.fallbackItems);
    const totalDivine = Object.values(items).reduce(
      (total, item) => total + item.quantity * item.unitValue,
      0
    );
    return {
      id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
      schemaVersion: SNAPSHOT_SCHEMA_VERSION,
      timestamp,
      accountName: String(options?.accountName || ''),
      league: String(options?.league || ''),
      totalDivine,
      chaosRate: Number(options?.chaosRate) || 1,
      selected: Array.isArray(options?.selected) ? options.selected : [],
      scopeKey: getSelectionKey(options?.selected),
      failedTabs: Number(options?.failedTabs) || 0,
      items
    };
  }

  function calculateDelta(previous, current) {
    if (!previous || !current) {
      return { quantityDelta: 0, marketDelta: 0, totalDelta: 0, elapsedMs: 0 };
    }
    const previousItems = previous.items || {};
    const currentItems = current.items || {};
    const keys = new Set([...Object.keys(previousItems), ...Object.keys(currentItems)]);
    let quantityDelta = 0;
    let marketDelta = 0;
    for (const key of keys) {
      const before = previousItems[key];
      const after = currentItems[key];
      const previousQuantity = Number(before?.quantity) || 0;
      const currentQuantity = Number(after?.quantity) || 0;
      const previousPrice = Number(before?.unitValue) || Number(after?.unitValue) || 0;
      const currentPrice = Number(after?.unitValue) || previousPrice;
      quantityDelta += (currentQuantity - previousQuantity) * currentPrice;
      marketDelta += previousQuantity * (currentPrice - previousPrice);
    }
    return {
      quantityDelta,
      marketDelta,
      totalDelta: (Number(current.totalDivine) || 0) - (Number(previous.totalDivine) || 0),
      elapsedMs: Math.max(0, (Number(current.timestamp) || 0) - (Number(previous.timestamp) || 0))
    };
  }

  function buildItemDeltas(previous, current) {
    if (!previous || !current) return {};
    const previousItems = previous.items || {};
    const currentItems = current.items || {};
    const deltas = {};
    const keys = new Set([...Object.keys(previousItems), ...Object.keys(currentItems)]);
    for (const key of keys) {
      const before = previousItems[key];
      const after = currentItems[key];
      const previousQuantity = Number(before?.quantity) || 0;
      const currentQuantity = Number(after?.quantity) || 0;
      const quantityDelta = currentQuantity - previousQuantity;
      if (!quantityDelta) continue;
      const unitValue = Number(after?.unitValue) || Number(before?.unitValue) || 0;
      deltas[key] = {
        key,
        name: String(after?.name || before?.name || key),
        category: String(after?.category || before?.category || ''),
        previousQuantity,
        currentQuantity,
        quantityDelta,
        unitValue,
        valueDelta: quantityDelta * unitValue
      };
    }
    return deltas;
  }

  function findLatestSnapshotForScope(snapshots, scopeKey) {
    const normalizedScope = String(scopeKey || '');
    let latest = null;
    for (const snapshot of snapshots || []) {
      if (String(snapshot?.scopeKey || '') !== normalizedScope) continue;
      if (!latest || Number(snapshot.timestamp) > Number(latest.timestamp)) latest = snapshot;
    }
    return latest;
  }

  function downsampleChartSeries(series, maxPoints) {
    const points = Array.isArray(series) ? series : [];
    const threshold = Math.max(3, Math.floor(Number(maxPoints) || 0));
    if (points.length <= threshold) return [...points];

    const sampled = [points[0]];
    const bucketSize = (points.length - 2) / (threshold - 2);
    let anchorIndex = 0;
    for (let bucket = 0; bucket < threshold - 2; bucket++) {
      const averageStart = Math.floor((bucket + 1) * bucketSize) + 1;
      const averageEnd = Math.min(points.length, Math.floor((bucket + 2) * bucketSize) + 1);
      let averageX = 0;
      let averageY = 0;
      const averageCount = Math.max(1, averageEnd - averageStart);
      for (let index = averageStart; index < averageEnd; index++) {
        averageX += Number(points[index]?.snapshot?.timestamp) || 0;
        averageY += Number(points[index]?.snapshot?.totalDivine) || 0;
      }
      averageX /= averageCount;
      averageY /= averageCount;

      const rangeStart = Math.floor(bucket * bucketSize) + 1;
      const rangeEnd = Math.min(points.length - 1, Math.floor((bucket + 1) * bucketSize) + 1);
      const anchorX = Number(points[anchorIndex]?.snapshot?.timestamp) || 0;
      const anchorY = Number(points[anchorIndex]?.snapshot?.totalDivine) || 0;
      let selectedIndex = rangeStart;
      let largestArea = -1;
      for (let index = rangeStart; index < rangeEnd; index++) {
        const pointX = Number(points[index]?.snapshot?.timestamp) || 0;
        const pointY = Number(points[index]?.snapshot?.totalDivine) || 0;
        const area = Math.abs(
          (anchorX - averageX) * (pointY - anchorY)
          - (anchorX - pointX) * (averageY - anchorY)
        );
        if (area > largestArea) {
          largestArea = area;
          selectedIndex = index;
        }
      }
      sampled.push(points[selectedIndex]);
      anchorIndex = selectedIndex;
    }
    sampled.push(points[points.length - 1]);
    return sampled;
  }

  function shouldRecordValueSnapshot(previous, current, threshold) {
    if (!current) return false;
    if (!previous) return true;
    const changeDivine = Math.abs(
      (Number(current.totalDivine) || 0) - (Number(previous.totalDivine) || 0)
    );
    const value = Math.max(0, Number(threshold?.value) || 0);
    if (String(threshold?.unit || 'divine') === 'chaos') {
      const chaosRate = Number(current.chaosRate) || Number(previous.chaosRate) || 1;
      return changeDivine * chaosRate + Number.EPSILON >= value;
    }
    return changeDivine + Number.EPSILON >= value;
  }

  function filterSnapshotsByValueChange(snapshots, threshold) {
    const ordered = [...(snapshots || [])].sort((a, b) => a.timestamp - b.timestamp);
    const filtered = [];
    for (const snapshot of ordered) {
      if (shouldRecordValueSnapshot(filtered[filtered.length - 1], snapshot, threshold)) {
        filtered.push(snapshot);
      }
    }
    return filtered;
  }

  function buildSeries(snapshots) {
    const ordered = [...(snapshots || [])].sort((a, b) => a.timestamp - b.timestamp);
    let inventoryValue = Number(ordered[0]?.totalDivine) || 0;
    return ordered.map((snapshot, index) => {
      const delta = index ? calculateDelta(ordered[index - 1], snapshot) : {
        quantityDelta: 0,
        marketDelta: 0,
        totalDelta: 0,
        elapsedMs: 0
      };
      if (index) inventoryValue += delta.quantityDelta;
      return { snapshot, inventoryValue, ...delta };
    });
  }

  function upsertSnapshot(snapshots, snapshot, protectedTimestamp = 0, now = Date.now()) {
    const cutoff = now - HISTORY_RETENTION_MS;
    const next = [...(snapshots || [])]
      .filter(item => Number(item?.timestamp) >= cutoff)
      .sort((a, b) => a.timestamp - b.timestamp);
    const last = next[next.length - 1];
    if (last
      && snapshot.timestamp - last.timestamp < SNAPSHOT_REPLACE_WINDOW_MS
      && String(last.scopeKey || '') === String(snapshot.scopeKey || '')
      && Number(last.timestamp) !== Number(protectedTimestamp)) {
      next[next.length - 1] = snapshot;
    } else {
      next.push(snapshot);
    }
    return next.slice(-MAX_SNAPSHOTS);
  }

  const api = {
    SNAPSHOT_REPLACE_WINDOW_MS,
    SNAPSHOT_SCHEMA_VERSION,
    getContextKey,
    getSelectionKey,
    isCoreFarmingStashTab,
    isSpecializedWealthStashTab,
    getStashTabFetchPlan,
    createSnapshot,
    calculateDelta,
    buildItemDeltas,
    findLatestSnapshotForScope,
    downsampleChartSeries,
    shouldRecordValueSnapshot,
    filterSnapshotsByValueChange,
    buildSeries,
    upsertSnapshot
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalScope.POE2TQStashHistory = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
