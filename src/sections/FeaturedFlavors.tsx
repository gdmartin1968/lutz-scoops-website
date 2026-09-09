import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  parsePublicFlavorFeed,
  type PublicFlavor,
} from "../lib/public-flavors";

const PUBLIC_FLAVORS_URL =
  "https://os.lutzscoops.us/api/public/flavors";

type LoadState = "loading" | "ready" | "error";
type FeaturedFlavor = PublicFlavor & { imageUrl: string };

export function FeaturedFlavors() {
  const [flavors, setFlavors] = useState<FeaturedFlavor[]>([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFlavors() {
      try {
        const response = await fetch(PUBLIC_FLAVORS_URL, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Flavor API returned ${response.status}`);
        }

        const data = parsePublicFlavorFeed(await response.json());
        if (!data) throw new Error("Flavor API returned an invalid response");

        setAvailableCount(data.count);
        setFlavors(
          data.featured.filter(
            (flavor): flavor is FeaturedFlavor =>
              Boolean(flavor.imageUrl),
          ),
        );
        setLoadState("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadState("error");
      }
    }

    void loadFlavors();
    return () => controller.abort();
  }, []);

  return (
    <section id="flavors" className="bg-[#fffaf4] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d] sm:text-sm">
            Live from today&apos;s scoop case
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#102a54] sm:text-5xl">
            Featured Flavors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#102a54]/70 sm:text-lg">
            {loadState === "loading" && "Checking today’s scoop case…"}
            {loadState === "ready" && flavors.length > 0 &&
              `${availableCount} ${availableCount === 1 ? "flavor is" : "flavors are"} available today. Here are today’s featured scoops.`}
            {loadState === "ready" && flavors.length === 0 &&
              "Today’s featured scoops will appear here when they are selected in our scoop case."}
            {loadState === "error" &&
              "Our live flavor list is taking a moment to refresh. Please call or visit us to see today’s scoop case."}
          </p>
        </div>

        {flavors.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {flavors.map((flavor) => (
            <article
              key={flavor.id}
              className="group overflow-hidden rounded-[1.35rem] border border-[#102a54]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#102a54]/10 sm:rounded-[1.6rem]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-white">
                <img
                  src={flavor.imageUrl}
                  alt={`${flavor.name} ice cream at Lutz Scoops`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-4 text-center sm:px-5 sm:py-5">
                <h3 className="text-sm font-black leading-tight text-[#102a54] sm:text-base">
                  {flavor.name}
                </h3>
              </div>
            </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center sm:mt-12">
          <a
            href="/order.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
          >
            <ShoppingBag size={16} />
            View Today&apos;s Menu
          </a>
        </div>
      </div>
    </section>
  );
}
