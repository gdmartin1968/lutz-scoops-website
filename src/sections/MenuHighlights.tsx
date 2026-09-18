import { useEffect, useState } from "react";
import {
  fetchPublicMenu,
  getStartingPrice,
  formatMenuPrice,
  resolveHighlightPrice,
  type MenuHighlightKey,
  type PublicMenuItem,
} from "../lib/public-menu";

const highlights: Array<{
  key: MenuHighlightKey;
  name: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}> = [
  {
    key: "iceCream",
    name: "Premium Ice Cream",
    description: "Your favorite flavors, freshly scooped.",
    image: "/images/flavors/ube.png",
    alt: "Ube ice cream in a branded Lutz Scoops cup",
    href: "/menu#scoops",
  },
  {
    key: "milkshakes",
    name: "Milkshakes",
    description: "Thick, creamy, whipped-cream topped.",
    image: "/images/lifestyle/hero-collage/friends.png",
    alt: "Adult customers enjoying topped milkshakes at Lutz Scoops",
    href: "/menu#milkshakes",
  },
  {
    key: "sundaes",
    name: "Sundaes",
    description: "Ice cream, rich sauces & favorite toppings.",
    image: "/images/menu/brownie-sundae-v2.webp",
    alt: "Three-scoop Brownie Sundae with three cherries atop whipped cream over a brownie base",
    href: "/menu#sundaes",
  },
  {
    key: "coffee",
    name: "Coffee & Espresso",
    description: "Espresso shots & cozy coffee favorites.",
    image: "/images/menu/affogato-espresso-v2.webp",
    alt: "Affogato with espresso pouring over vanilla ice cream, beside a separate espresso",
    href: "/menu#coffee",
  },
  {
    key: "acaiBowls",
    name: "Açaí Bowls",
    description: "Fruit, granola & a drizzle of honey.",
    image: "/images/menu/acai-cup-v2.webp",
    alt: "Purple açaí in a tall clear plastic cup with strawberries, granola and honey",
    href: "/menu#bowls",
  },
  {
    key: "floatsAndMore",
    name: "Floats & More",
    description: "Classic ice cream floats & sodas.",
    image: "/images/menu/root-beer-float.webp",
    alt: "Root beer float with vanilla ice cream",
    href: "/menu#floats",
  },
];

export function MenuHighlights() {
  const [menuItems, setMenuItems] = useState<PublicMenuItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetchPublicMenu(controller.signal)
      .then((data) => {
        setMenuItems(data.items);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setMenuItems([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const brownie = menuItems.find(item => item.name.trim().toLowerCase() === "brownie sundae");
  const brownieStartingPrice = brownie ? getStartingPrice(brownie) : null;
  const browniePrice = brownieStartingPrice === null ? null : formatMenuPrice(String(brownieStartingPrice));

  return (
    <section id="menu" className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#df336d]">
            More than scoops
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#102a54] sm:text-4xl">
            Something delicious for everyone.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ key, name, description, image, alt, href }) => {
            const priceLabel = resolveHighlightPrice(menuItems, key);

            return (
              <a
                key={name}
                href={href}
                className="group grid grid-cols-[42%_1fr] overflow-hidden rounded-2xl border border-[#102a54]/8 bg-[#fffaf6] transition duration-300 hover:-translate-y-1 hover:border-[#df336d]/20 hover:shadow-lg"
              >
                <div className="aspect-square self-center overflow-hidden bg-[#f4ece3]">
                  <img src={image} alt={alt} width={400} height={400} loading="lazy" className={`h-full w-full ${key === "sundaes" ? "bg-[#2b241e] object-contain" : "object-cover"} ${key === "milkshakes" ? "object-right" : ""}`} />
                </div>
                <div className="flex min-w-0 flex-col justify-center p-4">

                <h3 className="text-lg font-black leading-tight tracking-tight text-[#102a54]">
                  {name}
                </h3>

                <p className="mt-2 text-sm leading-5 text-[#102a54]/62">
                  {key === "sundaes" ? <>Pictured: Brownie Sundae{browniePrice && <> — <span data-pictured-price>{browniePrice}</span></>}</> : description}
                </p>

                {priceLabel && (
                  <p data-category-price={priceLabel} className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-[#0873ae]">
                    {key === "sundaes" ? `Sundaes ${priceLabel.toLowerCase()}` : priceLabel}
                  </p>
                )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
