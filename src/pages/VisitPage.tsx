import { Clock3, ExternalLink, MapPin, Navigation, Phone, ShoppingBag, Utensils } from "lucide-react";
import { useEffect } from "react";
import { InteractiveVisitMap } from "../components/InteractiveVisitMap";
import { business } from "../config/business";

const storefrontImage = "/images/lifestyle/homepage-storefront-standalone.png";

export function VisitPage() {
  useEffect(() => {
    document.title = "Visit Us | Lutz Scoops";
    const description = `Visit Lutz Scoops at ${business.address.street} in ${business.address.cityStateZip}. See current hours and get directions.`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, []);

  return (
    <div className="bg-[#fffaf4] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1120px]">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d]">Come scoop with us</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.045em] text-[#102a54] sm:text-5xl lg:text-6xl">Visit Us</h1>
        </header>

        <div className="relative z-0 mt-9 overflow-hidden rounded-2xl border border-[#102a54]/10 bg-[#dff2f9] shadow-lg shadow-[#102a54]/7 sm:mt-12 sm:rounded-[1.25rem]">
          <InteractiveVisitMap />
        </div>

        <div className="mx-auto mt-9 grid max-w-[980px] gap-9 sm:mt-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
          <figure className="overflow-hidden rounded-2xl border border-[#102a54]/10 bg-white shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={storefrontImage} alt="Lutz Scoops storefront on North Dale Mabry Highway" className="h-full w-full origin-right scale-[1.35] object-cover object-right" />
            </div>
            <figcaption className="p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#df336d]">Look for us</p>
              <p className="mt-2 font-bold leading-7 text-[#102a54]">Look for the Lutz Scoops sign along North Dale Mabry Highway.</p>
            </figcaption>
          </figure>

          <div className="space-y-9">
            <section aria-labelledby="location-heading">
              <h2 id="location-heading" className="text-xs font-black uppercase tracking-[0.2em] text-[#df336d]">Location</h2>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-4"><MapPin className="mt-0.5 shrink-0 text-[#df336d]" size={22} aria-hidden="true" /><address className="not-italic font-bold leading-7 text-[#102a54]"><span className="block">{business.address.street}</span><span className="block">{business.address.cityStateZip}</span></address></div>
                <div className="flex items-center gap-4"><Phone className="shrink-0 text-[#df336d]" size={22} aria-hidden="true" /><a href={business.phone.href} className="font-bold text-[#102a54] transition hover:text-[#df336d]">{business.phone.display}</a></div>
              </div>
            </section>

            <section aria-labelledby="hours-heading">
              <div className="flex items-center gap-3"><Clock3 className="text-[#df336d]" size={22} aria-hidden="true" /><h2 id="hours-heading" className="text-xs font-black uppercase tracking-[0.2em] text-[#102a54]">Hours</h2></div>
              <dl className="mt-5 space-y-3">
                {business.hours.map(({ days, time }) => <div key={days} className="grid grid-cols-[1fr_auto] items-baseline gap-5 text-sm sm:text-base"><dt className="font-semibold text-[#102a54]/72">{days}</dt><dd className="text-right font-black text-[#102a54]">{time}</dd></div>)}
              </dl>
            </section>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap">
          <a href={business.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-8 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]"><Navigation size={17} aria-hidden="true" />Get Directions</a>
          <a href={business.orderOnlineUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#102a54]/15 bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#102a54] transition hover:border-[#df336d]/40"><ShoppingBag size={16} aria-hidden="true" />Order Online<ExternalLink size={14} aria-hidden="true" /></a>
        </div>
        <nav aria-label="Explore before your visit" className="mt-5 flex items-center justify-center gap-6 text-sm font-extrabold text-[#0873ae]">
          <a href="/menu" className="inline-flex min-h-11 items-center gap-2 underline decoration-[#0873ae]/30 underline-offset-4 hover:text-[#df336d]"><Utensils size={16} aria-hidden="true" />Menu</a>
          <a href="/flavors" className="inline-flex min-h-11 items-center underline decoration-[#0873ae]/30 underline-offset-4 hover:text-[#df336d]">Today&apos;s Flavors</a>
        </nav>
      </div>
    </div>
  );
}
