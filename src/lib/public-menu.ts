export const PUBLIC_MENU_URL = "https://os.lutzscoops.us/api/public/menu";

export type PublicMenuVariant = {
  name: string | null;
  sizeLabel: string | null;
  price: string;
  displayOrder: number;
};

export type PublicMenuItem = {
  name: string;
  category: string | null;
  description: string | null;
  displayOrder: number;
  variants: PublicMenuVariant[];
};

export type PublicMenuResponse = {
  generatedAt: string;
  count: number;
  items: PublicMenuItem[];
};

export type MenuHighlightKey =
  | "iceCream"
  | "milkshakes"
  | "sundaes"
  | "coffee"
  | "acaiBowls"
  | "floatsAndMore";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const highlightAliases: Record<MenuHighlightKey, string[]> = {
  iceCream: [
    "scoops",
    "premium ice cream",
    "ice cream",
    "hand dipped ice cream",
  ],
  milkshakes: [
    "milkshakes",
    "milkshake",
    "shakes",
  ],
  sundaes: [
    "sundaes",
    "sundae",
  ],
  coffee: [
    "coffee and cocoa",
    "coffee and espresso",
    "coffee",
    "espresso",
  ],
  acaiBowls: [
    "acai bowls",
    "acai bowl",
  ],
  floatsAndMore: [
    "floats and ice cream sodas",
    "floats and more",
    "floats",
    "float",
  ],
};

// Presentation cards can represent an entire category or one canonical item.
const highlightSources: Record<MenuHighlightKey,
  | { kind: "category"; categories: string[] }
  | { kind: "item"; name: string }
> = {
  iceCream: { kind: "category", categories: ["scoops"] },
  milkshakes: { kind: "category", categories: ["milkshakes"] },
  sundaes: { kind: "category", categories: ["sundaes"] },
  coffee: { kind: "category", categories: ["coffee and cocoa"] },
  acaiBowls: { kind: "category", categories: ["bowls", "acai bowls"] },
  floatsAndMore: { kind: "item", name: "Floats & Ice Cream Sodas" },
};

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isPublicMenuVariant(value: unknown): value is PublicMenuVariant {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<PublicMenuVariant>;

  return (
    isNullableString(candidate.name) &&
    isNullableString(candidate.sizeLabel) &&
    typeof candidate.price === "string" &&
    typeof candidate.displayOrder === "number"
  );
}

function isPublicMenuItem(value: unknown): value is PublicMenuItem {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<PublicMenuItem>;

  return (
    typeof candidate.name === "string" &&
    isNullableString(candidate.category) &&
    isNullableString(candidate.description) &&
    typeof candidate.displayOrder === "number" &&
    Array.isArray(candidate.variants) &&
    candidate.variants.every(isPublicMenuVariant)
  );
}

export function isPublicMenuResponse(
  value: unknown,
): value is PublicMenuResponse {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<PublicMenuResponse>;

  return (
    typeof candidate.generatedAt === "string" &&
    typeof candidate.count === "number" &&
    Number.isInteger(candidate.count) &&
    candidate.count >= 0 &&
    Array.isArray(candidate.items) &&
    candidate.items.every(isPublicMenuItem) &&
    candidate.count === candidate.items.length
  );
}

export async function fetchPublicMenu(
  signal?: AbortSignal,
): Promise<PublicMenuResponse> {
  const response = await fetch(PUBLIC_MENU_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Public menu request failed with HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();

  if (!isPublicMenuResponse(payload)) {
    throw new Error("Public menu response did not match the expected contract.");
  }

  return payload;
}

export function parsePrice(price: string): number | null {
  const normalized = price.replace(/[$,\s]/g, "");

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);

  return Number.isFinite(value) && value >= 0 ? value : null;
}

// The seeded public variants use both name and sizeLabel for modifier wording.
// Match words, not price thresholds or substrings such as "shot": an espresso
// shot is a base product. Extra Large/Small are legitimate sizes.
export function isModifierVariant(variant: PublicMenuVariant): boolean {
  return [variant.name, variant.sizeLabel].some(label => {
    if (!label) return false;
    const words = normalize(label);
    return /\b(?:add|addon|addons|upgrade|upgrades)\b/.test(words) ||
      /\bextra (?:shots?|scoops?|toppings?|syrup|malt|flavou?r|whipped cream)\b/.test(words);
  });
}

export function formatMenuPrice(price: string): string | null {
  const value = parsePrice(price);
  return value === null ? null : `$${value.toFixed(2)}`;
}

export type PublicMenuGroup = {
  category: string;
  id: string;
  items: PublicMenuItem[];
};

export function menuSectionId(category: string): string {
  const key = normalize(category);
  if (key === "scoops") return "scoops";
  if (key === "sundaes") return "sundaes";
  if (key === "coffee" || key === "coffee and cocoa") return "coffee";
  if (key === "bowls" || key === "acai bowls") return "bowls";
  if (key === "shakes and floats" || key === "milkshakes") return "shakes-and-floats";
  return key.replace(/\s+/g, "-") || "more";
}

export function menuItemAnchor(name: string): string | null {
  const key = normalize(name);
  if (key === "milkshakes") return "milkshakes";
  if (key === "floats and ice cream sodas") return "floats";
  return null;
}

export function groupPublicMenuItems(items: PublicMenuItem[]): PublicMenuGroup[] {
  const groups: PublicMenuGroup[] = [];
  const byCategory = new Map<string, PublicMenuGroup>();
  for (const item of items) {
    const category = item.category?.trim() || "More";
    const key = normalize(category) || "more";
    let group = byCategory.get(key);
    if (!group) {
      group = { category, id: menuSectionId(category), items: [] };
      byCategory.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

export function getStartingPrice(item: PublicMenuItem): number | null {
  const prices = item.variants
    .filter((variant) => !isModifierVariant(variant))
    .map((variant) => parsePrice(variant.price))
    .filter((price): price is number => price !== null);

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export function formatStartingPrice(price: number | null): string | null {
  if (price === null) {
    return null;
  }

  return `From $${price.toFixed(2)}`;
}

function matchesItemName(item: PublicMenuItem, key: MenuHighlightKey): boolean {
  return highlightAliases[key].includes(normalize(item.name));
}

export function findHighlightItems(
  items: PublicMenuItem[],
  key: MenuHighlightKey,
): PublicMenuItem[] {
  const source = highlightSources[key];
  if (source.kind === "item") {
    // No category or presentation-name fallback: a missing canonical item
    // means this card has no published price.
    return items.filter(item => normalize(item.name) === normalize(source.name));
  }
  const keys = Object.keys(highlightAliases) as MenuHighlightKey[];
  const categoryItems = items.filter(item =>
    source.categories.includes(normalize(item.category ?? "")) &&
    // Keep a separately named product (e.g. Floats) out of another card's
    // category aggregation if an older menu groups it with Milkshakes.
    !keys.some(other => other !== key && matchesItemName(item, other)),
  );

  // Prefer all published items in the canonical category. For uncategorized
  // or older broadly grouped menus, fall back to exact item aliases only.
  return categoryItems.length > 0
    ? categoryItems
    : items.filter(item => matchesItemName(item, key));
}

export function resolveHighlightPrice(
  items: PublicMenuItem[],
  key: MenuHighlightKey,
): string | null {
  const prices = findHighlightItems(items, key)
    .map(getStartingPrice)
    .filter((price): price is number => price !== null);
  return formatStartingPrice(prices.length > 0 ? Math.min(...prices) : null);
}
