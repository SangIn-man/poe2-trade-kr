// ── State ──────────────────────────────────────────────
let filters = [];
let settings = { league: 'Standard', resultCount: 10 };
let editingId = null;
let statConditions = [];

function buildQuerySignature(filter) {
  return JSON.stringify({
    category: filter.category || '',
    rarity: filter.rarity || '',
    ilvlMin: Number(filter.ilvlMin) || 0,
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

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
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
    if (s.noValue == null) s.noValue = (s.value == null && !isFinite(Number(s.min)));
    if (!s.noValue && s.value != null && isFinite(Number(s.value))) s.min = roundFilterNumber(s.value);
    if (s.noValue) s.min = null;
  });
  filter.sourceHash = simpleHash(buildQuerySignature(filter));
  return filter;
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderFilters();
  setupTabs();
  setupModal();
  setupSettings();
  setupImportExport();
});

// ── Storage ────────────────────────────────────────────
async function loadData() {
  const result = await chrome.storage.local.get(['filters', 'settings']);
  filters = result.filters || getDefaultFilters();
  filters = filters.map(normalizeSavedFilter);
  if (result.settings) settings = { ...settings, ...result.settings };

  document.getElementById('settingLeague').value = settings.league;
  document.getElementById('settingResultCount').value = settings.resultCount;
}

async function saveFilters() {
  await chrome.storage.local.set({ filters });
}

async function saveSettings() {
  await chrome.storage.local.set({ settings });
}

// ── Default sample filters ─────────────────────────────
function getDefaultFilters() {
  return [
    {
      id: Date.now() + 1,
      name: '이동속도 부츠',
      category: 'armour.boots',
      rarity: 'rare',
      itemName: '',
      ilvlMin: 75,
      priceMax: 1,
      stats: [{ id: 'explicit.stat_2250533757', min: 25, label: '이동 속도 +%' }],
      note: '이동속도 25% 이상 레어 부츠'
    },
    {
      id: Date.now() + 2,
      name: '좋은 반지',
      category: 'accessory.ring',
      rarity: 'rare',
      itemName: '',
      ilvlMin: 80,
      priceMax: 2,
      stats: [],
      note: '레벨 80+ 레어 반지'
    }
  ];
}

