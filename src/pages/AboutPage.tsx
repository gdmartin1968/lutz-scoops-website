import { ArrowRight, MapPin } from "lucide-react";
import { useEffect } from "react";

const storefrontImage = "/images/lifestyle/homepage-storefront-standalone.png";

export function AboutPage() {
  useEffect(() => {
    document.title = "About Us | Lutz Scoops";
    const description = "Learn the story of Lutz Scoops, a locally owned and family-operated neighborhood shop serving the Lutz community.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, []);
  return (
    <div className="bg-[#fffaf4] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        <header className="text-center"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d]">Our neighborhood shop</p><h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] text-[#102a54] sm:text-5xl lg:text-6xl">About Us</h1></header>
        <div className="mt-9 grid items-center gap-9 sm:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="aspect-square overflow-hidden rounded-[1.6rem] border border-[#102a54]/10 bg-[#eaf6fb] shadow-xl shadow-[#102a54]/8 sm:rounded-[2rem]"><img src={storefrontImage} alt="Lutz Scoops storefront on North Dale Mabry Highway" className="h-full w-full object-cover object-right" /></div>
          <section aria-labelledby="story-heading" className="lg:py-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#df336d]">Our story</p>
            <h2 id="story-heading" className="mt-3 text-3xl font-black uppercase leading-[1.04] tracking-[-0.04em] text-[#102a54] sm:text-4xl lg:text-5xl">Locally owned.<br />Family operated.<br />Community focused.</h2>
            <div className="mt-6 max-w-2xl space-y-4 text-base font-medium leading-7 text-[#102a54]/72 sm:leading-8">
              <p>Lutz Scoops began as a family business in January 2021, when Stacee and KC Campbell opened the shop at the height of the pandemic. From the beginning, Lutz Scoops became part of the Lutz community—a neighborhood spot built around great ice cream, friendly faces, and a commitment to the community it serves.</p>
              <p>On June 27, 2026, Gordon Martin took ownership of Lutz Scoops, beginning the next chapter of the shop’s story as a locally owned and family-operated business.</p>
              <p>Before Lutz Scoops, Gordon spent more than a decade running his own small preschool in Pinellas County. After moving from Clearwater to Wesley Chapel, he decided it was time for a change of pace. Trading preschool classrooms for ice cream, coffee, and conversations with neighbors has turned out to be a pretty enjoyable change.</p>
              <p>And it really is a family operation. Gordon’s older sons, JT and Daniel, help Dad on the business side, while four-year-old Stefan has appointed himself Lutz Scoops’ official taste tester—a position he takes very seriously.</p>
              <p>When Gordon isn’t at the shop, there’s a good chance you’ll find him on a tennis or pickleball court, either teaching or playing.</p>
              <p>Through different owners and different chapters, the idea at the heart of Lutz Scoops remains pretty simple: great treats, good people, and a neighborhood shop we’re proud to call ours.</p>
            </div>
            <a href="/visit" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"><MapPin size={17} aria-hidden="true" />Visit Us<ArrowRight size={17} aria-hidden="true" /></a>
          </section>
        </div>
      </div>
    </div>
  );
}
