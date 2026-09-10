import { IceCreamBowl, MapPin, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { displayedDietaryCodes, loadPublicFlavorFeed, type PublicFlavor, type PublicFlavorFeed } from "../lib/public-flavors";
import { business } from "../config/business";

type AvailabilityState =
  | { status: "loading" }
  | { status: "ready"; feed: PublicFlavorFeed }
  | { status: "error" };

function FlavorCard({ flavor }: { flavor: PublicFlavor }) {
  const [failedImage, setFailedImage] = useState(false);
  const badges = displayedDietaryCodes(flavor.dietaryMetadata);
  const allergens = flavor.containsAllergens?.filter(value => value.trim()) ?? [];
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-[#102a54]/10 bg-white shadow-sm">
      <div className="aspect-[4/5] overflow-hidden bg-[#fff3f7]">
        {flavor.imageUrl?.trim() && !failedImage ? (
          <img src={flavor.imageUrl} alt={flavor.name} loading="lazy" decoding="async"
            className="h-full w-full object-cover" onError={() => setFailedImage(true)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#df336d]" aria-label="Flavor photo coming soon">
            <IceCreamBowl size={56} strokeWidth={1.25} aria-hidden="true" />
            <span className="text-sm font-bold">Photo coming soon</span>
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <h2 className="break-words text-xl font-black leading-tight tracking-[-0.02em] text-[#102a54]">{flavor.name}</h2>
        {flavor.description?.trim() && <p className="mt-3 break-words text-sm leading-6 text-[#102a54]/75">{flavor.description}</p>}
        {badges.length > 0 && <ul aria-label="Dietary information" className="mt-4 flex flex-wrap gap-2">
          {badges.map(code => <li key={code} className="rounded-full bg-[#eaf6fb] px-3 py-1 text-xs font-extrabold text-[#0873ae]">{code}</li>)}
        </ul>}
        {allergens.length > 0 && <p className="mt-4 break-words text-sm leading-6 text-[#102a54]/80"><strong>Contains:</strong> {allergens.join(", ")}</p>}
        {flavor.showAskStaff && <p className="mt-4 text-sm font-bold leading-6 text-[#102a54]">Ask Staff about dietary and allergen details.</p>}
      </div>
    </article>
  );
}

export function FlavorsPage() {
  const [state, setState] = useState<AvailabilityState>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    loadPublicFlavorFeed(controller.signal).then(
      feed => { if (!controller.signal.aborted) setState({ status: "ready", feed }); },
      () => { if (!controller.signal.aborted) setState({ status: "error" }); },
    );
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = "Today’s Flavors | Lutz Scoops";
    const description = "See the ice cream flavors currently available at Lutz Scoops in Lutz, Florida, with flavor descriptions and dietary information.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, []);

  return (
    <section className="bg-[#fffaf4] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d] sm:text-sm">From our scoop case</p>
          <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.04em] text-[#102a54] sm:text-5xl lg:text-6xl">Today’s Flavors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#102a54]/70 sm:text-lg">Find your favorite, or try something new. Here’s what’s currently scooping at Lutz Scoops.</p>
          <p role="status" className="mt-5 text-sm font-extrabold text-[#0873ae]">
            {state.status === "loading" && "Checking today’s scoop case…"}
            {state.status === "ready" && `${state.feed.count} ${state.feed.count === 1 ? "flavor" : "flavors"} available now`}
            {state.status === "error" && "Current availability is temporarily unavailable"}
          </p>
        </div>

        {state.status === "ready" && state.feed.available.length > 0 && <>
          <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.feed.available.map(flavor => <FlavorCard key={flavor.id} flavor={flavor} />)}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-[#102a54]/70">Dietary questions or allergies? Ask our team before ordering.</p>
        </>}

        {state.status === "ready" && state.feed.available.length === 0 && (
          <div className="mx-auto mt-9 max-w-2xl rounded-[1.6rem] border border-[#102a54]/10 bg-white px-6 py-9 text-center shadow-sm sm:p-10">
            <IceCreamBowl className="mx-auto text-[#df336d]" size={44} strokeWidth={1.5} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black tracking-[-0.03em]">A fresh look at the scoop case</h2>
            <p className="mt-3 text-base leading-7 text-[#102a54]/70">Today’s flavors haven’t been posted yet. Check back shortly or stop in to see what’s scooping today.</p>
          </div>
        )}
        {state.status === "error" && (
          <div className="mx-auto mt-9 max-w-2xl rounded-[1.6rem] border border-[#102a54]/10 bg-white px-6 py-9 text-center shadow-sm sm:p-10">
            <h2 className="text-2xl font-black tracking-[-0.03em]">Let’s check with the scoop crew</h2>
            <p className="mt-3 text-base leading-7 text-[#102a54]/70">We couldn’t load today’s flavors. Please try again in a little while, or call or visit us for current availability.</p>
            <a href={business.phone.href} className="mt-5 inline-flex min-h-11 items-center font-extrabold underline underline-offset-4">Call {business.phone.display}</a>
          </div>
        )}

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <a href={business.orderOnlineUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]">
            <ShoppingBag size={16} aria-hidden="true" />Order Online
          </a>
          <a href="/visit" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#102a54]/15 bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-[#102a54] transition hover:border-[#df336d]/40">
            <MapPin size={16} aria-hidden="true" />Visit Lutz Scoops
          </a>
        </div>
      </div>
    </section>
  );
}
