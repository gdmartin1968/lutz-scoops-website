import { IceCreamBowl, MapPin, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { displayedDietaryCodes, loadPublicFlavorFeed, type DietaryCode, type PublicFlavor, type PublicFlavorFeed } from "../lib/public-flavors";
import { business } from "../config/business";

type AvailabilityState = { status: "loading" } | { status: "ready"; feed: PublicFlavorFeed } | { status: "error" };
type Filter = "ALL" | Extract<DietaryCode, "GF" | "DF" | "V">;
const filters: Array<{ value: Filter; label: string }> = [{ value: "ALL", label: "All" }, { value: "GF", label: "Gluten Free" }, { value: "DF", label: "Dairy Free" }, { value: "V", label: "Vegan" }];

function FlavorCard({ flavor }: { flavor: PublicFlavor }) {
  const [failedImage, setFailedImage] = useState(false);
  const badges = displayedDietaryCodes(flavor.dietaryMetadata);
  return <article className="group min-w-0 overflow-hidden rounded-xl border border-[#102a54]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="aspect-square overflow-hidden bg-[#fffaf4]">
      {flavor.imageUrl?.trim() && !failedImage ? <img src={flavor.imageUrl} alt={`${flavor.name} ice cream`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]" onError={() => setFailedImage(true)} /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-[#df336d]" aria-label="Flavor photo coming soon"><IceCreamBowl size={40} strokeWidth={1.25} /><span className="text-xs font-bold">Photo coming soon</span></div>}
    </div>
    <div className="p-3 text-center sm:p-3.5">
      <h2 className="break-words text-sm font-black leading-tight text-[#102a54] sm:text-base">{flavor.name}</h2>
      {badges.length > 0 && <ul aria-label="Dietary information" className="mt-2 flex flex-wrap justify-center gap-1">{badges.map(code => <li key={code} className="rounded-full bg-[#eaf6fb] px-2 py-0.5 text-[10px] font-black text-[#0873ae]">{code}</li>)}</ul>}
      {flavor.description?.trim() && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#102a54]/65">{flavor.description}</p>}
      {flavor.showAskStaff && <p className="mt-2 text-[11px] font-bold text-[#102a54]/65">Ask staff for dietary details.</p>}
    </div>
  </article>;
}

export function FlavorsPage() {
  const [state, setState] = useState<AvailabilityState>({ status: "loading" });
  const [filter, setFilter] = useState<Filter>("ALL");
  useEffect(() => { const controller = new AbortController(); loadPublicFlavorFeed(controller.signal).then(feed => { if (!controller.signal.aborted) setState({ status: "ready", feed }); }, () => { if (!controller.signal.aborted) setState({ status: "error" }); }); return () => controller.abort(); }, []);
  useEffect(() => { document.title = "Today’s Flavors | Lutz Scoops"; }, []);
  const visible = useMemo(() => state.status === "ready" ? state.feed.available.filter(flavor => filter === "ALL" || flavor.dietaryMetadata?.[filter]?.value === "yes") : [], [state, filter]);

  return <div className="bg-[#fffaf4] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
    <div className="mx-auto max-w-[1280px]">
      <header className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d]">Live from our scoop case</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[#102a54] sm:text-5xl">Today’s Flavors</h1>
        <p role="status" className="mt-3 text-sm font-bold text-[#102a54]/68">{state.status === "loading" && "Checking today’s scoop case…"}{state.status === "ready" && `${state.feed.count} ${state.feed.count === 1 ? "flavor" : "flavors"} available now`}{state.status === "error" && "Current availability is temporarily unavailable"}</p>
      </header>
      {state.status === "ready" && <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Filter flavors">{filters.map(item => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={`min-h-10 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.05em] transition ${filter === item.value ? "border-[#df336d] bg-[#df336d] text-white" : "border-[#102a54]/15 bg-white text-[#102a54] hover:border-[#0873ae]"}`}>{item.label}</button>)}</div>}
      {state.status === "ready" && visible.length > 0 && <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{visible.map(flavor => <FlavorCard key={flavor.id} flavor={flavor} />)}</div>}
      {state.status === "ready" && visible.length === 0 && <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#102a54]/10 bg-white p-8 text-center"><IceCreamBowl className="mx-auto text-[#df336d]" size={38} /><h2 className="mt-3 text-xl font-black">No matching flavors right now</h2><p className="mt-2 text-sm text-[#102a54]/68">Try another filter or check back as the scoop case changes.</p></div>}
      {state.status === "error" && <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#102a54]/10 bg-white p-8 text-center"><h2 className="text-xl font-black">Let’s check with the scoop crew</h2><p className="mt-2 text-sm leading-6 text-[#102a54]/68">We couldn’t load today’s flavors. Please try again shortly or call us.</p><a href={business.phone.href} className="mt-4 inline-flex min-h-11 items-center font-black text-[#0873ae] underline">Call {business.phone.display}</a></div>}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={business.orderInfoPath} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3 text-sm font-black uppercase text-white"><ShoppingBag size={16} />Order Online</a><a href="/visit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#102a54]/15 bg-white px-7 py-3 text-sm font-black uppercase text-[#102a54]"><MapPin size={16} />Visit Lutz Scoops</a></div>
    </div>
  </div>;
}
