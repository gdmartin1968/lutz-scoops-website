import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  formatMenuPrice,
  groupPublicMenuItems,
  isModifierVariant,
  menuItemAnchor,
  menuSectionId,
} from "../src/lib/public-menu.ts";
import { fixtures, item, variant } from "./public-menu-fixtures.ts";

const groups = groupPublicMenuItems(fixtures);
assert.deepEqual(groups.map((group) => group.category), ["Scoops", "Milkshakes", "Sundaes", "Coffee & Cocoa", "Bowls", "Shakes & Floats", "Floats & Ice Cream Sodas"]);
assert.deepEqual(groups.find((group) => group.category === "Sundaes")?.items.map((entry) => entry.name), [
  "Hot Fudge Sundae", "Oreo Cookie Sundae", "Coconut Almond Joy Sundae", "Banana Split",
]);
assert.deepEqual(fixtures[1].variants.map((entry) => entry.sizeLabel), ["16 oz", "20 oz", "Add Malt Powder", "Vegan Milkshake Upgrade"]);
assert.equal(menuSectionId("Shakes & Floats"), "shakes-and-floats");
assert.equal(menuSectionId("Coffee"), "coffee");
assert.equal(menuItemAnchor("Milkshakes"), "milkshakes");
assert.equal(menuItemAnchor("Floats & Ice Cream Sodas"), "floats");
assert.equal(menuItemAnchor("Specialty Drink"), null);
assert.equal(formatMenuPrice("7.99"), "$7.99");
assert.equal(formatMenuPrice("$1.9"), "$1.90");
assert.equal(formatMenuPrice("invalid"), null);
for (const label of ["Add Malt Powder", "Vegan Milkshake Upgrade", "Add Flavor Shot", "Strawberry Add-On"]) {
  assert.equal(isModifierVariant(variant(label, "1.00")), true, label);
}
assert.equal(isModifierVariant(variant("Double Espresso Shot", "1.99")), false);
assert.deepEqual(groupPublicMenuItems([]), []);
assert.deepEqual(groupPublicMenuItems([
  item("First", null, []), item("Second", null, []), item("Third", "Later", []),
]).map((group) => group.items.map((entry) => entry.name)), [["First", "Second"], ["Third"]]);

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const app = read("src/App.tsx");
const page = read("src/pages/MenuPage.tsx");
const nav = read("src/components/Navbar.tsx");
const highlights = read("src/sections/MenuHighlights.tsx");
assert.match(app, /path === "\/menu" \? <MenuPage/);
assert.match(nav, /\{ label: "Menu", href: "\/menu" \}/);
assert.match(page, /fetchPublicMenu/);
assert.match(page, /groupPublicMenuItems/);
assert.match(page, /isModifierVariant/);
assert.match(page, /state.status === "loading"/);
assert.match(page, /state.status === "error"/);
assert.match(page, /groups.length === 0/);
assert.match(page, /Add-ons &amp; upgrades/);
assert.doesNotMatch(page, /From \$4\.99|From \$8\.50|From \$12\.50|From \$7\.99/);
for (const href of ["/menu#scoops", "/menu#milkshakes", "/menu#sundaes", "/menu#coffee", "/menu#bowls", "/menu#floats"]) {
  assert.ok(highlights.includes(`href: "${href}"`), href);
}
assert.equal((highlights.match(/href: "\/menu#/g) ?? []).length, 6);
assert.ok(page.includes("business.orderOnlineUrl"));

console.log("Menu page tests passed: route, ordered grouping, ordered variants, modifiers, empty/error states, anchors, live prices, and CTA.");
