import {
  ArrowRight,
  Clock3,
  MapPin,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#fff9f4]"
    >
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#f8cade]/45 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#ccecf8]/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[760px] lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0873ae]/10 bg-white px-4 py-2 text-sm font-black text-[#0873ae] shadow-sm">
            <Sparkles size={16} />
            Locally owned in Lutz, Florida
          </div>

          <h1 className="mt-7 max-w-3xl text-[3.45rem] font-black leading-[0.92] tracking-[-0.065em] text-[#102a54] sm:text-[4.75rem] lg:text-[6rem]">
            Good ice cream.
            <span className="block text-[#df336d]">Good coffee.</span>
            <span className="block text-[#0873ae]">Good vibes.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[#102a54]/65 sm:text-xl">
            Premium scoops, milkshakes, sundaes, coffee, açaí bowls and
            more—served with genuine hospitality seven days a week.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://lutzscoops.square.site/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-4 font-black text-white shadow-xl shadow-[#df336d]/20 transition hover:-translate-y-1 hover:bg-[#c92960]"
            >
              <ShoppingBag size={18} />
              Order Online
            </a>

            <a
              href="#visit"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0873ae] bg-white px-7 py-4 font-black text-[#0873ae] transition hover:-translate-y-1 hover:bg-[#edf8fc]"
            >
              <MapPin size={18} />
              Visit Us
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-[#102a54]/58">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-[#df336d]" />
              Open seven days
            </span>

            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-[#0873ae]" />
              Lutz Lake Crossing
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[690px]"
        >
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/80 bg-white shadow-[0_40px_100px_rgba(16,42,84,0.18)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7cddd]/30 via-transparent to-[#d6eff8]/45" />

            <img
              src="/images/flavors/cookie-monster.png"
              alt="Cookie Monster ice cream in a Lutz Scoops branded cup"
              className="relative h-auto w-full"
              fetchPriority="high"
            />
          </div>

          <div className="absolute -bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-[1.75rem] bg-white px-6 py-5 shadow-2xl shadow-[#102a54]/15 sm:left-10 sm:right-auto sm:min-w-[310px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df336d]">
                Featured flavor
              </p>

              <p className="mt-1 text-xl font-black text-[#102a54]">
                Cookie Monster
              </p>
            </div>

            <a
              href="#flavors"
              aria-label="Explore featured flavors"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#102a54] text-white transition hover:translate-x-1"
            >
              <ArrowRight size={19} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
