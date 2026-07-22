import { ArrowRight } from "lucide-react";

const featuredFlavors = [
  {
    name: "Cotton Candy",
    image: "/images/flavors/cotton-candy.png",
    alt: "Cotton Candy ice cream served in a Lutz Scoops branded cup",
  },
  {
    name: "Mango Sorbet",
    image: "/images/flavors/mango-sorbet.png",
    alt: "Mango Sorbet served in a Lutz Scoops branded cup",
  },
  {
    name: "Smurf",
    image: "/images/flavors/smurf.png",
    alt: "Smurf ice cream served in a Lutz Scoops branded cup",
  },
  {
    name: "Ube",
    image: "/images/flavors/ube.png",
    alt: "Ube ice cream served in a Lutz Scoops branded cup",
  },
];

export function FeaturedFlavors() {
  return (
    <section
      id="flavors"
      className="bg-[#fffaf4] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d] sm:text-sm">
            Customer favorites
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#102a54] sm:text-5xl">
            Featured Flavors
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#102a54]/70 sm:text-lg">
            Four colorful favorites. One delicious decision.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {featuredFlavors.map((flavor) => (
            <article
              key={flavor.name}
              className="group overflow-hidden rounded-[1.35rem] border border-[#102a54]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#102a54]/10 sm:rounded-[1.6rem]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-white">
                <img
                  src={flavor.image}
                  alt={flavor.alt}
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
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#df336d] bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#df336d] transition hover:-translate-y-0.5 hover:bg-[#df336d] hover:text-white"
          >
            View All Flavors
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
