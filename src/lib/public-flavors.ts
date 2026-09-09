export type DietaryCode = "GF" | "CF" | "EF" | "SF" | "NF" | "DF" | "V";
export type DietaryMetadata = Partial<Record<DietaryCode, { value: "yes" | "no" | "unknown"; reviewed: boolean }>>;

export type PublicFlavor = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  featuredRank: number | null;
  dietaryMetadata?: DietaryMetadata | null;
  showAskStaff?: boolean;
  containsAllergens?: string[];
};

export type PublicFlavorFeed = {
  count: number;
  available: PublicFlavor[];
  featured: PublicFlavor[];
};

// Same canonical codes and positive-value rule as the Lutz OS flavor board.
export const DIETARY_CODES: DietaryCode[] = ["GF", "CF", "EF", "SF", "NF", "DF", "V"];
export function displayedDietaryCodes(metadata: DietaryMetadata | null | undefined) {
  return DIETARY_CODES.filter(code => metadata?.[code]?.value === "yes");
}

function isPublicFlavor(value: unknown): value is PublicFlavor {
  if (!value || typeof value !== "object") return false;
  const flavor = value as Record<string, unknown>;
  const dietary = flavor.dietaryMetadata;
  if (dietary != null && (typeof dietary !== "object" || Array.isArray(dietary) ||
    !Object.values(dietary).every(claim => claim && typeof claim === "object" &&
      ["yes", "no", "unknown"].includes(claim.value) && typeof claim.reviewed === "boolean"))) return false;
  return (
    typeof flavor.id === "number" &&
    typeof flavor.name === "string" &&
    (flavor.slug === null || typeof flavor.slug === "string") &&
    (flavor.description === null || typeof flavor.description === "string") &&
    (flavor.imageUrl === null || typeof flavor.imageUrl === "string") &&
    (flavor.featuredRank === null || typeof flavor.featuredRank === "number") &&
    (flavor.showAskStaff === undefined || typeof flavor.showAskStaff === "boolean") &&
    (flavor.containsAllergens === undefined || (Array.isArray(flavor.containsAllergens) &&
      flavor.containsAllergens.every(item => typeof item === "string")))
  );
}

export function parsePublicFlavorFeed(value: unknown): PublicFlavorFeed | null {
  if (!value || typeof value !== "object") return null;
  const feed = value as Record<string, unknown>;
  if (!Array.isArray(feed.available) || !Array.isArray(feed.featured)) return null;
  if (!feed.available.every(isPublicFlavor) || !feed.featured.every(isPublicFlavor)) return null;
  if (feed.count !== undefined && (typeof feed.count !== "number" || !Number.isInteger(feed.count) || feed.count < 0)) return null;
  return {
    count: typeof feed.count === "number" ? feed.count : feed.available.length,
    available: feed.available,
    featured: feed.featured,
  };
}

export async function loadPublicFlavorFeed(signal?: AbortSignal): Promise<PublicFlavorFeed> {
  const response = await fetch("https://os.lutzscoops.us/api/public/flavors", {
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load flavors");
  const feed = parsePublicFlavorFeed(await response.json());
  if (!feed) throw new Error("Invalid flavor response");
  return feed;
}
