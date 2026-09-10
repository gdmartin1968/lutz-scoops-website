const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const keepAlive = setInterval(() => {}, 1_000);

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const output = process.env.VISIT_QA_OUTPUT || path.join(os.tmpdir(), "lutz-visit-qa");
  fs.mkdirSync(output, { recursive: true });
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4178, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto("http://127.0.0.1:4178/visit");
      await page.getByRole("heading", { name: "Visit Us", exact: true }).waitFor();
      assert.equal(await page.getByRole("link", { name: "727-504-4722" }).getAttribute("href"), "tel:+17275044722");
      assert.match(await page.getByRole("link", { name: "Get Directions" }).getAttribute("href"), /19259\+North\+Dale\+Mabry\+Highway/);
      assert.match(await page.getByRole("link", { name: "View Lutz Scoops on Google Maps" }).getAttribute("href"), /19259\+North\+Dale\+Mabry\+Highway/);
      assert.deepEqual(await page.locator("main dd").allTextContents(), ["12 PM – 9 PM", "12 PM – 10 PM", "12 PM – 8 PM"]);
      assert.ok(await page.getByText("19259 North Dale Mabry Highway", { exact: true }).isVisible());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no horizontal overflow");
      await page.screenshot({ path: path.join(output, `visit-${width}.png`), fullPage: true });
      await page.close();
    }
    console.log(`Visit page browser QA passed; screenshots: ${output}`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().then(() => clearInterval(keepAlive), error => { clearInterval(keepAlive); console.error(error); process.exitCode = 1; });
