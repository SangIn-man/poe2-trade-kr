'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const EN_ITEMS_URL = 'https://www.pathofexile.com/api/trade/data/items';
const KO_ITEMS_URL = 'https://poe.game.daum.net/api/trade/data/items';
const EN_STATS_URL = 'https://www.pathofexile.com/api/trade/data/stats';
const KO_STATS_URL = 'https://poe.game.daum.net/api/trade/data/stats';
const POEDB_BASE_URL = 'https://poedb.tw/kr/';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'poe1-item-names-ko.json');
const STAT_OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'poe1-stat-text-ko.json');
const INCLUDED_GROUPS = new Set([
  'accessory', 'armour', 'card', 'currency', 'flask', 'gem', 'jewel', 'map', 'monster', 'weapon'
]);
const FORBIDDEN_JEWEL_STAT_IDS = new Set([
  'explicit.stat_1190333629',
  'explicit.stat_2460506030'
]);

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'poe-trade-quick-search/translation-generator' } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

function decodeHtml(value) {
  return String(value || '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function getEntryKey(entry) {
  return entry?.name || entry?.type || '';
}

function makePoedbSlug(name) {
  return String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const poedbTitleCache = new Map();

async function fetchPoedbKoreanTitle(englishName) {
  if (poedbTitleCache.has(englishName)) return poedbTitleCache.get(englishName);
  const slug = makePoedbSlug(englishName);
  if (!slug) return null;

  const response = await fetch(POEDB_BASE_URL + encodeURIComponent(slug), {
    headers: { 'user-agent': 'poe-trade-quick-search/translation-generator' }
  });
  if (!response.ok) {
    poedbTitleCache.set(englishName, null);
    return null;
  }

  const html = await response.text();
  const match = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"\s*\/?>/i);
  const title = match ? decodeHtml(match[1]).trim() : null;
  poedbTitleCache.set(englishName, title);
  return title;
}

async function locateSingleMissingEnglishEntry(enEntries, koEntries, groupId) {
  let low = 0;
  let high = enEntries.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    let probe = null;

    for (let distance = 0; distance <= 4 && !probe; distance++) {
      for (const index of distance ? [middle - distance, middle + distance] : [middle]) {
        if (index < low || index > high) continue;
        const title = await fetchPoedbKoreanTitle(getEntryKey(enEntries[index]));
        if (!title) continue;
        const sameIndex = getEntryKey(koEntries[index]);
        const shiftedIndex = getEntryKey(koEntries[index - 1]);
        if (title === sameIndex) probe = { index, side: 'before' };
        else if (title === shiftedIndex) probe = { index, side: 'after' };
        else probe = { index, side: 'missing' };
        break;
      }
    }

    if (!probe) throw new Error(`${groupId}: PoEDB 기준점 확인 실패`);
    if (probe.side === 'missing') return probe.index;
    if (probe.side === 'before') low = probe.index + 1;
    else high = probe.index - 1;
  }

  return low;
}

function addPair(map, englishEntry, koreanEntry) {
  for (const field of ['type', 'name']) {
    const english = String(englishEntry?.[field] || '').trim();
    const korean = String(koreanEntry?.[field] || '').trim();
    if (!english || !korean || english === korean || map[english]) continue;
    map[english] = korean;
    if (field === 'name') map[`Foulborn ${english}`] = `삿된 혈통 ${korean}`;
  }
}

function addForbiddenJewelNames(map, englishStats, koreanStats) {
  const englishEntries = (englishStats.result || []).flatMap(group => group.entries || []);
  const koreanEntries = new Map(
    (koreanStats.result || []).flatMap(group => group.entries || []).map(entry => [entry.id, entry])
  );
  for (const englishEntry of englishEntries) {
    if (!FORBIDDEN_JEWEL_STAT_IDS.has(englishEntry.id)) continue;
    const koreanEntry = koreanEntries.get(englishEntry.id);
    const koreanOptions = new Map((koreanEntry?.option?.options || []).map(option => [option.id, option.text]));
    for (const option of englishEntry.option?.options || []) {
      const korean = koreanOptions.get(option.id);
      if (option.text && korean) map[option.text] = korean;
    }
  }
}

function buildStatTextMap(englishStats, koreanStats) {
  const koreanEntries = new Map(
    (koreanStats.result || []).flatMap(group => group.entries || []).map(entry => [entry.id, entry])
  );
  const map = {};
  for (const englishEntry of (englishStats.result || []).flatMap(group => group.entries || [])) {
    const koreanEntry = koreanEntries.get(englishEntry.id);
    const english = String(englishEntry.text || '').trim();
    const korean = String(koreanEntry?.text || '').trim();
    if (english && korean && english !== korean && !map[english]) map[english] = korean;
  }
  map['Eat a Soul when you Hit a Rare or Unique Enemy, no more than once every 0.25 seconds'] =
    '희귀 또는 고유 적 명중 시 영혼 1개 포식, 0.25초마다 최대 1번 포식';
  map['Skills fire # additional Projectiles'] = '스킬이 투사체 #개 추가 발사';
  return map;
}

function addNinjaSyntheticNames(map) {
  for (let tier = 1; tier <= 16; tier++) map[`Map (Tier ${tier})`] = `지도 (${tier}등급)`;

  const bosses = {
    'Al-Hezmin': '알-헤즈민',
    Baran: '바란',
    Drox: '드록스',
    Veritania: '베리타니아',
    'The Constrictor': '위압자',
    'The Enslaver': '노예 감독관',
    'The Eradicator': '박멸자',
    'The Purifier': '정화자'
  };
  for (const [english, korean] of Object.entries(bosses)) {
    for (let tier = 14; tier <= 16; tier++) map[`${english} Map (Tier ${tier})`] = `${korean} 지도 (${tier}등급)`;
  }
  map['The Enslaver Vaal Temple Map'] = '노예 감독관 바알 사원 지도';
  map['The Purifier Vaal Temple Map'] = '정화자 바알 사원 지도';
  map['Bearded Shaman'] = '수염 난 주술사';
}

async function pairGroup(enGroup, koGroup, map) {
  const enEntries = enGroup.entries || [];
  const koEntries = koGroup.entries || [];
  if (enEntries.length === koEntries.length) {
    enEntries.forEach((entry, index) => addPair(map, entry, koEntries[index]));
    return { id: enGroup.id, pairs: enEntries.length, skipped: 0 };
  }

  if (enEntries.length !== koEntries.length + 1) {
    throw new Error(`${enGroup.id}: 지원하지 않는 항목 수 차이 (${enEntries.length}/${koEntries.length})`);
  }

  const missingIndex = await locateSingleMissingEnglishEntry(enEntries, koEntries, enGroup.id);
  for (let enIndex = 0; enIndex < enEntries.length; enIndex++) {
    if (enIndex === missingIndex) continue;
    const koIndex = enIndex < missingIndex ? enIndex : enIndex - 1;
    addPair(map, enEntries[enIndex], koEntries[koIndex]);
  }
  return { id: enGroup.id, pairs: koEntries.length, skipped: 1, missing: getEntryKey(enEntries[missingIndex]) };
}

async function main() {
  const [english, korean, englishStats, koreanStats] = await Promise.all([
    fetchJson(EN_ITEMS_URL),
    fetchJson(KO_ITEMS_URL),
    fetchJson(EN_STATS_URL),
    fetchJson(KO_STATS_URL)
  ]);
  const koreanGroups = new Map((korean.result || []).map(group => [group.id, group]));
  const translations = {};
  const report = [];

  for (const englishGroup of english.result || []) {
    if (!INCLUDED_GROUPS.has(englishGroup.id)) continue;
    const koreanGroup = koreanGroups.get(englishGroup.id);
    if (!koreanGroup) throw new Error(`${englishGroup.id}: 한국어 그룹 없음`);
    report.push(await pairGroup(englishGroup, koreanGroup, translations));
  }

  addForbiddenJewelNames(translations, englishStats, koreanStats);
  addNinjaSyntheticNames(translations);

  const sorted = Object.fromEntries(Object.entries(translations).sort(([a], [b]) => a.localeCompare(b, 'en')));
  const statTexts = Object.fromEntries(
    Object.entries(buildStatTextMap(englishStats, koreanStats)).sort(([a], [b]) => a.localeCompare(b, 'en'))
  );
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  await fs.writeFile(STAT_OUTPUT_PATH, JSON.stringify(statTexts, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({
    output: OUTPUT_PATH,
    translations: Object.keys(sorted).length,
    statOutput: STAT_OUTPUT_PATH,
    statTranslations: Object.keys(statTexts).length,
    groups: report
  }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
