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
const menuHighlights = readFileSync(new URL("../src/sections/MenuHighlights.tsx", import.meta.url), "utf8");

assert.match(featured, /data\.featured\.filter/, "homepage must consume the featured collection");
assert.doesNotMatch(featured, /fallbackFlavors/, "homepage must not fabricate fallback flavors");
assert.doesNotMatch(featured, /featuredNote|supplier|inventory|sortOrder/, "internal fields must not be rendered");
assert.match(featured, /flavors\.length === 0/, "zero-featured response must have a deliberate empty state");
assert.match(featured, /loadState === "error"/, "API failures must have a graceful state");
assert.match(featured, /setAvailableCount\(data\.count\)/, "available content must use the authoritative feed count");
assert.doesNotMatch(featured, /\.sort\(/, "homepage must not reorder featured flavors");

assert.match(
  menu,
  /https:\/\/os\.lutzscoops\.us\/api\/public\/menu/,
  "homepage pricing must use the public menu API",
);

assert.match(
  menuHighlights,
  /fetchPublicMenu/,
  "Menu Highlights must fetch canonical public menu data",
);

assert.match(
  menuHighlights,
  /resolveHighlightPrice/,
  "Menu Highlights must derive prices from public menu data",
);

assert.match(
  menuHighlights,
  /priceLabel &&/,
  "missing pricing must degrade gracefully without fabricated fallback pricing",
);

assert.doesNotMatch(
  menuHighlights,
  /publicMenuHighlights/,
  "legacy hardcoded homepage pricing map must not remain",
);

const hero = readFileSync(new URL("../src/sections/Hero.tsx", import.meta.url), "utf8");
const collage = readFileSync(new URL("../src/components/HomepageCollage.tsx", import.meta.url), "utf8");
assert.match(hero, /HomepageCollage visible=\{slide\.id === "authentic-lifestyle-collage"\}/);
assert.match(hero, /homepage-lifestyle-collage-v2\.png/);
assert.match(hero, /lg:\[clip-path:inset\(0_46%_0_0\)\]/, "the superseded collage pixels must be clipped from presentation");
for (const asset of ["five-flavor-cups.png", "milkshake.png", "coffee.png", "friends.png", "lutz-scoops-sign.png", "good-vibes-neon.png"]) assert.ok(collage.includes(asset), asset);
for (const family of ["family-01.png", "family-02.png", "family-03.png", "family-04.png", "family-05.png"]) assert.ok(collage.includes(family), family);
assert.equal((collage.match(/family-0[1-5]\.png/g) ?? []).length, 5);
assert.match(collage, /approvedFamilyImages/);
assert.match(collage, /approvedFamilyImages\.length < 2/);
assert.match(collage, /HomepageCollage\(\{ visible \}/);
assert.match(collage, /FAMILY_ROTATION_MS = 8000/);
assert.match(collage, /AnimatePresence initial=\{false\}/);
assert.match(collage, /absolute inset-0 h-full w-full object-cover/);
assert.match(collage, /alt=""/);
assert.match(collage, /useReducedMotion/);
assert.doesNotMatch(collage, /sundae|cone/i);

console.log("Homepage integration assertions passed.");
