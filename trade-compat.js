(function initTradeCompat(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.POE2TQTradeCompat = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createTradeCompat() {
  'use strict';

  const POE1 = 'poe1';
  const POE2 = 'poe2';
  const STORAGE_KEY_SEPARATOR = '::';
  const POE1_WEAPON_FILTERS = new Set(['damage', 'aps', 'crit', 'dps', 'pdps', 'edps']);
  const POE1_ARMOUR_FILTERS = new Set(['ar', 'ev', 'es', 'ward', 'block', 'base_defence_percentile']);
  const POE1_SOCKET_FILTERS = new Set(['sockets', 'links']);
  const ROOT_CATEGORY_ALIASES = {
    accessories: 'accessory',
    accessory: 'accessory',
    armours: 'armour',
    armor: 'armour',
    armors: 'armour',
    armour: 'armour',
    weapons: 'weapon',
    weapon: 'weapon',
    jewels: 'jewel',
    jewel: 'jewel',
    maps: 'map',
    map: 'map',
    cards: 'card',
    card: 'card',
    gems: 'gem',
    gem: 'gem',
    flasks: 'flask',
    flask: 'flask',
    currencies: 'currency',
    currency: 'currency'
  };

  function normalizeRealm(realm) {
    return realm === POE1 ? POE1 : POE2;
  }

  function makeRealmLeagueKey(realm, league) {
    return `${normalizeRealm(realm)}${STORAGE_KEY_SEPARATOR}${String(league || '').trim()}`;
  }

  function parseRealmLeagueKey(value) {
    const text = String(value || '');
    const separatorIndex = text.indexOf(STORAGE_KEY_SEPARATOR);
    if (separatorIndex <= 0) return null;
    const realm = text.slice(0, separatorIndex);
    if (realm !== POE1 && realm !== POE2) return null;
    return {
      realm,
      league: text.slice(separatorIndex + STORAGE_KEY_SEPARATOR.length)
    };
  }

  function getPreferredBuildTabKey(filter, realm) {
    const normalizedRealm = normalizeRealm(realm || filter?.tradeRealm);
    const category = String(filter?.category || '').toLowerCase();
    const identity = [filter?.category, filter?.typeLine, filter?.canonicalTypeLine, filter?.name, filter?.itemName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const searchText = [
      identity,
      filter?.note,
      ...(filter?.stats || []).flatMap(stat => [stat?.label, stat?.id, stat?.fallbackId]),
      ...(filter?.equipment || []).flatMap(entry => [entry?.label, entry?.id])
    ].filter(Boolean).join(' ').toLowerCase();

    if (normalizedRealm === POE1) {
      if (/(?:^|[.\s:])(heist|heistmission|contract|blueprint)(?:$|[.\s:])|계약|도면|강탈/i.test(identity)) return 'contract';
      if (/^map(?:\.|$)|(?:^|\s)maps?(?:$|\s)|지도/i.test(identity)) return 'map';
    } else if (/(tablet|slate|waystone|map|ritual|abyss|expedition|sanctum|breach|delirium|서판|지도|의식|심연|탐험|사원|균열|환영)/i.test(searchText)) {
      return 'slate';
    }

    if (
      /^(weapon|armour|accessory)\./.test(category)
      || /^(jewel|flask)$/.test(category)
      || /(helmet|gloves|boots|belt|ring|amulet|quiver|shield|focus|buckler|wand|sceptre|spear|flail|claw|dagger|sword|axe|mace|staff|crossbow|활|반지|목걸이|장갑|투구|장화|갑옷|방패|주얼|플라스크)/i.test(searchText)
    ) {
      return 'equipment';
    }
    return '';
  }

  function getEquipmentFilterGroups(realm) {
    return normalizeRealm(realm) === POE1
      ? ['weapon_filters', 'armour_filters', 'socket_filters']
      : ['equipment_filters'];
  }

  function resolveEquipmentFilterGroup(realm, id) {
    if (normalizeRealm(realm) === POE2) return id ? 'equipment_filters' : '';
    if (POE1_WEAPON_FILTERS.has(id)) return 'weapon_filters';
    if (POE1_ARMOUR_FILTERS.has(id)) return 'armour_filters';
    if (POE1_SOCKET_FILTERS.has(id)) return 'socket_filters';
    return '';
  }

  function numberOrNull(value) {
    if (value == null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function getSocketFilterColours(entry) {
    const source = entry?.socketColours;
    if (!source || typeof source !== 'object') return {};
    const result = {};
    ['r', 'g', 'b', 'w', 'a'].forEach(key => {
      const value = numberOrNull(source[key]);
      if (value != null && value > 0) result[key] = Math.round(value);
    });
    return result;
  }

  function buildEquipmentFilterGroups(realm, equipment) {
    const groups = {};
    (equipment || []).forEach(entry => {
      if (!entry || entry.active === false || !entry.id) return;
      const groupName = resolveEquipmentFilterGroup(realm, entry.id);
      if (!groupName) return;
      const min = numberOrNull(entry.min);
      const max = numberOrNull(entry.max);
      const value = {};
      if (min != null && min > 0) value.min = min;
      if (max != null && max > 0) value.max = max;
      if (groupName === 'socket_filters') Object.assign(value, getSocketFilterColours(entry));
      if (!Object.keys(value).length) return;
      if (!groups[groupName]) groups[groupName] = { filters: {} };
      groups[groupName].filters[entry.id] = value;
    });
    return groups;
  }

  function applyEquipmentToTemplateFilters(queryFilters, equipment) {
    const equipmentById = new Map();
    (equipment || []).forEach(entry => {
      if (entry?.id) equipmentById.set(entry.id, entry);
    });
    ['equipment_filters', 'weapon_filters', 'armour_filters', 'socket_filters'].forEach(groupName => {
      const filters = queryFilters?.[groupName]?.filters || {};
      Object.keys(filters).forEach(id => {
        const entry = equipmentById.get(id);
        if (!entry) return;
        const target = filters[id] && typeof filters[id] === 'object' ? filters[id] : {};
        const min = numberOrNull(entry.min);
        const max = numberOrNull(entry.max);
        if (entry.active === false || (min == null && max == null)) {
          target.disabled = true;
          delete target.min;
          delete target.max;
          delete target.value;
          filters[id] = target;
          return;
        }
        const value = {};
        if (min != null && min > 0) value.min = min;
        if (max != null && max > 0) value.max = max;
        if (groupName === 'socket_filters') Object.assign(value, getSocketFilterColours(entry));
        if (!Object.keys(value).length) {
          target.disabled = true;
          delete target.min;
          delete target.max;
          delete target.value;
          filters[id] = target;
          return;
        }
        filters[id] = { ...value, disabled: false };
      });
    });
    return queryFilters;
  }

  function getPoe1SocketColour(socket) {
    const explicit = String(socket?.sColour || '').toUpperCase();
    if (explicit) return explicit;
    return ({ S: 'R', D: 'G', I: 'B', G: 'W', A: 'A', DV: 'DV' })[String(socket?.attr || '').toUpperCase()] || 'W';
  }

  function getSocketSummary(item, realm) {
    const sockets = Array.isArray(item?.sockets) ? item.sockets : [];
    if (normalizeRealm(realm) === POE2) {
      return {
        sockets: 0,
        links: 0,
        runeSockets: sockets.filter(socket => socket?.type === 'rune').length,
        text: ''
      };
    }

    const colourKeyMap = { R: 'r', G: 'g', B: 'b', W: 'w', A: 'a' };
    const groupCounts = new Map();
    const colours = {};
    const textParts = [];
    let previousGroup = null;
    sockets.forEach((socket, index) => {
      const group = socket?.group != null ? String(socket.group) : `socket-${index}`;
      const colour = getPoe1SocketColour(socket);
      const colourKey = colourKeyMap[colour];
      if (colourKey) colours[colourKey] = (colours[colourKey] || 0) + 1;
      if (!groupCounts.has(group)) groupCounts.set(group, { count: 0, colours: {}, order: index });
      const groupInfo = groupCounts.get(group);
      groupInfo.count += 1;
      if (colourKey) groupInfo.colours[colourKey] = (groupInfo.colours[colourKey] || 0) + 1;
      if (index > 0) textParts.push(group === previousGroup ? '-' : ' ');
      textParts.push(colour);
      previousGroup = group;
    });

    const linkedGroup = [...groupCounts.values()]
      .sort((a, b) => b.count - a.count || a.order - b.order)[0] || { count: 0, colours: {} };

    return {
      sockets: sockets.length,
      links: linkedGroup.count,
      colours,
      linkColours: linkedGroup.count > 1 ? linkedGroup.colours : {},
      runeSockets: 0,
      text: textParts.join('')
    };
  }

  function normalizeCategoryRoot(value) {
    const key = String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
    return ROOT_CATEGORY_ALIASES[key] || String(value || '').trim().toLowerCase();
  }

  function normalizeCategoryValue(category) {
    if (!category) return '';
    if (Array.isArray(category)) {
      const parts = category.map(part => String(part || '').trim().toLowerCase()).filter(Boolean);
      if (!parts.length) return '';
      parts[0] = normalizeCategoryRoot(parts[0]);
      return parts.join('.');
    }
    if (typeof category === 'object') {
      const rootKey = Object.keys(category)[0];
      if (!rootKey) return '';
      const root = normalizeCategoryRoot(rootKey);
      const subcategories = Array.isArray(category[rootKey]) ? category[rootKey] : [];
      return subcategories[0] ? `${root}.${String(subcategories[0]).toLowerCase()}` : root;
    }
    const parts = String(category).trim().toLowerCase().split('.').filter(Boolean);
    if (!parts.length) return '';
    parts[0] = normalizeCategoryRoot(parts[0]);
    return parts.join('.');
  }

  function normalizeCategoryForRealm(category, realm) {
    let normalized = normalizeCategoryValue(category);
    if (!normalized) return '';
    if (normalized === 'armour.belt') normalized = 'accessory.belt';
    if (normalizeRealm(realm) === POE1) {
      const poe2OnlyRoots = /^(?:weapon\.(?:unarmed|spear|flail|talisman|ranged|crossbow|caster)|armour\.(?:focus|buckler)|map\.(?:waystone|barya|bosskey|tablet)|currency\.(?:socketable|rune|soulcore|idol))$/;
      if (poe2OnlyRoots.test(normalized)) normalized = normalized.split('.')[0];
    }
    return normalized;
  }

  function inferItemCategory(item, realm, fallbackRoot = '') {
    const normalizedRealm = normalizeRealm(realm);
    const direct = normalizeCategoryForRealm(item?.category, normalizedRealm);
    if (direct) return direct;

    const extendedRoot = item?.extended?.category;
    const extendedSubcategories = item?.extended?.subcategories;
    if (extendedRoot) {
      const extended = normalizeCategoryForRealm(
        Array.isArray(extendedSubcategories) && extendedSubcategories.length
          ? [extendedRoot, extendedSubcategories[0]]
          : extendedRoot,
        normalizedRealm
      );
      if (extended) return extended;
    }

    const text = `${item?.icon || ''} ${item?.typeLine || ''} ${item?.baseType || ''}`;
    const rules = [
      [/Belts?|벨트/i, 'accessory.belt'],
      [/Amulets?|목걸이/i, 'accessory.amulet'],
      [/Rings?|반지/i, 'accessory.ring'],
      [/BodyArmou?rs?|Chests?|(?:^|[\/ ])Body(?:Str|Dex|Int)|갑옷/i, 'armour.chest'],
      [/Helmets?|투구/i, 'armour.helmet'],
      [/Gloves?|장갑/i, 'armour.gloves'],
      [/Boots?|장화|신발/i, 'armour.boots'],
      [/Quivers?|화살통|퀴버/i, 'armour.quiver'],
      [/Shields?|방패/i, 'armour.shield'],
      [/Foci|Focuses?|집중도|포커스/i, 'armour.focus'],
      [/Bucklers?/i, 'armour.buckler'],
      [/Bows?|활/i, 'weapon.bow'],
      [/Wands?|마법봉/i, 'weapon.wand'],
      [/Sceptres?|셉터/i, 'weapon.sceptre'],
      [/Spears?|창/i, 'weapon.spear'],
      [/Flails?|도리깨/i, 'weapon.flail'],
      [/Claws?|클로/i, 'weapon.claw'],
      [/Daggers?|단검/i, 'weapon.dagger'],
      [/OneHandSwords?|ThrustingOneHandSwords?/i, 'weapon.onesword'],
      [/OneHandAxes?/i, 'weapon.oneaxe'],
      [/OneHandMaces?/i, 'weapon.onemace'],
      [/TwoHandSwords?/i, 'weapon.twosword'],
      [/TwoHandAxes?/i, 'weapon.twoaxe'],
      [/TwoHandMaces?/i, 'weapon.twomace'],
      [/Warstaves?/i, 'weapon.warstaff'],
      [/Staves|Staffs?/i, 'weapon.staff'],
      [/Crossbows?/i, 'weapon.crossbow'],
      [/Flasks?|플라스크/i, 'flask'],
      [/Jewels?|주얼/i, 'jewel']
    ];
    for (const [pattern, category] of rules) {
      if (pattern.test(text)) return normalizeCategoryForRealm(category, normalizedRealm);
    }

    const frameCategory = ({ 4: 'gem', 5: 'currency', 6: 'card' })[Number(item?.frameType)] || '';
    return normalizeCategoryForRealm(fallbackRoot || frameCategory, normalizedRealm);
  }

  function getTradeRarity(item) {
    const rarity = String(item?.rarity || '').toLowerCase();
    if (['normal', 'magic', 'rare', 'unique'].includes(rarity)) return rarity;
    return ({ 0: 'normal', 1: 'magic', 2: 'rare', 3: 'unique' })[Number(item?.frameType)] || '';
  }

  function buildRatesPerDivine(realm, data) {
    const normalizedRealm = normalizeRealm(realm);
    if (normalizedRealm === POE2) {
      return { divine: 1, ...(data?.core?.rates || {}) };
    }
    const divinePerPrimary = numberOrNull(data?.core?.rates?.divine);
    const primary = String(data?.core?.primary || '').toLowerCase();
    if (divinePerPrimary > 0 && primary === 'chaos') {
      const chaosPerDivine = 1 / divinePerPrimary;
      const rates = { divine: 1, chaos: chaosPerDivine };
      Object.entries(data?.core?.rates || {}).forEach(([id, rate]) => {
        const ratePerPrimary = numberOrNull(rate);
        if (id && ratePerPrimary > 0) rates[id] = 1 / ratePerPrimary;
      });
      return rates;
    }
    const lines = Array.isArray(data?.lines) ? data.lines : [];
    const divineLine = lines.find(line => line?.id === 'divine');
    const chaosPerDivine = numberOrNull(divineLine?.primaryValue);
    if (!(chaosPerDivine > 0)) return { divine: 1 };
    const rates = { divine: 1, chaos: chaosPerDivine };
    lines.forEach(line => {
      const chaosValue = numberOrNull(line?.primaryValue);
      if (line?.id && chaosValue > 0) rates[line.id] = chaosPerDivine / chaosValue;
    });
    return rates;
  }

  function getLineValueInDivine(realm, line, data) {
    const directDivineValue = numberOrNull(line?.divineValue);
    if (directDivineValue > 0) return directDivineValue;
    const value = numberOrNull(line?.primaryValue);
    if (normalizeRealm(realm) === POE2) return value;
    const divinePerPrimary = numberOrNull(data?.core?.rates?.divine);
    const primary = String(data?.core?.primary || '').toLowerCase();
    if (divinePerPrimary > 0 && primary === 'chaos') {
      const primaryValue = numberOrNull(line?.chaosValue) ?? value;
      return primaryValue > 0 ? primaryValue * divinePerPrimary : null;
    }
    const chaosValue = numberOrNull(line?.chaosValue);
    if (chaosValue > 0) {
      const divineLineForChaosValue = (data?.lines || []).find(entry => entry?.id === 'divine');
      const chaosPerDivineForChaosValue = numberOrNull(divineLineForChaosValue?.primaryValue);
      return chaosPerDivineForChaosValue > 0 ? chaosValue / chaosPerDivineForChaosValue : null;
    }
    if (!(value > 0)) return null;
    const divineLine = (data?.lines || []).find(entry => entry?.id === 'divine');
    const chaosPerDivine = numberOrNull(divineLine?.primaryValue);
    return chaosPerDivine > 0 ? value / chaosPerDivine : null;
  }

  function mergeConcurrentFilters(incomingMaps, currentMaps, baseRevision) {
    const merged = {};
    const keys = new Set([...Object.keys(incomingMaps || {}), ...Object.keys(currentMaps || {})]);
    keys.forEach(key => {
      const incoming = Array.isArray(incomingMaps?.[key]) ? incomingMaps[key].slice() : [];
      const incomingIds = new Set(incoming.map(filter => String(filter?.id || '')));
      const concurrent = (currentMaps?.[key] || []).filter(filter => {
        const id = String(filter?.id || '');
        return Number(filter?._storageRevision || 0) > Number(baseRevision || 0)
          && (!id || !incomingIds.has(id));
      });
      if (Object.prototype.hasOwnProperty.call(incomingMaps || {}, key) || concurrent.length) {
        merged[key] = incoming.concat(concurrent);
      }
    });
    return merged;
  }

  function carryForwardFilterRevisions(nextMaps, currentMaps, nextRevision) {
    Object.entries(nextMaps || {}).forEach(([key, filters]) => {
      if (!Array.isArray(filters)) return;
      const currentById = new Map((currentMaps?.[key] || []).map(filter => [String(filter?.id || ''), filter]));
      nextMaps[key] = filters.map(filter => {
        const id = String(filter?.id || '');
        const current = id ? currentById.get(id) : null;
        const knownRevision = Math.max(
          Number(filter?._storageRevision || 0),
          Number(current?._storageRevision || 0)
        );
        return { ...filter, _storageRevision: knownRevision || Number(nextRevision || 0) };
      });
    });
    return nextMaps;
  }

  function getItemIconIdentity(value) {
    const source = String(value || '').trim();
    if (!source) return '';
    const withoutQuery = source.split(/[?#]/, 1)[0];
    const fileName = withoutQuery.slice(withoutQuery.lastIndexOf('/') + 1);
    if (!fileName) return '';
    try {
      return decodeURIComponent(fileName).replace(/\.(?:png|webp|jpg|jpeg)$/i, '').toLowerCase();
    } catch (_) {
      return fileName.replace(/\.(?:png|webp|jpg|jpeg)$/i, '').toLowerCase();
    }
  }

  function selectClosestGemVariant(candidates, target) {
    const rows = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
    if (!rows.length) return null;
    const level = Number(target?.level);
    const quality = Number(target?.quality);
    const hasLevel = target?.level != null && target.level !== '' && Number.isFinite(level);
    const hasQuality = target?.quality != null && target.quality !== '' && Number.isFinite(quality);
    const corrupted = Boolean(target?.corrupted);
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const row of rows) {
      const rowLevel = Number(row.level);
      const rowQuality = Number(row.quality);
      if (Boolean(row.corrupted) !== corrupted) continue;
      let score = 0;
      if (hasLevel) score += Number.isFinite(rowLevel) ? Math.abs(rowLevel - level) * 100 : 10000;
      if (hasQuality) score += Number.isFinite(rowQuality) ? Math.abs(rowQuality - quality) : 1000;
      if (score < bestScore) {
        best = row;
        bestScore = score;
      }
    }
    return best;
  }

  function getProfileAccountName(payload) {
    return String(
      payload?.name
      || payload?.accountName
      || payload?.profile?.name
      || payload?.profile?.accountName
      || ''
    ).trim();
  }

  return Object.freeze({
    POE1,
    POE2,
    normalizeRealm,
    makeRealmLeagueKey,
    parseRealmLeagueKey,
    getPreferredBuildTabKey,
    getEquipmentFilterGroups,
    resolveEquipmentFilterGroup,
    buildEquipmentFilterGroups,
    applyEquipmentToTemplateFilters,
    getSocketSummary,
    normalizeCategoryForRealm,
    inferItemCategory,
    getTradeRarity,
    buildRatesPerDivine,
    getLineValueInDivine,
    mergeConcurrentFilters,
    carryForwardFilterRevisions,
    getItemIconIdentity,
    selectClosestGemVariant,
    getProfileAccountName
  });
});
