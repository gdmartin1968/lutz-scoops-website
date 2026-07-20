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
        <div className="relative min-h-[610px] overflow-hidden sm:min-h-[680px] lg:min-h-[720px]">
          <img
            src="/images/lifestyle/homepage-lifestyle-collage.png"
            alt="Lutz Scoops ice cream, coffee, desserts, families and friends"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/76 to-white/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf5]/28 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10 flex min-h-[610px] max-w-[680px] flex-col justify-center px-6 py-14 sm:min-h-[680px] sm:px-10 lg:min-h-[720px] lg:px-20"
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#df336d] sm:text-base">
              Handcrafted in Lutz, Florida
            </p>

            <h1 className="mt-5 text-[3.15rem] font-black leading-[0.94] tracking-[-0.055em] text-[#102a54] sm:text-[4.5rem] lg:text-[5.15rem]">
              Premium ice cream,
              <span className="block">coffee &amp; more.</span>
            </h1>

            <p className="mt-6 max-w-[500px] text-lg font-semibold leading-8 text-[#102a54]/82 sm:text-xl">
              Handcrafted flavors. Friendly faces.
              <span className="block">Made just for you.</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://lutzscoops.square.site/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"
              >
                <ShoppingBag size={17} />
                Order Online
              </a>

              <a
                href="#flavors"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#102a54] bg-white/90 px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-[#102a54] transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Flavors
                <ArrowRight size={17} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
