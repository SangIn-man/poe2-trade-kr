'use strict';

// poe2_item_translations_ko.json 내용을 카테고리 구분 없이 단일 맵으로 병합
const ITEM_NAMES_KO = {
  "Ancient Infuser": "고대 주입기",
  "Arcanist's Etcher": "신비학자의 식각기",
  "Architect's Orb": "건축가의 오브",
  "Armourer's Scrap": "방어구 장인의 고철",
  "Artificer's Orb": "숙련공의 오브",
  "Artificer's Shard": "숙련공의 파편",
  "Blacksmith's Whetstone": "대장장이의 숫돌",
  "Chance Shard": "기회의 파편",
  "Chaos Orb": "카오스 오브",
  "Core Destabiliser": "핵 불안정화기",
  "Cryptic Key": "난해한 열쇠",
  "Crystallised Corruption": "결정화된 타락",
  "Divine Orb": "신성한 오브",
  "Exalted Orb": "엑잘티드 오브",
  "Fracturing Orb": "분열의 오브",
  "Gemcutter's Prism": "세공사의 프리즘",
  "Glassblower's Bauble": "유리직공의 방울",
  "Greater Chaos Orb": "상위 카오스 오브",
  "Greater Exalted Orb": "상위 엑잘티드 오브",
  "Greater Jeweller's Orb": "상위 쥬얼러 오브",
  "Greater Orb of Augmentation": "상위 확장의 오브",
  "Greater Orb of Transmutation": "상위 진화의 오브",
  "Greater Regal Orb": "상위 제왕의 오브",
  "Hinekora's Lock": "히네코라의 머리카락",
  "Lesser Jeweller's Orb": "하위 쥬얼러 오브",
  "Mirror of Kalandra": "칼란드라의 거울",
  "Orb of Alchemy": "연금술의 오브",
  "Orb of Annulment": "소멸의 오브",
  "Orb of Augmentation": "확장의 오브",
  "Orb of Chance": "기회의 오브",
  "Orb of Extraction": "추출의 오브",
  "Orb of Transmutation": "진화의 오브",
  "Perfect Chaos Orb": "완벽한 카오스 오브",
  "Perfect Exalted Orb": "완벽한 엑잘티드 오브",
  "Perfect Jeweller's Orb": "완벽한 쥬얼러 오브",
  "Perfect Orb of Augmentation": "완벽한 확장의 오브",
  "Perfect Orb of Transmutation": "완벽한 진화의 오브",
  "Perfect Regal Orb": "완벽한 제왕의 오브",
  "Regal Orb": "제왕의 오브",
  "Regal Shard": "제왕의 파편",
  "Scroll of Wisdom": "감정 주문서",
  "Transmutation Shard": "진화의 파편",
  "Vaal Arcanist's Infuser": "바알 신비학자의 주입기",
  "Vaal Armourer's Infuser": "바알 방어구 장인의 주입기",
  "Vaal Blacksmith's Infuser": "바알 대장장이의 주입기",
  "Vaal Catalysing Infuser": "바알 촉진시키는 주입기",
  "Vaal Cultivation Orb": "바알 함양 오브",
  "Vaal Orb": "바알 오브",
  "Vaal Siphoner": "바알 착취기",
  "Essence of Abrasion": "마모의 에센스",
  "Essence of Alacrity": "기민성의 에센스",
  "Essence of Battle": "전투의 에센스",
  "Essence of Command": "지휘의 에센스",
  "Essence of Delirium": "섬망의 에센스",
  "Essence of Electricity": "전기의 에센스",
  "Essence of Enhancement": "강화의 에센스",
  "Essence of Flames": "화염의 에센스",
  "Essence of Grounding": "접지의 에센스",
  "Essence of Haste": "가속의 에센스",
  "Essence of Horror": "경악의 에센스",
  "Essence of Hysteria": "발작의 에센스",
  "Essence of Ice": "얼음의 에센스",
  "Essence of Insanity": "광기의 에센스",
  "Essence of Insulation": "절연의 에센스",
  "Essence of Opulence": "풍요의 에센스",
  "Essence of Ruin": "폐허의 에센스",
  "Essence of Seeking": "추구의 에센스",
  "Essence of Sorcery": "마술의 에센스",
  "Essence of Thawing": "해동의 에센스",
  "Essence of the Abyss": "심연의 에센스",
  "Essence of the Body": "육신의 에센스",
  "Essence of the Breach": "균열의 에센스",
  "Essence of the Infinite": "무한의 에센스",
  "Essence of the Mind": "정신의 에센스",
  "Greater Essence of Abrasion": "상위 마모의 에센스",
  "Greater Essence of Alacrity": "상위 기민성의 에센스",
  "Greater Essence of Battle": "상위 전투의 에센스",
  "Greater Essence of Command": "상위 지휘의 에센스",
  "Greater Essence of Electricity": "상위 전기의 에센스",
  "Greater Essence of Enhancement": "상위 강화의 에센스",
  "Greater Essence of Flames": "상위 화염의 에센스",
  "Greater Essence of Grounding": "상위 접지의 에센스",
  "Greater Essence of Haste": "상위 가속의 에센스",
  "Greater Essence of Ice": "상위 얼음의 에센스",
  "Greater Essence of Insulation": "상위 절연의 에센스",
  "Greater Essence of Opulence": "상위 풍요의 에센스",
  "Greater Essence of Ruin": "상위 폐허의 에센스",
  "Greater Essence of Seeking": "상위 추구의 에센스",
  "Greater Essence of Sorcery": "상위 마술의 에센스",
  "Greater Essence of Thawing": "상위 해동의 에센스",
  "Greater Essence of the Body": "상위 육신의 에센스",
  "Greater Essence of the Infinite": "상위 무한의 에센스",
  "Greater Essence of the Mind": "상위 정신의 에센스",
  "Lesser Essence of Abrasion": "하위 마모의 에센스",
  "Lesser Essence of Alacrity": "하위 기민성의 에센스",
  "Lesser Essence of Battle": "하위 전투의 에센스",
  "Lesser Essence of Command": "하위 지휘의 에센스",
  "Lesser Essence of Electricity": "하위 전기의 에센스",
  "Lesser Essence of Enhancement": "하위 강화의 에센스",
  "Lesser Essence of Flames": "하위 화염의 에센스",
  "Lesser Essence of Grounding": "하위 접지의 에센스",
  "Lesser Essence of Haste": "하위 가속의 에센스",
  "Lesser Essence of Ice": "하위 얼음의 에센스",
  "Lesser Essence of Insulation": "하위 절연의 에센스",
  "Lesser Essence of Opulence": "하위 풍요의 에센스",
  "Lesser Essence of Ruin": "하위 폐허의 에센스",
  "Lesser Essence of Seeking": "하위 추구의 에센스",
  "Lesser Essence of Sorcery": "하위 마술의 에센스",
  "Lesser Essence of Thawing": "하위 해동의 에센스",
  "Lesser Essence of the Body": "하위 육신의 에센스",
  "Lesser Essence of the Infinite": "하위 무한의 에센스",
  "Lesser Essence of the Mind": "하위 정신의 에센스",
  "Perfect Essence of Abrasion": "완벽한 마모의 에센스",
  "Perfect Essence of Alacrity": "완벽한 기민성의 에센스",
  "Perfect Essence of Battle": "완벽한 전투의 에센스",
  "Perfect Essence of Command": "완벽한 지휘의 에센스",
  "Perfect Essence of Electricity": "완벽한 전기의 에센스",
  "Perfect Essence of Enhancement": "완벽한 강화의 에센스",
  "Perfect Essence of Flames": "완벽한 화염의 에센스",
  "Perfect Essence of Grounding": "완벽한 접지의 에센스",
  "Perfect Essence of Haste": "완벽한 가속의 에센스",
  "Perfect Essence of Ice": "완벽한 얼음의 에센스",
  "Perfect Essence of Insulation": "완벽한 절연의 에센스",
  "Perfect Essence of Opulence": "완벽한 풍요의 에센스",
  "Perfect Essence of Ruin": "완벽한 폐허의 에센스",
  "Perfect Essence of Seeking": "완벽한 추구의 에센스",
  "Perfect Essence of Sorcery": "완벽한 마술의 에센스",
  "Perfect Essence of Thawing": "완벽한 해동의 에센스",
  "Perfect Essence of the Body": "완벽한 육신의 에센스",
  "Perfect Essence of the Infinite": "완벽한 무한의 에센스",
  "Perfect Essence of the Mind": "완벽한 정신의 에센스",
  "Call of the Shadows": "그림자의 부름",
  "Head of the King": "왕의 머리",
  "Omen of Abyssal Echoes": "심연의 메아리의 징조",
  "Omen of Amelioration": "개량의 징조",
  "Omen of Answered Prayers": "응답받은 기도의 징조",
  "Omen of Bartering": "물물교환의 징조",
  "Omen of Catalysing Exaltation": "촉진하는 찬미의 징조",
  "Omen of Chance": "기회의 징조",
  "Omen of Chaotic Effectiveness": "혼란스러운 효율의 징조",
  "Omen of Chaotic Monsters": "혼란스러운 괴물의 징조",
  "Omen of Chaotic Quantity": "혼란스러운 수량의 징조",
  "Omen of Chaotic Rarity": "혼란스러운 희귀도의 징조",
  "Omen of Dextral Annulment": "우측 소멸의 징조",
  "Omen of Dextral Crystallisation": "우측 결정화의 징조",
  "Omen of Dextral Erasure": "우측 말소의 징조",
  "Omen of Dextral Exaltation": "우측 찬미의 징조",
  "Omen of Dextral Necromancy": "우측 강령술의 징조",
  "Omen of Gambling": "도박의 징조",
  "Omen of Greater Exaltation": "상위 찬미의 징조",
  "Omen of Light": "빛의 징조",
  "Omen of Putrefaction": "부패의 징조",
  "Omen of Refreshment": "원기 회복의 징조",
  "Omen of Reinforcements": "보강의 징조",
  "Omen of Resurgence": "재기의 징조",
  "Omen of Sanctification": "축성의 징조",
  "Omen of Secret Compartments": "비밀 공간의 징조",
  "Omen of Sinistral Annulment": "좌측 소멸의 징조",
  "Omen of Sinistral Crystallisation": "좌측 결정화의 징조",
  "Omen of Sinistral Erasure": "좌측 말소의 징조",
  "Omen of Sinistral Exaltation": "좌측 찬미의 징조",
  "Omen of Sinistral Necromancy": "좌측 강령술의 징조",
  "Omen of the Ancients": "고대인의 징조",
  "Omen of the Blackblooded": "검은 피의 징조",
  "Omen of the Blessed": "축복받은 자의 징조",
  "Omen of the Hunt": "사냥의 징조",
  "Omen of the Liege": "군왕의 징조",
  "Omen of the Sovereign": "군주의 징조",
  "Omen of Whittling": "절사의 징조",
  "Raven-Touched Shard": "큰까마귀의 손길에 닿은 파편",
  "Ancient Concentrated Liquid Fear": "고대 농축된 액체 두려움",
  "Ancient Concentrated Liquid Isolation": "고대 농축된 액체 고립",
  "Ancient Concentrated Liquid Suffering": "고대 농축된 액체 고통",
  "Ancient Diluted Liquid Greed": "고대 희석된 액체 탐욕",
  "Ancient Diluted Liquid Guilt": "고대 희석된 액체 죄책감",
  "Ancient Diluted Liquid Ire": "고대 희석된 액체 진노",
  "Ancient Liquid Despair": "고대 액체 절망",
  "Ancient Liquid Disgust": "고대 액체 혐오",
  "Ancient Liquid Envy": "고대 액체 선망",
  "Ancient Liquid Paranoia": "고대 액체 집착",
  "Ancient Potent Liquid Contempt": "고대 위력적인 액체 경멸",
  "Ancient Potent Liquid Ferocity": "고대 위력적인 액체 흉포함",
  "Ancient Potent Liquid Melancholy": "고대 위력적인 액체 우울",
  "Concentrated Liquid Fear": "농축된 액체 두려움",
  "Concentrated Liquid Isolation": "농축된 액체 고립",
  "Concentrated Liquid Suffering": "농축된 액체 고통",
  "Diluted Liquid Greed": "희석된 액체 탐욕",
  "Diluted Liquid Guilt": "희석된 액체 죄책감",
  "Diluted Liquid Ire": "희석된 액체 진노",
  "Liquid Despair": "액체 절망",
  "Liquid Disgust": "액체 혐오",
  "Liquid Envy": "액체 선망",
  "Liquid Paranoia": "액체 집착",
  "Potent Liquid Contempt": "위력적인 액체 경멸",
  "Potent Liquid Ferocity": "위력적인 액체 흉포함",
  "Potent Liquid Melancholy": "위력적인 액체 우울"
};

