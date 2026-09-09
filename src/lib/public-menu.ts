export const PUBLIC_MENU_URL = "https://os.lutzscoops.us/api/public/menu";

export type PublicMenuVariant = {
  name: string | null;
  sizeLabel: string | null;
  price: string;
  displayOrder: number;
};

export type PublicMenuItem = {
  name: string;
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
    "coffee and espresso",
    "coffee",
    "espresso",
  ],
  acaiBowls: [
    "acai bowls",
    "acai bowl",
  ],
  floatsAndMore: [
    "floats and more",
    "floats",
    "float",
  ],
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

function parsePrice(price: string): number | null {
  const normalized = price.replace(/[$,\s]/g, "");

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);

  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function getStartingPrice(item: PublicMenuItem): number | null {
  const prices = item.variants
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

export function findHighlightItem(
  items: PublicMenuItem[],
  key: MenuHighlightKey,
): PublicMenuItem | null {
  const aliases = highlightAliases[key].map(normalize);

  const exactMatch = items.find((item) =>
    aliases.includes(normalize(item.name)),
  );

  if (exactMatch) {
    return exactMatch;
  }

  return (
    items.find((item) => {
      const itemName = normalize(item.name);

      return aliases.some(
        (alias) =>
          itemName.includes(alias) ||
          alias.includes(itemName),
      );
    }) ?? null
  );
}

export function resolveHighlightPrice(
  items: PublicMenuItem[],
  key: MenuHighlightKey,
): string | null {
  const item = findHighlightItem(items, key);

  if (!item) {
    return null;
  }

  return formatStartingPrice(getStartingPrice(item));
}