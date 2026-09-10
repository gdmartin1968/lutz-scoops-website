import { Heart } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-18 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f5] text-[#df336d]">
          <Heart size={27} fill="currentColor" />
        </div>

        <p className="mt-7 text-sm font-black uppercase tracking-[0.26em] text-[#0873ae]">
          About Lutz Scoops
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-5xl">
          Locally operated. Community focused.
        </h2>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#102a54]/64">
          Lutz Scoops is locally operated by Northstar Hospitality Group LLC,
          with a focus on friendly service, a welcoming experience and serving
          the Lutz community well.
        </p>
      </div>
    </section>
  );
}
