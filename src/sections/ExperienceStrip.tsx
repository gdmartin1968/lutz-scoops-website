import {
  Coffee,
  IceCreamBowl,
  MapPin,
  Users,
} from "lucide-react";

const experiences = [
  {
    title: "Handcrafted Flavors",
    description: "Made in small batches for the best taste.",
    icon: IceCreamBowl,
  },
  {
    title: "Coffee & More",
    description: "Premium coffee, shakes, sundaes and açaí bowls.",
    icon: Coffee,
  },
  {
    title: "Locally Owned",
    description: "Locally operated. Community focused. Proud to serve Lutz.",
    icon: Users,
  },
  {
    title: "Visit Us",
    description: "Lutz Lake Crossing",
    linkLabel: "Get Directions",
    href: "/visit",
    icon: MapPin,
  },
];

export function ExperienceStrip() {
  return (
    <section
      aria-label="The Lutz Scoops experience"
      className="border-y border-[#102a54]/10 bg-[#fffaf4]"
    >
      <div className="mx-auto grid max-w-[1440px] sm:grid-cols-2 lg:grid-cols-4">
        {experiences.map(
          ({
            title,
            description,
            linkLabel,
            href,
            icon: Icon,
          }) => (
            <article
              key={title}
              className="relative flex min-h-[150px] flex-col items-center justify-center px-6 py-6 text-center sm:px-8 lg:min-h-[160px]"
            >
              <div className="grid h-11 w-11 place-items-center text-[#df336d]">
                <Icon
                  size={34}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-3 text-xs font-black uppercase tracking-[0.06em] text-[#102a54]">
                {title}
              </h2>

              <p className="mt-2 max-w-[230px] text-xs font-medium leading-5 text-[#102a54]/70 sm:text-sm">
                {description}
              </p>

              {href && linkLabel && (
                <a
                  href={href}
                  className="mt-1 text-sm font-extrabold text-[#0873ae] underline decoration-[#0873ae]/35 underline-offset-4 transition hover:text-[#df336d]"
                >
                  {linkLabel}
                </a>
              )}

              <div
                aria-hidden="true"
                className="absolute bottom-0 left-8 right-8 h-px bg-[#102a54]/10 sm:hidden"
              />

              <div
                aria-hidden="true"
                className="absolute bottom-8 right-0 top-8 hidden w-px bg-[#102a54]/12 lg:block last:hidden"
              />
            </article>
          ),
        )}
      </div>
    </section>
  );
}