const CATEGORY_PREFIXES = ['explicit','implicit','desecrated','enchant','fractured','crafted','rune'];
const CATEGORY_LABELS = {
  explicit: '비고정', implicit: '고정', desecrated: '훼손',
  enchant: '인챈트', fractured: '분열됨', crafted: '제작', rune: '룬'
};

const KR_TRADE_BASE = 'https://poe.game.daum.net/trade2/search/poe2';
const KR_API_SEARCH = (l) => `https://poe.game.daum.net/api/trade2/search/poe2/${l}`;
const DEFAULT_LEAGUE = 'Runes of Aldur';
const KNOWN_LEAGUES = ['Runes of Aldur', 'HC Runes of Aldur', 'Standard', 'Hardcore'];
const LEAGUE_ALIASES = { 'Rune of Aldur': 'Runes of Aldur', 'Hardcore Rune of Aldur': 'HC Runes of Aldur' };

let filtersByLeague = {};
let settings = { league: DEFAULT_LEAGUE, resultCount: 10 };
let editingId = null;

const getCurrentFilters = () => filtersByLeague[settings.league] || [];
const setCurrentFilters = (arr) => { filtersByLeague[settings.league] = arr; };

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

function updateFilterSourceHash(filter) {
  filter.sourceHash = simpleHash(buildQuerySignature(filter));
}

