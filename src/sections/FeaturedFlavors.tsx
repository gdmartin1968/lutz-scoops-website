import {
  ArrowRight,
  BadgeCheck,
  IceCreamBowl,
} from "lucide-react";

export function FeaturedFlavors() {
  return (
    <section
      id="flavors"
      className="overflow-hidden bg-[#102a54] py-24 text-white sm:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#8fd8f4]">
            Flavor gallery coming next
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-6xl">
            More than 25 flavors. One very difficult decision.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
            We are building a complete visual flavor library so every
            product appears accurately and consistently across the website,
            digital menus and Lutz OS.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Accurate product photography",
              "Consistent Lutz Scoops branding",
              "Current availability managed separately",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 font-bold text-white/80"
              >
                <BadgeCheck size={21} className="text-[#f6bdd2]" />
                {item}
              </div>
            ))}
          </div>

          <a
            href="https://lutzscoops.square.site/"
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#df336d] px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-[#c92960]"
          >
            View Online Ordering
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-[#f6c9da] via-white to-[#cfeaf6] p-5 shadow-2xl shadow-black/20 sm:p-8">
            <img
              src="/images/flavors/cookie-monster.png"
              alt="Cookie Monster ice cream in a Lutz Scoops branded cup"
              className="w-full rounded-[2rem]"
              loading="lazy"
            />
          </div>

          <div className="absolute -bottom-5 -right-2 hidden rounded-3xl bg-white p-5 text-[#102a54] shadow-2xl sm:block">
            <IceCreamBowl size={28} className="text-[#df336d]" />
            <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-[#0873ae]">
              Full catalog
            </p>
            <p className="mt-1 text-xl font-black">
              Coming together now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
