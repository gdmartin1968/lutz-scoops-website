import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const app = read("src/App.tsx");
const page = read("src/pages/AboutPage.tsx");
const nav = read("src/components/Navbar.tsx");
const homeAbout = read("src/sections/AboutSection.tsx");
const experience = read("src/sections/ExperienceStrip.tsx");

assert.match(app, /path === "\/about" \? <AboutPage/);
assert.match(nav, /\{ label: "About", href: "\/about" \}/);
for (const href of ["/flavors", "/menu", "/visit"]) assert.ok(nav.includes(`href: "${href}"`), href);
assert.match(page, />About Us</);
assert.match(page, /Locally operated\.<br \/>Community focused\./);
assert.match(page, /Northstar Hospitality Group LLC/);
assert.match(page, /href="\/visit"/);
assert.match(page, /homepage-storefront-standalone\.png/);
assert.ok(existsSync(new URL("../public/images/lifestyle/homepage-storefront-standalone.png", import.meta.url)));
assert.doesNotMatch(page, /\$\d|price|founded|since \d|award-winning|locally sourced|from scratch/i);
assert.doesNotMatch(page + homeAbout + experience, /family-owned|family-operated|Paradise To Go|previous owner|founder/i);

console.log("About page tests passed: route, navigation, authentic image, ownership, positioning, CTA, and factual-copy guardrails.");
