const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const root = path.resolve(__dirname, '..');
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const { communityPhotos, COMMUNITY_ROTATION_MS, COMMUNITY_FADE_MS } = await import(pathToFileURL(path.join(root, 'src/config/communityPhotos.ts')).href);
  const { preview } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href);
  const server = process.env.ABOUT_QA_URL ? null : await preview({ root, preview: { host: '127.0.0.1', port: 4179, strictPort: true } });
  const base = process.env.ABOUT_QA_URL || 'http://127.0.0.1:4179';
  const output = process.env.ABOUT_QA_OUTPUT || path.join(os.tmpdir(), 'lutz-community-rotation-qa');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    assert.equal(communityPhotos.length, 5);
    assert.match(communityPhotos[0].src, /family-03.png$/);
    assert.equal(COMMUNITY_ROTATION_MS, 8000);
    assert.equal(COMMUNITY_FADE_MS, 600);
    async function check(route, width, reducedMotion) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const panel = page.locator('[data-community-photos]');
      assert.equal(await panel.count(), 1);
      await panel.scrollIntoViewIfNeeded();
      for (const img of await panel.locator('img').all()) await img.evaluate(e => e.decode());
      assert.deepEqual(await panel.locator('img').evaluateAll(es => es.map(e => e.getAttribute('src'))), communityPhotos.map(p => p.src));
      const active = panel.locator('[data-community-active="true"]');
      assert.equal(await active.getAttribute('src'), communityPhotos[0].src);
      const measure = () => panel.evaluate(e => ({ width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height, top: e.getBoundingClientRect().top + scrollY, bodyHeight: document.body.scrollHeight }));
      const initial = await measure();
      assert.ok(Math.abs(initial.width / initial.height - 4 / 3) < 0.01);
      if (route === '/about') {
        assert.equal(await page.getByRole('main').getByRole('link', { name: /Visit Us/i }).getAttribute('href'), '/visit');
        for (const copy of [/Stacee and KC Campbell/, /June 27, 2026/, /JT and Daniel/, /official taste tester/, /Through different owners and different chapters/]) assert.equal(await page.getByRole('main').getByText(copy).count(), 1);
        assert.equal(await page.getByText(/Northstar Hospitality Group LLC/).count(), 0);
      }
      if (reducedMotion === 'reduce') {
        assert.equal(await active.evaluate(e => getComputedStyle(e).transitionDuration), '0s');
        await page.waitForTimeout(COMMUNITY_ROTATION_MS + 900);
        assert.equal(await active.getAttribute('src'), communityPhotos[0].src);
      } else {
        for (let i = 0; i <= communityPhotos.length; i++) {
          const expected = communityPhotos[i % communityPhotos.length];
          if (i > 0) {
            await page.waitForFunction(src => document.querySelector('[data-community-active="true"]')?.getAttribute('src') === src, expected.src, { timeout: COMMUNITY_ROTATION_MS + 2000 });
            const duration = await active.evaluate(e => getComputedStyle(e).transitionDuration);
            assert.equal(duration, '0.6s');
            // Inspect a real intermediate frame, not just the final image state.
            await page.waitForFunction(() => { const opacity = Number(getComputedStyle(document.querySelector('[data-community-active="true"]')).opacity); return opacity > 0 && opacity < 1; }, null, { timeout: 500 });
            await page.waitForTimeout(COMMUNITY_FADE_MS + 50);
          }
          assert.equal(await active.getAttribute('alt'), expected.alt);
          assert.equal(await panel.getByRole('img').count(), 1, 'only active photo is exposed to accessibility');
          assert.deepEqual(await measure(), initial, 'rotation must not shift layout');
          if (i < communityPhotos.length) await panel.screenshot({ path: path.join(output, `${route === '/' ? 'home' : 'about'}-${width}-${i}.png`) });
        }
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await panel.locator('img').evaluateAll(es => es.some(e => !e.complete || !e.naturalWidth)), false);
      assert.deepEqual(errors, []);
      console.log(`${route} ${width}px ${reducedMotion}: PASS`);
      await page.close();
    }
    for (const motion of ['no-preference', 'reduce']) {
      const checks = [375, 430, 768, 1440].flatMap(width => ['/', '/about'].map(route => ({ route, width })));
      for (let index = 0; index < checks.length; index += 4) {
        const results = await Promise.allSettled(checks.slice(index, index + 4).map(({ route, width }) => check(route, width, motion)));
        for (const result of results) if (result.status === 'rejected') throw result.reason;
      }
    }
    console.log(`Shared collection, full real-time cycle, crossfade, stable layout, reduced motion and About copy passed. Screenshots: ${output}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
