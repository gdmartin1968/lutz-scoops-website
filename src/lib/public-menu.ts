// Confirmed against the active Lutz OS menu configuration on September 9, 2026.
// Keep customer pricing centralized here until Lutz OS exposes a public menu-price DTO.
export const publicMenuHighlights = {
  iceCream: { priceLabel: "From $4.99" },
  milkshakes: { priceLabel: "From $8.50" },
  sundaes: { priceLabel: "From $8.50" },
  coffee: { priceLabel: "From $1.99" },
  acaiBowls: { priceLabel: "From $12.50" },
  floatsAndMore: { priceLabel: "From $5.99" },
} as const;
