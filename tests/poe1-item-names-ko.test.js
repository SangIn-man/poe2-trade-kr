'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const translations = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'data', 'poe1-item-names-ko.json'),
  'utf8'
));
const statTranslations = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'data', 'poe1-stat-text-ko.json'),
  'utf8'
));
const effectTranslations = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'data', 'poe1-item-effects-ko.json'),
  'utf8'
));
const divinationCards = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'data', 'poe1-divination-cards.json'),
  'utf8'
));

test('PoE1 ninja translation map covers official and synthetic names', () => {
  assert.ok(Object.keys(translations).length > 5000);
  assert.equal(translations['Chaos Orb'], '카오스 오브');
  assert.equal(translations['The Doctor'], '의사');
  assert.equal(translations.Mageblood, '마법사의 피');
  assert.equal(translations['Winged Reliquary Scarab'], '날개 달린 성유물 보관실 갑충석');
  assert.equal(translations['More Than Skill'], '기술 외의 소질');
  assert.equal(translations['Foulborn Mageblood'], '삿된 혈통 마법사의 피');
  assert.equal(translations['Mystic Refractor'], '신비한 굴절기');
  assert.equal(translations['Leather Hood'], '가죽 두건');
  assert.equal(translations['Map (Tier 16)'], '지도 (16등급)');
});

test('PoE1 item translation map includes official skill gem names', () => {
  assert.equal(translations['Vaal Immortal Call'], '바알 불멸의 외침');
  assert.equal(translations['Ice Nova'], '얼음 폭발');
  assert.equal(translations['Awakened Enlighten Support'], '각성한 계몽 보조');
});

test('PoE1 ninja stat map includes tooltip modifier translations', () => {
  assert.ok(Object.keys(statTranslations).length > 10000);
  assert.equal(statTranslations['+# to Dexterity'], '민첩 +#');
  assert.equal(statTranslations['Culling Strike'], '마무리 타격');
  assert.equal(statTranslations['Skills fire # additional Projectiles'], '스킬이 투사체 #개 추가 발사');
  assert.equal(
    statTranslations['Eat a Soul when you Hit a Rare or Unique Enemy, no more than once every 0.25 seconds'],
    '희귀 또는 고유 적 명중 시 영혼 1개 포식, 0.25초마다 최대 1번 포식'
  );
});

test('PoE1 ninja consumable map includes Korean effect descriptions', () => {
  assert.ok(Object.keys(effectTranslations).length > 500);
  assert.equal(effectTranslations['Chaos Orb'], '희귀 아이템을 재련해 무작위 신규 속성 부여');
  assert.match(effectTranslations['Deafening Essence of Misery'], /속성 1개 보장/);
  assert.match(effectTranslations['Deafening Essence of Misery'], /화살통: 물리 공격 피해/);
  assert.match(effectTranslations['Deafening Essence of Misery'], /허리띠: 플라스크로 얻는 마나 회복 속도/);
  assert.match(effectTranslations['Deafening Essence of Misery'], /목걸이, 반지, 방패: 마나 재생 속도/);
  assert.match(effectTranslations['Arrogance of the Vaal'], /고정 속성 2개 부여/);
  assert.match(effectTranslations['Divination Scarab of Pilfering'], /점술 카드 복제/);
});

test('PoE1 divination card map includes completion stack sizes', () => {
  assert.ok(Object.keys(divinationCards).length >= 94);
  assert.equal(divinationCards['House of Mirrors'].stackSize, 9);
  assert.equal(divinationCards['Time-Lost Relic'].stackSize, 10);
});
