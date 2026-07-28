(function initPobCharacter(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.POE2TQPobCharacter = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPobCharacter() {
  'use strict';

  const FRAME_TYPES = {
    normal: 0,
    magic: 1,
    rare: 2,
    unique: 3,
    gem: 4,
    currency: 5,
    divinationcard: 6,
    quest: 7,
    prophecy: 8,
    relic: 9
  };

  const SLOT_MAP = {
    'weapon 1': { inventoryId: 'Weapon', x: 0, w: 2, h: 4 },
    'weapon 2': { inventoryId: 'Offhand', x: 0, w: 2, h: 4 },
    helmet: { inventoryId: 'Helm', x: 0, w: 2, h: 2 },
    helm: { inventoryId: 'Helm', x: 0, w: 2, h: 2 },
    'body armour': { inventoryId: 'BodyArmour', x: 0, w: 2, h: 3 },
    bodyarmour: { inventoryId: 'BodyArmour', x: 0, w: 2, h: 3 },
    gloves: { inventoryId: 'Gloves', x: 0, w: 2, h: 2 },
    boots: { inventoryId: 'Boots', x: 0, w: 2, h: 2 },
    amulet: { inventoryId: 'Amulet', x: 0, w: 1, h: 1 },
    'ring 1': { inventoryId: 'Ring', x: 0, w: 1, h: 1 },
    'ring 2': { inventoryId: 'Ring2', x: 0, w: 1, h: 1 },
    belt: { inventoryId: 'Belt', x: 0, w: 2, h: 1 },
    'flask 1': { inventoryId: 'Flask', x: 0, w: 1, h: 2 },
    'flask 2': { inventoryId: 'Flask', x: 1, w: 1, h: 2 },
    'flask 3': { inventoryId: 'Flask', x: 2, w: 1, h: 2 },
    'flask 4': { inventoryId: 'Flask', x: 3, w: 1, h: 2 },
    'flask 5': { inventoryId: 'Flask', x: 4, w: 1, h: 2 }
  };

  function normalizeSlotName(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/^weapon\s+1\s+swap$/, 'weapon swap 1')
      .replace(/^weapon\s+2\s+swap$/, 'weapon swap 2');
  }

  function mapSlotName(value) {
    const key = normalizeSlotName(value);
    const direct = SLOT_MAP[key];
    if (direct) return { ...direct };
    const flaskMatch = key.match(/^flask\s*([1-5])$/);
    if (flaskMatch) return { inventoryId: 'Flask', x: Number(flaskMatch[1]) - 1, w: 1, h: 2 };
    return null;
  }

  function cleanPobText(value) {
    return String(value || '')
      .replace(/\{(?:crafted|fractured|enchant|implicit|custom|crucible|scourge)\}/gi, '')
      .replace(/\{(?:variant|range|tags?|index):[^}]*\}/gi, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function property(name, value) {
    return { name, values: [[String(value), 0]], displayMode: 0 };
  }

  function parseSockets(value) {
    const sockets = [];
    const attributeByPobColour = { R: 'S', G: 'D', B: 'I', W: 'G', A: 'A' };
    const groups = String(value || '').trim().split(/\s+/).filter(Boolean);
    groups.forEach((groupText, group) => {
      groupText.split('-').forEach(colour => {
        const pobColour = String(colour || '').trim().toUpperCase();
        const attr = attributeByPobColour[pobColour] || pobColour;
        if (attr) sockets.push({ group, attr });
      });
    });
    return sockets;
  }

  function resolvePobRanges(value) {
    const source = String(value || '');
    const ranges = Array.from(source.matchAll(/\{range:([^}]+)\}/gi)).flatMap(match =>
      String(match[1] || '').split(',').map(Number).filter(Number.isFinite)
    );
    if (!ranges.length) return source;
    let rangeIndex = 0;
    return source
      .replace(/\{range:[^}]+\}/gi, '')
      .replace(/\((-?\d+(?:\.\d+)?)\s*[-–—]\s*(-?\d+(?:\.\d+)?)\)/g, (_, minText, maxText) => {
        const min = Number(minText);
        const max = Number(maxText);
        const percentile = Math.max(0, Math.min(1, ranges[Math.min(rangeIndex, ranges.length - 1)]));
        rangeIndex += 1;
        const selected = min + ((max - min) * percentile);
        return Number.isInteger(min) && Number.isInteger(max)
          ? String(Math.round(selected))
          : String(Math.round(selected * 10000) / 10000);
      });
  }

  function normalizeModShape(value) {
    return String(value || '')
      .replace(/\((-?\d+(?:\.\d+)?)\s*[-–—]\s*(-?\d+(?:\.\d+)?)\)/g, '#')
      .replace(/-?\d+(?:\.\d+)?/g, '#')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function dedupePobMods(mods) {
    const source = Array.isArray(mods) ? mods : [];
    const concreteShapes = new Set(source
      .filter(line => !/\(-?\d+(?:\.\d+)?\s*[-–—]\s*-?\d+(?:\.\d+)?\)/.test(line))
      .map(normalizeModShape));
    const seen = new Set();
    return source.filter(line => {
      const hasRange = /\(-?\d+(?:\.\d+)?\s*[-–—]\s*-?\d+(?:\.\d+)?\)/.test(line);
      const shape = normalizeModShape(line);
      if (hasRange && concreteShapes.has(shape)) return false;
      const exact = String(line || '').trim();
      if (seen.has(exact)) return false;
      seen.add(exact);
      return true;
    });
  }

  function parseItemText(rawText, slotName) {
    const slot = mapSlotName(slotName);
    if (!slot) return null;
    const lines = String(rawText || '').replace(/\r/g, '').split('\n').map(line => line.trim());
    const rarityIndex = lines.findIndex(line => /^Rarity:\s*/i.test(line));
    if (rarityIndex < 0) return null;
    const rarity = lines[rarityIndex].replace(/^Rarity:\s*/i, '').trim();
    const frameType = FRAME_TYPES[rarity.toLowerCase().replace(/\s+/g, '')] ?? 0;
    const header = [];
    for (let i = rarityIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line) continue;
      if (/^-{4,}$/.test(line) || /^(?:Unique ID|Item Level|LevelReq|Implicits|Sockets|Quality|Requirements):/i.test(line)) break;
      header.push(cleanPobText(line));
      if (header.length >= 2) break;
    }
    const hasNamedHeader = frameType === 1 || frameType === 2 || frameType === 3 || frameType === 9;
    const name = hasNamedHeader && header.length > 1 ? header[0] : '';
    const baseType = hasNamedHeader && header.length > 1 ? header[1] : (header[0] || '');
    const item = {
      id: `pob-${String(slotName || '').replace(/\s+/g, '-').toLowerCase()}`,
      verified: true,
      identified: true,
      frameType,
      name,
      typeLine: baseType,
      baseType,
      inventoryId: slot.inventoryId,
      x: slot.x,
      y: 0,
      w: slot.w,
      h: slot.h,
      properties: [],
      requirements: [],
      sockets: [],
      enchantMods: [],
      implicitMods: [],
      explicitMods: [],
      craftedMods: [],
      fracturedMods: [],
      utilityMods: []
    };

    const selectedVariantMatch = lines.map(line => line.match(/^Selected Variant:\s*(\d+)/i)).find(Boolean);
    const selectedVariant = selectedVariantMatch ? Number(selectedVariantMatch[1]) : null;
    let implicitRemaining = 0;
    let inRequirements = false;
    const metadataPattern = /^(?:Rarity|Unique ID|Item Level|LevelReq|Implicits|Sockets|Quality|Requirements|Note|League|Variant|Selected Variant):/i;
    for (let i = rarityIndex + 1; i < lines.length; i += 1) {
      const original = lines[i];
      if (!original || /^-{4,}$/.test(original)) {
        inRequirements = false;
        continue;
      }
      const variantMatch = original.match(/\{variant:([^}]+)\}/i);
      if (variantMatch && selectedVariant != null) {
        const variants = String(variantMatch[1] || '').split(',').map(Number).filter(Number.isFinite);
        if (variants.length && !variants.includes(selectedVariant)) continue;
      }
      if (header.includes(cleanPobText(original))) continue;
      let match = original.match(/^Item Level:\s*(\d+)/i);
      if (match) {
        item.ilvl = Number(match[1]);
        continue;
      }
      match = original.match(/^LevelReq:\s*(\d+)/i);
      if (match) {
        item.requirements.push(property('레벨', match[1]));
        continue;
      }
      match = original.match(/^Sockets:\s*(.+)$/i);
      if (match) {
        item.sockets = parseSockets(match[1]);
        continue;
      }
      match = original.match(/^Implicits:\s*(\d+)/i);
      if (match) {
        implicitRemaining = Number(match[1]);
        continue;
      }
      if (/^Requirements:/i.test(original)) {
        inRequirements = true;
        continue;
      }
      match = original.match(/^(Str|Dex|Int|Level):\s*(.+)$/i);
      if (inRequirements && match) {
        const labels = { str: '힘', dex: '민첩', int: '지능', level: '레벨' };
        item.requirements.push(property(labels[match[1].toLowerCase()], cleanPobText(match[2])));
        continue;
      }
      match = original.match(/^(Quality|Armour|Evasion Rating|Energy Shield|Ward|Block|Physical Damage|Elemental Damage|Critical Strike Chance|Attacks per Second|Duration|Charges|Life Recovery|Mana Recovery):\s*(.+)$/i);
      if (match) {
        item.properties.push(property(match[1], cleanPobText(match[2])));
        continue;
      }
      match = original.match(/^(Armour|Evasion|EnergyShield|Ward):\s*(.+)$/i);
      if (match) {
        const labels = { armour: 'Armour', evasion: 'Evasion Rating', energyshield: 'Energy Shield', ward: 'Ward' };
        item.properties.push(property(labels[match[1].toLowerCase()], cleanPobText(match[2])));
        continue;
      }
      if (/^(?:Armour|Evasion|EnergyShield|Ward|PhysicalDamage|ElementalDamage|CritChance|AttackRate)BasePercentile:/i.test(original)) continue;
      if (/^Corrupted$/i.test(original)) {
        item.corrupted = true;
        continue;
      }
      if (/^Mirrored$/i.test(original)) {
        item.duplicated = true;
        continue;
      }
      if (/^Unidentified$/i.test(original)) {
        item.identified = false;
        continue;
      }
      if (metadataPattern.test(original)) continue;

      const cleaned = cleanPobText(resolvePobRanges(original));
      if (!cleaned) continue;
      if (/\{enchant\}/i.test(original)) item.enchantMods.push(cleaned);
      else if (/\{crafted\}/i.test(original)) item.craftedMods.push(cleaned);
      else if (/\{fractured\}/i.test(original)) {
        item.fractured = true;
        item.fracturedMods.push(cleaned);
      } else if (/\{(?:crucible|scourge)\}/i.test(original)) item.utilityMods.push(cleaned);
      else if (/\{implicit\}/i.test(original) || implicitRemaining > 0) {
        item.implicitMods.push(cleaned);
        if (implicitRemaining > 0) implicitRemaining -= 1;
      } else item.explicitMods.push(cleaned);
    }

    ['enchantMods', 'implicitMods', 'explicitMods', 'craftedMods', 'fracturedMods', 'utilityMods']
      .forEach(key => { item[key] = dedupePobMods(item[key]); });
    return item;
  }

  function readNumber(stats, aliases) {
    for (const key of aliases) {
      const value = Number(stats?.[key]);
      if (Number.isFinite(value)) return value;
    }
    return null;
  }

  function buildStatRows(stats) {
    const rows = [];
    const add = (key, label, aliases, format = value => Math.round(value).toLocaleString('ko-KR')) => {
      const value = readNumber(stats, aliases);
      if (value != null) rows.push({ key, label, value: format(value) });
    };
    const percent = value => `${Math.round(value * 10) / 10}%`;
    const resistance = (key, label, aliases, maxAliases) => {
      const value = readNumber(stats, aliases);
      if (value == null) return;
      const maximum = readNumber(stats, maxAliases);
      rows.push({ key, label, value: maximum == null ? percent(value) : `${percent(value)} / ${percent(maximum)}` });
    };

    add('life', '생명력', ['Life', 'LifeUnreserved']);
    add('mana', '마나', ['Mana', 'ManaUnreserved']);
    add('energy-shield', '에너지 보호막', ['EnergyShield']);
    add('strength', '힘', ['Str', 'Strength']);
    add('dexterity', '민첩', ['Dex', 'Dexterity']);
    add('intelligence', '지능', ['Int', 'Intelligence']);
    add('block', '공격 막기', ['BlockChance'], percent);
    add('spell-block', '주문 막기', ['SpellBlockChance'], percent);
    resistance('fire-resist', '화염 저항', ['FireResist'], ['FireResistMax', 'MaxFireResist', 'FireResistCap']);
    resistance('cold-resist', '냉기 저항', ['ColdResist'], ['ColdResistMax', 'MaxColdResist', 'ColdResistCap']);
    resistance('lightning-resist', '번개 저항', ['LightningResist'], ['LightningResistMax', 'MaxLightningResist', 'LightningResistCap']);
    resistance('chaos-resist', '카오스 저항', ['ChaosResist'], ['ChaosResistMax', 'MaxChaosResist', 'ChaosResistCap']);
    add('movement-speed', '이동 속도', ['EffectiveMovementSpeedMod', 'MovementSpeedMod'], value => {
      const increase = Math.abs(value) <= 10 ? (value - 1) * 100 : value;
      return `${increase >= 0 ? '+' : ''}${Math.round(increase * 10) / 10}%`;
    });
    add('armour', '방어도', ['Armour']);
    add('evasion', '회피', ['Evasion']);
    add('physical-reduction', '물리 피해 감소', ['PhysicalDamageReduction'], percent);
    return rows;
  }

  function normalizeTradeModText(value, depth = 0) {
    if (value == null || depth > 8) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      const looksLikeValueTuple = value.length <= 3
        && (value.length === 1 || typeof value[1] === 'number' || typeof value[1] === 'string' || value[1] == null);
      if (looksLikeValueTuple) return normalizeTradeModText(value[0], depth + 1);
      return value.map(entry => normalizeTradeModText(entry, depth + 1)).filter(Boolean).join(' ').trim();
    }
    if (typeof value !== 'object') return '';

    for (const key of ['text', 'string', 'name', 'label', 'line', 'mod', 'descrText', 'description', 'displayText']) {
      if (value[key] == null || value[key] === value) continue;
      const template = normalizeTradeModText(value[key], depth + 1);
      if (!template) continue;
      const rawValues = Array.isArray(value.values)
        ? value.values
        : (Array.isArray(value.magnitudes) ? value.magnitudes : []);
      const values = rawValues.map(entry => normalizeTradeModText(entry, depth + 1)).filter(Boolean);
      if (!values.length) return template;
      const rendered = template.replace(/\{(\d+)\}/g, (_, index) => values[Number(index)] || '');
      if (value.displayMode === 1) return `${values.join(' ')} ${rendered}`.trim();
      if (value.displayMode === 3 || rendered !== template) return rendered.trim();
      const missingValues = values.filter(entry => !rendered.includes(entry));
      return missingValues.length ? `${rendered} ${missingValues.join(' ')}`.trim() : rendered.trim();
    }

    for (const key of ['value', 'typeLine', 'baseType']) {
      if (value[key] != null && value[key] !== value) return normalizeTradeModText(value[key], depth + 1);
    }
    return '';
  }

  function localizeTradeItem(item, itemNames, translateStat) {
    if (!item || typeof item !== 'object') return item;
    const localizeStat = typeof translateStat === 'function' ? translateStat : value => value;
    const result = { ...item };
    const translatedName = itemNames?.[String(item.name || '').trim()];
    if (translatedName) result.name = translatedName;
    const translatedTypeLine = itemNames?.[String(item.typeLine || '').trim()];
    const translatedBaseType = itemNames?.[String(item.baseType || '').trim()];
    if (translatedTypeLine) result.typeLine = translatedTypeLine;
    if (translatedBaseType) result.baseType = translatedBaseType;
    [
      'enchantMods', 'implicitMods', 'explicitMods', 'craftedMods',
      'fracturedMods', 'utilityMods', 'skillMods', 'runeMods', 'mutatedMods'
    ].forEach(key => {
      if (Array.isArray(item[key])) {
        result[key] = item[key]
          .map(value => normalizeTradeModText(value))
          .filter(Boolean)
          .map(value => localizeStat(value));
      }
    });
    return result;
  }

  return {
    mapSlotName,
    cleanPobText,
    parseSockets,
    resolvePobRanges,
    dedupePobMods,
    parseItemText,
    buildStatRows,
    normalizeTradeModText,
    localizeTradeItem
  };
});