function roundFilterNumber(value) {
  const num = Number(value);
  if (!isFinite(num)) return 0;
  return Math.abs(num) % 1 === 0 ? Math.abs(num) : Number(Math.abs(num).toFixed(2));
}

function normalizeSavedFilter(filter) {
  if (!filter || typeof filter !== 'object') return filter;
  filter.reqLvlMin = 0;
  filter.priceMax = 0;
  if (filter.savedPrice === undefined) filter.savedPrice = null;
  if (!filter.typeLine) filter.typeLine = '';
  if (filter.typeLineActive == null) filter.typeLineActive = true;
  filter.equipment = Array.isArray(filter.equipment) ? filter.equipment : [];
  filter.stats = Array.isArray(filter.stats) ? filter.stats : [];
  filter.equipment.forEach(e => {
    if (!e) return;
    if (e.active == null) e.active = true;
    if (e.value != null && isFinite(Number(e.value))) e.min = roundFilterNumber(e.value);
  });
  filter.stats.forEach(s => {
    if (!s) return;
    if (s.active == null) s.active = true;
    if (s.value != null && isFinite(Number(s.value))) {
      // Preserve the sign for negative stats (감소 stats stored as negative values).
      const sign = Number(s.value) < 0 ? -1 : 1;
      s.min = sign * roundFilterNumber(s.value);
    }
    // Migrate: if id is unknown but fallbackId is valid, promote fallbackId → id
    if (s.id && s.id.includes('unknown') && s.fallbackId && !s.fallbackId.includes('unknown')) {
      s.id = s.fallbackId;
    }
  });
  updateFilterSourceHash(filter);
  return filter;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  render();
  bindTabs();
  bindHeader();
  bindModal();
  bindSettings();
  bindImportExport();
  chrome.storage.onChanged.addListener((changes) => {
    let needsRender = false;
    if (changes.filtersByLeague) {
      filtersByLeague = changes.filtersByLeague.newValue || {};
      needsRender = true;
    }
    if (changes.settings) {
      settings = { ...settings, ...(changes.settings.newValue || {}) };
      document.getElementById('leagueBadge').textContent = settings.league;
      document.getElementById('sLeague').value = settings.league;
      needsRender = true;
    }
    if (needsRender) render();
  });

  // Top-tab buttons (replaced inline onclick to comply with MV3 CSP)
  document.getElementById('top-tab-trade').addEventListener('click', () => switchTopTab('trade'));
  document.getElementById('top-tab-economy').addEventListener('click', () => switchTopTab('economy'));
  document.getElementById('ninja-rate-badge').addEventListener('click', () => switchTopTab('economy'));
  document.getElementById('ninja-refresh-btn').addEventListener('click', () => loadNinjaRates());

  // 카테고리 탭 초기 렌더
  renderNinjaCategoryTabs();

  // Economy 탭 검색창 이벤트
  const ninjaSearchEl = document.getElementById('ninja-search');
  if (ninjaSearchEl) {
    ninjaSearchEl.addEventListener('input', applyNinjaSearch);
  }

  // 환율 배지 초기 로드 (백그라운드)
  setTimeout(() => loadNinjaRates(), 1000);
});

async function loadData() {
  const r = await chrome.storage.local.get(['filters', 'filtersByLeague', 'settings']);
  if (r.settings) settings = { ...settings, ...r.settings };
  filtersByLeague = r.filtersByLeague || {};
  if (Array.isArray(r.filters) && r.filters.length && !r.filtersByLeague) {
    filtersByLeague[settings.league] = r.filters;
    await chrome.storage.local.set({ filtersByLeague });
    await chrome.storage.local.remove('filters');
  }
  let migrated = false;
  if (LEAGUE_ALIASES[settings.league]) {
    settings.league = LEAGUE_ALIASES[settings.league];
    migrated = true;
  }
  for (const oldName of Object.keys(LEAGUE_ALIASES)) {
    if (filtersByLeague[oldName]) {
      const newName = LEAGUE_ALIASES[oldName];
      const existing = filtersByLeague[newName] || [];
      filtersByLeague[newName] = existing.concat(filtersByLeague[oldName]);
      delete filtersByLeague[oldName];
      migrated = true;
    }
  }
  Object.keys(filtersByLeague).forEach(league => {
    filtersByLeague[league] = (filtersByLeague[league] || []).map(normalizeSavedFilter);
  });
  await chrome.storage.local.set({ filtersByLeague, settings });
  document.getElementById('sLeague').value = settings.league;
  document.getElementById('sCount').value = settings.resultCount;
  document.getElementById('leagueBadge').textContent = settings.league;
}

