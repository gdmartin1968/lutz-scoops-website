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
    for (const width of [375, 430, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await page.goto("http://127.0.0.1:4178/visit");
      await page.getByRole("heading", { name: "Visit Us", exact: true }).waitFor();
      await page.getByRole("region", { name: "Interactive map showing Lutz Scoops" }).waitFor();
      await page.locator(".leaflet-marker-icon").waitFor();
      assert.ok(await page.locator(".leaflet-container").isVisible());
      assert.ok(await page.locator(".leaflet-popup-content").getByText("Lutz Scoops", { exact: true }).isVisible());
      assert.match(await page.locator(".leaflet-control-attribution").innerText(), /OpenStreetMap/);
      await page.locator(".leaflet-control-zoom-in").click();
      assert.equal(await page.getByRole("link", { name: "727-504-4722" }).getAttribute("href"), "tel:+17275044722");
      for (const link of await page.getByRole("link", { name: "Get Directions" }).all()) {
        assert.match(await link.getAttribute("href"), /19259\+North\+Dale\+Mabry\+Highway/);
      }
      assert.ok(await page.getByRole("img", { name: "Lutz Scoops storefront on North Dale Mabry Highway" }).isVisible());
      const storefront = page.getByRole("img", { name: "Lutz Scoops storefront on North Dale Mabry Highway" });
      const image = await storefront.evaluate(element => ({ src: element.getAttribute("src"), naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, width: element.clientWidth, height: element.clientHeight }));
      assert.equal(image.src, "/images/lifestyle/visit-storefront.png");
      assert.deepEqual([image.naturalWidth, image.naturalHeight], [1536, 1152]);
      assert.ok(Math.abs(image.width / image.height - 4 / 3) < 0.02, "storefront keeps its natural 4:3 ratio");
      assert.ok(await page.getByText('Look for the big “ICE CREAM” sign in the plaza — we\'re right underneath it.', { exact: true }).isVisible());
      assert.equal(await page.getByText(/Lutz Scoops sign along North Dale Mabry Highway/).count(), 0);
      assert.deepEqual(await page.locator("main dd").allTextContents(), ["12 PM – 9 PM", "12 PM – 10 PM", "12 PM – 8 PM"]);
      assert.ok(await page.getByRole("main").getByRole("link", { name: /Order Online/ }).isVisible());
      assert.ok(await page.getByRole("navigation", { name: "Explore before your visit" }).getByRole("link", { name: "Menu", exact: true }).isVisible());
      assert.ok(await page.getByRole("navigation", { name: "Explore before your visit" }).getByRole("link", { name: "Today's Flavors", exact: true }).isVisible());
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
