import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { business } from "../src/config/business.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const orderSources = [
  "src/components/Navbar.tsx",
  "src/sections/Hero.tsx",
  "src/sections/VisitSection.tsx",
  "src/pages/FlavorsPage.tsx",
  "src/pages/MenuPage.tsx",
  "src/pages/VisitPage.tsx",
];

assert.equal(business.orderInfoPath, "/order.html");
assert.equal(business.squareOrderingUrl, "https://lutzscoops.square.site/");
for (const file of orderSources) {
  const source = read(file);
  assert.ok(source.includes("business.orderInfoPath"), `${file} uses the internal ordering route`);
  assert.ok(!source.includes("lutzscoops.square.site"), `${file} does not bypass the ordering information page`);
}

const navbar = read("src/components/Navbar.tsx");
assert.equal(navbar.match(/business\.orderInfoPath/g)?.length, 2, "desktop and mobile ordering links are covered");
const orderPage = read("public/order.html");
assert.ok(orderPage.includes("Same Day Pickup Is Coming Soon."));
assert.ok(orderPage.includes('href="/order-survey.html"'));
const surveyPage = read("public/order-survey.html");
assert.ok(surveyPage.includes('id="survey"'));
assert.ok(surveyPage.includes("https://os.lutzscoops.us/api/public/order-survey"));
assert.ok(surveyPage.includes('id="deliveryContact"'));
assert.ok(surveyPage.includes("form.reportValidity()"));

console.log("Ordering flow assertions passed: internal CTAs, preserved info page, questionnaire, and separated Square URL.");
