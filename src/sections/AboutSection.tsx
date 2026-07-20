import { Heart } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f5] text-[#df336d]">
          <Heart size={27} fill="currentColor" />
        </div>

        <p className="mt-7 text-sm font-black uppercase tracking-[0.26em] text-[#0873ae]">
          Locally owned
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-6xl">
          Built around great treats and genuine hospitality.
        </h2>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#102a54]/64">
          Lutz Scoops is a locally owned ice cream and coffee shop operated
          by Northstar Hospitality Group LLC. We believe every visit should
          feel welcoming, memorable and just a little sweeter.
        </p>
      </div>
    </section>
  );
}
