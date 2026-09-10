const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const keepAlive = setInterval(() => {}, 1_000);

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const output = process.env.ABOUT_QA_OUTPUT || path.join(os.tmpdir(), "lutz-about-qa");
  fs.mkdirSync(output, { recursive: true });
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4179, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto("http://127.0.0.1:4179/about");
      await page.getByRole("heading", { name: "About Us", exact: true }).waitFor();
      assert.ok(await page.getByRole("heading", { name: /Locally operated.*Community focused/i }).isVisible());
      assert.equal(await page.getByRole("link", { name: /Visit Us/i }).getAttribute("href"), "/visit");
      assert.match(await page.getByRole("img", { name: /Lutz Scoops storefront/ }).getAttribute("src"), /homepage-storefront-standalone\.png/);
      assert.ok(await page.getByRole("main").getByText(/Northstar Hospitality Group LLC/).isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
      await page.screenshot({ path: path.join(output, `about-${width}.png`), fullPage: true });
      await page.close();
    }
    console.log(`About page browser QA passed; screenshots: ${output}`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().then(() => clearInterval(keepAlive), error => { clearInterval(keepAlive); console.error(error); process.exitCode = 1; });
