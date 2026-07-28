'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SOURCE_URL = 'https://poedb.tw/us/Flasks';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'poe1-flask-icons.json');

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function main() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`PoEDB HTTP ${response.status}`);
  const html = await response.text();
  const icons = {};
  const pattern = /<img[^>]+src="([^"]+\/2DItems\/Flasks\/[^"]+\.webp)"[^>]*>[\s\S]{0,900}?<a class="(?:whiteitem|magicitem|rareitem|uniqueitem)[^"]*"[^>]*>([^<]+)<\/a>/gi;
  for (const match of html.matchAll(pattern)) {
    const icon = decodeHtml(match[1]);
    const name = decodeHtml(match[2]);
    if (name && icon && !icons[name]) icons[name] = icon;
  }
  if (Object.keys(icons).length < 20) throw new Error(`플라스크 이미지가 ${Object.keys(icons).length}개만 추출되었습니다.`);
  const sorted = Object.fromEntries(Object.entries(icons).sort(([a], [b]) => a.localeCompare(b, 'en')));
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${Object.keys(sorted).length} flask icons to ${OUTPUT_PATH}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
