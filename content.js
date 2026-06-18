console.warn('🔥 POE2 content.js LOADED 🔥');
'use strict';

// ─── 거래소 사이트 판별 ───────────────────────────────
// content.js 는 <all_urls> 에 주입되므로, 거래소 전용 로직(⭐ 버튼,
// MutationObserver, 매물 평가 등)은 거래소 호스트에서만 실행한다.
const IS_TRADE_SITE = /(?:poe\.kakaogames\.com|pathofexile\.com)/i.test(location.hostname);

// ─── tracked rows ─────────────────────────────────────
const injected = new WeakSet();
const SEARCH_EVAL_KEY = 'searchEvaluationContexts';
const TRADE_RATE_KEY = 'tradeCurrencyRates';
let cachedEvalQueryId = null;
let cachedEvalContext = null;
let cachedEvalContextPromise = null;
let cachedTradeRates = null;

if (IS_TRADE_SITE) {
  const observer = new MutationObserver(() => scanItems());
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(scanItems, 1000);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes[TRADE_RATE_KEY]) {
      cachedTradeRates = changes[TRADE_RATE_KEY].newValue || null;
      scheduleEvaluation();
    }
    if (changes[SEARCH_EVAL_KEY]) {
      cachedEvalContext = null;           // 캐시 무효화
      cachedEvalContextPromise = null;    // 진행 중인 프로미스도 무효화
      document.querySelectorAll('.row[data-id]').forEach(row => {
        applySearchEvaluation(row).catch(() => {});
      });
      scheduleEvaluation();
    }
  });

  storageGet([TRADE_RATE_KEY]).then(result => {
    cachedTradeRates = result?.[TRADE_RATE_KEY] || null;
    scheduleEvaluation();
  }).catch(() => {});
}

// ─── DOM-based search evaluation ──────────────────────
function getRatePerDivine(currency) {
  const rates = cachedTradeRates?.rates || {};
  if (!currency) return null;
  if (currency === 'divine') return 1;
  const aliases = {
    exalted: ['exalted', 'exalt'],
    chaos: ['chaos'],
    divine: ['divine']
  };
  const keys = aliases[currency] || [currency];
  for (const key of keys) {
    const value = Number(rates[key]);
    if (isFinite(value) && value > 0) return value;
  }
  return null;
}

function parseListingPrice(row) {
  const priceEl = row.querySelector('.price') || row.querySelector('.listing-price')
    || row.querySelector('[class*="price"]');
  if (!priceEl) return null;
  const imgAlt = (priceEl.querySelector('img')?.alt || '').toLowerCase();
  const text = priceEl.textContent.trim().replace(/\s+/g, ' ');
  const numMatch = text.match(/([\d.]+)/);
  if (!numMatch) return null;
  const amount = parseFloat(numMatch[1]);
  if (!amount || amount <= 0) return null;
  const combined = (imgAlt + ' ' + text).toLowerCase();
  let currency = '';
  if (/divine|div/.test(combined)) currency = 'divine';
  else if (/chaos/.test(combined)) currency = 'chaos';
  else if (/exalt/.test(combined)) currency = 'exalted';
  else if (/gold/.test(combined)) currency = 'gold';

  let normalized = amount;
  if (currency === 'gold') {
    normalized = amount * 0.0001;
  } else if (currency) {
    const ratePerDivine = getRatePerDivine(currency);
    if (currency === 'divine') normalized = amount;
    else if (ratePerDivine && isFinite(ratePerDivine) && ratePerDivine > 0) normalized = amount / ratePerDivine;
    else if (currency === 'exalted') normalized = amount / 100;
    else if (currency === 'chaos') normalized = amount / 1000;
  }
  return { amount, currency, normalized };
}

let evalDebounceTimer = null;
function scheduleEvaluation() {
  clearTimeout(evalDebounceTimer);
  evalDebounceTimer = setTimeout(computeAndApplyEvaluations, 800);
}

function normalizeTierStatText(text) {
  return normalizeSpace(String(text || '')
    .replace(/\[([^\]|]+)\|([^\]]+)\]/g, '$2')
    .replace(/\[([^\]|]+)\]/g, '$1')
    .replace(/,/g, '')
    .replace(/([+-]?\d+(?:\.\d+)?)\s*(?:to|~|-|—)\s*([+-]?\d+(?:\.\d+)?)/gi, '#~#')
    .replace(/[+-]?\d+(?:\.\d+)?/g, '#')
    .replace(/[+-]\s*#/g, '#')
    .toLowerCase());
}

function parseTierTag(text) {
  const m = normalizeSpace(text || '').match(/\b([PS])(\d+)\b/i);
  if (!m) return null;
  return {
    tag: `${m[1].toUpperCase()}${m[2]}`,
    tierType: m[1].toUpperCase() === 'P' ? 'prefix' : 'suffix',
    tierRank: parseInt(m[2], 10)
  };
}

function getTradeAffixKind(block, statEl) {
  const field = String(statEl?.getAttribute('data-field') || '');
  const classText = `${block?.className || ''} ${statEl?.className || ''}`.toLowerCase();
  if (/\.fractured\./.test(field) || classText.includes('fractured')) return 'fractured';
  if (/\.crafted\./.test(field) || classText.includes('crafted')) return 'crafted';
  if (/\.desecrated\./.test(field) || classText.includes('desecrated')) return 'desecrated';
  if (/\.implicit\./.test(field) || classText.includes('implicit')) return 'implicit';
  if (/\.rune\./.test(field) || classText.includes('rune')) return 'rune';
  if (/\.explicit\./.test(field) || classText.includes('explicit')) return 'explicit';
  return 'unknown';
}

function extractTieredAffixes(row) {
  const affixes = [];
  row.querySelectorAll('.item-mod').forEach((block, idx) => {
    if (!isVisibleElement(block)) return;
    const tierEl = block.querySelector('.lc.l.pr, .lc.l.su, .l.pr, .l.su');
    const statEl = block.querySelector('[data-field^="stat."], [data-field*=".stat_"], .s.lc, .lc.s');
    const tier = parseTierTag(tierEl?.textContent || '');
    const label = normalizeSpace(statEl?.textContent || '');
    if (!tier || !label) return;
    const value = extractStatValueFromText(label);
    affixes.push({
      order: idx,
      tag: tier.tag,
      tierType: tier.tierType,
      tierRank: isFinite(tier.tierRank) ? tier.tierRank : 99,
      affixKind: getTradeAffixKind(block, statEl),
      label,
      normalizedLabel: normalizeTierStatText(label),
      value: isFinite(value) ? value : NaN,
      dataField: statEl.getAttribute('data-field') || '',
      blockClassName: block.className || ''
    });
  });
  return affixes;
}

function getTierWeight(rank) {
  const safeRank = isFinite(rank) ? Math.max(0, Math.floor(rank)) : 12;
  return 13 - Math.min(safeRank, 12);
}

