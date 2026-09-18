const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '..');
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const { resolveHighlightPrice } = await import(pathToFileURL(path.join(root, 'src/lib/public-menu.ts')).href);
  const { preview } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href);
  const server = process.env.HOMEPAGE_QA_URL ? null : await preview({ root, preview: { host: '127.0.0.1', port: 4179, strictPort: true } });
  const base = process.env.HOMEPAGE_QA_URL || 'http://127.0.0.1:4179';
  const output = process.env.HOMEPAGE_QA_OUTPUT || path.join(os.tmpdir(), 'lutz-homepage-revision-qa');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const api = 'https://os.lutzscoops.us/api/public/menu';
  const keys = ['iceCream', 'milkshakes', 'sundaes', 'coffee', 'acaiBowls', 'floatsAndMore'];
  const names = ['Premium Ice Cream', 'Milkshakes', 'Sundaes', 'Coffee & Espresso', 'Açaí Bowls', 'Floats & More'];
  try {
    for (const width of [375, 430, 768, 1024, 1280, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      const feedPromise = page.waitForResponse(api);
      const flavorsPromise = page.waitForResponse('https://os.lutzscoops.us/api/public/flavors');
      await page.goto(base, { waitUntil: 'networkidle' });
      const feedResponse = await feedPromise;
      assert.equal(feedResponse.status(), 200);
      const feed = await feedResponse.json();
      const flavors = await flavorsPromise;
      assert.equal(flavors.status(), 200);
      await page.getByRole('heading', { level: 1, name: /Premium ice cream/i }).waitFor();
      const hero = page.locator('#top img');
      assert.ok(await hero.evaluate(e => e.complete && e.naturalWidth > 0));
      assert.equal(await hero.evaluate(e => getComputedStyle(e).objectFit), 'contain', 'entire baked-in flavor label and cup must remain visible');
      const bounds = await hero.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
      const parent = await hero.locator('..').boundingBox();
      assert.ok(bounds.y >= parent.y + 15 && bounds.y + bounds.height <= parent.y + parent.height - 15, 'hero has vertical breathing room');
      await page.locator('#top').screenshot({ path: path.join(output, `hero-${width}.png`) });
      const menu = page.locator('#menu');
      await menu.scrollIntoViewIfNeeded();
      const cards = menu.locator('a');
      assert.deepEqual(await cards.locator('h3').allTextContents(), names);
      for (const img of await cards.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(e => e.decode());
      }
      assert.equal(await cards.locator('img').count(), 6);
      const brownieImage = cards.nth(2).locator('img');
      assert.match(await brownieImage.getAttribute('src'), /brownie-sundae-v2.webp$/);
      assert.match(await brownieImage.getAttribute('alt'), /Three-scoop Brownie Sundae with three cherries/);
      assert.deepEqual(await brownieImage.evaluate(e => [e.naturalWidth, e.naturalHeight, getComputedStyle(e).objectFit]), [800, 600, 'contain']);
      const expected = keys.map(key => resolveHighlightPrice(feed.items, key));
      assert.deepEqual(await cards.evaluateAll(es => es.map(e => e.querySelector('[data-category-price]')?.getAttribute('data-category-price') || null)), expected);
      const brownie = feed.items.find(item => item.name === 'Brownie Sundae');
      if (brownie) {
        const { getStartingPrice, formatMenuPrice } = await import(pathToFileURL(path.join(root, 'src/lib/public-menu.ts')).href);
        assert.equal(await cards.nth(2).locator('[data-pictured-price]').innerText(), formatMenuPrice(String(getStartingPrice(brownie))));
        assert.equal(await cards.nth(2).locator('[data-pictured-price]').innerText(), '$10.50');
        assert.match(await cards.nth(2).innerText(), /Pictured: Brownie Sundae/);
        assert.match(await cards.nth(2).innerText(), /Sundaes from \$/i);
      }
      const rects = await cards.evaluateAll(es => es.map(e => ({ x: e.offsetLeft, y: e.offsetTop })));
      if (width >= 1024) { assert.equal(new Set(rects.map(r => r.x)).size, 3); assert.equal(new Set(rects.map(r => r.y)).size, 2); }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await cards.evaluateAll(es => es.some(e => e.scrollWidth > e.clientWidth + 1)), false);
      assert.deepEqual(errors, []);
      await menu.screenshot({ style: '#root > div > header { visibility: hidden; }', path: path.join(output, `menu-${width}.png`) });
      console.log(JSON.stringify({ width, menuItems: feed.count, flavors: (await flavors.json()).count, prices: expected, result: 'PASS' }));
      await page.close();
    }
    // API failure must not substitute fabricated prices, while images remain useful.
    for (const status of [200, 503]) {
      const page = await browser.newPage();
      await page.route(api, route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ generatedAt: new Date().toISOString(), count: 0, items: [] }) }));
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.doesNotMatch(await page.locator('#menu').innerText(), /\$\d/);
      assert.equal(await page.locator('[data-pictured-price]').count(), 0);
      assert.equal(await page.locator('#menu img').count(), 6);
      await page.close();
    }
    console.log(`Homepage visual revision QA passed. Screenshots: ${output}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
