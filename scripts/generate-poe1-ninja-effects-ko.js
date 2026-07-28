'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const LEAGUE = process.argv.slice(2).find(arg => !arg.startsWith('--')) || 'Standard';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'poe1-item-effects-ko.json');
const CARD_OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'poe1-divination-cards.json');
const POEDB_BASE_URL = 'https://poedb.tw/kr/';
const CONCURRENCY = 8;
const EXCHANGE_TYPES = [
  'Currency', 'Fragment', 'Essence', 'Scarab', 'DivinationCard',
  'Oil', 'Fossil', 'Tattoo', 'AllflameEmber'
];
const CARD_STACK_OVERRIDES = {
  // Legacy card no longer has a matching PoEDB page, but remains in poe.ninja.
  'Time-Lost Relic': 10
};

function decodeHtml(value) {
  return String(value || '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&#10;', '\n')
    .replaceAll('&#13;', '');
}

function makePoedbSlug(name) {
  return String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeDescription(value) {
  return decodeHtml(value)
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
}

function htmlToInlineText(value) {
  return decodeHtml(String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function extractEssenceGuaranteedOptions(html, description) {
  const explicitMods = [...html.matchAll(/<div\s+class="explicitMod">([\s\S]*?)<\/div>/gi)]
    .map(match => htmlToInlineText(match[1]));
  const summaryIndex = explicitMods.findIndex(text => text === description || text.includes('아래 해당하는 속성 1개 보장'));
  if (summaryIndex < 0) return [];
  const options = [];
  for (const text of explicitMods.slice(summaryIndex + 1)) {
    if (!text) continue;
    if (/^[^:\n]{1,100}:\s*.+/.test(text)) {
      options.push(text);
      continue;
    }
    if (options.length) break;
  }
  return options;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'poe-trade-quick-search/effect-generator' },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

async function fetchEffect(item) {
  const slug = makePoedbSlug(item.name);
  if (!slug) return null;
  try {
    const response = await fetch(POEDB_BASE_URL + encodeURIComponent(slug), {
      headers: { 'user-agent': 'poe-trade-quick-search/effect-generator' },
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<meta\s+property="og:description"\s+content="([\s\S]*?)"\s*\/?>/i);
    const description = normalizeDescription(match?.[1]);
    const stackMatch = item.category === 'Cards'
      ? html.match(/<div\s+class=["']stackSize["']>\s*(\d+)\s*<\/div>/i)
      : null;
    const stackSize = Number(stackMatch?.[1]);
    if (!description && !(stackSize > 0)) return null;
    const essenceOptions = description && item.category === 'Essences'
      ? extractEssenceGuaranteedOptions(html, description)
      : [];
    return {
      name: item.name,
      description: [description, ...essenceOptions].filter(Boolean).join('\n'),
      stackSize: stackSize > 0 ? stackSize : null
    };
  } catch (_) {
    return null;
  }
}

async function mapConcurrent(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
      if ((index + 1) % 50 === 0) console.log(`${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, runWorker));
  return results;
}

async function main() {
  const responses = await Promise.all(EXCHANGE_TYPES.map(async type => {
    const url = `https://poe.ninja/poe1/api/economy/exchange/current/overview?league=${encodeURIComponent(LEAGUE)}&type=${encodeURIComponent(type)}&withItems=true`;
    return fetchJson(url);
  }));
  const itemMap = new Map();
  responses.forEach(data => {
    (data.items || data.core?.items || []).forEach(item => {
      if (item?.name && !itemMap.has(item.name)) itemMap.set(item.name, item);
    });
  });

  let existing = {};
  let existingCards = {};
  try {
    existing = JSON.parse(await fs.readFile(OUTPUT_PATH, 'utf8'));
  } catch (_) {}
  try {
    existingCards = JSON.parse(await fs.readFile(CARD_OUTPUT_PATH, 'utf8'));
  } catch (_) {}
  Object.entries(CARD_STACK_OVERRIDES).forEach(([name, stackSize]) => {
    existingCards[name] = { stackSize };
  });

  const pending = [...itemMap.values()].filter(item => {
    if (!existing[item.name]) return true;
    if (item.category === 'Essences' && !existing[item.name].split(/\r?\n/).some(line => line.includes(':'))) return true;
    return item.category === 'Cards' && !(existingCards[item.name]?.stackSize > 0);
  });
  const fetched = await mapConcurrent(pending, fetchEffect);
  fetched.filter(Boolean).forEach(result => {
    if (result.description) existing[result.name] = result.description;
    if (result.stackSize) existingCards[result.name] = { stackSize: result.stackSize };
  });
  const sorted = Object.fromEntries(Object.entries(existing).sort(([a], [b]) => a.localeCompare(b, 'en')));
  const sortedCards = Object.fromEntries(Object.entries(existingCards).sort(([a], [b]) => a.localeCompare(b, 'en')));
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  await fs.writeFile(CARD_OUTPUT_PATH, JSON.stringify(sortedCards, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({
    output: OUTPUT_PATH,
    cardOutput: CARD_OUTPUT_PATH,
    league: LEAGUE,
    ninjaItems: itemMap.size,
    requested: pending.length,
    effects: Object.keys(sorted).length,
    missing: [...itemMap.keys()].filter(name => !sorted[name]).length,
    divinationCards: Object.keys(sortedCards).length
  }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
