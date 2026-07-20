import { ArrowRight } from "lucide-react";

const flavors = [
  {
    name: "Cookie Monster",
    image: "/images/flavors/cookie-monster.png",
    description: "Bright, playful and packed with cookie goodness.",
  },
  {
    name: "Double Chocolate",
    image: "/images/flavors/double-chocolate.png",
    description: "Rich chocolate flavor made for serious chocolate lovers.",
  },
  {
    name: "Mississippi Mud Pie",
    image: "/images/flavors/mississippi-mud-pie.jpg",
    description: "A decadent combination of chocolate, cookies and creaminess.",
  },
  {
    name: "Coffee",
    image: "/images/flavors/coffee.png",
    description: "Smooth coffee flavor with a creamy, satisfying finish.",
  },
  {
    name: "Chocolate Peanut Butter",
    image: "/images/flavors/chocolate-peanut-butter.png",
    description: "Chocolate and peanut butter in one irresistible scoop.",
  },
  {
    name: "Pralines & Cream",
    image: "/images/flavors/pralines-and-cream.png",
    description: "Creamy, nutty and layered with sweet praline flavor.",
  },
];

export function FeaturedFlavors() {
  return (
    <section
      id="flavors"
      className="overflow-hidden bg-[#102a54] py-24 text-white sm:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#8fd8f4]">
              The stars of the show
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] sm:text-6xl">
              Flavors worth falling in love with.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Our selection changes, but there is always something delicious
              waiting in the dipping cabinet.
            </p>
          </div>

          <a
            href="https://lutzscoops.square.site/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-black text-[#f6bdd2] transition hover:text-white"
          >
            Order online
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((flavor) => (
            <article
              key={flavor.name}
              className="group overflow-hidden rounded-[2rem] bg-white text-[#102a54] shadow-xl shadow-black/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#f8d7e3] via-white to-[#d7eff8]">
                <img
                  src={flavor.image}
                  alt={`${flavor.name} ice cream served in a Lutz Scoops branded cup`}
                  className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0873ae]">
                  Lutz Scoops favorite
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight">
                  {flavor.name}
                </h3>

                <p className="mt-3 leading-7 text-[#102a54]/60">
                  {flavor.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-9 text-center text-sm font-semibold text-white/50">
          Flavor availability may change throughout the week.
        </p>
      </div>
    </section>
  );
}
