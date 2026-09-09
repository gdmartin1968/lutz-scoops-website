import { useEffect, useState } from "react";
import {
  Blend,
  Coffee,
  CupSoda,
  IceCreamBowl,
  Leaf,
  Sparkles,
} from "lucide-react";
import {
  fetchPublicMenu,
  resolveHighlightPrice,
  type MenuHighlightKey,
  type PublicMenuItem,
} from "../lib/public-menu";

const highlights: Array<{
  key: MenuHighlightKey;
  name: string;
  description: string;
  icon: typeof IceCreamBowl;
}> = [
  {
    key: "iceCream",
    name: "Premium Ice Cream",
    description: "Classic favorites and unforgettable specialty flavors.",
    icon: IceCreamBowl,
  },
  {
    key: "milkshakes",
    name: "Milkshakes",
    description: "Thick, creamy and blended exactly how you like them.",
    icon: Blend,
  },
  {
    key: "sundaes",
    name: "Sundaes",
    description: "Loaded with toppings, sauces and plenty of personality.",
    icon: Sparkles,
  },
  {
    key: "coffee",
    name: "Coffee & Espresso",
    description: "Coffeehouse favorites made for sipping or pairing.",
    icon: Coffee,
  },
  {
    key: "acaiBowls",
    name: "Açaí Bowls",
    description: "Refreshing bowls topped with fruit and crunch.",
    icon: Leaf,
  },
  {
    key: "floatsAndMore",
    name: "Floats & More",
    description: "Root beer floats, specialty drinks and sweet surprises.",
    icon: CupSoda,
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

  return (
    <section id="menu" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#df336d]">
            More than scoops
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-6xl">
            Something delicious for everyone.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ key, name, description, icon: Icon }) => {
            const priceLabel = resolveHighlightPrice(menuItems, key);

            return (
              <article
                key={name}
                className="group rounded-[2rem] border border-[#102a54]/8 bg-[#fffaf6] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#df336d]/20 hover:shadow-2xl hover:shadow-[#102a54]/8"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#df336d] shadow-sm transition group-hover:rotate-3 group-hover:scale-105">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight text-[#102a54]">
                  {name}
                </h3>

                <p className="mt-3 leading-7 text-[#102a54]/62">
                  {description}
                </p>

                {priceLabel && (
                  <p className="mt-5 text-sm font-black uppercase tracking-[0.08em] text-[#0873ae]">
                    {priceLabel}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}