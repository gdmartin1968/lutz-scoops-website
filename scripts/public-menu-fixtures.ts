import type { PublicMenuItem, PublicMenuVariant, MenuHighlightKey } from "../src/lib/public-menu.ts";

export const variant = (name: string | null, price: string, sizeLabel: string | null = name): PublicMenuVariant => ({
  name, sizeLabel, price, displayOrder: 10,
});
export const item = (name: string, category: string | null, variants: PublicMenuVariant[]): PublicMenuItem => ({
  name, category, description: null, displayOrder: 10, variants,
});

// Test-only representative published menu; none of this data is bundled into the site.
export const fixtures: PublicMenuItem[] = [
  item("Scoops", "Scoops", [variant("Kiddie", "4.99"), variant("Small / 1 Scoop", "5.99")]),
  item("Milkshakes", "Milkshakes", [
    variant("Milkshakes 16 oz", "8.50", "16 oz"),
    variant("Milkshakes 20 oz", "9.99", "20 oz"),
    variant("Milkshakes Add Malt Powder", "0.99", "Add Malt Powder"),
    variant("Milkshakes Vegan Milkshake Upgrade", "1.00", "Vegan Milkshake Upgrade"),
  ]),
  item("Hot Fudge Sundae", "Sundaes", [variant("Regular", "8.50")]),
  item("Oreo Cookie Sundae", "Sundaes", [variant("Regular", "9.99")]),
  item("Coconut Almond Joy Sundae", "Sundaes", [variant("Regular", "9.99")]),
  item("Banana Split", "Sundaes", [variant("Regular", "10.99")]),
  item("Coffee & Cocoa", "Coffee & Cocoa", [
    variant("Coffee & Cocoa Add Flavor Shot", "0.50", "Add Flavor Shot"),
    variant("Coffee & Cocoa Double Espresso Shot", "1.99", "Double Espresso Shot"),
    variant("Coffee & Cocoa Latte from", "3.99", "Latte from"),
  ]),
  item("Açaí Bowl", "Bowls", [variant("Regular", "12.50")]),
  item("Floats & Ice Cream Sodas", "Shakes & Floats", [
    variant("Ice Cream Float 16 oz", "7.99"), variant("Ice Cream Soda 16 oz", "7.99"),
  ]),
  // Synthetic adversarial records, not claimed to be the unavailable historical
  // production collision. Cover category and presentation-alias contamination.
  item("QA Specialty Drink", "Floats & Ice Cream Sodas", [variant("Regular", "5.99")]),
  item("Floats & More", "Shakes & Floats", [variant("Regular", "5.99")]),
];

export const expectedPrices: Record<MenuHighlightKey, string> = {
  iceCream: "From $4.99", milkshakes: "From $8.50", sundaes: "From $8.50",
  coffee: "From $1.99", acaiBowls: "From $12.50", floatsAndMore: "From $7.99",
};
