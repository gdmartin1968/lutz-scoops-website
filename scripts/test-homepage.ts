import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parsePublicFlavorFeed } from "../src/lib/public-flavors.ts";

const flavor = (id: number, name: string, featuredRank: number | null) => ({
  id,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  description: null,
  imageUrl: `https://os.lutzscoops.us/media/${id}.png`,
  featuredRank,
});

const one = flavor(1, "Rank One", 1);
const three = flavor(3, "Rank Three", 3);
const parsed = parsePublicFlavorFeed({
  count: 4,
  available: [one, flavor(2, "Available", null), three],
  featured: [one, three],
});

assert.ok(parsed, "valid public feed should parse");
assert.deepEqual(parsed.featured.map((item) => item.name), ["Rank One", "Rank Three"], "featured API order must be preserved");
assert.equal(parsed.count, 4, "authoritative available count must be preserved");
assert.deepEqual(parsePublicFlavorFeed({ count: 0, available: [], featured: [] }), { count: 0, available: [], featured: [] });
assert.equal(parsePublicFlavorFeed({ available: null, featured: [] }), null, "invalid API response must fail safely");

const featured = readFileSync(new URL("../src/sections/FeaturedFlavors.tsx", import.meta.url), "utf8");
const menu = readFileSync(new URL("../src/lib/public-menu.ts", import.meta.url), "utf8");

assert.match(featured, /data\.featured\.filter/, "homepage must consume the featured collection");
assert.doesNotMatch(featured, /fallbackFlavors/, "homepage must not fabricate fallback flavors");
assert.doesNotMatch(featured, /featuredNote|supplier|inventory|sortOrder/, "internal fields must not be rendered");
assert.match(featured, /flavors\.length === 0/, "zero-featured response must have a deliberate empty state");
assert.match(featured, /loadState === "error"/, "API failures must have a graceful state");
assert.match(featured, /setAvailableCount\(data\.count\)/, "available content must use the authoritative feed count");
assert.doesNotMatch(featured, /\.sort\(/, "homepage must not reorder featured flavors");

for (const price of ["$4.99", "$8.50", "$1.99", "$12.50", "$5.99"]) {
  assert.ok(menu.includes(price), `expected confirmed public price ${price}`);
}

console.log("Homepage integration assertions passed.");
