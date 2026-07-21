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
    description: "Locally owned. Family operated. Proud to serve our community.",
    icon: Users,
  },
  {
    title: "Visit Us",
    description: "Lutz Lake Crossing",
    linkLabel: "Get Directions",
    href: "https://www.google.com/maps/search/?api=1&query=Lutz+Scoops+Lutz+Florida",
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
              className="relative flex min-h-[245px] flex-col items-center justify-center px-7 py-10 text-center sm:px-9 lg:min-h-[270px] lg:py-11"
            >
              <div className="grid h-14 w-14 place-items-center text-[#df336d]">
                <Icon
                  size={42}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-4 text-sm font-black uppercase tracking-[0.04em] text-[#102a54]">
                {title}
              </h2>

              <p className="mt-3 max-w-[230px] text-sm font-medium leading-6 text-[#102a54]/74">
                {description}
              </p>

              {href && linkLabel && (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
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
