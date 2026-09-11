const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const keepAlive = setInterval(() => {}, 1_000);

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const output = process.env.HOMEPAGE_QA_OUTPUT || path.join(os.tmpdir(), "lutz-homepage-collage-qa");
  fs.mkdirSync(output, { recursive: true });
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4179, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const width of [375, 430, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const errors = [];
      page.on("console", message => { if (message.type() === "error" && !message.text().includes("Failed to load resource")) errors.push(message.text()); });
      page.on("pageerror", error => errors.push(error.message));
      page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto("http://127.0.0.1:4179/");
      await page.getByRole("heading", { level: 1, name: /Premium ice cream/i }).waitFor();
      const collage = page.getByLabel("Lutz Scoops treats and community");
      const baseImage = page.getByRole("img", { name: "Lutz Scoops ice cream, coffee, desserts, families and friends" });
      assert.match(await baseImage.getAttribute("src"), /homepage-lifestyle-collage-v2\.png/);
      assert.ok(await baseImage.evaluate(element => element.complete && element.naturalWidth > 0));
      if (width >= 1024) {
        await collage.waitFor();
        const expected = [
          ["Five branded Lutz Scoops cups with five different visible ice cream flavors", "five-flavor-cups.png"],
          ["A family of four enjoying ice cream together", "family-south-asian.png"],
          ["A boy drinking a whipped cream and chocolate drizzle milkshake", "milkshake.png"],
          ["Coffee pouring into a branded Lutz Scoops mug", "coffee.png"],
          ["Two friends enjoying Lutz Scoops drinks", "friends.png"],
          ["Lutz Scoops wall sign", "lutz-scoops-sign.png"],
          ["Good ice cream, good coffee, good vibes neon sign", "good-vibes-neon.png"],
        ];
        for (const [alt, filename] of expected) {
          const image = collage.getByRole("img", { name: alt });
          await image.waitFor();
          assert.match(await image.getAttribute("src"), new RegExp(filename.replace(".", "\\.")));
          assert.ok(await image.evaluate(element => element.complete && element.naturalWidth > 0));
        }
      } else {
        assert.equal(await collage.isVisible(), false);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: false });
      await page.close();
    }
    console.log(`Focused homepage collage QA passed; screenshots: ${output}`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().then(() => clearInterval(keepAlive), error => { clearInterval(keepAlive); console.error(error); process.exitCode = 1; });
