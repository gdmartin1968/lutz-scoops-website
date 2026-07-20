import {
  Coffee,
  Heart,
  IceCreamBowl,
  Smile,
} from "lucide-react";

const experiences = [
  {
    eyebrow: "Premium scoops",
    title: "Flavor-first ice cream",
    description:
      "Classic favorites, playful creations and rich specialty flavors.",
    icon: IceCreamBowl,
  },
  {
    eyebrow: "Coffeehouse favorites",
    title: "Coffee meets dessert",
    description:
      "Espresso drinks, iced coffee and the perfect pairing for your scoop.",
    icon: Coffee,
  },
  {
    eyebrow: "Made for sharing",
    title: "A neighborhood gathering place",
    description:
      "Family treats, date nights, after-school stops and spontaneous cravings.",
    icon: Heart,
  },
  {
    eyebrow: "Genuine hospitality",
    title: "Friendly faces. Good vibes.",
    description:
      "A warm welcome and something delicious for everyone who walks in.",
    icon: Smile,
  },
];

export function ExperienceStrip() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#df336d]">
            The Lutz Scoops experience
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-6xl">
            More than a scoop.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#102a54]/60">
            Great products bring people through the door. A memorable
            experience brings them back.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {experiences.map(({ eyebrow, title, description, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-[2rem] border border-[#102a54]/8 bg-[#fff9f4] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#df336d]/20 hover:shadow-2xl hover:shadow-[#102a54]/8"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#df336d] shadow-sm transition group-hover:rotate-3 group-hover:scale-105">
                <Icon size={27} />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#0873ae]">
                {eyebrow}
              </p>

              <h3 className="mt-2 text-2xl font-black leading-tight tracking-tight text-[#102a54]">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-[#102a54]/60">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
