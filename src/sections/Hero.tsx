import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#fffaf5]"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="relative min-h-[560px] overflow-hidden sm:min-h-[610px] lg:min-h-[625px]">
          <img
            src="/images/lifestyle/homepage-lifestyle-collage.png"
            alt="Lutz Scoops ice cream, coffee, desserts, families and friends"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />

          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/94 via-white/64 to-transparent sm:w-[76%] lg:w-[66%]" />
          <div className="absolute inset-y-0 left-0 w-[48%] bg-white/18 blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex min-h-[560px] max-w-[680px] flex-col justify-center px-6 py-12 sm:min-h-[610px] sm:px-10 lg:min-h-[625px] lg:max-w-[790px] lg:px-20"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df336d] sm:text-sm">
              Handcrafted in Lutz, Florida
            </p>

            <h1 className="mt-4 text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#102a54] sm:text-[4rem] lg:text-[4.35rem]">
              Premium ice cream,
              <span className="block">coffee &amp; more.</span>
            </h1>

            <p className="mt-5 max-w-[470px] text-lg font-semibold leading-7 text-[#102a54]/82 sm:text-xl">
              Handcrafted flavors. Friendly faces.
              <span className="block">Made just for you.</span>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://lutzscoops.square.site/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-md shadow-[#df336d]/18 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
              >
                <ShoppingBag size={16} />
                Order Online
              </a>

              <a
                href="#flavors"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#102a54] bg-white/88 px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#102a54] transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Flavors
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