const persist = () => chrome.storage.local.set({ filtersByLeague, settings });

function render() {
  const list = document.getElementById('filterList');
  // Preserve which cards are currently open before re-render
  const openIds = new Set(
    Array.from(list.querySelectorAll('.filter-card.open')).map(el => el.id.replace('card-', ''))
  );
  const current = getCurrentFilters();
  if (!current.length) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">⭐</div>
        <p><strong>${esc(settings.league)}</strong> 리그에 저장된 필터가 없습니다.</p>
        <div class="guide-step">1. 아래 버튼으로 거래소 열기</div>
        <div class="guide-step">2. 원하는 아이템 검색</div>
        <div class="guide-step">3. 아이템 옆 ⭐ 즐겨찾기 클릭</div>
      </div>`;
    return;
  }
  list.innerHTML = '';
  current.slice().reverse().forEach(f => {
    const card = makeCard(f);
    if (openIds.has(String(f.id))) card.classList.add('open');
    list.appendChild(card);
  });
}

function currencyLabel(currency) {
  const map = {
    'divine': 'div',
    'exalted': 'ex',
    'chaos': 'chaos',
    'annulment': 'ann',
    'blessed': 'bles',
    'transmutation': 'trans',
    'augmentation': 'aug',
    'alteration': 'alt',
    'regal': 'reg',
    'vaal': 'vaal',
    'jewellers': 'jew',
    'fusing': 'fuse',
    'chromatic': 'chrom',
    'chance': 'chance',
    'scouring': 'scour',
    'alchemy': 'alch',
    'orb-of-conflict': 'conflict',
    'greater-jewellers': 'g.jew',
    'perfect-jewellers': 'p.jew',
    'artificers': 'art',
    'glassblowers': 'glass',
    'mirror': 'mirror',
    'fracturing': 'frac',
    'enkindling': 'enk',
    'instilling': 'inst',
  };
  return map[currency] || currency;
}

function makeCard(f) {
  const wrap = document.createElement('div');
  wrap.className = 'filter-card';
  wrap.id = `card-${f.id}`;

  const rarityClass = {rare:'badge-rare',unique:'badge-unique',magic:'badge-magic'}[f.rarity] || '';
  const rarityColor = {rare:'#f0c830',unique:'#af6025',magic:'#8888ff',normal:'#c8c8c8'}[f.rarity] || '#c8b98a';
  const catLabel = f.category ? f.category.split('.').pop() : '';

  const summary = [];
  if (f.ilvlMin)  summary.push(`iLvl ${f.ilvlMin}+`);
  const activeEquipment = (f.equipment||[]).filter(e => e.active !== false);
  if (activeEquipment.length) summary.push(`장비 ${activeEquipment.length}개`);
  const activeStats = (f.stats||[]).filter(s => s.active !== false);
  if (activeStats.length) summary.push(`스탯 ${activeStats.length}개`);

  const baseChips = [
    f.ilvlMin    ? `<span class="info-chip ilvl">📦 iLvl ${f.ilvlMin}+</span>` : '',
    f.areaLvlMin ? `<span class="info-chip area">🗺 지역Lv ${f.areaLvlMin}+</span>` : '',
    f.note       ? `<span class="info-chip">📝 ${esc(f.note)}</span>` : '',
  ].join('');

  const equipmentRows = (f.equipment||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="equip-min-value" data-filter-id="${f.id}" data-equip-idx="${i}" title="마우스 휠로 조정">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
    </div>`;
  }).join('');

  const statRows = (f.stats||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    const rawId = s.id || s.fallbackId || '';
    const prefixMatch = rawId.match(/^([^.]+)\./);
    const prefix = prefixMatch ? prefixMatch[1] : null;
    const knownPrefix = prefix && CATEGORY_LABELS[prefix] ? prefix : null;
    const badgeHtml = knownPrefix
      ? `<button class="cat-badge cat-badge-${knownPrefix}" data-stat-idx="${i}">${CATEGORY_LABELS[knownPrefix]}</button>`
      : (prefix ? `<button class="cat-badge cat-badge-explicit" data-stat-idx="${i}" style="opacity:0.5">${prefix}</button>` : '');
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}" data-stat-idx="${i}">
      ${badgeHtml}
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="stat-min-value" data-filter-id="${f.id}" data-stat-idx="${i}" title="마우스 휠로 조정">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
      <button class="stat-delete-btn" data-filter-id="${f.id}" data-stat-idx="${i}" title="이 스탯 삭제">×</button>
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="filter-card-head" data-id="${f.id}">
      <span class="card-arrow">▶</span>
      <div class="card-title">
        <div class="card-name" style="color:${rarityColor}"><span class="filter-name-edit" contenteditable="false" title="클릭해서 이름 편집">${esc(f.name)}</span></div>
        <div class="card-sub">${summary.join(' · ') || '저장된 아이템'}</div>
      </div>
      <div class="card-badges">
        ${catLabel ? `<span class="badge badge-cat">${catLabel}</span>` : ''}
        ${f.rarity ? `<span class="badge ${rarityClass}">${f.rarity}</span>` : ''}
        ${f.typeLine ? `<span class="badge type-line-badge ${f.typeLineActive !== false ? 'active' : 'inactive'}" title="클릭해서 기반 유형 필터 토글">${esc(f.typeLine)}</span>` : ''}
        ${f.savedPrice ? `<span class="saved-price-badge">${f.savedPrice.amount} ${currencyLabel(f.savedPrice.currency)}</span>` : ''}
        <button class="btn-delete-small" data-id="${f.id}" title="필터 삭제">×</button>
      </div>
    </div>

    <div class="card-quick">
      <button class="btn-search-q"   data-id="${f.id}">🔍 새창</button>
      <button class="btn-search-cur" data-id="${f.id}">🔗 현재창</button>
      <button class="btn-open-q"     data-id="${f.id}">🌐 KR거래소</button>
    </div>

    <div class="card-detail">
      ${baseChips ? `<div class="base-info">${baseChips}</div>` : ''}
      ${equipmentRows ? `<div class="stat-table">
        <div class="stat-table-title">장비 조건 (원본값 → 필터 최솟값)</div>
        ${equipmentRows}
      </div>` : ''}
      ${statRows ? `<div class="stat-table">
        <div class="stat-table-title">스탯 조건 (원본값 → 필터 최솟값)</div>
        ${statRows}
      </div>` : ''}
      <div id="result-${f.id}"></div>
    </div>
  `;

  wrap.querySelector('.filter-card-head').addEventListener('click', e => {
    if (e.target.closest('.cat-badge, .stat-delete-btn, .stat-min-value, .equip-min-value, .filter-name-edit, .type-line-badge, .btn-delete-small, button')) return;
    wrap.classList.toggle('open');
  });

  // Inline name editing
  const nameEl = wrap.querySelector('.filter-name-edit');
  let _prevName = f.name;

  nameEl.addEventListener('click', e => {
    e.stopPropagation();
    if (nameEl.contentEditable === 'true') return;
    _prevName = nameEl.textContent;
    nameEl.contentEditable = 'true';
    nameEl.focus();
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  const saveName = () => {
    nameEl.contentEditable = 'false';
    const newName = nameEl.textContent.trim();
    if (!newName) {
      nameEl.textContent = _prevName;
      return;
    }
    if (newName === _prevName) return;
    f.name = newName;
    _prevName = newName;
    persist();
  };

  nameEl.addEventListener('blur', saveName);

  nameEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameEl.blur();
    }
    if (e.key === 'Escape') {
      nameEl.textContent = _prevName;
      nameEl.contentEditable = 'false';
    }
  });
  wrap.querySelector('.btn-search-q').addEventListener('click', e => { e.stopPropagation(); if(!wrap.classList.contains('open')) wrap.classList.add('open'); doSearch(f.id, true); });
  wrap.querySelector('.btn-search-cur').addEventListener('click', e => { e.stopPropagation(); if(!wrap.classList.contains('open')) wrap.classList.add('open'); doSearch(f.id, false); });
  wrap.querySelector('.btn-open-q').addEventListener('click', e => { e.stopPropagation(); openKR(f.id); });
  wrap.querySelector('.btn-delete-small').addEventListener('click', e => { e.stopPropagation(); delFilter(f.id); });

  // typeLine badge toggle
  const typeLineBadgeEl = wrap.querySelector('.type-line-badge');
  if (typeLineBadgeEl) {
    typeLineBadgeEl.addEventListener('click', e => {
      e.stopPropagation();
      f.typeLineActive = f.typeLineActive === false;
      typeLineBadgeEl.classList.toggle('active', f.typeLineActive !== false);
      typeLineBadgeEl.classList.toggle('inactive', f.typeLineActive === false);
      persist();
    });
  }

  // Feature 2: stat row inline delete buttons
  wrap.querySelectorAll('.stat-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const filterId = btn.dataset.filterId;
      const statIdx  = parseInt(btn.dataset.statIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.stats) return;
      target.stats.splice(statIdx, 1);
      updateFilterSourceHash(target);
      persist();
      // Re-render only this card in-place
      const newCard = makeCard(target);
      wrap.replaceWith(newCard);
      // Keep card open if it was open
      if (wrap.classList.contains('open')) newCard.classList.add('open');
    });
  });

  // Feature: mouse wheel on stat-min-value spans to adjust min value
  wrap.querySelectorAll('.stat-min-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      const filterId = span.dataset.filterId;
      const statIdx  = parseInt(span.dataset.statIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.stats || !target.stats[statIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      target.stats[statIdx].min = (Number(target.stats[statIdx].min) || 0) + delta;
      updateFilterSourceHash(target);
      persist();
      // Update display text in-place without full re-render
      span.textContent = target.stats[statIdx].min + '+';
    }, { passive: false });
  });

  // Feature: mouse wheel on equip-min-value spans to adjust equipment min value
  wrap.querySelectorAll('.equip-min-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const filterId = span.dataset.filterId;
      const equipIdx = parseInt(span.dataset.equipIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.equipment || !target.equipment[equipIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      target.equipment[equipIdx].min = Math.max(0, (Number(target.equipment[equipIdx].min) || 0) + delta);
      updateFilterSourceHash(target);
      persist();
      // Update display text in-place without full re-render
      span.textContent = target.equipment[equipIdx].min + '+';
    }, { passive: false });
  });

  // Feature: category badge cycle on filter cards
  wrap.querySelectorAll('.cat-badge').forEach(badge => {
    badge.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const statIdx = parseInt(badge.dataset.statIdx, 10);
      const stat = f.stats[statIdx];
      if (!stat || !stat.id) return;
      const match = stat.id.match(/^([^.]+)\.(.+)$/);
      if (!match) return;
      const [, curPrefix, rest] = match;
      const curIdx = CATEGORY_PREFIXES.indexOf(curPrefix);
      // If unknown prefix, start from explicit (index 0), else advance by 1
      const nextPrefix = CATEGORY_PREFIXES[(curIdx + 1) % CATEGORY_PREFIXES.length];
      stat.id = `${nextPrefix}.${rest}`;
      // Update badge in-place
      badge.textContent = CATEGORY_LABELS[nextPrefix] || nextPrefix;
      badge.className = `cat-badge cat-badge-${nextPrefix}`;
      badge.style.opacity = '';
      updateFilterSourceHash(f);
      persist();
    });
  });

  return wrap;
}

async function doSearch(id, openInNew = true) {
  const f = getCurrentFilters().find(x => String(x.id) === String(id));
  if (!f) return;
  const rd  = document.getElementById(`result-${id}`);
  const btnNew = document.querySelector(`.btn-search-q[data-id="${id}"]`);
  const btnCur = document.querySelector(`.btn-search-cur[data-id="${id}"]`);
  rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#6a5a3a"><span class="spin"></span> 검색 ID 발급 중...</div></div>`;
  if (btnNew) { btnNew.classList.add('loading'); btnNew.disabled = true; btnNew.innerHTML = '<span class="spin"></span> 검색 중'; }
  if (btnCur) { btnCur.classList.add('loading'); btnCur.disabled = true; btnCur.innerHTML = '<span class="spin"></span>'; }

  try {
    const query = buildQuery(f);
    chrome.runtime.sendMessage({
      type: 'APPEND_DEBUG_LOG',
      entry: {
        kind: 'search',
        league: settings.league,
        filterId: f.id,
        filterName: f.name,
        query
      }
    }).catch(() => {});
    const res = await fetch(KR_API_SEARCH(encodeURIComponent(settings.league)), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `HTTP ${res.status}`);
    }
    const sData = await res.json();
    if (!sData.id) throw new Error('검색 ID를 받지 못했습니다');
    const url = `${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}/${sData.id}`;
    if (openInNew) {
      chrome.tabs.create({ url });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs && tabs[0]) chrome.tabs.update(tabs[0].id, { url });
        else chrome.tabs.create({ url });
      });
    }
    const total = (sData.total || 0).toLocaleString();
    const openLabel = openInNew ? '새 탭에' : '현재 탭에서';
    rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#80d040;font-size:11px">✅ 거래소 검색 결과를 ${openLabel} 열었습니다 (총 ${total}개)<br/><a href="${url}" target="_blank" style="color:#5080a0;font-size:10px">다시 열기 →</a></div></div>`;
  } catch(err) {
    rd.innerHTML = `<div class="result-area"><div class="result-error">⚠️ ${esc(err.message)}</div></div>`;
  } finally {
    if (btnNew) { btnNew.classList.remove('loading'); btnNew.disabled = false; btnNew.innerHTML = '🔍 새창'; }
    if (btnCur) { btnCur.classList.remove('loading'); btnCur.disabled = false; btnCur.innerHTML = '🔗 현재창'; }
  }
}

