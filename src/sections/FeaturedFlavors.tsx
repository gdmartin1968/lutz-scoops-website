import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import {
  loadPublicFlavorFeed,
  type PublicFlavor,
} from "../lib/public-flavors";


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
        const data = await loadPublicFlavorFeed(controller.signal);

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
    <section id="flavors" className="bg-[#fffaf4] py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d] sm:text-sm">
            Live from today&apos;s scoop case
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.035em] text-[#102a54] sm:text-4xl">
            Featured Flavors
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#102a54]/68 sm:text-base">
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
          <div className="mx-auto mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {flavors.map((flavor) => (
            <article
              key={flavor.id}
              className="group overflow-hidden rounded-xl border border-[#102a54]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-white">
                <img
                  src={flavor.imageUrl}
                  alt={`${flavor.name} ice cream at Lutz Scoops`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="px-2.5 py-3 text-center sm:px-3">
                <h3 className="text-xs font-black leading-tight text-[#102a54] sm:text-sm">
                  {flavor.name}
                </h3>
              </div>
            </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href="/flavors"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
          >
            <ShoppingBag size={16} />
            View Today&apos;s Flavors
          </a>
        </div>
      </div>
    </section>
  );
}
