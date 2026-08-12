import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type PublicFlavor = {
  name: string;
  sortOrder: number;
  imageUrl: string;
};

type PublicFlavorResponse = {
  generatedAt: string;
  count: number;
  flavors: PublicFlavor[];
};

const PUBLIC_FLAVORS_URL =
  "https://os.lutzscoops.us/api/public/flavors";

const fallbackFlavors: PublicFlavor[] = [
  { name: "Mango Sorbet", sortOrder: 1, imageUrl: "/images/flavors/mango-sorbet.png" },
  { name: "Smurf", sortOrder: 2, imageUrl: "/images/flavors/smurf.png" },
  { name: "Ube", sortOrder: 3, imageUrl: "/images/flavors/ube.png" },
  { name: "Strawberry", sortOrder: 4, imageUrl: "/images/flavors/strawberry.png" },
];

export function FeaturedFlavors() {
  const [flavors, setFlavors] = useState<PublicFlavor[]>(fallbackFlavors);
  const [live, setLive] = useState(false);

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

        const data = (await response.json()) as PublicFlavorResponse;
        const currentFlavors = data.flavors
          .filter((flavor) => Boolean(flavor.name) && Boolean(flavor.imageUrl))
          .sort((a, b) => a.sortOrder - b.sortOrder);

        if (currentFlavors.length > 0) {
          setFlavors(currentFlavors);
          setLive(true);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Unable to load live Lutz Scoops flavors:", error);
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
            {live ? "Live from today’s scoop case" : "A few Lutz Scoops favorites"}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#102a54] sm:text-5xl">
            Today&apos;s Flavors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#102a54]/70 sm:text-lg">
            {live
              ? `${flavors.length} flavors currently available at Lutz Scoops.`
              : "Our live flavor list is refreshing. Here are a few favorites in the meantime."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {flavors.map((flavor) => (
            <article
              key={`${flavor.sortOrder}-${flavor.name}`}
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

        <div className="mt-10 flex justify-center sm:mt-12">
          <a
            href="https://lutzscoops.square.site/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
          >
            <ShoppingBag size={16} />
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
