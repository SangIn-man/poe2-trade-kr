const test = require('node:test');
const assert = require('node:assert/strict');
const { mapSlotName, parseSockets, resolvePobRanges, parseItemText, buildStatRows, localizeTradeItem } = require('../pob-character.js');

test('maps active PoB equipment slots to character API inventory ids', () => {
  assert.deepEqual(mapSlotName('Weapon 1'), { inventoryId: 'Weapon', x: 0, w: 2, h: 4 });
  assert.deepEqual(mapSlotName('Ring 2'), { inventoryId: 'Ring2', x: 0, w: 1, h: 1 });
  assert.deepEqual(mapSlotName('Flask 5'), { inventoryId: 'Flask', x: 4, w: 1, h: 2 });
  assert.equal(mapSlotName('Weapon 1 Swap'), null);
});

test('parses PoB socket groups and item text into trade-compatible fields', () => {
  assert.deepEqual(parseSockets('R-G-B B-B'), [
    { group: 0, attr: 'S' }, { group: 0, attr: 'D' }, { group: 0, attr: 'I' },
    { group: 1, attr: 'I' }, { group: 1, attr: 'I' }
  ]);
  const item = parseItemText(`Rarity: RARE
Gale Shelter
Vaal Regalia
--------
Quality: +20%
Energy Shield: 720
--------
Requirements:
Level: 68
Int: 194
--------
Sockets: B-B-B-B-R-G
Item Level: 86
--------
Implicits: 1
{implicit}+12% to all Elemental Resistances
{fractured}+48 to maximum Energy Shield
{crafted}+6% increased Attributes
Corrupted`, 'Body Armour');
  assert.equal(item.name, 'Gale Shelter');
  assert.equal(item.baseType, 'Vaal Regalia');
  assert.equal(item.frameType, 2);
  assert.equal(item.inventoryId, 'BodyArmour');
  assert.equal(item.sockets.length, 6);
  assert.equal(new Set(item.sockets.map(socket => socket.group)).size, 1);
  assert.deepEqual(item.implicitMods, ['+12% to all Elemental Resistances']);
  assert.deepEqual(item.fracturedMods, ['+48 to maximum Energy Shield']);
  assert.deepEqual(item.craftedMods, ['+6% increased Attributes']);
  assert.equal(item.corrupted, true);
});

test('keeps only the selected PoB item variant and resolves its rolled ranges', () => {
  assert.equal(resolvePobRanges('{range:0.5}(80-100)% increased Evasion Rating'), '90% increased Evasion Rating');
  const item = parseItemText(`Rarity: UNIQUE
Heatshiver
Leather Hood
Variant: Legacy
Variant: Current
Selected Variant: 2
Evasion: 290
EvasionBasePercentile: 1
Sockets: G-G-B-G
Item Level: 85
Implicits: 0
{variant:1}+1 to Level of Socketed Fire Gems
{variant:1}+1 to Level of Socketed Cold Gems
{variant:2}(80-100)% increased Evasion Rating
{variant:2}90% increased Evasion Rating
{variant:2}60% increased Mana Regeneration Rate
{variant:2}+(20-30)% to Fire Resistance
{variant:2}+25% to Fire Resistance
{variant:2}+(20-30)% to Cold Resistance
{variant:2}+25% to Cold Resistance
{variant:1}(20-30)% increased Cold Damage if you have used a Fire Skill Recently`, 'Helmet');
  assert.deepEqual(item.sockets.map(socket => socket.attr), ['D', 'D', 'I', 'D']);
  assert.ok(item.properties.some(entry => entry.name === 'Evasion Rating' && entry.values[0][0] === '290'));
  assert.deepEqual(item.explicitMods, [
    '90% increased Evasion Rating',
    '60% increased Mana Regeneration Rate',
    '+25% to Fire Resistance',
    '+25% to Cold Resistance'
  ]);
});

test('parses PoB flask duration, charge use, and recovery as item properties', () => {
  const item = parseItemText(`Rarity: MAGIC
Experimenter's Quicksilver Flask of Adrenaline
Quicksilver Flask
--------
Quality: +20%
Duration: 7.20 Seconds
Charges: 30 per use
Life Recovery: 1200 over 4 Seconds
Item Level: 84
--------
40% increased Movement Speed during Effect`, 'Flask 1');
  assert.equal(item.inventoryId, 'Flask');
  assert.equal(item.baseType, 'Quicksilver Flask');
  assert.deepEqual(item.properties.map(entry => entry.name), ['Quality', 'Duration', 'Charges', 'Life Recovery']);
  assert.deepEqual(item.explicitMods, ['40% increased Movement Speed during Effect']);
});

test('formats saved PoB player stats and includes maximum resistance when present', () => {
  const rows = buildStatRows({
    Life: '4321', ManaUnreserved: '817', Str: '155',
    FireResist: '80', FireResistMax: '80', BlockChance: '75',
    EffectiveMovementSpeedMod: '1.42'
  });
  assert.deepEqual(rows.find(row => row.key === 'fire-resist'), { key: 'fire-resist', label: '화염 저항', value: '80% / 80%' });
  assert.equal(rows.find(row => row.key === 'movement-speed').value, '+42%');
  assert.equal(rows.find(row => row.key === 'life').value, '4,321');
});

test('localizes PoB unique names, base types, and mods for the Korean trade API', () => {
  const source = {
    name: 'Mystic Refractor',
    typeLine: 'Pagan Wand',
    baseType: 'Pagan Wand',
    implicitMods: ['10% increased Cast Speed'],
    explicitMods: ['Skills fire 3 additional Projectiles']
  };
  const localized = localizeTradeItem(
    source,
    { 'Mystic Refractor': '신비한 굴절기', 'Pagan Wand': '이교도 마법봉' },
    value => value
      .replace('10% increased Cast Speed', '시전 속도 10% 증가')
      .replace('Skills fire 3 additional Projectiles', '스킬이 투사체 3개 추가 발사')
  );
  assert.equal(localized.name, '신비한 굴절기');
  assert.equal(localized.typeLine, '이교도 마법봉');
  assert.equal(localized.baseType, '이교도 마법봉');
  assert.deepEqual(localized.implicitMods, ['시전 속도 10% 증가']);
  assert.deepEqual(localized.explicitMods, ['스킬이 투사체 3개 추가 발사']);
  assert.equal(source.name, 'Mystic Refractor');
});
