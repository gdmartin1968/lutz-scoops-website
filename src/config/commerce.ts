export type CommerceProvider = {
  id: "pickup" | "delivery";
  provider: "Square" | "DoorDash" | "Lutz";
  title: string;
  description: string;
  actionLabel: string;
  unavailableMessage: string;
  destinationUrl: string | null;
  enabled: boolean;
};

export const commerce = {
  gatewayPath: "/order-online",
  providers: [
    { id: "pickup", provider: "Square", title: "Pickup", description: "Order ahead and pick it up at Lutz Scoops.", actionLabel: "Continue to pickup", unavailableMessage: "Pickup is temporarily unavailable.", destinationUrl: "https://lutzscoops.square.site/", enabled: true },
    { id: "delivery", provider: "DoorDash", title: "Delivery", description: "Get your Lutz Scoops delivered to your door.", actionLabel: "Continue to delivery", unavailableMessage: "Delivery ordering is not available yet.", destinationUrl: null, enabled: false },
  ] satisfies CommerceProvider[],
  // Provider accounts are not Lutz customer identity. No customer data is collected here.
  customerRelationship: { loyaltyStatus: "planned" },
} as const;

// Owned pickup launches only when explicitly configured on the public build.
// Loopback is a local review handoff to the isolated Lutz Commerce server.
export function ownedPickupDestination(hostname: string, configuredUrl: string | undefined = import.meta.env?.VITE_OWNED_ORDER_URL): string | null {
  if (configuredUrl) {
    if (!isCustomerUrl(configuredUrl)) return null;
    return configuredUrl;
  }
  return hostname === "localhost" || hostname === "127.0.0.1" ? "http://127.0.0.1:5000/order-ahead" : null;
}

export function isCustomerUrl(value: string | null): value is string {
  if (!value || value.trim() !== value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function providerDestination(option: CommerceProvider): string | null {
  return option.enabled && isCustomerUrl(option.destinationUrl) ? option.destinationUrl : null;
}

// Run by the ordering validation suite. Disabled providers may intentionally lack a URL.
export function validateProviders(providers: readonly CommerceProvider[]): string[] {
  return providers.flatMap(option => option.enabled && !isCustomerUrl(option.destinationUrl)
    ? [`${option.id}: enabled provider requires a valid HTTPS customer URL`]
    : []);
}
