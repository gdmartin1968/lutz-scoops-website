const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const root = path.resolve(__dirname, "..");
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
  const { preview } = await import(pathToFileURL(path.join(root, "node_modules/vite/dist/node/index.js")).href);
  const server = await preview({ root, preview: { host: "127.0.0.1", port: 4181, strictPort: true } });
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    const origin = "http://127.0.0.1:4181";
    for (const route of ["/", "/flavors", "/menu", "/about", "/visit"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
      await page.goto(origin + route);
      const links = await page.getByRole("link", { name: "Order Online", exact: true }).all();
      assert.ok(links.length >= 1, `${route} has an Order Online link`);
      for (const link of links) assert.equal(await link.getAttribute("href"), "/order.html", `${route} CTA`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${route} overflow`);
      await page.close();
    }

    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktop.goto(origin);
    const popupPromise = desktop.waitForEvent("popup");
    await desktop.getByRole("banner").getByRole("link", { name: "Order Online", exact: true }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    assert.equal(new URL(popup.url()).pathname, "/order.html");
    await popup.getByRole("heading", { name: "Same Day Pickup Is Coming Soon." }).waitFor();
    await popup.close();
    await desktop.close();

    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobile.goto(origin);
    await mobile.getByRole("button", { name: "Open navigation" }).click();
    assert.equal(await mobile.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Order Online", exact: true }).getAttribute("href"), "/order.html");
    await mobile.close();

    const survey = await browser.newPage({ viewport: { width: 375, height: 812 } });
    let surveySubmitted = false;
    await survey.route("https://os.lutzscoops.us/api/public/order-survey", route => {
      const request = route.request();
      assert.equal(request.method(), "POST");
      const payload = request.postDataJSON();
      assert.deepEqual(payload.products, []);
      assert.deepEqual(payload.customization, []);
      assert.equal(payload.deliveryContactRequested, true);
      surveySubmitted = true;
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    });
    await survey.goto(origin + "/order-survey.html");
    await survey.getByRole("heading", { name: "Tell us how you want to order." }).waitFor();
    await survey.locator("#deliveryContact").check();
    await survey.locator("#deliveryFields").waitFor({ state: "visible" });
    assert.equal(await survey.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "survey overflow");
    await survey.locator("#survey").evaluate(form => {
      for (const input of form.querySelectorAll("input[required]")) {
        if (input.type === "radio") input.checked = true;
        else input.value = "33548";
      }
      form.requestSubmit();
    });
    await survey.getByRole("heading", { name: "You just helped us build this better." }).waitFor();
    assert.equal(surveySubmitted, true);
    await survey.close();
    console.log("Focused ordering browser QA passed: desktop, mobile, all public routes, info page, and questionnaire interaction.");
  } finally {
    await browser.close();
    await server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
