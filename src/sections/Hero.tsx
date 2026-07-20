import { ArrowRight, IceCreamBowl, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[#fffaf6]"
    >
      <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[#f8ccdc]/45 blur-3xl" />
      <div className="absolute -right-20 bottom-4 h-96 w-96 rounded-full bg-[#ccecf8]/55 blur-3xl" />

      <div className="relative mx-auto grid min-h-[790px] max-w-[1440px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0873ae]/12 bg-white px-4 py-2 text-sm font-extrabold text-[#0873ae] shadow-sm">
            <Sparkles size={16} />
            Locally owned. Seriously delicious.
          </div>

          <h1 className="max-w-3xl text-[3.65rem] font-black leading-[0.91] tracking-[-0.065em] text-[#102a54] sm:text-[5rem] lg:text-[6.25rem]">
            Life is better
            <span className="block text-[#df336d]">with ice cream.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-[#102a54]/66 sm:text-xl">
            Premium scoops, milkshakes, sundaes, coffee, açaí bowls and
            more—served with a smile at Lutz Lake Crossing.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#flavors"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-4 font-black text-white shadow-xl shadow-[#df336d]/20 transition hover:-translate-y-1 hover:bg-[#c92960]"
            >
              Explore Flavors
              <ArrowRight size={18} />
            </a>

            <a
              href="#visit"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0873ae] bg-white px-7 py-4 font-black text-[#0873ae] transition hover:-translate-y-1 hover:bg-[#edf8fc]"
            >
              <MapPin size={18} />
              Visit Us
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative mx-auto w-full max-w-[690px]"
        >
          <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/80 bg-gradient-to-br from-[#f9d6e3] via-white to-[#cdebf7] shadow-[0_40px_100px_rgba(16,42,84,0.16)]">
            <div className="absolute left-[12%] top-[12%] h-20 w-20 rounded-full bg-white/65 blur-sm" />
            <div className="absolute bottom-[10%] right-[8%] h-32 w-32 rounded-full bg-white/70 blur-md" />

            <div className="absolute inset-0 grid place-items-center px-10 text-center">
              <div>
                <div className="relative mx-auto grid h-72 w-72 place-items-center rounded-full bg-white/60 shadow-2xl shadow-[#102a54]/10 backdrop-blur-sm sm:h-96 sm:w-96">
                  <div className="absolute inset-5 rounded-full border border-white/80" />
                  <IceCreamBowl
                    size={170}
                    strokeWidth={1.15}
                    className="text-[#df336d] sm:h-[210px] sm:w-[210px]"
                  />
                </div>

                <p className="mt-7 text-xl font-black text-[#102a54]">
                  Your signature hero scoop goes here
                </p>
                <p className="mt-2 text-sm font-semibold text-[#102a54]/50">
                  Real Lutz Scoops photography is next.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 left-6 rounded-3xl bg-white px-5 py-4 shadow-xl shadow-[#102a54]/12 sm:left-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#df336d]">
              Made for cravings
            </p>
            <p className="mt-1 font-black text-[#102a54]">
              One scoop is never enough.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
