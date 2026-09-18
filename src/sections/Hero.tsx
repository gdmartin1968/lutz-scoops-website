import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { business } from "../config/business";

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="top" className="overflow-hidden bg-[#fff8ef]">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[540px] lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }} className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df336d] sm:text-sm">Handcrafted in Lutz, Florida</p>
          <h1 className="mt-4 max-w-[690px] text-[2.75rem] font-black uppercase leading-[0.96] tracking-[-0.045em] text-[#102a54] sm:text-[3.8rem] lg:text-[4.2rem]">Premium ice cream,<span className="block">coffee &amp; more.</span></h1>
          <p className="mt-5 max-w-[500px] text-lg font-semibold leading-7 text-[#102a54]/76">Handcrafted flavors. Friendly faces.<span className="block">Made just for you.</span></p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={business.orderInfoPath} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"><ShoppingBag size={17} />Order Online</a>
            <a href="/flavors" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#102a54] bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#102a54] transition hover:-translate-y-0.5">View Flavors<ArrowRight size={17} /></a>
          </div>
        </motion.div>
        <div className="relative flex items-center justify-center bg-[#f4ece3] p-5 sm:p-8 lg:p-6">
          <img src="/images/flavors/mango-sorbet.png" alt="Mango Sorbet ice cream served in a Lutz Scoops cup" className="block aspect-square w-full max-w-[580px] object-contain" fetchPriority="high" />
          <div className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-[#fff8ef] to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