function computeMedian(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function computeRelativeRollScore(value, bucketValues) {
  const usable = (bucketValues || []).filter(v => isFinite(v));
  if (!usable.length || !isFinite(value)) return 0.5;
  const min = Math.min(...usable);
  const max = Math.max(...usable);
  if (!isFinite(min) || !isFinite(max) || max <= min) return 0.5;
  return (value - min) / (max - min);
}

function summarizeAffixes(affixes) {
  return affixes
    .slice()
    .sort((a, b) => a.tierRank - b.tierRank || String(a.label).localeCompare(String(b.label)))
    .slice(0, 3)
    .map(affix => `${affix.tag} ${affix.label}`)
    .join(' / ');
}

function formatNormalizedPrice(normalizedPrice) {
  if (!(normalizedPrice > 0)) return '';
  if (normalizedPrice >= 200) {
    const div = normalizedPrice / 200;
    const rounded = div >= 10 ? div.toFixed(1) : div.toFixed(2);
    return `${rounded.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')} div`;
  }
  return `${Number(normalizedPrice.toFixed(1))} chaos`;
}

function guessCategoryFromIcon(src) {
  const icon = String(src || '');
  if (/Helmets?/i.test(icon)) return 'armour.helmet';
  if (/BodyArmou?rs?|Chests?/i.test(icon)) return 'armour.chest';
  if (/Gloves?/i.test(icon)) return 'armour.gloves';
  if (/Boots?/i.test(icon)) return 'armour.boots';
  if (/Belts?/i.test(icon)) return 'armour.belt';
  if (/Rings?/i.test(icon)) return 'accessory.ring';
  if (/Amulets?/i.test(icon)) return 'accessory.amulet';
  if (/Quivers?/i.test(icon)) return 'armour.quiver';
  if (/Shields?/i.test(icon)) return 'armour.shield';
  if (/Foci|Focuses?/i.test(icon)) return 'armour.focus';
  if (/Bucklers?/i.test(icon)) return 'armour.buckler';
  if (/Bows?/i.test(icon)) return 'weapon.bow';
  if (/Wands?/i.test(icon)) return 'weapon.wand';
  if (/Sceptres?/i.test(icon)) return 'weapon.sceptre';
  if (/Spears?/i.test(icon)) return 'weapon.spear';
  if (/Flails?/i.test(icon)) return 'weapon.flail';
  if (/Claws?/i.test(icon)) return 'weapon.claw';
  if (/Daggers?/i.test(icon)) return 'weapon.dagger';
  if (/OneHandSwords?|ThrustingOneHandSwords?/i.test(icon)) return 'weapon.onesword';
  if (/OneHandAxes?/i.test(icon)) return 'weapon.oneaxe';
  if (/OneHandMaces?/i.test(icon)) return 'weapon.onemace';
  if (/TwoHandSwords?/i.test(icon)) return 'weapon.twosword';
  if (/TwoHandAxes?/i.test(icon)) return 'weapon.twoaxe';
  if (/TwoHandMaces?/i.test(icon)) return 'weapon.twomace';
  if (/Warstaves?/i.test(icon)) return 'weapon.warstaff';
  if (/Staves|Staffs?/i.test(icon)) return 'weapon.staff';
  if (/Crossbows?/i.test(icon)) return 'weapon.crossbow';
  return '';
}

function extractRowCategory(row) {
  const img = row.querySelector('img[src*="Items/"], img[src*="Art/2DItems"], img[src]');
  return guessCategoryFromIcon(img?.getAttribute('src') || img?.src || '');
}

function buildItemFingerprint(row, affixes) {
  const category = extractRowCategory(row);
  return {
    category,
    affixCount: (affixes || []).length
  };
}

function buildAffixMap(affixes) {
  const map = new Map();
  (affixes || []).forEach(affix => {
    if (!affix?.normalizedLabel) return;
    const prev = map.get(affix.normalizedLabel);
    if (!prev || affix.tierRank < prev.tierRank) map.set(affix.normalizedLabel, affix);
  });
  return map;
}

function buildLabelStats(entries) {
  const stats = new Map();
  entries.forEach(entry => {
    entry.affixes.forEach(affix => {
      if (!affix.normalizedLabel) return;
      let item = stats.get(affix.normalizedLabel);
      if (!item) {
        item = { min: Infinity, max: -Infinity, count: 0 };
        stats.set(affix.normalizedLabel, item);
      }
      if (isFinite(affix.value)) {
        item.min = Math.min(item.min, affix.value);
        item.max = Math.max(item.max, affix.value);
      }
      item.count += 1;
    });
  });
  return stats;
}

function computeEntryQualityScore(entry, labelStats) {
  if (!entry.affixes.length) return 0;
  return entry.affixes.reduce((sum, affix) => {
    const tierScore = Math.pow(getTierWeight(affix.tierRank), 1.85) * 3.2;
    const stat = labelStats.get(affix.normalizedLabel);
    const rollScore = computeRelativeRollScore(affix.value, stat ? [stat.min, stat.max] : null) * 18;
    return sum + tierScore + rollScore;
  }, 0);
}

function computePairSimilarity(entryA, entryB, labelStats) {
  if (entryA.fingerprint?.category && entryB.fingerprint?.category
      && entryA.fingerprint.category !== entryB.fingerprint.category) {
    return { similarity: 0, sharedCount: 0 };
  }

  const labels = new Set([
    ...Array.from(entryA.affixMap.keys()),
    ...Array.from(entryB.affixMap.keys())
  ]);
  if (!labels.size) return { similarity: 0, sharedCount: 0 };

  let numerator = 0;
  let denominator = 0;
  let sharedCount = 0;

  labels.forEach(label => {
    const affixA = entryA.affixMap.get(label);
    const affixB = entryB.affixMap.get(label);
    const aWeight = affixA ? getTierWeight(affixA.tierRank) : 0;
    const bWeight = affixB ? getTierWeight(affixB.tierRank) : 0;
    const labelWeight = Math.max(aWeight, bWeight, 1);
    denominator += labelWeight;
    if (!affixA || !affixB) return;

    sharedCount += 1;
    const tierDiff = Math.abs((affixA.tierRank || 99) - (affixB.tierRank || 99));
    const tierCloseness = Math.max(0, 1 - (tierDiff / 5));
    const stat = labelStats.get(label);
    const range = stat && isFinite(stat.min) && isFinite(stat.max) ? Math.max(stat.max - stat.min, 0) : 0;
    let rollCloseness = 0.6;
    if (range > 0 && isFinite(affixA.value) && isFinite(affixB.value)) {
      rollCloseness = Math.max(0, 1 - (Math.abs(affixA.value - affixB.value) / range));
    } else if (isFinite(affixA.value) && isFinite(affixB.value)) {
      rollCloseness = 1;
    }

    const localScore = labelWeight * (0.52 + (tierCloseness * 0.33) + (rollCloseness * 0.15));
    numerator += localScore;
  });

  const sharedRatio = sharedCount / Math.max(entryA.affixes.length, entryB.affixes.length, 1);
  let similarity = denominator > 0 ? (numerator / denominator) * (0.45 + (sharedRatio * 0.55)) : 0;
  const countGap = Math.abs((entryA.fingerprint?.affixCount || 0) - (entryB.fingerprint?.affixCount || 0));
  if (countGap > 0) similarity *= Math.max(0.65, 1 - (countGap * 0.08));
  return { similarity, sharedCount };
}

function estimateExpectedPrice(entry, entries, labelStats) {
  const comparisons = [];
  entries.forEach(candidate => {
    if (candidate === entry) return;
    if (!candidate.price?.normalized || !candidate.affixes.length) return;
    const pair = computePairSimilarity(entry, candidate, labelStats);
    if (pair.sharedCount < Math.max(2, Math.floor(Math.min(entry.affixes.length, candidate.affixes.length) / 2))) return;
    if (pair.similarity < 0.32) return;
    comparisons.push({
      similarity: pair.similarity,
      sharedCount: pair.sharedCount,
      candidate
    });
  });

  comparisons.sort((a, b) => b.similarity - a.similarity || a.candidate.price.normalized - b.candidate.price.normalized);
  const neighbors = comparisons.slice(0, 8);
  if (!neighbors.length) return null;

  const weighted = neighbors.reduce((acc, item) => {
    const weight = Math.pow(item.similarity, 2.4) * (1 + (item.sharedCount * 0.12));
    acc.weight += weight;
    acc.logSum += Math.log(item.candidate.price.normalized) * weight;
    acc.similaritySum += item.similarity;
    return acc;
  }, { weight: 0, logSum: 0, similaritySum: 0 });

  if (!(weighted.weight > 0)) return null;
  return {
    expectedPrice: Math.exp(weighted.logSum / weighted.weight),
    neighborCount: neighbors.length,
    confidence: weighted.similaritySum / neighbors.length
  };
}

function computeAndApplyEvaluations() {
  const rows = [...document.querySelectorAll('.row[data-id]')];
  if (rows.length < 2) return;
  const entries = rows.map(row => ({
    row,
    price: parseListingPrice(row),
    affixes: extractTieredAffixes(row)
  }));
  const pricedEntries = entries.filter(entry => entry.price?.normalized > 0);
  if (pricedEntries.length < 2) return;

  entries.forEach(entry => {
    entry.affixMap = buildAffixMap(entry.affixes);
    entry.fingerprint = buildItemFingerprint(entry.row, entry.affixes);
  });
  const labelStats = buildLabelStats(entries);

  let maxQualityScore = 0;
  entries.forEach(entry => {
    if (!entry.affixes.length || !entry.price?.normalized) return;
    const qualityScore = computeEntryQualityScore(entry, labelStats);
    if (!(qualityScore > 0)) return;
    entry.qualityScore = qualityScore;
    maxQualityScore = Math.max(maxQualityScore, qualityScore);
  });

  const estimatedEntries = [];
  entries.forEach(entry => {
    if (!entry.price?.normalized || !entry.qualityScore) return;
    const estimate = estimateExpectedPrice(entry, entries, labelStats);
    if (!estimate?.expectedPrice) return;
    entry.expectedPrice = estimate.expectedPrice;
    entry.neighborCount = estimate.neighborCount;
    entry.confidence = estimate.confidence;
    entry.comparisonRatio = entry.expectedPrice / entry.price.normalized;
    estimatedEntries.push(entry);
  });

  if (!estimatedEntries.length) {
    pricedEntries.forEach(entry => {
      upsertSearchEvaluationBadge(entry.row, {
        tier: '평가 보류',
        statScore: 0,
        priceText: `${entry.price.amount} ${entry.price.currency}`,
        ratioToMedian: null,
        affixSummary: entry.affixes.length ? summarizeAffixes(entry.affixes) : ''
      });
    });
    return;
  }

  entries.forEach(entry => {
    if (!entry.price) return;
    if (!entry.affixes.length || !entry.qualityScore || !entry.expectedPrice || !entry.comparisonRatio) {
      upsertSearchEvaluationBadge(entry.row, {
        tier: '평가 보류',
        statScore: 0,
        priceText: `${entry.price.amount} ${entry.price.currency}`,
        ratioToMedian: null,
        affixSummary: entry.affixes.length ? summarizeAffixes(entry.affixes) : ''
      });
      return;
    }

    const ratio = Number(entry.comparisonRatio.toFixed(2));
    const confidenceBias = entry.confidence >= 0.72 ? 0 : entry.confidence >= 0.58 ? 0.03 : 0.06;
    const lowCut = 0.83 - confidenceBias;
    const highCut = 1.2 + confidenceBias;
    const tier = ratio >= highCut ? '싼 매물' : ratio <= lowCut ? '비싼 매물' : '평균';
    const statScore = maxQualityScore
      ? Math.max(1, Math.round((entry.qualityScore / maxQualityScore) * 100))
      : 0;
    upsertSearchEvaluationBadge(entry.row, {
      tier,
      statScore,
      priceText: `${entry.price.amount} ${entry.price.currency}`,
      ratioToMedian: ratio.toFixed(2),
      affixSummary: summarizeAffixes(entry.affixes),
      expectedPriceText: formatNormalizedPrice(entry.expectedPrice),
      neighborCount: entry.neighborCount,
      confidence: entry.confidence
    });
  });
}

// ─── scan ─────────────────────────────────────────────
function scanItems() {
  const queryId = getQueryId();
  if (queryId !== cachedEvalQueryId) {
    cachedEvalQueryId = queryId;
    cachedEvalContext = null;
    cachedEvalContextPromise = null;
    document.querySelectorAll('.poe2tq-eval-badge').forEach(el => el.remove());
  }
  document.querySelectorAll('.row[data-id]').forEach(row => {
    if (injected.has(row)) return;
    injected.add(row);
    injectStarButton(row);
  });
  if (document.querySelectorAll('.row[data-id]').length > 0) {
    scheduleEvaluation();
  }
}

// ─── URL / API helpers ────────────────────────────────
function getQueryId() {
  // /trade2/search/poe2/<league>/<queryId>
  const m = location.pathname.match(/\/trade2\/search\/poe2\/[^\/]+\/([^\/?#]+)/);
  return m ? m[1] : null;
}

function getApiBase() {
  return location.hostname === 'poe.kakaogames.com'
    ? 'https://poe.kakaogames.com/api/trade2'
    : 'https://www.pathofexile.com/api/trade2';
}

function storageGet(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

function rectSnapshot(el, baseRect) {
  if (!el?.getBoundingClientRect) return null;
  const r = el.getBoundingClientRect();
  const relLeft = baseRect ? Number((r.left - baseRect.left).toFixed(1)) : Number(r.left.toFixed(1));
  const relTop = baseRect ? Number((r.top - baseRect.top).toFixed(1)) : Number(r.top.toFixed(1));
  return {
    left: relLeft,
    top: relTop,
    width: Number(r.width.toFixed(1)),
    height: Number(r.height.toFixed(1))
  };
}

function normalizeSpace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function isVisibleElement(el) {
  if (!el || !(el instanceof Element)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getElementDescriptor(el, baseRect) {
  return {
    tag: el.tagName?.toLowerCase() || '',
    className: el.className || '',
    text: normalizeSpace(el.textContent || ''),
    rect: rectSnapshot(el, baseRect)
  };
}

function collectTierBadgeNodes(row) {
  const baseRect = row.getBoundingClientRect();
  const nodes = [];
  const all = row.querySelectorAll('span, div, small, em, b, strong');
  all.forEach((el, idx) => {
    if (!isVisibleElement(el)) return;
    const text = normalizeSpace(el.textContent || '');
    if (!/^[PS]\d+$/i.test(text)) return;
    nodes.push({
      idx,
      tag: text.toUpperCase(),
      tierType: /^P/i.test(text) ? 'prefix' : 'suffix',
      tierRank: parseInt(text.slice(1), 10) || 0,
      el,
      className: el.className || '',
      rect: rectSnapshot(el, baseRect)
    });
  });
  return nodes;
}

function collectModLineNodes(row) {
  const baseRect = row.getBoundingClientRect();
  const selectors = [
    '.explicitMod', '.implicitMod', '.craftedMod', '.enchantMod', '.runeMod', '.desecratedMod',
    '.mod', '[class*="explicit"]', '[class*="implicit"]', '[class*="crafted"]',
    '[class*="enchant"]', '[class*="rune"]', '[class*="desecrated"]', '[class*="Mod"]', '[class*="-mod"]'
  ];
  const seen = new Set();
  const rows = [];
  row.querySelectorAll(selectors.join(',')).forEach((el, idx) => {
    if (!isVisibleElement(el)) return;
    if (seen.has(el)) return;
    const text = normalizeSpace(el.textContent || '');
    if (!text || /^[PS]\d+$/i.test(text)) return;
    if (text.length > 120) return;
    // Skip wrappers that only contain one child mod element with same text.
    const childSame = Array.from(el.children || []).some(child => normalizeSpace(child.textContent || '') === text);
    if (childSame && el.children.length === 1) return;
    seen.add(el);
    rows.push({
      idx,
      text,
      normalizedText: normalizeSpace(text.replace(/([+-]?\d+(?:\.\d+)?)\s*(?:to|~|-)\s*([+-]?\d+(?:\.\d+)?)/gi, '#~#').replace(/[+-]?\d+(?:\.\d+)?/g, '#')),
      el,
      className: el.className || '',
      rect: rectSnapshot(el, baseRect)
    });
  });
  return rows;
}

function pairTierBadgesToMods(modLines, tierBadges) {
  const remainingMods = modLines.slice();
  const matches = [];
  const unmatchedBadges = [];

  tierBadges.forEach(badge => {
    let bestIdx = -1;
    let bestScore = Infinity;
    remainingMods.forEach((mod, idx) => {
      if (!mod?.rect || !badge?.rect) return;
      const dy = Math.abs((badge.rect.top || 0) - (mod.rect.top || 0));
      const dx = (mod.rect.left || 0) - (badge.rect.left || 0);
      const sameParent = badge.el.parentElement === mod.el.parentElement ? -6 : 0;
      const score = dy + (dx >= -12 ? 0 : 25) + sameParent;
      if (dy <= 28 && score < bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    });
    if (bestIdx === -1) {
      unmatchedBadges.push({
        tag: badge.tag,
        tierType: badge.tierType,
        tierRank: badge.tierRank,
        className: badge.className,
        rect: badge.rect
      });
      return;
    }
    const mod = remainingMods.splice(bestIdx, 1)[0];
    matches.push({
      tierTag: badge.tag,
      tierType: badge.tierType,
      tierRank: badge.tierRank,
      modText: mod.text,
      normalizedText: mod.normalizedText,
      modClassName: mod.className,
      badgeClassName: badge.className,
      deltaTop: Number(Math.abs((badge.rect?.top || 0) - (mod.rect?.top || 0)).toFixed(1)),
      deltaLeft: Number(((mod.rect?.left || 0) - (badge.rect?.left || 0)).toFixed(1))
    });
  });

  const unmatchedMods = remainingMods.map(mod => ({
    text: mod.text,
    normalizedText: mod.normalizedText,
    className: mod.className,
    rect: mod.rect
  }));

  return { matches, unmatchedBadges, unmatchedMods };
}

function extractTieredModsFromRow(row) {
  const affixes = extractTieredAffixes(row);
  const tierBadges = collectTierBadgeNodes(row);
  const modLines = collectModLineNodes(row);
  return {
    rowId: row.dataset.id || '',
    rowClassName: row.className || '',
    rowRect: rectSnapshot(row),
    affixes,
    tierBadges: tierBadges.map(badge => ({
      tag: badge.tag,
      tierType: badge.tierType,
      tierRank: badge.tierRank,
      className: badge.className,
      rect: badge.rect
    })),
    modLines: modLines.map(mod => ({
      text: mod.text,
      normalizedText: mod.normalizedText,
      className: mod.className,
      rect: mod.rect
    })),
    matched: affixes.map(affix => ({
      tierTag: affix.tag,
      tierType: affix.tierType,
      tierRank: affix.tierRank,
      modText: affix.label,
      normalizedText: affix.normalizedLabel,
      modClassName: affix.blockClassName,
      badgeClassName: '',
      affixKind: affix.affixKind,
      dataField: affix.dataField
    })),
    unmatchedBadges: [],
    unmatchedMods: modLines
      .filter(mod => !affixes.some(affix => normalizeSpace(affix.label) === normalizeSpace(mod.text)))
      .map(mod => ({
        text: mod.text,
        normalizedText: mod.normalizedText,
        className: mod.className,
        rect: mod.rect
      })),
    rowTextSample: normalizeSpace(row.textContent || '').slice(0, 1200),
    rowHtmlSample: row.outerHTML.slice(0, 8000)
  };
}

async function loadSearchEvaluationContext() {
  const queryId = getQueryId();
  if (!queryId) return null;
  if (cachedEvalContext && cachedEvalQueryId === queryId) return cachedEvalContext;
  if (cachedEvalContextPromise) return cachedEvalContextPromise;
  cachedEvalContextPromise = storageGet([SEARCH_EVAL_KEY])
    .then(result => {
      cachedEvalQueryId = queryId;
      cachedEvalContext = result?.[SEARCH_EVAL_KEY]?.[queryId] || null;
      return cachedEvalContext;
    })
    .finally(() => {
      cachedEvalContextPromise = null;
    });
  return cachedEvalContextPromise;
}

function upsertSearchEvaluationBadge(row, evaluation) {
  if (!row || !evaluation) return;
  let badge = row.querySelector('.poe2tq-eval-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'poe2tq-eval-badge';
    const priceDiv = row.querySelector('.price') || row.querySelector('.listing-price');
    if (priceDiv?.parentNode) {
      priceDiv.parentNode.insertBefore(badge, priceDiv.nextSibling);
    } else {
      row.appendChild(badge);
    }
  }
  const tierClass = evaluation.tier === '싼 매물' ? 'tier-under'
    : evaluation.tier === '비싼 매물' ? 'tier-over'
    : evaluation.tier === '평균' ? 'tier-average' : 'tier-hold';
  badge.className = `poe2tq-eval-badge ${tierClass}`;
  badge.textContent = evaluation.tier === '평가 보류'
    ? '평가 보류' : `${evaluation.tier} · ${evaluation.statScore}점`;
  const ratioText = evaluation.ratioToMedian ? `예상가 대비 ${evaluation.ratioToMedian}x` : '비교값 없음';
  const expectedText = evaluation.expectedPriceText ? `예상가 ${evaluation.expectedPriceText}` : '';
  const neighborText = evaluation.neighborCount ? `유사템 ${evaluation.neighborCount}개` : '';
  const confidenceText = evaluation.confidence ? `신뢰도 ${Math.round(evaluation.confidence * 100)}%` : '';
  badge.title = [
    evaluation.priceText || '',
    expectedText,
    ratioText,
    neighborText,
    confidenceText,
    evaluation.affixSummary || ''
  ].filter(Boolean).join(' / ');
}

async function applySearchEvaluation(row) {
  const queryId = getQueryId();
  if (!queryId || !row?.dataset?.id) return;
  const context = await loadSearchEvaluationContext();
  if (!context?.evaluations) return;
  const rowId = String(row.dataset.id);
  const evaluation = context.evaluations[rowId]
    || context.evaluations[rowId.replace(/^_+/, '')]
    || Object.entries(context.evaluations).find(([id]) => String(id) === rowId || String(id).endsWith(rowId) || rowId.endsWith(String(id)))?.[1];
  if (!evaluation) {
    // only log first row to avoid spam
    if (!applySearchEvaluation._logged) {
      applySearchEvaluation._logged = true;
      console.log('[POE2TQ] no eval for rowId:', rowId, 'context keys sample:', Object.keys(context.evaluations).slice(0, 2));
    }
    return;
  }
  upsertSearchEvaluationBadge(row, evaluation);
}

// ─── button injection ─────────────────────────────────
function injectStarButton(row) {
  const priceDiv = row.querySelector('.price') || row.querySelector('.listing-price');

  const starBtn = document.createElement('button');
  starBtn.className = 'poe2tq-star-btn';
  starBtn.textContent = '⭐ 즐겨찾기';
  starBtn.title = 'PoE2 Trade Quick에 필터로 저장';

  starBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await handleStar(starBtn, row);
  });

  const pobBtn = document.createElement('button');
  pobBtn.className = 'pob-copy-btn';
  pobBtn.textContent = '📋';
  pobBtn.title = 'PoB 형식으로 클립보드에 복사';

  pobBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await handlePobCopy(row, pobBtn);
  });

  if (priceDiv?.parentNode) {
    priceDiv.parentNode.insertBefore(starBtn, priceDiv.nextSibling);
    priceDiv.parentNode.insertBefore(pobBtn, starBtn.nextSibling);
  } else {
    row.appendChild(starBtn);
    row.appendChild(pobBtn);
  }
}

// ─── stat selection modal ─────────────────────────────
function showStatSelectionModal(filter) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('poe2tq-stat-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'poe2tq-stat-modal';

    const statsHtml = filter.stats.length
      ? filter.stats.map((stat, i) => `
        <label class="poe2tq-sm-item">
          <input type="checkbox" data-idx="${i}" checked>
          <span class="poe2tq-sm-label">${stat.label}${stat.value != null ? ` <em>${stat.value}</em>` : ''}</span>
        </label>`).join('')
      : '<div class="poe2tq-sm-empty">속성 없음</div>';

    overlay.innerHTML = `
      <div class="poe2tq-sm-box">
        <div class="poe2tq-sm-title">${filter.name || filter.itemName || '속성 선택'}</div>
        <div class="poe2tq-sm-hint">저장할 속성을 선택하세요</div>
        <div class="poe2tq-sm-list">${statsHtml}</div>
        <div class="poe2tq-sm-actions">
          <button class="poe2tq-sm-btn-all">전체선택</button>
          <button class="poe2tq-sm-btn-none">전체해제</button>
          <span style="flex:1"></span>
          <button class="poe2tq-sm-btn-cancel">취소</button>
          <button class="poe2tq-sm-btn-save">저장</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const getChecked = () => [...overlay.querySelectorAll('input[type="checkbox"]')];

    overlay.querySelector('.poe2tq-sm-btn-all').addEventListener('click', () => getChecked().forEach(cb => cb.checked = true));
    overlay.querySelector('.poe2tq-sm-btn-none').addEventListener('click', () => getChecked().forEach(cb => cb.checked = false));

    overlay.querySelector('.poe2tq-sm-btn-cancel').addEventListener('click', () => {
      overlay.remove();
      reject(new Error('취소됨'));
    });

    overlay.querySelector('.poe2tq-sm-btn-save').addEventListener('click', () => {
      const selected = new Set(getChecked().filter(cb => cb.checked).map(cb => +cb.dataset.idx));
      filter.stats = filter.stats.filter((_, i) => selected.has(i));
      overlay.remove();
      resolve(filter);
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); reject(new Error('취소됨')); } });
  });
}

// ─── main click handler ───────────────────────────────
async function handleStar(btn, row) {
  btn.disabled = true;
  btn.textContent = '⏳ 저장 중...';

  try {
    const itemId = row.dataset.id;
    const queryId = getQueryId();
    if (!itemId) throw new Error('아이템 ID를 찾을 수 없습니다');
    if (!queryId) throw new Error('검색 결과 페이지에서만 사용 가능합니다');

    const apiUrl = `${getApiBase()}/fetch/${encodeURIComponent(itemId)}?query=${encodeURIComponent(queryId)}&realm=poe2`;
    const res = await fetch(apiUrl, { credentials: 'include' });
    if (!res.ok) throw new Error(`API 응답 오류 (HTTP ${res.status})`);
    const data = await res.json();
    const result = data?.result?.[0];
    if (!result?.item) throw new Error('아이템 데이터를 받지 못했습니다');

    const built = await buildFilterFromApi(result.item, result.listing);
    const filter = built?.filter;
    if (!filter) throw new Error('필터 생성 실패');

    const selectedFilter = await showStatSelectionModal(filter);

    chrome.runtime.sendMessage({
      type: 'APPEND_DEBUG_LOG',
      entry: {
        kind: 'favorite',
        host: location.hostname,
        itemId,
        queryId,
        sourceFetchUrl: apiUrl,
        itemSummary: {
          name: result.item?.name || '',
          typeLine: result.item?.typeLine || '',
          category: result.item?.category || '',
          frameType: result.item?.frameType,
          ilvl: result.item?.ilvl
        },
        sourceMods: {
          properties: result.item?.properties || [],
          additionalProperties: result.item?.additionalProperties || [],
          notableProperties: result.item?.notableProperties || [],
          explicitMods: result.item?.explicitMods || [],
          implicitMods: result.item?.implicitMods || [],
          craftedMods: result.item?.craftedMods || [],
          enchantMods: result.item?.enchantMods || [],
          runeMods: result.item?.runeMods || [],
          fracturedMods: result.item?.fracturedMods || [],
          bondedMods: result.item?.bondedMods || [],
          desecratedMods: result.item?.desecratedMods || [],
          utilityMods: result.item?.utilityMods || []
        },
        filter,
        debug: built.debug || null
      }
    }).catch(() => {});

    const dup = await chrome.runtime.sendMessage({
      type: 'CHECK_DUPLICATE',
      hash: selectedFilter.sourceHash
    });

    if (dup?.duplicate) {
      showToast(`이미 저장된 필터입니다: "${dup.name}"`, 'warn');
      btn.textContent = '✅ 이미 저장됨';
      return;
    }

    const saveRes = await chrome.runtime.sendMessage({ type: 'SAVE_FILTER', filter: selectedFilter });
    if (saveRes?.ok) {
      btn.textContent = '✅ 저장완료!';
      btn.classList.add('saved');
      const league = saveRes.league ? ` [${saveRes.league}]` : '';
      showToast(`"${selectedFilter.name}" 저장 완료!${league} (총 ${saveRes.total}개)`, 'ok');
    } else {
      throw new Error('저장 실패');
    }
  } catch (err) {
    if (err.message === '취소됨') {
      btn.textContent = '⭐ 즐겨찾기';
      btn.disabled = false;
      return;
    }
    btn.textContent = '❌ 실패';
    btn.disabled = false;
    showToast('오류: ' + err.message, 'err');
    setTimeout(() => { btn.textContent = '⭐ 즐겨찾기'; btn.disabled = false; }, 2500);
  }
}

async function handleTierDebug(row, btn) {
  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = '…';
  try {
    const queryId = getQueryId();
    const extracted = extractTieredModsFromRow(row);
    await chrome.runtime.sendMessage({
      type: 'APPEND_DEBUG_LOG',
      entry: {
        kind: 'tier-debug',
        host: location.hostname,
        queryId: queryId || '',
        itemId: row?.dataset?.id || '',
        extracted
      }
    });
    showToast(`티어 디버그 로그 저장 완료 (${extracted.matched.length}개 매칭)`, 'ok');
    btn.textContent = 'OK';
  } catch (err) {
    showToast(`티어 로그 실패: ${err.message}`, 'err');
    btn.textContent = '!';
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = prevText;
    }, 1200);
  }
}

// ─── frame type → rarity ──────────────────────────────
const FRAME_TYPES = {
  0: 'normal', 1: 'magic', 2: 'rare', 3: 'unique',
  4: 'gem', 5: 'currency', 6: 'divcard',
  7: 'quest', 8: 'prophecy', 9: 'foil'
};

const EQUIPMENT_PROPERTY_RULES = [
  { id: 'damage', label: '피해', patterns: [/(?:damage|피해)/i] },
  { id: 'aps', label: '초당 공격', patterns: [/(?:attacks per second|초당 공격(?: 횟수)?)/i] },
  { id: 'crit', label: '치명타 확률', patterns: [/(?:critical hit chance|치명타 확률)/i] },
  { id: 'dps', label: 'DPS', patterns: [/(?:^|\b)dps(?:$|\b)|초당 피해/i] },
  { id: 'pdps', label: '물리 DPS', patterns: [/(?:physical dps|물리 dps)/i] },
  { id: 'edps', label: '원소 DPS', patterns: [/(?:elemental dps|원소 dps)/i] },
  { id: 'reload_time', label: '재장전 시간', patterns: [/(?:reload time|재장전 시간)/i] },
  { id: 'ar', label: '방어도', patterns: [/(?:armou?r|방어도)/i] },
  { id: 'ev', label: '회피', patterns: [/(?:evasion(?: rating)?|회피(?:도| 등급)?)/i] },
  { id: 'es', label: '에너지 보호막', patterns: [/(?:energy shield|에너지 (?:실드|보호막))/i] },
  { id: 'block', label: '막기 확률', patterns: [/(?:block(?: chance)?|막기 확률)/i] },
  { id: 'spirit', label: '정신력', patterns: [/(?:spirit|정신력)/i] }
];

const EXACT_EQUIPMENT_FILTERS = new Set(['rune_sockets']);

// ─── icon path → category ─────────────────────────────
function guessCategoryFromItem(item) {
  console.log('[cat]', JSON.stringify(item?.category), item?.typeLine);
  const directCategory = item?.category;
  if (Array.isArray(directCategory) && directCategory.length) return directCategory.join('.');
  if (typeof directCategory === 'string' && directCategory) return directCategory;
  if (directCategory && typeof directCategory === 'object' && !Array.isArray(directCategory)) {
    const mainKey = Object.keys(directCategory)[0];
    const subArr = directCategory[mainKey];
    if (mainKey) {
      const singular = mainKey === 'accessories' ? 'accessory' : mainKey.replace(/s$/, '');
      if (Array.isArray(subArr) && subArr.length) return `${singular}.${subArr[0]}`;
      return singular;
    }
  }
  const icon = item?.icon || '';
  // PoE icon paths contain category hints: /Helmets/, /BodyArmours/, etc.
  if (/Helmets?/i.test(icon))      return 'armour.helmet';
  if (/BodyArmou?rs?|Chests?/i.test(icon)) return 'armour.chest';
  if (/Gloves?/i.test(icon))       return 'armour.gloves';
  if (/Boots?/i.test(icon))        return 'armour.boots';
  if (/Belts?/i.test(icon))        return 'armour.belt';
  if (/Rings?/i.test(icon))        return 'accessory.ring';
  if (/Amulets?/i.test(icon))      return 'accessory.amulet';
  if (/Quivers?/i.test(icon))      return 'armour.quiver';
  if (/Shields?/i.test(icon))      return 'armour.shield';
  if (/Foci|Focuses?/i.test(icon)) return 'armour.focus';
  if (/Bucklers?/i.test(icon))     return 'armour.buckler';
  if (/Bows?/i.test(icon))         return 'weapon.bow';
  if (/Wands?/i.test(icon))        return 'weapon.wand';
  if (/Sceptres?/i.test(icon))     return 'weapon.sceptre';
  if (/Spears?/i.test(icon))       return 'weapon.spear';
  if (/Flails?/i.test(icon))       return 'weapon.flail';
  if (/Claws?/i.test(icon))        return 'weapon.claw';
  if (/Daggers?/i.test(icon))      return 'weapon.dagger';
  if (/OneHandSwords?|ThrustingOneHandSwords?/i.test(icon)) return 'weapon.onesword';
  if (/OneHandAxes?/i.test(icon))  return 'weapon.oneaxe';
  if (/OneHandMaces?/i.test(icon)) return 'weapon.onemace';
  if (/TwoHandSwords?/i.test(icon))return 'weapon.twosword';
  if (/TwoHandAxes?/i.test(icon))  return 'weapon.twoaxe';
  if (/TwoHandMaces?/i.test(icon)) return 'weapon.twomace';
  if (/Warstaves?/i.test(icon))    return 'weapon.warstaff';
  if (/Staves|Staffs?/i.test(icon))return 'weapon.staff';
  if (/Crossbows?/i.test(icon))    return 'weapon.crossbow';
  if (/Flasks?/i.test(icon))        return 'flask';
  if (/Jewels?/i.test(icon))         return 'jewel';
  // PoE2 uses hashed CDN icon URLs — fall back to typeLine keyword matching
  const typeStr = (item?.typeLine || item?.baseType || '');
  if (/목걸이/u.test(typeStr))        return 'accessory.amulet';
  if (/부적/u.test(typeStr))          return 'weapon.talisman';
  if (/반지/u.test(typeStr))         return 'accessory.ring';
  if (/벨트/u.test(typeStr))         return 'armour.belt';
  if (/투구/u.test(typeStr))         return 'armour.helmet';
  if (/장갑/u.test(typeStr))         return 'armour.gloves';
  if (/장화|신발/u.test(typeStr))    return 'armour.boots';
  if (/방패/u.test(typeStr))         return 'armour.shield';
  if (/집중도|포커스/u.test(typeStr)) return 'armour.focus';
  if (/화살통|퀴버/u.test(typeStr))  return 'armour.quiver';
  return '';
}

function stripTags(text) {
  return String(text || '').replace(/<[^>]*>/g, '').trim();
}

function parseFirstNumber(text) {
  const m = stripTags(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

function roundFilterNumber(value) {
  if (!isFinite(value)) return NaN;
  const rounded = Math.abs(value) % 1 === 0 ? Math.abs(value) : Number(Math.abs(value).toFixed(2));
  return rounded;
}

function parsePropertyValue(name, rawValue) {
  const text = stripTags(rawValue).replace(/,/g, '');
  const range = text.match(/(-?\d+(?:\.\d+)?)\s*[-~]\s*(-?\d+(?:\.\d+)?)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    if (!isNaN(a) && !isNaN(b)) {
      if (/damage/i.test(name) || /피해/.test(name)) return roundFilterNumber((Math.abs(a) + Math.abs(b)) / 2);
      return roundFilterNumber(Math.max(Math.abs(a), Math.abs(b)));
    }
  }
  return roundFilterNumber(parseFirstNumber(text));
}

function renderPropertyText(prop) {
  const name = stripTags(prop?.name || '');
  const values = Array.isArray(prop?.values) ? prop.values.map(v => stripTags(v?.[0])).filter(Boolean) : [];
  const templated = name.replace(/\{(\d+)\}/g, (_, idx) => values[Number(idx)] || '');
  if (values.length === 0) return templated.trim();
  if (prop?.displayMode === 1) return `${values.join(' ')} ${templated}`.trim();
  if (prop?.displayMode === 3) return templated.trim();
  return `${templated} ${values.join(' ')}`.trim();
}

function getPropertyLabel(name, rawValue) {
  const valueText = stripTags(rawValue);
  return valueText ? `${name}: ${valueText}` : name;
}

function calcDefaultMin(id, value) {
  if (!isFinite(value) || value <= 0) return 0;
  if (EXACT_EQUIPMENT_FILTERS.has(id)) return Math.max(1, Math.round(value));
  return roundFilterNumber(value);
}

function extractEquipmentValues(text, id) {
  const s = stripTags(text).replace(/,/g, ' ');
  switch (id) {
    case 'damage': {
      const m = s.match(/(-?\d+(?:\.\d+)?)\s*[-~]\s*(-?\d+(?:\.\d+)?)/);
      if (!m) return [];
      return [roundFilterNumber((Math.abs(Number(m[1])) + Math.abs(Number(m[2]))) / 2)];
    }
    case 'aps':
    case 'crit':
    case 'dps':
    case 'pdps':
    case 'edps':
    case 'reload_time':
    case 'ar':
    case 'ev':
    case 'es':
    case 'block':
    case 'spirit': {
      const values = [];
      const after = new RegExp(`${id === 'ar' ? '(?:armou?r|방어도)' : id === 'ev' ? '(?:evasion(?: rating)?|회피(?:도| 등급)?)' : id === 'es' ? '(?:energy shield|에너지 (?:실드|보호막))' : id === 'aps' ? '(?:attacks per second|초당 공격(?: 횟수)?)' : id === 'crit' ? '(?:critical hit chance|치명타 확률)' : id === 'dps' ? '(?:^|\\\\b)dps(?:$|\\\\b)|초당 피해' : id === 'pdps' ? '(?:physical dps|물리 dps)' : id === 'edps' ? '(?:elemental dps|원소 dps)' : id === 'reload_time' ? '(?:reload time|재장전 시간)' : id === 'block' ? '(?:block(?: chance)?|막기 확률)' : '(?:spirit|정신력)'}[^\\d-]*(-?\\d+(?:\\.\\d+)?)`, 'ig');
      const before = new RegExp(`(-?\\d+(?:\\.\\d+)?)[^\\d]*(?:${id === 'ar' ? 'armou?r|방어도' : id === 'ev' ? 'evasion(?: rating)?|회피(?:도| 등급)?' : id === 'es' ? 'energy shield|에너지 (?:실드|보호막)' : id === 'aps' ? 'attacks per second|초당 공격(?: 횟수)?' : id === 'crit' ? 'critical hit chance|치명타 확률' : id === 'dps' ? 'dps|초당 피해' : id === 'pdps' ? 'physical dps|물리 dps' : id === 'edps' ? 'elemental dps|원소 dps' : id === 'reload_time' ? 'reload time|재장전 시간' : id === 'block' ? 'block(?: chance)?|막기 확률' : 'spirit|정신력'})`, 'ig');
      let m;
      while ((m = after.exec(s))) values.push(roundFilterNumber(Number(m[1])));
      while ((m = before.exec(s))) values.push(roundFilterNumber(Number(m[1])));
      return values.filter(v => isFinite(v) && v > 0);
    }
    default:
      return [];
  }
}

function extractStatValueFromText(text) {
  const s = stripTags(text).replace(/,/g, '');
  const range = s.match(/(-?\d+(?:\.\d+)?)\s*(?:to|-|~)\s*(-?\d+(?:\.\d+)?)/i);
  if (range) return roundFilterNumber((Math.abs(Number(range[1])) + Math.abs(Number(range[2]))) / 2);
  const single = s.match(/-?\d+(?:\.\d+)?/);
  return single ? roundFilterNumber(Number(single[0])) : NaN;
}

function isFlagOnlyStatText(text) {
  const label = stripTags(text);
  if (!label) return false;
  if (/\d/.test(label)) return false;
  return true;
}

let cachedTradeStatMap = null;
let cachedTradeStatMapPromise = null;

function normalizeStatText(text) {
  return stripTags(text)
    .replace(/\[([^\]|]+)\|([^\]]+)\]/g, '$2')
    .replace(/\[([^\]|]+)\]/g, '$1')
    .replace(/,/g, '')
    .replace(/([+-]?\d+(?:\.\d+)?)\s*(?:to|~|-)\s*([+-]?\d+(?:\.\d+)?)/gi, '#~#')
    .replace(/[+-]?\d+(?:\.\d+)?/g, '#')
    .replace(/[+-]\s*#/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function flattenTradeStatEntries(groups, out) {
  (groups || []).forEach(group => {
    (group.entries || []).forEach(entry => {
      if (!entry?.id || !entry?.text) return;
      out.push({
        id: entry.id,
        text: entry.text,
        normalized: normalizeStatText(entry.text)
      });
    });
  });
}

function buildTradeStatMapFromParsed(parsed) {
  const map = new Map();
  const entries = [];
  if (Array.isArray(parsed?.result)) flattenTradeStatEntries(parsed.result, entries);
  entries.forEach(entry => {
    if (!map.has(entry.normalized)) map.set(entry.normalized, []);
    map.get(entry.normalized).push(entry);
  });
  return map;
}

async function ensureTradeStatMap() {
  if (cachedTradeStatMap) return cachedTradeStatMap;
  if (cachedTradeStatMapPromise) return cachedTradeStatMapPromise;

  cachedTradeStatMapPromise = (async () => {
    try {
      const res = await fetch(`${getApiBase()}/data/stats`, { credentials: 'include' });
      if (res.ok) {
        const parsed = await res.json();
        const map = buildTradeStatMapFromParsed(parsed);
        if (map.size) {
          cachedTradeStatMap = map;
          return map;
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem('lscache-trade2stats');
      if (raw) {
        const parsed = JSON.parse(raw);
        const map = buildTradeStatMapFromParsed(parsed);
        cachedTradeStatMap = map;
        return map;
      }
    } catch {}

    cachedTradeStatMap = new Map();
    return cachedTradeStatMap;
  })();

  try {
    return await cachedTradeStatMapPromise;
  } finally {
    cachedTradeStatMapPromise = null;
  }
}

function getTradeStatMap() {
  return cachedTradeStatMap || new Map();
}

function resolveTradeStatId(label, category, fallbackId) {
  const normalized = normalizeStatText(label);
  if (!normalized) return fallbackId || '';

  const matches = getTradeStatMap().get(normalized) || [];
  if (!matches.length) return '';

  const categoryPrefix = `${category}.`;
  const preferred = matches.find(entry => entry.id.startsWith(categoryPrefix));
  if (preferred) return preferred.id;

  return matches[0].id || '';
}

function shouldSkipStatLine(label, category, item) {
  const text = stripTags(label);
  if (!text) return true;

  if (category === 'bonded' || category === 'rune') return true;
  if (/결속됨|bonded/i.test(text)) return true;
  if (/능력치 요구사항|attribute requirements?/i.test(text)) return true;

  const isArmourCategory = /^armour\./.test(item?.category || guessCategoryFromItem(item) || '');
  if (isArmourCategory && /(방어도|회피|에너지 보호막|armou?r|evasion|energy shield)/i.test(text)) {
    return true;
  }

  return false;
}

function upsertStatFilter(target, entry) {
  if (!entry || !entry.label) return;
  const existing = target.find(x => x.label === entry.label);
  if (existing) return;
  target.push(entry);
}

function upsertEquipmentFilter(target, id, label, value) {
  if (!isFinite(value) || value <= 0) return;
  const existing = target.find(x => x.id === id);
  if (existing) {
    if (value > existing.value) {
      existing.value = value;
      existing.min = calcDefaultMin(id, value);
      existing.label = label || existing.label;
    }
    return;
  }
  target.push({
    id,
    label,
    value,
    min: calcDefaultMin(id, value),
    max: null,
    active: true
  });
}

function collectEquipmentFilters(item) {
  const equipment = [];
  const properties = [];
  ['properties', 'additionalProperties', 'notableProperties'].forEach(key => {
    if (Array.isArray(item?.[key])) properties.push(...item[key]);
  });

  properties.forEach(prop => {
    const name = stripTags(prop?.name || '');
    const lineText = renderPropertyText(prop);
    if (!name && !lineText) return;
    const rawValue = Array.isArray(prop?.values)
      ? prop.values.map(v => stripTags(v?.[0])).filter(Boolean).join(' ')
      : lineText;

    for (const rule of EQUIPMENT_PROPERTY_RULES) {
      if (rule.patterns.some(p => p.test(name) || p.test(lineText))) {
        const values = extractEquipmentValues(lineText, rule.id);
        if (values.length === 0) {
          const numeric = parsePropertyValue(name || lineText, rawValue);
          if (isFinite(numeric) && numeric > 0) {
            upsertEquipmentFilter(equipment, rule.id, getPropertyLabel(name || rule.label, rawValue), numeric);
          }
        } else {
          values.forEach(numeric => {
            upsertEquipmentFilter(equipment, rule.id, lineText || getPropertyLabel(name || rule.label, rawValue), numeric);
          });
        }
      }
    }
  });

  const runeSocketCount = Array.isArray(item?.sockets)
    ? item.sockets.filter(s => s?.type === 'rune').length
    : 0;
  if (runeSocketCount > 0) {
    upsertEquipmentFilter(equipment, 'rune_sockets', '룬 소켓', runeSocketCount);
  }

  return equipment;
}

function buildQuerySignature(filter) {
  return JSON.stringify({
    category: filter.category || '',
    rarity: filter.rarity || '',
    ilvlMin: Number(filter.ilvlMin) || 0,
    areaLvlMin: Number(filter.areaLvlMin) || 0,
    equipment: (filter.equipment || [])
      .filter(x => x.active !== false && x.id)
      .map(x => `${x.id}:${Number(x.min) || 0}`)
      .sort(),
    stats: (filter.stats || [])
      .filter(x => x.active !== false && x.id)
      .map(x => x.noValue ? `${x.id}:flag` : `${x.id}:${Number(x.min) || 0}`)
      .sort()
  });
}

// ─── build filter from API response ───────────────────
async function buildFilterFromApi(item, listing) {
  cachedTradeStatMap = null;
  const statMap = await ensureTradeStatMap();
  const debug = {
    tradeStatMapSize: statMap.size,
    equipmentLines: [],
    statLines: []
  };
  const filter = {
    id:             Date.now() + Math.random(),
    name:           item.name || item.typeLine || '이름없는 아이템',
    category:       guessCategoryFromItem(item),
    rarity:         FRAME_TYPES[item.frameType] || '',
    itemName:       item.name || item.typeLine || '',
    typeLine:       item.typeLine || item.baseType || '',
    typeLineActive: true,
    ilvlMin:        0,
    ilvlMax:        null,
    areaLvlMin:     0,
    reqLvlMin:      0,
    priceMax:       0,
    savedPrice:     listing?.price ? { amount: listing.price.amount, currency: listing.price.currency } : null,
    equipment:      [],
    stats:          [],
    note:           '',
    sourceHash:     '',
    savedAt:        new Date().toISOString()
  };

  // ilvl
  if (typeof item.ilvl === 'number') filter.ilvlMin = item.ilvl;

  filter.equipment = collectEquipmentFilters(item);
  debug.equipmentLines = (filter.equipment || []).map(x => ({
    id: x.id,
    label: x.label,
    value: x.value,
    min: x.min,
    active: x.active !== false
  }));

  // stats from extended.hashes + extended.mods
  const ext = item.extended || {};
  const hashes = ext.hashes || {};
  const mods   = ext.mods || {};

  const CATEGORY_SPECS = [
    { key: 'explicit', prop: 'explicitMods' },
    { key: 'implicit', prop: 'implicitMods' },
    { key: 'crafted', prop: 'craftedMods' },
    { key: 'enchant', prop: 'enchantMods' },
    { key: 'rune', prop: 'runeMods' },
    { key: 'fractured', prop: 'fracturedMods' },
    { key: 'desecrated', prop: 'desecratedMods' },
    { key: 'utility', prop: 'utilityMods' }
  ];

  for (const spec of CATEGORY_SPECS) {
    const cat = spec.key;
    const catHashes = hashes[cat] || [];
    const renderedTexts = item[spec.prop] || [];
    const fallbackIds = catHashes
      .filter(entry => Array.isArray(entry) && entry[0])
      .map(entry => entry[0]);

    renderedTexts.forEach((renderedLine, modIdx) => {
      const label = stripTags(renderedLine);
      if (!label) return;
      if (shouldSkipStatLine(label, cat, item)) {
        debug.statLines.push({
          category: cat,
          modIdx,
          label,
          skipped: true,
          reason: 'skip_rule'
        });
        return;
      }
      let parsedValue = extractStatValueFromText(label);
      const fallbackId = fallbackIds[modIdx] || fallbackIds[0] || '';
      const statId = resolveTradeStatId(label, cat, fallbackId);
      const isResolved = !!(statId || fallbackId);
      const resolvedId = statId || fallbackId || `${cat}.unknown_${simpleHash(label + ':' + fallbackId)}`;

      // Negate value when label says "감소" (reduction) but the API stat tracks it as
      // an "증가" (increase) with a negative value.  Simple rule: if the mod text
      // contains "감소" and does NOT contain "증가", and the resolved ID is not
      // unknown, flip the sign so the stored value/min are negative.
      // This avoids double-negating values that are already negative from parsing.
      const labelText = stripTags(label);
      const hasReduction = /감소/.test(labelText);
      const hasIncrease  = /증가/.test(labelText);
      const isNegativeStat = hasReduction && !hasIncrease && !resolvedId.includes('unknown');
      if (isNegativeStat && isFinite(parsedValue) && parsedValue > 0) {
        parsedValue = -parsedValue;
      }

      debug.statLines.push({
        category: cat,
        modIdx,
        label,
        normalized: normalizeStatText(label),
        parsedValue: isFinite(parsedValue) ? parsedValue : null,
        fallbackId,
        resolvedId,
        matched: isResolved,
        negated: isNegativeStat,
        noValue: !isFinite(parsedValue) && isFlagOnlyStatText(label),
        active: isResolved && (isFinite(parsedValue) ? parsedValue !== 0 : isFlagOnlyStatText(label))
      });

      if (isFinite(parsedValue) && parsedValue !== 0) {
        upsertStatFilter(filter.stats, {
          label,
          id:         resolvedId,
          fallbackId: fallbackId || undefined,
          value:      parsedValue,
          min:        parsedValue,
          max:        null,
          active:     isResolved
        });
      } else if (isResolved && isFlagOnlyStatText(label)) {
        upsertStatFilter(filter.stats, {
          label,
          id:         resolvedId,
          fallbackId: fallbackId || undefined,
          value:      null,
          min:        null,
          max:        null,
          noValue:    true,
          active:     true
        });
      } else {
        upsertStatFilter(filter.stats, {
          label,
          id:         resolvedId,
          fallbackId: fallbackId || undefined,
          value:      null,
          min:        null,
          max:        null,
          noValue:    true,
          active:     false
        });
      }
    });
  }

  filter.sourceHash = simpleHash(buildQuerySignature(filter));
  return { filter, debug };
}

// ─── PoB copy ─────────────────────────────────────────
async function handlePobCopy(row, btn) {
  const itemId = row.dataset.id;
  if (!itemId) return;

  btn.textContent = '…';
  btn.disabled = true;

  try {
    const data = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'FETCH_POB', itemId }, res => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        if (!res || !res.ok) return reject(new Error(res?.error || 'fetch failed'));
        resolve(res.data);
      });
    });

    const result = data?.result?.[0];
    if (!result?.item) throw new Error('아이템 데이터 없음');

    const pobText = buildPoBFormat(result.item);

    // clipboard 복사 (navigator.clipboard 우선, execCommand fallback)
    try {
      await navigator.clipboard.writeText(pobText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = pobText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '📋'; btn.disabled = false; }, 1500);
  } catch (e) {
    console.error('[PoB Copy]', e);
    btn.textContent = '✗';
    showToast('PoB 복사 실패: ' + e.message, 'err');
    setTimeout(() => { btn.textContent = '📋'; btn.disabled = false; }, 1500);
  }
}

function buildPoBFormat(item) {
  const lines = [];

  // 1. 아이템 이름 / 베이스 타입
  if (item.name) lines.push(stripTags(item.name));
  lines.push(stripTags(item.baseType || item.typeLine || ''));

  // 2. Unique ID
  if (item.id) lines.push(`Unique ID: ${item.id}`);

  // 3. Item Level
  if (item.ilvl != null) lines.push(`Item Level: ${item.ilvl}`);

  // 4. Quality — properties 배열에서 'Quality' 항목 파싱
  const allProps = [
    ...(item.properties || []),
    ...(item.additionalProperties || [])
  ];
  const qualityProp = allProps.find(p => /quality/i.test(stripTags(p?.name || '')));
  if (qualityProp) {
    const qval = Array.isArray(qualityProp.values) && qualityProp.values[0]
      ? stripTags(qualityProp.values[0][0]).replace(/[^0-9]/g, '')
      : '';
    if (qval) lines.push(`Quality: ${qval}`);
  }

  // 5. Sockets
  if (Array.isArray(item.sockets) && item.sockets.length > 0) {
    lines.push(`Sockets: ${item.sockets.map(() => 'S').join(' ')}`);
  }

  // 6. Runes (소켓에 낀 아이템)
  if (Array.isArray(item.socketedItems) && item.socketedItems.length > 0) {
    item.socketedItems.forEach(si => {
      const runeName = stripTags(si.name || si.typeLine || '');
      if (runeName) lines.push(`Rune: ${runeName}`);
    });
  }

  // 7. Level Requirement
  if (Array.isArray(item.requirements)) {
    const lvlReq = item.requirements.find(r => /^level$/i.test(stripTags(r?.name || '')));
    if (lvlReq && Array.isArray(lvlReq.values) && lvlReq.values[0]) {
      lines.push(`LevelReq: ${stripTags(lvlReq.values[0][0])}`);
    }
  }

  // 8. Implicits block
  const implicitLines = [];
  (item.runeMods || []).forEach(m => implicitLines.push(`{enchant}{rune}${stripTags(m)}`));
  (item.bondedMods || []).forEach(m => implicitLines.push(`{enchant}{rune}${stripTags(m)}`));
  (item.enchantMods || []).forEach(m => implicitLines.push(`{enchant}${stripTags(m)}`));
  (item.implicitMods || []).forEach(m => implicitLines.push(stripTags(m)));

  lines.push(`Implicits: ${implicitLines.length}`);
  implicitLines.forEach(l => lines.push(l));

  // 9. Explicit mods
  const craftedSet = new Set((item.craftedMods || []).map(m => stripTags(m)));
  const fracturedSet = new Set((item.fracturedMods || []).map(m => stripTags(m)));
  const desecratedSet = new Set((item.desecratedMods || item.corruptedMods || []).map(m => stripTags(m)));

  (item.fracturedMods || []).forEach(m => lines.push(`{fractured}${stripTags(m)}`));

  (item.explicitMods || []).forEach(m => {
    const text = stripTags(m);
    if (!craftedSet.has(text) && !fracturedSet.has(text) && !desecratedSet.has(text)) {
      lines.push(text);
    }
  });

  (item.desecratedMods || item.corruptedMods || []).forEach(m => lines.push(`{desecrated}${stripTags(m)}`));

  (item.craftedMods || []).forEach(m => lines.push(`{crafted}${stripTags(m)}`));

  return lines.join('\n');
}

// ─── toast ────────────────────────────────────────────
function showToast(msg, type = 'ok') {
  const existing = document.getElementById('poe2tq-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'poe2tq-toast';
  toast.className = `poe2tq-toast poe2tq-toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─── util ─────────────────────────────────────────────
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

// ─── in-page iframe 사이드바 ──────────────────────────────
// 네이티브 chrome.sidePanel 대신 거래소 페이지에 우리가 제어하는
// iframe 사이드바를 주입한다. 거래소 탭에서만 자연히 보이고,
// 다른 탭으로 가면 페이지의 일부이므로 함께 사라진다.
const SIDEBAR_HOST_ID = 'poe2-qs-sidebar-host';

function initSidebar() {
  const HOST_ID = SIDEBAR_HOST_ID;
  const STORAGE_KEY = 'sidebarUI';
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 760;
  const DEFAULT_WIDTH = 460;
  const HANDLE_WIDTH = 32;

  // 중복 주입 방지 (재호출해도 안전)
  if (document.getElementById(HOST_ID)) return;

  const clampWidth = (w) => Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w));

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.cssText =
    'position:fixed; top:0; height:100vh; z-index:2147483647;';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .wrap {
      --w: ${DEFAULT_WIDTH}px;
      position: relative;
      height: 100vh;
      font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;
    }
    .panel {
      position: relative;
      height: 100vh;
      width: var(--w);
      background: #1a1a1a;
      transition: width 0.18s ease;
      overflow: hidden;
    }
    .wrap.side-right .panel {
      box-shadow: -4px 0 18px rgba(0, 0, 0, 0.55);
    }
    .wrap.side-left .panel {
      box-shadow: 4px 0 18px rgba(0, 0, 0, 0.55);
    }
    .wrap.collapsed .panel {
      width: 0;
      overflow: hidden;
      box-shadow: none;
    }
    .resizer {
      position: absolute;
      top: 0;
      width: 6px;
      height: 100%;
      cursor: ew-resize;
      background: transparent;
      z-index: 2;
    }
    .wrap.side-right .resizer {
      left: 0;
      right: auto;
    }
    .wrap.side-left .resizer {
      right: 0;
      left: auto;
    }
    .resizer:hover {
      background: rgba(200, 146, 42, 0.35);
    }
    .wrap.collapsed .resizer {
      display: none;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
    .handle {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: ${HANDLE_WIDTH}px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c8922a;
      color: #1a1a1a;
      font-size: 16px;
      font-weight: bold;
      border: 0;
      cursor: pointer;
      z-index: 3;
      user-select: none;
    }
    .wrap.side-right .handle {
      left: -${HANDLE_WIDTH}px;
      right: auto;
      border-radius: 8px 0 0 8px;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5);
    }
    .wrap.side-left .handle {
      right: -${HANDLE_WIDTH}px;
      left: auto;
      border-radius: 0 8px 8px 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.5);
    }
    .handle:hover {
      background: #f0d080;
    }
    .side-toggle {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      margin-top: -44px;
      width: ${HANDLE_WIDTH}px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2a2a2a;
      color: #f0d080;
      font-size: 14px;
      border: 0;
      cursor: pointer;
      z-index: 3;
      user-select: none;
    }
    .wrap.side-right .side-toggle {
      left: -${HANDLE_WIDTH}px;
      right: auto;
      border-radius: 6px 0 0 6px;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5);
    }
    .wrap.side-left .side-toggle {
      right: -${HANDLE_WIDTH}px;
      left: auto;
      border-radius: 0 6px 6px 0;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.5);
    }
    .side-toggle:hover {
      background: #3a3a3a;
    }
  `;
  shadow.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const handle = document.createElement('button');
  handle.className = 'handle';
  handle.type = 'button';
  handle.title = 'PoE2 사이드바 열기/닫기';

  const sideToggle = document.createElement('button');
  sideToggle.className = 'side-toggle';
  sideToggle.type = 'button';
  sideToggle.title = 'PoE2 사이드바 좌/우 위치 전환';
  sideToggle.textContent = '⇄';

  const panel = document.createElement('div');
  panel.className = 'panel';

  const resizer = document.createElement('div');
  resizer.className = 'resizer';

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('sidepanel.html');

  panel.appendChild(resizer);
  panel.appendChild(iframe);
  wrap.appendChild(handle);
  wrap.appendChild(sideToggle);
  wrap.appendChild(panel);
  shadow.appendChild(wrap);

  let state = { open: true, width: DEFAULT_WIDTH, side: 'right' };

  function applyState() {
    const isLeft = state.side === 'left';
    // host를 화면 좌/우 가장자리에 고정
    host.style.right = isLeft ? 'auto' : '0';
    host.style.left = isLeft ? '0' : 'auto';
    wrap.classList.toggle('side-left', isLeft);
    wrap.classList.toggle('side-right', !isLeft);
    wrap.style.setProperty('--w', `${state.width}px`);
    wrap.classList.toggle('collapsed', !state.open);
    // 오른쪽 패널: 접기 ▶ / 펼치기 ◀, 왼쪽 패널: 좌우 반전
    if (isLeft) {
      handle.textContent = state.open ? '◀' : '▶';
    } else {
      handle.textContent = state.open ? '▶' : '◀';
    }
  }

  function saveState() {
    try {
      chrome.storage.local.set({ [STORAGE_KEY]: { ...state } });
    } catch (_) {
      /* 컨텍스트 무효화 등은 무시 */
    }
  }

  function setOpen(open) {
    state = { ...state, open };
    applyState();
    saveState();
  }

  function toggle() {
    setOpen(!state.open);
  }

  function setSide(side) {
    const next = side === 'left' ? 'left' : 'right';
    // open/width는 유지하고 side만 변경
    state = { ...state, side: next };
    applyState();
    saveState();
  }

  function toggleSide() {
    setSide(state.side === 'left' ? 'right' : 'left');
  }

  // 초기 상태 로드
  try {
    chrome.storage.local.get(STORAGE_KEY, (r) => {
      if (chrome.runtime.lastError) {
        applyState();
        return;
      }
      const saved = r && r[STORAGE_KEY];
      if (saved && typeof saved === 'object') {
        state = {
          open: typeof saved.open === 'boolean' ? saved.open : true,
          width: clampWidth(Number(saved.width) || DEFAULT_WIDTH),
          side: saved.side === 'left' ? 'left' : 'right'
        };
      }
      applyState();
    });
  } catch (_) {
    applyState();
  }

  handle.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });

  sideToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSide();
  });

  // 리사이저 드래그로 너비 조절
  let dragging = false;

  function onMouseMove(e) {
    if (!dragging) return;
    // 오른쪽 패널: 왼쪽 가장자리 드래그 → innerWidth - clientX
    // 왼쪽 패널: 오른쪽 가장자리 드래그 → clientX
    const raw =
      state.side === 'left' ? e.clientX : window.innerWidth - e.clientX;
    const next = clampWidth(raw);
    state = { ...state, width: next };
    wrap.style.setProperty('--w', `${next}px`);
  }

  function onMouseUp() {
    if (!dragging) return;
    dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // 드래그 중 막아둔 iframe 포인터 이벤트 복구
    iframe.style.pointerEvents = '';
    saveState();
  }

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragging = true;
    // 드래그 중 iframe이 mousemove를 삼키지 않도록 포인터 이벤트 차단
    iframe.style.pointerEvents = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // background에서 오는 토글 메시지 수신
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'TOGGLE_SIDEBAR') {
      toggle();
    }
  });

  // 설정 패널의 너비 슬라이더에서 width 가 바뀌면 즉시 --w 적용.
  // 자기가 방금 드래그로 저장한 값과 같으면 무시(무한루프/튐 방지).
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || !changes[STORAGE_KEY]) return;
      const nextWidth = changes[STORAGE_KEY].newValue?.width;
      if (nextWidth == null) return;
      const clamped = clampWidth(Number(nextWidth));
      if (clamped === state.width) return;
      state = { ...state, width: clamped };
      wrap.style.setProperty('--w', `${clamped}px`);
    });
  } catch (_) {
    /* 컨텍스트 무효화 등은 무시 */
  }
}

// ─── 사이드바 주입 조건 결정 ──────────────────────────
// 거래소 사이트에서만 주입한다.
if (IS_TRADE_SITE) {
  initSidebar();
}