// ── Render Filters ─────────────────────────────────────
function renderFilters() {
  const list = document.getElementById('filterList');

  if (filters.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔍</div>
        <p>저장된 필터가 없습니다.<br/>위의 <strong>+ 필터 추가</strong>를 눌러 만들어보세요.</p>
      </div>`;
    return;
  }

  list.innerHTML = '';
  filters.forEach(f => {
    const card = document.createElement('div');
    card.className = 'filter-card';
    card.id = `card-${f.id}`;

    const categoryLabel = f.category ? f.category.split('.').pop().toUpperCase() : '전체';
    const rarityColors = { rare: '#f0c830', unique: '#af6025', magic: '#8888ff', normal: '#c8c8c8', '': '#888' };
    const rarityColor = rarityColors[f.rarity] || '#888';

    const equipmentBadges = (f.equipment || []).slice(0, 1).map(s =>
      `<span class="tag">${s.label}: ${s.min}+</span>`
    ).join('');
    const statBadges = f.stats.slice(0, 2).map(s =>
      `<span class="tag">${s.label}: ${s.min}+</span>`
    ).join('');

    card.innerHTML = `
      <div class="filter-card-header">
        <span class="filter-name" style="color:${rarityColor}">${escHtml(f.name)}</span>
        <span class="filter-category">${categoryLabel}</span>
      </div>
      <div class="filter-meta">
        ${f.ilvlMin ? `<span>iLvl ${f.ilvlMin}+</span>` : ''}
        ${equipmentBadges}
        ${statBadges}
        ${f.note ? `<span style="color:#5a4a2a">${escHtml(f.note)}</span>` : ''}
      </div>
      <div class="filter-actions">
        <button class="btn-search" data-id="${f.id}">🔍 즉시 검색</button>
        <button class="btn-open-trade" data-id="${f.id}">🌐 거래소 열기</button>
        <button class="btn-edit" data-id="${f.id}">✏️</button>
        <button class="btn-del" data-id="${f.id}">✕</button>
      </div>
      <div class="result-panel" id="result-${f.id}"></div>
    `;

    list.appendChild(card);
  });

  // Event delegation
  list.querySelectorAll('.btn-search').forEach(btn => {
    btn.addEventListener('click', () => quickSearch(btn.dataset.id));
  });
  list.querySelectorAll('.btn-open-trade').forEach(btn => {
    btn.addEventListener('click', () => openTrade(btn.dataset.id));
  });
  list.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });
  list.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', () => deleteFilter(btn.dataset.id));
  });
}

// ── Quick Search (API) ─────────────────────────────────
async function quickSearch(id) {
  const f = filters.find(x => String(x.id) === String(id));
  if (!f) return;

  const panel = document.getElementById(`result-${id}`);
  panel.className = 'result-panel show';
  panel.innerHTML = `<div style="text-align:center;padding:8px;color:#6a5a3a"><span class="spinner"></span>검색 중...</div>`;

  try {
    const query = buildQuery(f);
    const league = encodeURIComponent(settings.league);

    // Step 1: POST search to get IDs
    const searchRes = await fetch(`https://www.pathofexile.com/api/trade2/search/${league}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PoE2TradeQuick/1.0'
      },
      body: JSON.stringify(query)
    });

    if (!searchRes.ok) {
      const errData = await searchRes.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const ids = (searchData.result || []).slice(0, settings.resultCount);
    const total = searchData.total || 0;

    if (ids.length === 0) {
      panel.innerHTML = renderNoResult(total);
      return;
    }

    // Step 2: Fetch item details
    const fetchRes = await fetch(
      `https://www.pathofexile.com/api/trade2/fetch/${ids.join(',')}?query=${searchData.id}&realm=poe2`,
      {
        headers: { 'User-Agent': 'PoE2TradeQuick/1.0' }
      }
    );

    const fetchData = await fetchRes.json();
    const items = fetchData.result || [];

    panel.innerHTML = renderResults(items, searchData.id, total);

  } catch (err) {
    panel.innerHTML = `
      <div style="color:#c05050;font-size:11px;padding:6px">
        ⚠️ 오류: ${escHtml(err.message)}<br/>
        <span style="color:#6a4a3a;font-size:10px">거래소 직접 열기를 이용해보세요.</span>
      </div>`;
  }
}

function buildQuery(f) {
  const query = { query: { filters: {} }, sort: { price: 'asc' } };

  if (f.rarity) query.query.filters.type_filters = { filters: { rarity: { option: f.rarity } } };
  if (f.category) {
    query.query.filters.type_filters = query.query.filters.type_filters || { filters: {} };
    query.query.filters.type_filters.filters.category = { option: f.category };
  }
  if (f.ilvlMin) {
    query.query.filters.misc_filters = { filters: { ilvl: { min: parseInt(f.ilvlMin) } } };
  }
  const equipmentFilters = {};
  (f.equipment || []).forEach(e => {
    if (e.active === false || !e.id) return;
    const min = parseFloat(e.min);
    if (!isFinite(min) || min <= 0) return;
    equipmentFilters[e.id] = { min };
  });
  if (Object.keys(equipmentFilters).length) {
    query.query.filters.equipment_filters = { filters: equipmentFilters };
  }
  if (f.stats && f.stats.length > 0) {
    query.query.stats = [{
      type: 'and',
      filters: f.stats
        .filter(s => s.active !== false && s.id && !s.id.includes('unknown'))
        .map(s => s.noValue
          ? ({ id: s.id, disabled: false })
          : ({
              id: s.id,
              value: { min: parseFloat(s.min) },
              disabled: false
            }))
    }];
  } else {
    query.query.stats = [{ type: 'and', filters: [] }];
  }

  return query;
}

