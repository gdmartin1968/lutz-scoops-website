import { ArrowRight, IceCreamBowl } from "lucide-react";

const flavors = [
  "Cookie Monster",
  "Double Chocolate",
  "Mississippi Mud Pie",
  "Coffee",
  "Chocolate Peanut Butter",
  "Pralines & Cream",
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
          {flavors.map((flavor, index) => (
            <article
              key={flavor}
              className="group overflow-hidden rounded-[2rem] bg-white text-[#102a54]"
            >
              <div
                className={`grid aspect-[4/3] place-items-center ${
                  index % 2 === 0
                    ? "bg-gradient-to-br from-[#f7cfdd] via-white to-[#d7eff8]"
                    : "bg-gradient-to-br from-[#d7eff8] via-white to-[#f8d7e3]"
                }`}
              >
                <IceCreamBowl
                  size={92}
                  strokeWidth={1.25}
                  className="text-[#df336d] transition duration-500 group-hover:-translate-y-2 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0873ae]">
                  Lutz Scoops favorite
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight">
                  {flavor}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-white/48">
          These placeholders will be replaced with your real branded flavor
          photography.
        </p>
      </div>
    </section>
  );
}
