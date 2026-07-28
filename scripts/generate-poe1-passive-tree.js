#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

const VERSION = '3_28';
const SOURCE_URL = `https://raw.githubusercontent.com/PathOfBuildingCommunity/PathOfBuilding/dev/src/TreeData/${VERSION}/tree.lua`;
const KOREAN_TREE_URL = 'https://poe.game.daum.net/passive-skill-tree';
const KOREAN_HIDDEN_PASSIVE_SOURCE_URL = 'https://poedb.tw/kr/Forbidden_Flesh';
const OUTPUT = path.resolve(__dirname, '..', 'data', `poe1-passive-tree-${VERSION.replace('_', '.')}.json`);
const KOREAN_HIDDEN_PASSIVE_FALLBACKS = {
  18054: { name: '자연의 광분', stats: ['플레이어가 유발하는 비-피해 원소 상태 이상 효과가 2 미터 내의 다른 적들에게 확산', '플레이어가 유발하는 비-피해 원소 상태 이상의 효과 100% 증폭'] },
  19355: { name: '해방된 잠재력', stats: ['인내, 격분, 권능 충전 지속시간 400% 증가', '처치 시 25%의 확률로 권능, 격분 또는 인내 충전 획득', '인내 충전 최대치 +1', '격분 충전 최대치 +1', '권능 충전 최대치 +1'] },
  27602: { name: '아홉 목숨', stats: ['받은 피해의 25%를 생명력, 마나, 에너지 보호막으로 회생', '회생 효과가 3초에 걸쳐 발생'] },
  42469: { name: '치명적인 번창', stats: ['공격 스킬 마지막 반복 시 피해 60% 증폭', '비-이동 전용 공격 스킬이 1 회 추가 반복'] },
  52435: { name: '불굴의 결의', stats: ['주는 피해 10% 감폭', '받는 피해 25% 감폭'] },
  57331: { name: '공허의 고삐', stats: ['명중 시 27%의 확률로 비-카오스 피해의 25%를 추가 카오스 피해로 획득', '명중 시 13%의 확률로 비-카오스 피해의 50%를 추가 카오스 피해로 획득', '명중 시 7%의 확률로 비-카오스 피해의 100%를 추가 카오스 피해로 획득'] },
  57568: { name: '이글거리는 순수', stats: ['카오스 피해의 45%를 화염 피해로 받음', '카오스 피해의 45%를 번개 피해로 받음'] }
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 PoETradeQuickSearchDataBuilder/1.0' } }, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(response.headers.location).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        response.resume();
        return;
      }
      response.setEncoding('utf8');
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function extractAssignedJson(source, variableName) {
  const marker = `var ${variableName} =`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing page variable: ${variableName}`);
  const start = source.indexOf('{', markerIndex + marker.length);
  if (start < 0) throw new Error(`Missing JSON object: ${variableName}`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}' && --depth === 0) return JSON.parse(source.slice(start, i + 1));
  }
  throw new Error(`Unclosed JSON object: ${variableName}`);
}

function findBalancedTable(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing Lua table: ${marker}`);
  const start = source.indexOf('{', markerIndex + marker.length);
  if (start < 0) throw new Error(`Missing opening brace: ${marker}`);
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '{') depth += 1;
    else if (ch === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Unclosed Lua table: ${marker}`);
}

function decodeLuaString(value) {
  if (!value) return '';
  try {
    return JSON.parse(value);
  } catch {
    return value.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
}

function readStringField(block, key) {
  const match = block.match(new RegExp(`\\["${key}"\\]\\s*=\\s*("(?:\\\\.|[^"\\\\])*")`));
  return match ? decodeLuaString(match[1]) : '';
}

function readStringArray(block, key) {
  const marker = `["${key}"]`;
  if (!block.includes(marker)) return [];
  const table = findBalancedTable(block, marker);
  const values = [];
  const pattern = /"(?:\\.|[^"\\])*"/g;
  let match;
  while ((match = pattern.exec(table))) values.push(decodeLuaString(match[0]));
  return values;
}

function readMasteryEffects(block) {
  const marker = '["masteryEffects"]';
  if (!block.includes(marker)) return [];
  const table = findBalancedTable(block, marker);
  const matches = [...table.matchAll(/\["effect"\]\s*=\s*(\d+)/g)];
  return matches.map((match, index) => {
    const end = matches[index + 1]?.index ?? table.length;
    const segment = table.slice(match.index, end);
    return { effect: Number(match[1]), stats: readStringArray(segment, 'stats') };
  });
}