function renderResults(items, queryId, total) {
  const tradeUrl = `https://www.pathofexile.com/trade2/search/${encodeURIComponent(settings.league)}/${queryId}`;
  let html = `
    <div class="result-header">
      <span>총 ${total.toLocaleString()}개 검색 (상위 ${items.length}개 표시)</span>
      <a class="result-link" href="${tradeUrl}" target="_blank">거래소에서 전체 보기 →</a>
    </div>`;

  items.forEach(item => {
    if (!item?.listing) return;
    const { listing, item: iData } = item;
    const price = listing.price ? `${listing.price.amount} ${listing.price.currency}` : '가격 미정';
    const seller = listing.account?.name || '알 수 없음';
    const charName = listing.account?.lastCharacterName || '';
    const age = timeAgo(listing.indexed);

    html += `
      <div class="result-item">
        <div>
          <span class="price">${escHtml(price)}</span>
          <span style="color:#4a6030;font-size:10px;margin-left:6px">${escHtml(iData?.name || iData?.typeLine || '')}</span>
        </div>
        <div>
          <span class="seller">@${escHtml(charName || seller)}</span>
          <span class="age" style="margin-left:6px">${age}</span>
        </div>
      </div>`;
  });

  return html;
}

function renderNoResult(total) {
  return `<div style="text-align:center;padding:10px;color:#6a4a2a;font-size:11px">
    😔 결과 없음 (총 ${total}개)<br/>
    <span style="font-size:10px">필터 조건을 완화해보세요.</span>
  </div>`;
}

// ── Open Trade Page ────────────────────────────────────
function openTrade(id) {
  const f = filters.find(x => String(x.id) === String(id));
  if (!f) return;
  const query = buildQuery(f);
  const encoded = encodeURIComponent(JSON.stringify(query));
  const url = `https://www.pathofexile.com/trade2/search/${encodeURIComponent(settings.league)}`;
  // Open trade page (the query will be submitted via the API separately if needed)
  chrome.tabs.create({ url });
}

// ── Delete Filter ──────────────────────────────────────
function deleteFilter(id) {
  if (!confirm('이 필터를 삭제할까요?')) return;
  filters = filters.filter(x => String(x.id) !== String(id));
  saveFilters();
  renderFilters();
}

// ── Modal ──────────────────────────────────────────────
function setupModal() {
  document.getElementById('btnAddNew').addEventListener('click', () => openModal(null));
  document.getElementById('btnModalCancel').addEventListener('click', closeModal);
  document.getElementById('btnModalSave').addEventListener('click', saveModal);
  document.getElementById('btnAddStat').addEventListener('click', addStatRow);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
}

function openModal(id) {
  editingId = id;
  statConditions = [];

  const f = id ? filters.find(x => String(x.id) === String(id)) : null;
  document.getElementById('modalTitle').textContent = f ? '필터 편집' : '새 필터 추가';
  document.getElementById('fName').value = f?.name || '';
  document.getElementById('fCategory').value = f?.category || '';
  document.getElementById('fRarity').value = f?.rarity || '';
  document.getElementById('fItemName').value = f?.itemName || '';
  document.getElementById('fIlvlMin').value = f?.ilvlMin || '';
  document.getElementById('fPriceMax').value = f?.priceMax || '';
  document.getElementById('fNote').value = f?.note || '';

  const statList = document.getElementById('statList');
  statList.innerHTML = '';
  statConditions = f?.stats ? [...f.stats] : [];
  statConditions.forEach((s, i) => addStatRow(s, i));

  document.getElementById('modalOverlay').classList.add('show');
  document.getElementById('fName').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  editingId = null;
}

