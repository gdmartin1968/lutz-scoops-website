import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const FAMILY_ROTATION_MS = 8000;

const approvedFamilyImages = [
  { src: "/images/lifestyle/hero-collage/family-01.png", objectPosition: "50% center" },
  { src: "/images/lifestyle/hero-collage/family-02.png", objectPosition: "38% center" },
  { src: "/images/lifestyle/hero-collage/family-03.png", objectPosition: "52% center" },
  { src: "/images/lifestyle/hero-collage/family-04.png", objectPosition: "50% center" },
  { src: "/images/lifestyle/hero-collage/family-05.png", objectPosition: "44% center" },
] as const;

type PanelProps = {
  src: string;
  alt: string;
  className: string;
  fit?: "cover" | "contain";
};

function Panel({ src, alt, className, fit = "cover" }: PanelProps) {
  return (
    <div className={`absolute overflow-hidden bg-[#fffaf5] ${className}`}>
      <img src={src} alt={alt} className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`} />
    </div>
  );
}

export function HomepageCollage({ visible }: { visible: boolean }) {
  const [familyIndex, setFamilyIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || approvedFamilyImages.length < 2) return;
    const timer = window.setInterval(() => {
      setFamilyIndex(current => (current + 1) % approvedFamilyImages.length);
    }, FAMILY_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const family = approvedFamilyImages[familyIndex];

  return (
    <div aria-label="Lutz Scoops treats and community" className={`absolute inset-y-0 right-0 z-[2] w-[46%] bg-white ${visible ? "hidden lg:block" : "hidden"}`}>
      <Panel src="/images/lifestyle/hero-collage/five-flavor-cups.png" alt="Five branded Lutz Scoops cups with five different visible ice cream flavors" fit="contain" className="left-0 top-0 h-[21.9%] w-[57.6%]" />
      <Panel src="/images/lifestyle/hero-collage/coffee.png" alt="Coffee pouring into a branded Lutz Scoops mug" className="right-0 top-0 h-[21.9%] w-[41.1%]" />

      <div data-family-panel className="absolute left-0 top-[22.6%] h-[50.8%] w-[57.6%] overflow-hidden bg-[#fffaf5]">
        <AnimatePresence initial={false}>
          <motion.img
            data-family-slide={familyIndex + 1}
            key={family.src}
            src={family.src}
            alt=""
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            style={{ objectPosition: family.objectPosition }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <Panel src="/images/lifestyle/hero-collage/milkshake.png" alt="A boy drinking a whipped cream and chocolate drizzle milkshake" className="right-0 top-[22.8%] h-[46.6%] w-[41.1%]" />
      <Panel src="/images/lifestyle/hero-collage/friends.png" alt="Two friends enjoying Lutz Scoops drinks" className="bottom-0 left-0 h-[25.7%] w-[30.8%]" />
      <Panel src="/images/lifestyle/hero-collage/lutz-scoops-sign.png" alt="Lutz Scoops wall sign" className="bottom-0 left-[31.4%] h-[25.7%] w-[29.7%]" />
      <Panel src="/images/lifestyle/hero-collage/good-vibes-neon.png" alt="Good ice cream, good coffee, good vibes neon sign" className="bottom-0 right-0 h-[29.6%] w-[38.4%]" />
    </div>
  );
}