function buildQuery(f) {
  const q = { query:{ status:{ option:'securable' }, filters:{}, stats:[{type:'and',filters:[]}] }, sort:{price:'asc'} };
  const tf = {};
  if (f.rarity)   tf.rarity   = { option: f.rarity };
  if (f.category) tf.category = { option: f.category };
  if (f.typeLine && f.typeLineActive !== false) tf.type = { option: f.typeLine };
  if (Object.keys(tf).length) q.query.filters.type_filters = { filters: tf };

  const mf = {};
  if (f.ilvlMin)    mf.ilvl       = { min: Number(f.ilvlMin) };
  if (f.areaLvlMin) mf.area_level = { min: Number(f.areaLvlMin) };
  if (Object.keys(mf).length) q.query.filters.misc_filters = { filters: mf };

  q.query.filters.trade_filters = { filters: { sale_type: { option: 'priced' } } };

  const equipmentFilters = {};
  (f.equipment || []).forEach(e => {
    if (e.active === false || !e.id) return;
    const min = Number(e.min);
    if (!isFinite(min) || min <= 0) return;
    equipmentFilters[e.id] = { min };
  });
  if (Object.keys(equipmentFilters).length) q.query.filters.equipment_filters = { filters: equipmentFilters };

  const statFilters = [];
  (f.stats || []).forEach(s => {
    if (s.active === false) return;
    const effectiveId = (s.id && !s.id.includes('unknown'))
      ? s.id
      : (s.fallbackId && !s.fallbackId.includes('unknown') ? s.fallbackId : null);
    if (!effectiveId) return;
    // Negative stats (감소/reduction mods) are stored with negative min values.
    // The trade API requires these to be queried with `max` (not `min`) so that
    // items with a roll of -35 or better (more negative = more reduction) are found.
    const minVal = Number(s.min);
    const statValue = minVal < 0 ? { max: minVal } : { min: minVal };
    statFilters.push({ id: effectiveId, value: statValue, disabled: false });
  });
  if (statFilters.length) {
    q.query.stats[0].filters = statFilters;
  }
  return q;
}

