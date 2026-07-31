import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  useEffect,
  useState,
} from "react";

const HERO_ROTATION_MS = 9000;

type HeroTheme = "light" | "dark";

type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  theme: HeroTheme;
};

const heroSlides: HeroSlide[] = [
  {
    id: "authentic-lifestyle-collage",
    image:
      "/images/lifestyle/homepage-lifestyle-collage.png",
    alt:
      "Lutz Scoops ice cream, coffee, desserts, families and friends",
    theme: "light",
  },
  {
    id: "authentic-storefront",
    image:
      "/images/lifestyle/homepage-storefront-standalone.png",
    alt:
      "The authentic Lutz Scoops storefront in Lutz, Florida",
    theme: "dark",
  },
];

export function Hero() {
  const [activeSlide, setActiveSlide] =
    useState(0);

  const prefersReducedMotion =
    useReducedMotion();

  useEffect(() => {
    if (
      prefersReducedMotion ||
      heroSlides.length < 2
    ) {
      return;
    }

    let timer:
      | ReturnType<typeof window.setInterval>
      | undefined;

    function stopRotation() {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    }

    function startRotation() {
      stopRotation();

      timer = window.setInterval(() => {
        setActiveSlide(
          (current) =>
            (current + 1) %
            heroSlides.length
        );
      }, HERO_ROTATION_MS);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopRotation();
      }
      else {
        startRotation();
      }
    }

    startRotation();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      stopRotation();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [prefersReducedMotion]);

  const slide =
    heroSlides[activeSlide];

  const isDark =
    slide.theme === "dark";

  const eyebrowClassName = isDark
    ? "text-[#ff76a4]"
    : "text-[#df336d]";

  const headingClassName = isDark
    ? "text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)]"
    : "text-[#102a54]";

  const descriptionClassName = isDark
    ? "text-white/92 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]"
    : "text-[#102a54]/82";

  const secondaryButtonClassName = isDark
    ? "border-white bg-white/95 text-[#102a54] hover:bg-white"
    : "border-[#102a54] bg-white/88 text-[#102a54] hover:bg-white";

  return (
    <section
      id="top"
      aria-label="Lutz Scoops homepage highlights"
      className="relative overflow-hidden bg-[#fffaf5]"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="relative min-h-[560px] overflow-hidden sm:min-h-[610px] lg:min-h-[625px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{
                opacity:
                  prefersReducedMotion
                    ? 1
                    : 0,
              }}
              animate={{ opacity: 1 }}
              exit={{
                opacity:
                  prefersReducedMotion
                    ? 1
                    : 0,
              }}
              transition={{
                duration:
                  prefersReducedMotion
                    ? 0
                    : 0.8,
              }}
              className="absolute inset-0"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover object-center"
                fetchPriority={
                  activeSlide === 0
                    ? "high"
                    : "auto"
                }
              />

              {isDark ? (
                <>
                  <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#071427]/98 via-[#071427]/84 to-[#071427]/12 sm:w-[82%] lg:w-[72%]" />

                  <div className="absolute inset-y-0 left-0 w-[52%] bg-[#071427]/34 blur-2xl" />
                </>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/94 via-white/64 to-transparent sm:w-[76%] lg:w-[66%]" />

                  <div className="absolute inset-y-0 left-0 w-[48%] bg-white/18 blur-2xl" />
                </>
              )}

              <motion.div
                initial={{
                  opacity: 0,
                  y:
                    prefersReducedMotion
                      ? 0
                      : 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration:
                    prefersReducedMotion
                      ? 0
                      : 0.6,
                }}
                className="relative z-10 flex min-h-[560px] max-w-[680px] flex-col justify-center px-6 py-12 sm:min-h-[610px] sm:px-10 lg:min-h-[625px] lg:max-w-[790px] lg:px-20"
              >
                <p
                  className={`text-xs font-black uppercase tracking-[0.22em] sm:text-sm ${eyebrowClassName}`}
                >
                  Handcrafted in Lutz, Florida
                </p>

                <h1
                  className={`mt-4 text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-[4rem] lg:text-[4.35rem] ${headingClassName}`}
                >
                  Premium ice cream,
                  <span className="block">
                    coffee &amp; more.
                  </span>
                </h1>

                <p
                  className={`mt-5 max-w-[470px] text-lg font-semibold leading-7 sm:text-xl ${descriptionClassName}`}
                >
                  Handcrafted flavors. Friendly faces.

                  <span className="block">
                    Made just for you.
                  </span>
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://lutzscoops.square.site/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-md shadow-[#df336d]/25 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
                  >
                    <ShoppingBag size={16} />
                    Order Online
                  </a>

                  <a
                    href="#flavors"
                    className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] transition hover:-translate-y-0.5 ${secondaryButtonClassName}`}
                  >
                    View Flavors
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div
            aria-label="Choose homepage image"
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/85 px-3 py-2 shadow-lg backdrop-blur-md"
          >
            {heroSlides.map(
              (
                heroSlide,
                index
              ) => (
                <button
                  key={heroSlide.id}
                  type="button"
                  onClick={() =>
                    setActiveSlide(index)
                  }
                  aria-label={`Show homepage image ${
                    index + 1
                  }`}
                  aria-current={
                    activeSlide === index
                      ? "true"
                      : undefined
                  }
                  className={
                    activeSlide === index
                      ? "h-2.5 w-7 rounded-full bg-[#df336d] transition-all"
                      : "h-2.5 w-2.5 rounded-full bg-[#102a54]/30 transition-all hover:bg-[#102a54]/55"
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
