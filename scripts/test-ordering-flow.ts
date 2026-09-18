import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { business } from "../src/config/business.ts";
import { commerce, isCustomerUrl, ownedPickupDestination, providerDestination, validateProviders } from "../src/config/commerce.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const orderSources = [
  "src/components/Navbar.tsx",
  "src/sections/Hero.tsx",
  "src/sections/VisitSection.tsx",
  "src/pages/FlavorsPage.tsx",
  "src/pages/MenuPage.tsx",
  "src/pages/VisitPage.tsx",
];

assert.equal(business.orderInfoPath, "/order-online");
assert.equal(business.squareOrderingUrl, "https://lutzscoops.square.site/");
assert.equal(ownedPickupDestination("127.0.0.1"),"http://127.0.0.1:5000/order-ahead");
assert.equal(ownedPickupDestination("lutzscoops.us"),null,"Public launch requires explicit owned-order URL configuration.");
assert.equal(ownedPickupDestination("lutzscoops.us","https://os.lutzscoops.us/order-ahead"),"https://os.lutzscoops.us/order-ahead");
for (const file of orderSources) {
  const source = read(file);
  assert.ok(source.includes("business.orderInfoPath"), `${file} uses the internal ordering route`);
  assert.ok(!source.includes("lutzscoops.square.site"), `${file} does not bypass the ordering information page`);
}

const navbar = read("src/components/Navbar.tsx");
assert.equal(navbar.match(/business\.orderInfoPath/g)?.length, 2, "desktop and mobile ordering links are covered");
const orderPage = read("src/pages/OrderPage.tsx");
assert.match(read("src/App.tsx"), /path === "\/order-online" \? <OrderPage/);
assert.equal(commerce.providers[0].destinationUrl, "https://lutzscoops.square.site/");
assert.equal(commerce.providers[0].enabled, true);
assert.equal(commerce.providers[1].provider, "DoorDash");
assert.equal(commerce.providers[1].destinationUrl, null);
assert.equal(commerce.providers[1].enabled, false);
assert.match(orderPage, /commerce\.providers\.map/);
assert.match(read("public/order.html"), /url=\/order-online/);

console.log("Ordering flow assertions passed: internal gateway, Square pickup, disabled DoorDash delivery, and legacy redirect.");
assert.deepEqual(validateProviders(commerce.providers), [], "live provider configuration is valid");
assert.equal(commerce.providers[1].unavailableMessage, "Delivery ordering is not available yet.");
for (const destinationUrl of [null, "", "not a URL", "javascript:alert(1)", "http://example.test", "//example.test", "https://user:password@example.test", " https://example.test"]) {
  const invalid = { ...commerce.providers[0], destinationUrl };
  assert.equal(isCustomerUrl(destinationUrl), false);
  assert.equal(providerDestination(invalid), null);
  assert.equal(validateProviders([invalid]).length, 1);
}
assert.equal(providerDestination(commerce.providers[1]), null);
assert.deepEqual(validateProviders([commerce.providers[1]]), []);
assert.equal(providerDestination({ ...commerce.providers[1], destinationUrl: "https://delivery.example.test/order" }), null);

// Render the actual card with isolated configuration fixtures; never alter live configuration.
const { createRequire } = await import("node:module");
const requireCard = createRequire(new URL("../src/pages/OrderPage.tsx", import.meta.url));
const ts = requireCard("typescript");
const { createElement } = requireCard("react");
const { renderToStaticMarkup } = requireCard("react-dom/server");
const compiled = ts.transpileModule(orderPage, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const cardModule = { exports: {} as { OrderProviderCard?: unknown } };
new Function("require", "module", "exports", compiled)(requireCard, cardModule, cardModule.exports);
const renderCard = (option: import("../src/config/commerce.ts").CommerceProvider) => renderToStaticMarkup(createElement(cardModule.exports.OrderProviderCard, { option }));
const pickupHtml = renderCard(commerce.providers[0]);
assert.ok(pickupHtml.includes('href="https://lutzscoops.square.site/"'));
assert.ok(pickupHtml.includes('data-event="pickup_selected"'));
const unavailableHtml = renderCard(commerce.providers[1]);
assert.ok(unavailableHtml.includes("Delivery ordering is not available yet."));
assert.ok(unavailableHtml.includes('disabled=""'));
assert.doesNotMatch(unavailableHtml, /href=/);
const enabledDelivery = { ...commerce.providers[1], enabled: true, destinationUrl: "https://delivery.example.test/order" };
assert.deepEqual(validateProviders([enabledDelivery]), []);
const deliveryHtml = renderCard(enabledDelivery);
assert.ok(deliveryHtml.includes('href="https://delivery.example.test/order"'));
assert.ok(deliveryHtml.includes('data-event="delivery_selected"'));
assert.doesNotMatch(deliveryHtml, /not available|disabled=/);
for (const destinationUrl of [null, "javascript:alert(1)"]) {
  const html = renderCard({ ...commerce.providers[0], destinationUrl });
  assert.doesNotMatch(html, /href=/);
  assert.ok(html.includes("Pickup is temporarily unavailable."));
}
assert.ok(read("src/sections/Footer.tsx").includes("business.orderInfoPath"));
assert.doesNotMatch(orderPage, /square\.site|doordash\.com/);
assert.doesNotMatch(read("public/order.html"), /Same Day Pickup Is Coming Soon/);
console.log("Provider safety and actual card rendering passed: enabled/disabled/missing URLs, delivery activation, independent provider seam.");
