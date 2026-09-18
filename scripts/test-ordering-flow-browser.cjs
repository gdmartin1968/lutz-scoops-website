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

    for (const width of [375, 430, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 812 }, reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
      await page.goto(origin + "/order-online", { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: "How would you like to get your Lutz Scoops?", exact: true }).waitFor();
      const pickup = page.locator('[data-fulfillment="pickup"]');
      const owned = page.locator('[data-fulfillment="owned-pickup"]');
      const delivery = page.locator('[data-fulfillment="delivery"]');
      assert.equal(await owned.getByRole("link", { name: "Start a pickup order" }).getAttribute("href"), "http://127.0.0.1:5000/order-ahead");
      assert.ok((await owned.innerText()).includes("Pay at pickup"));
      const link = pickup.getByRole("link", { name: "Continue to pickup" });
      assert.equal(await link.getAttribute("href"), "https://lutzscoops.square.site/");
      assert.ok(await delivery.getByText("Delivery ordering is not available yet.", { exact: true }).isVisible());
      assert.equal(await delivery.getByRole("link").count(), 0);
      const disabled = delivery.getByRole("button", { name: "Delivery unavailable" });
      assert.equal(await disabled.isDisabled(), true);
      await disabled.evaluate(e => e.click());
      assert.equal(page.url(), origin + "/order-online");
      const rect = await disabled.boundingBox();
      assert.ok(rect.height >= 48);
      assert.ok(rect.height >= 48, "disabled delivery remains a usable touch target after the owned pickup entry");
      assert.equal(await link.evaluate(e => getComputedStyle(e).color), "rgb(255, 255, 255)", "pickup label contrasts with pink background");
      await link.focus();
      assert.equal(await link.evaluate(e => e.matches(":focus-visible")), true);
      assert.equal(await link.evaluate(e => getComputedStyle(e).outlineStyle), "solid");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: require("node:path").join(require("node:os").tmpdir(), "gateway-" + width + ".png"), fullPage: true });
      // Intercept only the external handoff; no order or merchant interaction occurs.
      await page.route("https://lutzscoops.square.site/", route => route.fulfill({ contentType: "text/html", body: "<h1>Verified pickup destination</h1>" }));
      await page.keyboard.press("Enter");
      await page.waitForURL("https://lutzscoops.square.site/");
      assert.deepEqual(errors, []);
      await page.close();
    }
    for (const route of ["/", "/flavors", "/menu", "/about", "/visit"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
      await page.goto(origin + route, { waitUntil: "networkidle" });
      const links = await page.getByRole("link", { name: "Order Online", exact: true }).all();
      assert.ok(links.length >= 1);
      for (const link of links) assert.equal(await link.getAttribute("href"), "/order-online", route + " CTA");
      assert.equal(await page.locator('a[href*="square.site"]').count(), 0);
      await page.getByRole("banner").getByRole("link", { name: "Order Online", exact: true }).click();
      await page.waitForURL(origin + "/order-online");
      await page.close();
    }
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobile.goto(origin);
    await mobile.getByRole("button", { name: "Open navigation" }).click();
    await mobile.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Order Online", exact: true }).click();
    await mobile.waitForURL(origin + "/order-online");
    await mobile.goto(origin + "/order.html");
    await mobile.waitForURL(origin + "/order-online");
    await mobile.getByRole("heading", { name: "How would you like to get your Lutz Scoops?" }).waitFor();
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
    console.log("Focused ordering browser QA passed: desktop, mobile, all public routes, gateway, disabled delivery, keyboard pickup handoff, legacy redirect, and questionnaire interaction.");
  } finally {
    await browser.close();
    await new Promise(resolve => server.httpServer.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
