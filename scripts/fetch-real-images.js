const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join('public', 'demo-products');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const CATEGORIES = [
  'Category:Automobile_engines',
  'Category:Car_engines',
  'Category:Motor_vehicle_engines',
  'Category:Internal_combustion_engines',
  'Category:Automobile_parts',
  'Category:Automotive_engine_parts',
  'Category:Automobile_mechanics',
  'Category:Vehicle_engines',
];

const USER_AGENT = 'MockupGenerator/1.0 (demo images)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Commons API failed: ${res.status}`);
  return res.json();
}

async function fetchCategoryFiles(category) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=${encodeURIComponent(category)}&gcmtype=file&gcmlimit=500&prop=imageinfo&iiprop=url|mime`;
  const data = await fetchJson(api);
  const pages = data?.query?.pages || {};
  return Object.values(pages)
    .map((p) => p.imageinfo && p.imageinfo[0])
    .filter(Boolean)
    .filter((info) => info.mime === 'image/jpeg')
    .map((info) => info.url);
}

async function downloadWithRetry(url, filepath, maxRetries = 5) {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filepath, buf);
      return true;
    }
    if (res.status === 429 || res.status >= 500) {
      const wait = 1000 * Math.pow(2, attempt);
      await sleep(wait);
      continue;
    }
    return false;
  }
  return false;
}

async function main() {
  const existing = new Set(
    fs.readdirSync(OUT_DIR).filter((f) => f.startsWith('real-') && f.endsWith('.jpg'))
  );
  let index = existing.size;

  const urls = [];
  for (const cat of CATEGORIES) {
    try {
      const list = await fetchCategoryFiles(cat);
      urls.push(...list);
      await sleep(300);
    } catch (err) {
      process.stdout.write(`Skip category ${cat}: ${err.message}\n`);
    }
  }

  const uniqueUrls = Array.from(new Set(urls));

  for (const url of uniqueUrls) {
    if (index >= 79) break;
    const pad = String(index + 1).padStart(3, '0');
    const filename = `real-${pad}.jpg`;
    const filepath = path.join(OUT_DIR, filename);
    if (fs.existsSync(filepath)) {
      index += 1;
      continue;
    }

    const ok = await downloadWithRetry(url, filepath, 6);
    if (ok) {
      index += 1;
      process.stdout.write(`Downloaded ${filename}\n`);
      await sleep(400);
    } else {
      process.stdout.write(`Skipped (failed) ${url}\n`);
    }
  }

  if (index < 79) {
    throw new Error(`Downloaded only ${index} images`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
