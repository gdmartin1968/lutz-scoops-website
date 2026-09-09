import assert from "node:assert/strict";
import {
  PUBLIC_MENU_URL,
  findHighlightItem,
  formatStartingPrice,
  getStartingPrice,
  isPublicMenuResponse,
  resolveHighlightPrice,
  type PublicMenuItem,
} from "../src/lib/public-menu";

assert.equal(
  PUBLIC_MENU_URL,
  "https://os.lutzscoops.us/api/public/menu",
);

const fixtures: PublicMenuItem[] = [
  {
    name: "Milkshakes",
    description: "Hand-spun shakes",
    displayOrder: 20,
    variants: [
      {
        name: "Regular",
        sizeLabel: "16 oz",
        price: "8.50",
        displayOrder: 10,
      },
      {
        name: "Large",
        sizeLabel: "20 oz",
        price: "9.50",
        displayOrder: 20,
      },
    ],
  },
  {
    name: "Coffee & Espresso",
    description: null,
    displayOrder: 30,
    variants: [
      {
        name: "Small Coffee",
        sizeLabel: "12 oz",
        price: "$1.99",
        displayOrder: 10,
      },
      {
        name: "Espresso",
        sizeLabel: null,
        price: "2.50",
        displayOrder: 20,
      },
    ],
  },
  {
    name: "Sundaes",
    description: null,
    displayOrder: 40,
    variants: [],
  },
  {
    name: "Açaí Bowls",
    description: null,
    displayOrder: 50,
    variants: [
      {
        name: null,
        sizeLabel: null,
        price: "12.50",
        displayOrder: 10,
      },
    ],
  },
];

assert.equal(
  findHighlightItem(fixtures, "milkshakes")?.name,
  "Milkshakes",
);

assert.equal(
  findHighlightItem(fixtures, "coffee")?.name,
  "Coffee & Espresso",
);

assert.equal(
  findHighlightItem(fixtures, "acaiBowls")?.name,
  "Açaí Bowls",
);

assert.equal(
  getStartingPrice(fixtures[0]),
  8.5,
);

assert.equal(
  getStartingPrice(fixtures[1]),
  1.99,
);

assert.equal(
  getStartingPrice(fixtures[2]),
  null,
);

assert.equal(
  formatStartingPrice(8.5),
  "From $8.50",
);

assert.equal(
  formatStartingPrice(null),
  null,
);

assert.equal(
  resolveHighlightPrice(fixtures, "milkshakes"),
  "From $8.50",
);

assert.equal(
  resolveHighlightPrice(fixtures, "coffee"),
  "From $1.99",
);

assert.equal(
  resolveHighlightPrice(fixtures, "sundaes"),
  null,
);

assert.equal(
  resolveHighlightPrice(fixtures, "acaiBowls"),
  "From $12.50",
);

assert.equal(
  isPublicMenuResponse({
    generatedAt: "2026-09-09T19:22:33.754Z",
    count: 0,
    items: [],
  }),
  true,
);

assert.equal(
  isPublicMenuResponse({
    generatedAt: "2026-09-09T19:22:33.754Z",
    count: 1,
    items: [],
  }),
  false,
  "count must agree with public items",
);

assert.equal(
  isPublicMenuResponse({
    generatedAt: "2026-09-09T19:22:33.754Z",
    count: 1,
    items: [
      {
        name: "Bad Variant",
        description: null,
        displayOrder: 1,
        variants: [{ price: 4.99 }],
      },
    ],
  }),
  false,
  "malformed variants must fail validation",
);

console.log(
  "Public website menu-data tests passed: endpoint, validation, accented matching, minimum-price calculation, formatting, and graceful missing-price behavior.",
);