function openKR(id) {
  chrome.tabs.create({ url:`${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}` });
}

function delFilter(id) {
  if (!confirm('이 필터를 삭제할까요?')) return;
  setCurrentFilters(getCurrentFilters().filter(x => String(x.id) !== String(id)));
  persist(); render();
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

function bindHeader() {
  document.getElementById('btnGoTrade').addEventListener('click', () => {
    chrome.tabs.create({ url:`${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}` });
  });
  document.getElementById('leagueBadge').addEventListener('click', () => {
    const cur = settings.league;
    const idx = KNOWN_LEAGUES.indexOf(cur);
    const next = KNOWN_LEAGUES[(idx + 1) % KNOWN_LEAGUES.length];
    settings.league = next;
    document.getElementById('leagueBadge').textContent = next;
    document.getElementById('sLeague').value = next;
    persist();
    render();
  });
}

function bindModal() {
  document.getElementById('btnCancel').addEventListener('click', closeModal);
  document.getElementById('btnSave').addEventListener('click', saveModal);
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target===document.getElementById('overlay')) closeModal();
  });

  // Feature 3: mouse wheel on focused number inputs inside the modal
  document.querySelector('.modal').addEventListener('wheel', e => {
    const inp = e.target;
    if (inp.tagName !== 'INPUT' || inp.type !== 'number') return;
    if (document.activeElement !== inp) return;
    e.preventDefault();
    // deltaY > 0 = scroll down = decrease value; < 0 = scroll up = increase value
    const delta = e.deltaY > 0 ? -1 : 1;
    const current = parseFloat(inp.value) || 0;
    inp.value = current + delta;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }, { passive: false });
}

