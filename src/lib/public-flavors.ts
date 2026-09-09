export type PublicFlavor = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  featuredRank: number | null;
};

export type PublicFlavorFeed = {
  count: number;
  available: PublicFlavor[];
  featured: PublicFlavor[];
};

function isPublicFlavor(value: unknown): value is PublicFlavor {
  if (!value || typeof value !== "object") return false;
  const flavor = value as Record<string, unknown>;
  return (
    typeof flavor.id === "number" &&
    typeof flavor.name === "string" &&
    (flavor.slug === null || typeof flavor.slug === "string") &&
    (flavor.description === null || typeof flavor.description === "string") &&
    (flavor.imageUrl === null || typeof flavor.imageUrl === "string") &&
    (flavor.featuredRank === null || typeof flavor.featuredRank === "number")
  );
}

export function parsePublicFlavorFeed(value: unknown): PublicFlavorFeed | null {
  if (!value || typeof value !== "object") return null;
  const feed = value as Record<string, unknown>;
  if (!Array.isArray(feed.available) || !Array.isArray(feed.featured)) return null;
  if (!feed.available.every(isPublicFlavor) || !feed.featured.every(isPublicFlavor)) return null;

  return {
    count: typeof feed.count === "number" ? feed.count : feed.available.length,
    available: feed.available,
    featured: feed.featured,
  };
}