function addStatRow(existing = null, idx = null) {
  if (!existing || typeof existing === 'object' && existing.target) {
    // Called from button click
    existing = null;
    idx = statConditions.length;
    statConditions.push({ id: '', min: 0, label: '' });
  }

  const i = idx !== null ? idx : statConditions.length - 1;
  const row = document.createElement('div');
  row.className = 'stat-row';
  row.dataset.idx = i;
  row.innerHTML = `
    <input type="text" class="stat-label" placeholder="스탯 이름 (예: 이동 속도)" value="${escHtml(existing?.label || '')}"/>
    <input type="text" class="stat-id" placeholder="stat ID" value="${escHtml(existing?.id || '')}" style="flex:2;font-size:10px"/>
    <input type="number" class="stat-min num" placeholder="최소" value="${existing?.min || ''}"/>
    <button class="btn-remove-stat" data-idx="${i}">✕</button>
  `;
  row.querySelector('.btn-remove-stat').addEventListener('click', () => {
    statConditions.splice(i, 1);
    row.remove();
    // Re-index remaining rows
    document.querySelectorAll('.stat-row').forEach((r, newI) => {
      r.dataset.idx = newI;
      r.querySelector('.btn-remove-stat').dataset.idx = newI;
    });
  });
  document.getElementById('statList').appendChild(row);
}

function saveModal() {
  const name = document.getElementById('fName').value.trim();
  if (!name) { alert('필터 이름을 입력해주세요.'); return; }
  const existing = editingId ? filters.find(x => String(x.id) === String(editingId)) : null;

  // Collect stat rows
  const stats = [];
  document.querySelectorAll('.stat-row').forEach(row => {
    const label = row.querySelector('.stat-label').value.trim();
    const id = row.querySelector('.stat-id').value.trim();
    const min = parseFloat(row.querySelector('.stat-min').value) || 0;
    if (label || id) stats.push({ label, id, min });
  });

  const f = {
    ...(existing || {}),
    id: editingId || Date.now(),
    name,
    category: document.getElementById('fCategory').value,
    rarity: document.getElementById('fRarity').value,
    itemName: document.getElementById('fItemName').value.trim(),
    ilvlMin: parseInt(document.getElementById('fIlvlMin').value) || 0,
    priceMax: 0,
    reqLvlMin: 0,
    note: document.getElementById('fNote').value.trim(),
    equipment: existing?.equipment ? existing.equipment.slice() : [],
    stats
  };
  f.sourceHash = simpleHash(buildQuerySignature(f));

  if (editingId) {
    const idx = filters.findIndex(x => String(x.id) === String(editingId));
    if (idx !== -1) filters[idx] = f;
  } else {
    filters.push(f);
  }

  saveFilters();
  renderFilters();
  closeModal();
}

// ── Tabs ───────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const name = tab.dataset.tab;
      document.getElementById('tab-filters').style.display = name === 'filters' ? 'block' : 'none';
      document.getElementById('tab-settings').style.display = name === 'settings' ? 'block' : 'none';
    });
  });
}

// ── Settings ───────────────────────────────────────────
function setupSettings() {
  document.getElementById('settingLeague').addEventListener('change', e => {
    settings.league = e.target.value;
    saveSettings();
  });
  document.getElementById('settingResultCount').addEventListener('change', e => {
    settings.resultCount = parseInt(e.target.value);
    saveSettings();
  });
}

// ── Import / Export ────────────────────────────────────
function setupImportExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    const data = JSON.stringify({ filters, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poe2-filters-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btnImportTrigger').addEventListener('click', () => {
    document.getElementById('btnImport').click();
  });

  document.getElementById('btnImport').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.filters) {
          filters = data.filters;
          if (data.settings) settings = { ...settings, ...data.settings };
          saveFilters();
          saveSettings();
          renderFilters();
          alert('✅ 가져오기 완료!');
        }
      } catch {
        alert('❌ 파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('btnClearAll').addEventListener('click', () => {
    if (confirm('모든 필터를 삭제할까요?')) {
      filters = [];
      saveFilters();
      renderFilters();
    }
  });
}

// ── Helpers ────────────────────────────────────────────
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
