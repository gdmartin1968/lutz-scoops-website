import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { displayedDietaryCodes, loadPublicFlavorFeed, parsePublicFlavorFeed } from "../src/lib/public-flavors.ts";

const first = { id: 1234567, name: "Available first", slug: null, description: null, imageUrl: null, featuredRank: null,
  dietaryMetadata: { GF: { value: "yes", reviewed: true }, DF: { value: "no", reviewed: true }, V: { value: "unknown", reviewed: false } },
  showAskStaff: true, containsAllergens: ["milk"] };
const second = { ...first, id: 2, name: "Available second", featuredRank: 1 };
const fixture = { count: 7, available: [first, second], featured: [second], flavors: [{ ...first, name: "Compatibility only" }] };
const parsed = parsePublicFlavorFeed(fixture);
assert.ok(parsed);
assert.deepEqual(parsed.available.map(f => f.name), ["Available first", "Available second"]);
assert.equal(parsed.count, 7, "use API count, not featured length or a locally inferred count");
assert.deepEqual(displayedDietaryCodes(parsed.available[0].dietaryMetadata), ["GF"]);
assert.deepEqual(displayedDietaryCodes(null), []);
assert.deepEqual(parsePublicFlavorFeed({ count: 0, available: [], featured: [] })?.available, []);
assert.equal(parsePublicFlavorFeed({ ...fixture, available: "invalid" }), null);
assert.equal(parsePublicFlavorFeed({ ...fixture, count: -1 }), null);
assert.equal(parsePublicFlavorFeed({ ...fixture, available: [{ ...first, containsAllergens: [123] }] }), null);

const originalFetch = globalThis.fetch;
let calls = 0;
try {
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, "https://os.lutzscoops.us/api/public/flavors");
    assert.equal(options?.cache, "no-store");
    return new Response(JSON.stringify(fixture), { status: 200 });
  };
  assert.deepEqual((await loadPublicFlavorFeed()).available.map(f => f.name), ["Available first", "Available second"]);
  assert.equal(calls, 1, "one request per load");
  globalThis.fetch = async () => new Response(JSON.stringify({count:0, available:[], featured:[]}));
  assert.equal((await loadPublicFlavorFeed()).count, 0);
  globalThis.fetch = async () => new Response("", {status:503});
  await assert.rejects(loadPublicFlavorFeed);
  globalThis.fetch = async () => { throw new TypeError("network unavailable"); };
  await assert.rejects(loadPublicFlavorFeed);
  globalThis.fetch = async () => new Response('{"invalid":true}');
  await assert.rejects(loadPublicFlavorFeed);
} finally { globalThis.fetch = originalFetch; }

const read = (file: string) => readFileSync(new URL("../" + file, import.meta.url), "utf8");
const page = read("src/pages/FlavorsPage.tsx");
assert.match(read("src/App.tsx"), /=== "\/flavors" \? <FlavorsPage/);
assert.match(page, /state.feed.available.map/);
assert.doesNotMatch(page, /\.featured|\.sort\(|featuredRank|>\{flavor.id\}|digitalAssetPath|generatedAt|supplier/);
assert.match(page, /flavor.imageUrl\?\.trim\(\) && !failedImage/);
assert.match(page, /onError=\{\(\) => setFailedImage\(true\)\}/);
assert.match(page, /flavor.description\?\.trim\(\)/);
assert.match(page, /displayedDietaryCodes\(flavor.dietaryMetadata\)/);
assert.match(page, /flavor.showAskStaff/);
assert.match(page, /flavor.containsAllergens/);
assert.match(page, /state.status === "error"/);
assert.match(page, /state.feed.available.length === 0/);
assert.match(page, /state.feed.count/);
assert.match(page, /document.title = "Today’s Flavors \| Lutz Scoops"/);
assert.match(page, /meta\[name="description"\]/);
for (const file of ["src/sections/Hero.tsx", "src/sections/FeaturedFlavors.tsx", "public/order.html"])
  assert.ok(read(file).includes('href="/flavors"'), file);
const nav = read("src/components/Navbar.tsx");
assert.ok(nav.includes('{ label: "Flavors", href: "/flavors" }'));
assert.equal(nav.match(/links.map/g)?.length, 2, "desktop and mobile share canonical links");
for (const file of ["src/pages/FlavorsPage.tsx", "src/components/Navbar.tsx", "src/sections/VisitSection.tsx"])
  assert.ok(read(file).includes("business.orderOnlineUrl"), file);
assert.ok(read("src/sections/Hero.tsx").includes('href="https://lutzscoops.square.site/"'));
console.log("Flavors integration assertions passed: collection, count/order, dietary, empty/error, request, routing, images, SEO and navigation.");
