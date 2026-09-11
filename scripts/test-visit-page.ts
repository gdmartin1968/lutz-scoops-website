import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { business } from "../src/config/business.ts";

assert.deepEqual(business.address, { street: "19259 North Dale Mabry Highway", cityStateZip: "Lutz, FL 33548" });
assert.deepEqual(business.phone, { display: "727-504-4722", href: "tel:+17275044722" });
assert.deepEqual(business.location, { latitude: 28.157359, longitude: -82.480821, mapZoom: 17 });
assert.deepEqual(business.hours, [
  { days: "Monday – Thursday", time: "12 PM – 9 PM" },
  { days: "Friday – Saturday", time: "12 PM – 10 PM" },
  { days: "Sunday", time: "12 PM – 8 PM" },
]);
assert.equal(business.orderOnlineUrl, "https://lutzscoops.square.site/");
assert.match(business.directionsUrl, /19259\+North\+Dale\+Mabry\+Highway/);

const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const app = read("src/App.tsx");
const page = read("src/pages/VisitPage.tsx");
const map = read("src/components/InteractiveVisitMap.tsx");
const nav = read("src/components/Navbar.tsx");
const homeVisit = read("src/sections/VisitSection.tsx");
assert.match(app, /path === "\/visit" \? <VisitPage/);
assert.match(nav, /\{ label: "Visit", href: "\/visit" \}/);
for (const path of ["/flavors", "/menu"]) assert.ok(nav.includes(`href: "${path}"`));
for (const token of ["business.address.street", "business.address.cityStateZip", "business.phone.href", "business.hours", "business.directionsUrl", "business.orderOnlineUrl"]) assert.ok(page.includes(token), token);
for (const token of ["L.map", "tile.openstreetmap.org", "OpenStreetMap", "L.marker", "business.location", "business.directionsUrl"]) assert.ok(map.includes(token), token);
assert.match(page, /InteractiveVisitMap/);
assert.match(page, /visit-storefront\.png/);
assert.match(page, /Look for the big “ICE CREAM” sign in the plaza — we&apos;re right underneath it/);
assert.doesNotMatch(page, /background-image:linear-gradient|View Lutz Scoops on Google Maps|Lutz Scoops sign along North Dale Mabry Highway/);
for (const href of ["/menu", "/flavors"]) assert.ok(page.includes(`href="${href}"`));
for (const token of ["business.address.street", "business.phone.href", "business.hours", "business.directionsUrl", "business.orderOnlineUrl"]) assert.ok(homeVisit.includes(token), token);
assert.doesNotMatch(page + homeVisit, /2637 Tarragona|12 PM – 9 PM.*Sunday/);

console.log("Visit page tests passed: route, verified business data, hours, contact links, directions, ordering, and centralized reuse.");
