# Homepage merchandising assets

Local visual-review revision, 2026-09-13. Existing assets audited first.
Reused unchanged: /images/flavors/ube.png, /images/lifestyle/hero-collage/milkshake.png, /images/lifestyle/hero-collage/coffee.png. These are existing branded repository assets; original photographic provenance is undocumented. Hero retains /images/flavors/mango-sorbet.png unchanged.

The three WebP assets are AI-generated representative food imagery, not photographs of actual shop servings. Built-in imagegen generated each; Sharp resized to 600 x 600 WebP quality 85. Original PNGs retained in Codex generated_images.

Menu basis: https://os.lutzscoops.us/api/public/menu, checked 2026-09-13. Brownie Sundae is published; visible brownie pieces, chocolate sauce, cream and cherry follow approved image direction. Bowls list fruit, granola and honey with strawberry supported. Floats & Ice Cream Sodas is published; root beer follows existing website copy. No prices embedded in assets.

## Exact generation prompts

### brownie-sundae.webp

Photorealistic premium ice cream shop product photograph, square composition for a small website merchandising card. A white shallow bowl with vanilla ice cream, FOUR substantial chunky cut brownie squares prominently exposed in the FOREGROUND and beside the scoops, clearly visible dark fudgy interiors and crackly crust, glossy chocolate sauce, whipped cream and one red cherry. Brownie pieces must be instantly unmistakable, never hidden below ice cream. Entire dessert and bowl inside frame with 10 percent margin. Warm cream seamless tabletop/background, soft natural studio light, appetizing realistic texture, no text, no logo, no props, no nuts or extra ingredients.

### acai-bowl.webp

Photorealistic premium ice cream shop product photograph, square composition for small website merchandising card. Three-quarter overhead view of a white bowl filled with thick deep purple acai, topped with sliced strawberries, golden granola and a delicate honey drizzle ONLY. Current menu supports acai bowls with fruit granola honey and strawberry. Do not add banana, blueberries, coconut, seeds, nut butter or other ingredients. Entire bowl inside frame with 10 percent margin. Warm cream seamless tabletop/background, soft natural studio light, appetizing realistic texture. No text, logos or props.

### root-beer-float.webp

Photorealistic premium ice cream shop product photograph, square composition for a small website merchandising card. A clear tall soda glass filled with dark root beer and two visible vanilla ice cream scoops floating on top, creamy fizzy foam at the boundary, recognizable classic root beer float. Whole glass and scoops inside frame with 10 percent margin. Warm cream seamless tabletop/background, soft natural studio light, realistic condensation and appetizing texture. No whipped cream, no extra toppings, no text, no logo, no props.


## Revision 2 — precise product composition (2026-09-13)

Active cards now reuse `/images/lifestyle/hero-collage/friends.png` for adults enjoying milkshakes (right-aligned square CSS crop). This is an existing repository asset; original capture/authenticity is not documented, so it is not independently verified store photography. Ube and root-beer-float assets remain unchanged. Previous brownie-sundae.webp and acai-bowl.webp remain preserved but are no longer used by these cards.

The açaí cup and affogato assets are AI-generated representative imagery using the built-in imagegen tool, not actual store photography. No branding was added. Sharp converted those full square images to 600 × 600 WebP, quality 85, without cropping. The clear 16 oz açaí cup follows the owner's revision request; ingredients follow the public menu and approved directions. The affogato serving glass is illustrative, not a verified store vessel. The Brownie Sundae asset from this revision was superseded by Gordon's approved three-scoop image on September 18, 2026.

Original generated PNG identifiers for the other two assets:
- acai-cup-v2: exec-6d2b884e-c2e4-4ff6-9251-abed05b9bd52.png
- affogato-espresso-v2: exec-26bb7378-7f0a-4a02-8501-9689eba53797.png

Price distinction: the Sundaes category minimum remains API-derived. A separate pictured Brownie Sundae price is resolved from that exact live menu item using existing price parsers; missing/invalid prices are omitted. Coffee retains its existing category resolver and is not repriced to the pictured affogato.

### Current Brownie Sundae asset — approved September 18, 2026

`brownie-sundae-v2.webp` is a faithful WebP derivative of Gordon's approved `Brownie Sundae.png`, supplied from his Downloads folder. Source SHA-256: `4b754fd81e345f9ab1321663ace918cd466e4124fb93058b5c3b3c3be3f5acb9`. Sharp cropped only the outer wood tabletop from the 1672 × 941 source (left 209, top 0, width 1254, height 941), then resized to 800 × 600 WebP at quality 90. The entire plate, three scoops, three cherries on top, whipped cream, and brownie base remain in frame. The homepage card displays the whole derivative without further cropping. It is a Gordon-approved merchandising image, not a claim of unverified store photography.

### Exact revision 2 prompts for the other assets

#### acai-cup-v2.webp

Photorealistic premium ice cream shop product photograph on warm cream seamless tabletop, square framing, soft natural studio light. ONE TALL SLENDER CLEAR DISPOSABLE PLASTIC 16 ounce milkshake-style cup with rolled plastic rim, gently tapered walls, height about 1.8 times top diameter. It is NOT a bowl, NOT a short wide container, NOT glass. Filled with dark purple thick acai puree visibly showing through transparent plastic. Only sliced strawberries, granola and a fine honey drizzle at the top. NO bananas, blueberries, coconut, seeds or other ingredients. Three quarter near eye level product view to strongly emphasize tall thin transparent plastic cup and purple base. Whole cup inside frame with comfortable margins. No logo, no branding, no text, no utensils, no props. Appetizing realistic premium product photograph.

#### affogato-espresso-v2.webp

Photorealistic premium ice cream shop food product photograph, square composition on warm cream seamless tabletop with soft natural studio light. TWO separate servings side by side, both fully visible and easy to recognize at thumbnail size. Left: an affogato in a small clear serving glass, a round scoop of vanilla ice cream with freshly poured dark espresso visibly cascading down and swirling around the melting vanilla scoop. Right: a separate small white espresso demitasse cup and saucer containing dark espresso with golden crema. Affogato larger than espresso serving. Clear distinction between creamy affogato and separate espresso. Both vessels fully inside frame, tightly grouped with comfortable margins. No additional food, no toppings, no text, no logos, no fabricated branding. Realistic appetizing textures, compact premium merchandising photograph.
