import { Clock3, MapPin, Navigation, Phone } from "lucide-react";
import { useEffect } from "react";
import { business } from "../config/business";

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
        <a aria-label="View Lutz Scoops on Google Maps" href={business.directionsUrl} target="_blank" rel="noreferrer" className="relative mt-9 flex h-[260px] overflow-hidden rounded-[1.6rem] border border-[#102a54]/10 bg-[#dff2f9] shadow-xl shadow-[#102a54]/7 sm:mt-12 sm:h-[340px] sm:rounded-[2rem] lg:h-[390px]">
          <div aria-hidden="true" className="absolute inset-0 opacity-55 [background-image:linear-gradient(32deg,transparent_0%,transparent_46%,white_47%,white_52%,transparent_53%),linear-gradient(145deg,transparent_0%,transparent_35%,white_36%,white_40%,transparent_41%),linear-gradient(90deg,transparent_0%,transparent_68%,#b9dfe9_69%,#b9dfe9_72%,transparent_73%)]" />
          <div className="relative m-auto flex flex-col items-center px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#df336d] text-white shadow-lg shadow-[#102a54]/20"><MapPin size={32} fill="currentColor" aria-hidden="true" /></span>
            <span className="mt-4 rounded-full bg-white/95 px-5 py-3 text-sm font-black text-[#102a54] shadow-md sm:text-base">Lutz Scoops · North Dale Mabry Highway</span>
          </div>
        </a>
        <div className="mx-auto mt-9 grid max-w-[920px] gap-10 sm:mt-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
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
        <div className="mt-12 text-center sm:mt-14">
          <a href={business.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#df336d] bg-white px-8 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#df336d] transition hover:-translate-y-0.5 hover:bg-[#fff2f6]"><Navigation size={17} aria-hidden="true" />Get Directions</a>
        </div>
      </div>
    </div>
  );
}
