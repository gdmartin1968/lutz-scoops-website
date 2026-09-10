const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const keepAlive = setInterval(() => {}, 1_000);

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const { fixtures } = await import(pathToFileURL(path.join(__dirname, "public-menu-fixtures.ts")).href);
  const output = process.env.MENU_PAGE_QA_OUTPUT || path.join(os.tmpdir(), "lutz-menu-page-qa");
  fs.mkdirSync(output, { recursive: true });
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4177, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const api = "https://os.lutzscoops.us/api/public/menu";

  try {
    for (const state of ["populated", "empty", "error"]) {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.route(api, async route => {
          await new Promise(resolve => setTimeout(resolve, 80));
          await route.fulfill({ status: state === "error" ? 503 : 200, contentType: "application/json", body: JSON.stringify({ generatedAt: "2026-09-10T12:00:00Z", count: state === "populated" ? fixtures.length : 0, items: state === "populated" ? fixtures : [] }) });
        });
        await page.goto("http://127.0.0.1:4177/menu");
        await page.getByRole("heading", { name: "Our Menu", exact: true }).waitFor();
        await page.getByRole("status").waitFor();
        if (state === "populated") {
          await page.getByRole("heading", { name: "Scoops", exact: true, level: 2 }).waitFor();
          assert.deepEqual(await page.locator("main section[id] > div:first-child h2").allTextContents(), ["Scoops", "Milkshakes", "Sundaes", "Coffee & Cocoa", "Bowls", "Shakes & Floats", "Floats & Ice Cream Sodas"]);
          assert.deepEqual(await page.locator("#milkshakes li span:first-child").allTextContents(), ["16 oz", "20 oz", "Add Malt Powder", "Vegan Milkshake Upgrade"]);
          assert.equal(await page.locator("#milkshakes h4", { hasText: "Add-ons & upgrades" }).count(), 1);
          assert.equal(await page.getByRole("main").getByRole("link", { name: "Order Online", exact: true }).getAttribute("href"), "https://lutzscoops.square.site/");
        } else if (state === "empty") {
          await page.getByRole("heading", { name: "Our menu is being refreshed" }).waitFor();
          assert.equal(await page.locator("article").count(), 0);
        } else {
          await page.getByRole("heading", { name: "Our menu is taking a moment" }).waitFor();
          assert.equal(await page.getByRole("link", { name: "Call 727-504-4722" }).count(), 1);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
        await page.screenshot({ path: path.join(output, `${state}-${width}.png`), fullPage: true });
        await page.close();
      }
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "reduce" });
    await page.route(api, route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ generatedAt: "2026-09-10T12:00:00Z", count: fixtures.length, items: fixtures }) }));
    await page.goto("http://127.0.0.1:4177/menu#floats");
    await page.locator("#floats").waitFor();
    await page.waitForFunction(() => {
      const bounds = document.querySelector("#floats").getBoundingClientRect();
      return scrollY > 0 && bounds.top < innerHeight && bounds.bottom > 0;
    });
    await page.getByRole("button", { name: "Open navigation" }).click();
    assert.equal(await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Menu", exact: true }).getAttribute("href"), "/menu");
    await page.close();
    console.log(`Menu page browser QA passed; screenshots: ${output}`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().then(
  () => clearInterval(keepAlive),
  error => { clearInterval(keepAlive); console.error(error); process.exitCode = 1; },
);
