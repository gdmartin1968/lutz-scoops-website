const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const keepAlive = setInterval(() => {}, 1_000);

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4180, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const routes = [
    ["/", /Premium ice cream/i],
    ["/flavors", /Today’s Flavors/i],
    ["/menu", /Our Menu/i],
    ["/about", /About Us/i],
    ["/visit", /Visit Us/i],
  ];

  try {
    for (const width of [375, 430, 768, 1440]) {
      for (const [route, heading] of routes) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        await page.goto(`http://127.0.0.1:4180${route}`);
        await page.getByRole("heading", { name: heading }).first().waitFor();
        assert.equal(await page.locator("#root > div > header").count(), 1, `${route} has one shared header`);
        assert.equal(await page.locator("main").count(), 1, `${route} has one main region`);
        assert.equal(await page.locator("footer").count(), 1, `${route} has one shared footer`);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} has no horizontal overflow at ${width}px`);
        assert.equal(await page.locator("a, button").evaluateAll(elements => elements.some(element => element.scrollWidth > element.clientWidth + 1)), false, `${route} has no clipped controls at ${width}px`);
        await page.close();
      }
    }
    console.log("Whole-site responsive fidelity QA passed at 375, 430, 768 and 1440px.");
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().then(
  () => clearInterval(keepAlive),
  error => { clearInterval(keepAlive); console.error(error); process.exitCode = 1; },
);
