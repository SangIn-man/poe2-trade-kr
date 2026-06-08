'use strict';

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
    if (s.value != null && isFinite(Number(s.value))) s.min = roundFilterNumber(s.value);
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
  current.slice().reverse().forEach(f => list.appendChild(makeCard(f)));
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

  const equipmentRows = (f.equipment||[]).map(s => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="stat-min-val">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
    </div>`;
  }).join('');

  const statRows = (f.stats||[]).map(s => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="stat-min-val">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="filter-card-head" data-id="${f.id}">
      <span class="card-arrow">▶</span>
      <div class="card-title">
        <div class="card-name" style="color:${rarityColor}">${esc(f.name)}</div>
        <div class="card-sub">${summary.join(' · ') || '저장된 아이템'}</div>
      </div>
      <div class="card-badges">
        ${catLabel ? `<span class="badge badge-cat">${catLabel}</span>` : ''}
        ${f.rarity ? `<span class="badge ${rarityClass}">${f.rarity}</span>` : ''}
      </div>
    </div>

    <div class="card-quick">
      <button class="btn-search-q" data-id="${f.id}">🔍 거래소에서 검색</button>
      <button class="btn-open-q"   data-id="${f.id}">🌐 KR거래소</button>
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
      <div class="card-edit-btns">
        <button class="btn-edit-s" data-id="${f.id}">✏️ 편집</button>
        <button class="btn-del-s"  data-id="${f.id}">✕ 삭제</button>
      </div>
    </div>
  `;

  wrap.querySelector('.filter-card-head').addEventListener('click', () => wrap.classList.toggle('open'));
  wrap.querySelector('.btn-search-q').addEventListener('click', e => { e.stopPropagation(); if(!wrap.classList.contains('open')) wrap.classList.add('open'); doSearch(f.id); });
  wrap.querySelector('.btn-open-q').addEventListener('click', e => { e.stopPropagation(); openKR(f.id); });
  wrap.querySelector('.btn-edit-s').addEventListener('click', () => openModal(f.id));
  wrap.querySelector('.btn-del-s').addEventListener('click', () => delFilter(f.id));
  return wrap;
}

async function doSearch(id) {
  const f = getCurrentFilters().find(x => String(x.id) === String(id));
  if (!f) return;
  const rd  = document.getElementById(`result-${id}`);
  const btn = document.querySelector(`.btn-search-q[data-id="${id}"]`);
  rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#6a5a3a"><span class="spin"></span> 검색 ID 발급 중...</div></div>`;
  if (btn) { btn.classList.add('loading'); btn.innerHTML = '<span class="spin"></span> 검색 중'; }

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
    chrome.tabs.create({ url });
    const total = (sData.total || 0).toLocaleString();
    rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#80d040;font-size:11px">✅ 거래소에 검색 결과를 열었습니다 (총 ${total}개)<br/><a href="${url}" target="_blank" style="color:#5080a0;font-size:10px">다시 열기 →</a></div></div>`;
  } catch(err) {
    rd.innerHTML = `<div class="result-area"><div class="result-error">⚠️ ${esc(err.message)}</div></div>`;
  } finally {
    if (btn) { btn.classList.remove('loading'); btn.innerHTML = '🔍 거래소에서 검색'; }
  }
}

function buildQuery(f) {
  const q = { query:{ filters:{}, stats:[{type:'and',filters:[]}] }, sort:{price:'asc'} };
  const tf = {};
  if (f.rarity)   tf.rarity   = { option: f.rarity };
  if (f.category) tf.category = { option: f.category };
  if (Object.keys(tf).length) q.query.filters.type_filters = { filters: tf };

  const mf = {};
  if (f.ilvlMin)    mf.ilvl       = { min: Number(f.ilvlMin) };
  if (f.areaLvlMin) mf.area_level = { min: Number(f.areaLvlMin) };
  if (Object.keys(mf).length) q.query.filters.misc_filters = { filters: mf };

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
    statFilters.push({ id: effectiveId, value: { min: Number(s.min) }, disabled: false });
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
    row.innerHTML = `
      <button class="stat-toggle ${active?'':'off'}" data-idx="${i}" title="활성/비활성">${active?'✅':'⬜'}</button>
      <span class="stat-edit-label" title="${esc(s.label)}">${esc(s.label)}</span>
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min}" min="0" step="1" title="최솟값"/>
    `;
    row.querySelector('.stat-toggle').addEventListener('click', function() {
      const isOn = !this.classList.contains('off');
      this.classList.toggle('off', isOn);
      this.textContent = isOn ? '⬜' : '✅';
      this.closest('.stat-edit-row').style.opacity = isOn ? '.4' : '1';
    });
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
