import { CommunityPhotos } from "../components/CommunityPhotos";

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-12 sm:py-14">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
        <CommunityPhotos className="aspect-[4/3] w-full rounded-2xl" />
        <div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#0873ae]">
          About Lutz Scoops
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#102a54] sm:text-4xl">
          Locally operated. Community focused.
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-[#102a54]/64">
          Lutz Scoops is locally operated by Northstar Hospitality Group LLC,
          with a focus on friendly service, a welcoming experience and serving
          the Lutz community well.
        </p><a href="/about" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#df336d] px-6 text-sm font-black uppercase text-white">Our Story</a></div>
      </div>
    </section>
  );
}