function parseNodes(source) {
  const topLevelNodes = source.match(/^ {4}\["nodes"\]\s*=\s*\{/m);
  if (!topLevelNodes || topLevelNodes.index == null) throw new Error('Missing top-level nodes table');
  const table = findBalancedTable(source.slice(topLevelNodes.index), '["nodes"]');
  const nodes = {};
  const entryPattern = /\[(\d+)\]\s*=\s*\{/g;
  let match;
  while ((match = entryPattern.exec(table))) {
    const id = match[1];
    const block = findBalancedTable(table.slice(match.index), `[${id}]`);
    const name = readStringField(block, 'name');
    if (!name) continue;
    const node = { name, stats: readStringArray(block, 'stats') };
    const masteryEffects = readMasteryEffects(block);
    if (masteryEffects.length) node.masteryEffects = masteryEffects;
    const ascendancyName = readStringField(block, 'ascendancyName');
    if (ascendancyName) node.ascendancyName = ascendancyName;
    for (const flag of ['isNotable', 'isKeystone', 'isMastery', 'isJewelSocket', 'isBloodline']) {
      if (new RegExp(`\\["${flag}"\\]\\s*=\\s*true`).test(block)) node[flag] = true;
    }
    nodes[id] = node;
  }
  return nodes;
}

function mergeKoreanNodes(nodes, koreanTree) {
  const koreanNodes = koreanTree?.nodes || {};
  let nameMatches = 0;
  let statMatches = 0;
  let fallbackMatches = 0;
  let masteryEffectMatches = 0;
  for (const [id, node] of Object.entries(nodes)) {
    const koreanNode = koreanNodes[id];
    if (!koreanNode) {
      const fallback = KOREAN_HIDDEN_PASSIVE_FALLBACKS[id];
      if (fallback) {
        node.koName = fallback.name;
        node.koStats = fallback.stats;
        nameMatches += 1;
        statMatches += 1;
        fallbackMatches += 1;
      }
      continue;
    }
    if (koreanNode.name) {
      node.koName = koreanNode.name;
      nameMatches += 1;
    }
    if (Array.isArray(koreanNode.stats)) {
      node.koStats = koreanNode.stats;
      statMatches += 1;
    }
    if (Array.isArray(koreanNode.masteryEffects)) {
      const effects = new Map((node.masteryEffects || []).map(effect => [String(effect.effect), effect]));
      for (const koreanEffect of koreanNode.masteryEffects) {
        const key = String(koreanEffect.effect);
        let effect = effects.get(key);
        if (!effect) {
          effect = { effect: Number(koreanEffect.effect), stats: [] };
          effects.set(key, effect);
        }
        effect.koStats = Array.isArray(koreanEffect.stats) ? koreanEffect.stats : [];
        if (Array.isArray(koreanEffect.reminderText)) effect.koReminderText = koreanEffect.reminderText;
        masteryEffectMatches += 1;
      }
      node.masteryEffects = Array.from(effects.values());
    }
  }
  return { nameMatches, statMatches, fallbackMatches, masteryEffectMatches, officialNodeCount: Object.keys(koreanNodes).length };
}

async function main() {
  const localSource = process.argv[2];
  const localKoreanSource = process.argv[3];
  const [source, koreanPage] = await Promise.all([
    localSource ? fs.readFileSync(path.resolve(localSource), 'utf8') : download(SOURCE_URL),
    localKoreanSource ? fs.readFileSync(path.resolve(localKoreanSource), 'utf8') : download(KOREAN_TREE_URL)
  ]);
  const nodes = parseNodes(source);
  if (Object.keys(nodes).length < 1000) throw new Error(`Parsed too few nodes: ${Object.keys(nodes).length}`);
  const koreanTree = extractAssignedJson(koreanPage, 'passiveSkillTreeData');
  const translation = mergeKoreanNodes(nodes, koreanTree);
  if (translation.nameMatches < 3000) throw new Error(`Matched too few Korean node names: ${translation.nameMatches}`);
  const payload = {
    version: 1,
    game: 'poe1',
    treeVersion: VERSION.replace('_', '.'),
    source: {
      repository: 'PathOfBuildingCommunity/PathOfBuilding',
      branch: 'dev',
      path: `src/TreeData/${VERSION}/tree.lua`,
      rawUrl: SOURCE_URL,
      koreanTreeUrl: KOREAN_TREE_URL,
      hiddenPassiveSourceUrl: KOREAN_HIDDEN_PASSIVE_SOURCE_URL,
      koreanNameMatches: translation.nameMatches,
      koreanStatMatches: translation.statMatches,
      koreanFallbackMatches: translation.fallbackMatches,
      koreanMasteryEffectMatches: translation.masteryEffectMatches,
      officialKoreanNodeCount: translation.officialNodeCount
    },
    nodes
  };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(payload)}\n`);
  process.stdout.write(`Wrote ${Object.keys(nodes).length} nodes (${translation.nameMatches} Korean names, ${translation.statMatches} Korean stats, ${translation.masteryEffectMatches} mastery effects) to ${OUTPUT}\n`);
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