function openModal(id) {
  editingId = id;
  const f = getCurrentFilters().find(x => String(x.id) === String(id));
  if (!f) return;
  document.getElementById('eName').value  = f.name;
  document.getElementById('eNote').value  = f.note||'';

  const el = document.getElementById('equipEditList');
  el.innerHTML = '';
  (f.equipment||[]).forEach((s, i) => {
    const active = s.active !== false;
    const row = document.createElement('div');
    row.className = 'stat-edit-row';
    row.innerHTML = `
      <button class="stat-toggle ${active?'':'off'}" data-idx="${i}" title="활성/비활성">${active?'✅':'⬜'}</button>
      <span class="stat-edit-label" title="${esc(s.label)}">${esc(s.label)}</span>
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min}" min="0" step="0.1" title="최솟값"/>
    `;
    row.querySelector('.stat-toggle').addEventListener('click', function() {
      const isOn = !this.classList.contains('off');
      this.classList.toggle('off', isOn);
      this.textContent = isOn ? '⬜' : '✅';
      this.closest('.stat-edit-row').style.opacity = isOn ? '.4' : '1';
    });
    el.appendChild(row);
  });

  const sl = document.getElementById('statEditList');
  sl.innerHTML = '';
  (f.stats||[]).forEach((s, i) => {
    const active = s.active !== false;
    const row = document.createElement('div');
    row.className = 'stat-edit-row';

    // Category badge: show for all known prefixes, cycle on click
    const rawId = s.id || s.fallbackId || '';
    const prefixM = rawId.match(/^([^.]+)\./);
    const curPfx = prefixM ? prefixM[1] : 'explicit';
    const knownPfx = CATEGORY_LABELS[curPfx] ? curPfx : null;
    const badgeHtml = rawId
      ? `<button class="cat-badge cat-badge-${knownPfx || 'explicit'}"
           data-idx="${i}"
           data-prefix="${curPfx}"
           title="클릭하여 카테고리 전환"
           style="${knownPfx ? '' : 'opacity:0.5'}">${CATEGORY_LABELS[curPfx] || curPfx}</button>`
      : '';

    row.innerHTML = `
      <button class="stat-toggle ${active?'':'off'}" data-idx="${i}" title="활성/비활성">${active?'✅':'⬜'}</button>
      <span class="stat-edit-label" title="${esc(s.label)}">${esc(s.label)}</span>
      ${badgeHtml}
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min}" step="1" title="최솟값 (감소 스탯은 음수)"/>
    `;
    row.querySelector('.stat-toggle').addEventListener('click', function() {
      const isOn = !this.classList.contains('off');
      this.classList.toggle('off', isOn);
      this.textContent = isOn ? '⬜' : '✅';
      this.closest('.stat-edit-row').style.opacity = isOn ? '.4' : '1';
    });

    // Category badge cycle in modal
    const badge = row.querySelector('.cat-badge');
    if (badge) {
      badge.addEventListener('click', function() {
        const currentPrefix = this.dataset.prefix;
        const curIdx = CATEGORY_PREFIXES.indexOf(currentPrefix);
        const nextPrefix = CATEGORY_PREFIXES[(curIdx + 1) % CATEGORY_PREFIXES.length];
        this.dataset.prefix = nextPrefix;
        this.className = `cat-badge cat-badge-${nextPrefix}`;
        this.style.opacity = '';
        this.textContent = CATEGORY_LABELS[nextPrefix] || nextPrefix;
      });
    }

    sl.appendChild(row);
  });

  document.getElementById('overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('overlay').classList.remove('show');
  editingId = null;
}

function saveModal() {
  const arr = getCurrentFilters();
  const f = arr.find(x => String(x.id) === String(editingId));
  if (!f) return;
  f.name     = document.getElementById('eName').value.trim() || f.name;
  f.priceMax = 0;
  f.reqLvlMin = 0;
  f.note     = document.getElementById('eNote').value.trim();

  document.querySelectorAll('#equipEditList .stat-edit-row').forEach((row, i) => {
    if (!f.equipment || !f.equipment[i]) return;
    const toggle = row.querySelector('.stat-toggle');
    f.equipment[i].active = !toggle.classList.contains('off');
    f.equipment[i].min    = parseFloat(row.querySelector('.stat-edit-min').value)||0;
  });

  document.querySelectorAll('#statEditList .stat-edit-row').forEach((row, i) => {
    if (!f.stats[i]) return;
    const toggle = row.querySelector('.stat-toggle');
    f.stats[i].active = !toggle.classList.contains('off');
    f.stats[i].min    = parseFloat(row.querySelector('.stat-edit-min').value)||0;

    // Apply category badge prefix to the stat id
    const badge = row.querySelector('.cat-badge');
    if (badge && f.stats[i].id) {
      const newPrefix = badge.dataset.prefix;
      const withoutPrefix = f.stats[i].id.replace(/^[^.]+\./, '');
      f.stats[i].id = `${newPrefix}.${withoutPrefix}`;
    }
  });

  updateFilterSourceHash(f);
  persist(); render(); closeModal();
}

function bindSettings() {
  const leagueInput = document.getElementById('sLeague');
  const onLeagueChange = (val) => {
    const v = (val || '').trim();
    if (!v) return;
    settings.league = v;
    document.getElementById('leagueBadge').textContent = v;
    leagueInput.value = v;
    persist();
    render();
  };
  leagueInput.addEventListener('change', e => onLeagueChange(e.target.value));
  leagueInput.addEventListener('blur',   e => onLeagueChange(e.target.value));
  document.getElementById('sCount').addEventListener('change', e => { settings.resultCount=parseInt(e.target.value); persist(); });
}

function bindImportExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({filtersByLeague,settings},null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`poe2-filters-${Date.now()}.json`});
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('btnImportTrigger').addEventListener('click',()=>document.getElementById('fileImport').click());
  document.getElementById('btnExportDebug').addEventListener('click', exportDebugLogs);
  document.getElementById('btnClearDebug').addEventListener('click', async () => {
    if (!confirm('디버그 로그를 모두 비울까요?')) return;
    await chrome.runtime.sendMessage({ type: 'CLEAR_DEBUG_LOGS' }).catch(() => null);
    alert('✅ 디버그 로그를 비웠습니다.');
  });
  document.getElementById('fileImport').addEventListener('change', e => {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const d = JSON.parse(ev.target.result);
        if (d.filtersByLeague) {
          filtersByLeague = d.filtersByLeague;
        } else if (Array.isArray(d.filters)) {
          filtersByLeague = { ...filtersByLeague, [settings.league]: d.filters };
        } else {
          alert('❌ 파일 형식 오류'); return;
        }
        if (d.settings) settings = { ...settings, ...d.settings };
        persist(); render();
        document.getElementById('sLeague').value = settings.league;
        document.getElementById('leagueBadge').textContent = settings.league;
        alert('✅ 가져오기 완료!');
      } catch { alert('❌ 파일 형식 오류'); }
    };
    r.readAsText(file); e.target.value='';
  });
  document.getElementById('btnClear').addEventListener('click',()=>{
    if(confirm(`"${settings.league}" 리그의 모든 필터를 삭제할까요?`)){
      setCurrentFilters([]);
      persist(); render();
    }
  });
}

