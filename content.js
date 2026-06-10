'use strict';

// ─── tracked rows ─────────────────────────────────────
const injected = new WeakSet();

const observer = new MutationObserver(() => scanItems());
observer.observe(document.body, { childList: true, subtree: true });
setTimeout(scanItems, 1000);

// ─── scan ─────────────────────────────────────────────
function scanItems() {
  document.querySelectorAll('.row[data-id]').forEach(row => {
    if (injected.has(row)) return;
    injected.add(row);
    injectStarButton(row);
  });
}

// ─── URL / API helpers ────────────────────────────────
function getQueryId() {
  // /trade2/search/poe2/<league>/<queryId>
  const m = location.pathname.match(/\/trade2\/search\/poe2\/[^\/]+\/([^\/?#]+)/);
  return m ? m[1] : null;
}

function getApiBase() {
  return location.hostname === 'poe.game.daum.net'
    ? 'https://poe.game.daum.net/api/trade2'
    : 'https://www.pathofexile.com/api/trade2';
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
      hash: filter.sourceHash
    });

    if (dup?.duplicate) {
      showToast(`이미 저장된 필터입니다: "${dup.name}"`, 'warn');
      btn.textContent = '✅ 이미 저장됨';
      return;
    }

    const saveRes = await chrome.runtime.sendMessage({ type: 'SAVE_FILTER', filter });
    if (saveRes?.ok) {
      btn.textContent = '✅ 저장완료!';
      btn.classList.add('saved');
      const league = saveRes.league ? ` [${saveRes.league}]` : '';
      showToast(`"${filter.name}" 저장 완료!${league} (총 ${saveRes.total}개)`, 'ok');
    } else {
      throw new Error('저장 실패');
    }
  } catch (err) {
    btn.textContent = '❌ 실패';
    btn.disabled = false;
    showToast('오류: ' + err.message, 'err');
    setTimeout(() => { btn.textContent = '⭐ 즐겨찾기'; btn.disabled = false; }, 2500);
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
  { id: 'aps', label: '초당 공격', patterns: [/(?:attacks per second|초당 공격|공격 속도)/i] },
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
  const directCategory = item?.category;
  if (Array.isArray(directCategory) && directCategory[0]) return directCategory[0];
  if (typeof directCategory === 'string' && directCategory) return directCategory;
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
  if (/Flasks?/i.test(icon))       return 'flask';
  if (/Jewels?/i.test(icon))       return 'jewel';
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
      const after = new RegExp(`${id === 'ar' ? '(?:armou?r|방어도)' : id === 'ev' ? '(?:evasion(?: rating)?|회피(?:도| 등급)?)' : id === 'es' ? '(?:energy shield|에너지 (?:실드|보호막))' : id === 'aps' ? '(?:attacks per second|초당 공격|공격 속도)' : id === 'crit' ? '(?:critical hit chance|치명타 확률)' : id === 'dps' ? '(?:^|\\\\b)dps(?:$|\\\\b)|초당 피해' : id === 'pdps' ? '(?:physical dps|물리 dps)' : id === 'edps' ? '(?:elemental dps|원소 dps)' : id === 'reload_time' ? '(?:reload time|재장전 시간)' : id === 'block' ? '(?:block(?: chance)?|막기 확률)' : '(?:spirit|정신력)'}[^\\d-]*(-?\\d+(?:\\.\\d+)?)`, 'ig');
      const before = new RegExp(`(-?\\d+(?:\\.\\d+)?)[^\\d]*(?:${id === 'ar' ? 'armou?r|방어도' : id === 'ev' ? 'evasion(?: rating)?|회피(?:도| 등급)?' : id === 'es' ? 'energy shield|에너지 (?:실드|보호막)' : id === 'aps' ? 'attacks per second|초당 공격|공격 속도' : id === 'crit' ? 'critical hit chance|치명타 확률' : id === 'dps' ? 'dps|초당 피해' : id === 'pdps' ? 'physical dps|물리 dps' : id === 'edps' ? 'elemental dps|원소 dps' : id === 'reload_time' ? 'reload time|재장전 시간' : id === 'block' ? 'block(?: chance)?|막기 확률' : 'spirit|정신력'})`, 'ig');
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
      .map(x => `${x.id}:${Number(x.min) || 0}`)
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
        active: isResolved && isFinite(parsedValue) && parsedValue !== 0
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
      } else {
        upsertStatFilter(filter.stats, {
          label,
          id:         resolvedId,
          fallbackId: fallbackId || undefined,
          value:      null,
          min:        1,
          max:        null,
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
