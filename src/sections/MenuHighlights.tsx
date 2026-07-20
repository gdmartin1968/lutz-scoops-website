import {
  Blend,
  Coffee,
  CupSoda,
  IceCreamBowl,
  Leaf,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    name: "Premium Ice Cream",
    description: "Classic favorites and unforgettable specialty flavors.",
    icon: IceCreamBowl,
  },
  {
    name: "Milkshakes",
    description: "Thick, creamy and blended exactly how you like them.",
    icon: Blend,
  },
  {
    name: "Sundaes",
    description: "Loaded with toppings, sauces and plenty of personality.",
    icon: Sparkles,
  },
  {
    name: "Coffee & Espresso",
    description: "Coffeehouse favorites made for sipping or pairing.",
    icon: Coffee,
  },
  {
    name: "Açaí Bowls",
    description: "Refreshing bowls topped with fruit and crunch.",
    icon: Leaf,
  },
  {
    name: "Floats & More",
    description: "Root beer floats, specialty drinks and sweet surprises.",
    icon: CupSoda,
  },
];

export function MenuHighlights() {
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
          {highlights.map(({ name, description, icon: Icon }) => (
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