async function exportDebugLogs() {
  const res = await chrome.runtime.sendMessage({ type: 'GET_DEBUG_LOGS' }).catch(() => null);
  const logs = res?.logs || [];
  const sections = logs.map((entry, idx) => {
    return [
      `===== LOG ${idx + 1} =====`,
      `loggedAt: ${entry.loggedAt || ''}`,
      `kind: ${entry.kind || ''}`,
      JSON.stringify(entry, null, 2),
      ''
    ].join('\n');
  });
  const text = sections.length ? sections.join('\n') : 'No debug logs.';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `poe2-debug-log-${Date.now()}.txt`
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

// ── Economy tab ──────────────────────────────────────────────

function applyNinjaSearch() {
  const query = (document.getElementById('ninja-search')?.value || '').trim().toLowerCase();
  const rows = document.querySelectorAll('#ninja-currency-list .ninja-row');
  rows.forEach(row => {
    const nameEl = row.querySelector('.ninja-name');
    const text = (nameEl?.textContent || '').toLowerCase();
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

const NINJA_CATEGORIES = [
  { label: '커런시', type: 'Currency' },
  { label: '에센스', type: 'Essences' },
  { label: '징조', type: 'Ritual' },
  { label: '환영 액체', type: 'Delirium' },
];

let currentNinjaCategory = 'Currency';

function renderNinjaCategoryTabs() {
  const container = document.getElementById('ninja-category-tabs');
  if (!container) return;
  container.innerHTML = '';
  NINJA_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ninja-cat-btn' + (cat.type === currentNinjaCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      currentNinjaCategory = cat.type;
      const searchEl = document.getElementById('ninja-search');
      if (searchEl) searchEl.value = '';
      renderNinjaCategoryTabs();
      refreshNinja();
    });
    container.appendChild(btn);
  });
}

function switchTopTab(tabName) {
  document.querySelectorAll('.top-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.top-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`top-panel-${tabName}`).classList.add('active');
  document.getElementById(`top-tab-${tabName}`).classList.add('active');
  if (tabName === 'economy') { renderNinjaCategoryTabs(); loadNinjaRates(); }
}

const ninjaCacheMap = {};   // key: `${league}::${itemType}` → { data, fetchedAt }

function refreshNinja() {
  // Force-reload current category (bypass cache)
  const cacheKey = `${settings.league || 'Standard'}::${currentNinjaCategory}`;
  delete ninjaCacheMap[cacheKey];
  loadNinjaRates();
}

async function loadNinjaRates() {
  const league = settings.league || 'Standard';
  const itemType = currentNinjaCategory;
  const cacheKey = `${league}::${itemType}`;
  const now = Date.now();

  const cached = ninjaCacheMap[cacheKey];
  if (cached && now - cached.fetchedAt < 5 * 60 * 1000) {
    renderNinjaRates(cached.data);
    if (itemType === 'Currency') updateRateBadge(cached.data);
    return;
  }

  document.getElementById('ninja-currency-list').innerHTML = '<div class="ninja-loading">로딩 중...</div>';

  chrome.runtime.sendMessage({ type: 'FETCH_NINJA', league, itemType }, res => {
    if (!res || !res.ok || !res.data) {
      document.getElementById('ninja-currency-list').innerHTML = '<div class="ninja-loading">데이터 로드 실패</div>';
      return;
    }
    ninjaCacheMap[cacheKey] = { data: res.data, fetchedAt: Date.now() };
    renderNinjaRates(res.data);
    if (itemType === 'Currency') updateRateBadge(res.data);
  });
}

function loadNinjaImage(img, ninjaPath) {
  img.src = 'https://web.poecdn.com' + ninjaPath;
  img.onerror = () => { img.style.display = 'none'; };
}

function renderNinjaRates(data) {
  const container = document.getElementById('ninja-currency-list');
  if (!container) return;
  container.innerHTML = '';

  const updated = document.getElementById('ninja-last-updated');
  if (updated) updated.textContent = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) + ' 기준';

  // withItems=true 파라미터로 최상위 items 배열에 모든 카테고리 아이템 이미지 포함됨.
  // 없는 경우 core.items(Currency 전용)로 폴백.
  const items = data.items || data.core?.items || [];
  const lines = data.lines || [];

  if (lines.length === 0) {
    container.innerHTML = '<div style="padding:12px;color:#806040;text-align:center;">데이터 없음</div>';
    return;
  }

  // id → {name, image} 맵 빌드
  const itemMap = {};
  items.forEach(item => { itemMap[item.id] = item; });

  // primaryValue 내림차순 정렬
  const sorted = [...lines].sort((a, b) => (b.primaryValue || 0) - (a.primaryValue || 0));

  sorted.forEach(line => {
    const info = itemMap[line.id] || {};
    const name = ITEM_NAMES_KO[info.name] || info.name || line.id;
    const imageUrl = info.image ? 'https://web.poecdn.com' + info.image : null;
    const value = line.primaryValue;
    if (!value && value !== 0) return;

    // 표시 형식: 값이 1 이상이면 "N/div", 미만이면 "1div = N개"
    let priceText;
    if (value >= 1) {
      priceText = value.toFixed(value >= 10 ? 0 : 1) + '/div';
    } else if (value > 0) {
      priceText = '1div=' + Math.round(1 / value) + '개';
    } else {
      return;
    }

    const row = document.createElement('div');
    row.className = 'ninja-row';
    row.innerHTML = `
      <img class="ninja-icon" src="" alt="">
      <span class="ninja-name">${name}</span>
      <span class="ninja-div">${priceText}</span>
    `;
    const img = row.querySelector('img');
    if (imageUrl) {
      img.src = imageUrl;
      img.onerror = () => { img.style.display = 'none'; };
    } else {
      img.style.display = 'none';
    }
    container.appendChild(row);
  });

  // 렌더 완료 후 현재 검색어로 즉시 필터링
  applyNinjaSearch();
}

function updateRateBadge(data) {
  const badge = document.getElementById('ninja-rate-badge');
  if (!badge) return;
  const exRate = data.core?.rates?.exalted;
  if (exRate) {
    badge.textContent = `1div = ${exRate}ex`;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}
