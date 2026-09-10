import { AlertCircle, ShoppingBag, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchPublicMenu,
  formatMenuPrice,
  groupPublicMenuItems,
  isModifierVariant,
  menuItemAnchor,
  type PublicMenuItem,
  type PublicMenuVariant,
} from "../lib/public-menu";

type MenuState =
  | { status: "loading" }
  | { status: "ready"; items: PublicMenuItem[] }
  | { status: "error" };

function VariantRow({ variant, modifier = false }: { variant: PublicMenuVariant; modifier?: boolean }) {
  const price = formatMenuPrice(variant.price);
  if (!price) return null;
  const label = variant.sizeLabel?.trim() || variant.name?.trim() || "Regular";
  return (
    <li className={`flex min-h-8 items-baseline justify-between gap-4 ${modifier ? "text-sm text-[#102a54]/65" : "font-bold text-[#102a54]"}`}>
      <span className="min-w-0 break-words">{label}</span>
      <span className="shrink-0 font-black tabular-nums text-[#0873ae]">{price}</span>
    </li>
  );
}

function MenuItemCard({ item }: { item: PublicMenuItem }) {
  const baseVariants = item.variants.filter((variant) => !isModifierVariant(variant));
  const modifiers = item.variants.filter(isModifierVariant);
  const anchor = menuItemAnchor(item.name);
  return (
    <article id={anchor ?? undefined} className="scroll-mt-28 rounded-[1.6rem] border border-[#102a54]/10 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-xl font-black leading-tight tracking-[-0.025em] text-[#102a54] sm:text-2xl">{item.name}</h3>
      {item.description?.trim() && <p className="mt-2 text-sm leading-6 text-[#102a54]/68 sm:text-base">{item.description}</p>}
      {baseVariants.length > 0 && <ul className="mt-5 space-y-2" aria-label={`${item.name} sizes and prices`}>
        {baseVariants.map((variant, index) => <VariantRow key={`${variant.name}-${variant.sizeLabel}-${index}`} variant={variant} />)}
      </ul>}
      {modifiers.length > 0 && (
        <div className="mt-5 border-t border-[#102a54]/10 pt-4">
          <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#df336d]">Add-ons &amp; upgrades</h4>
          <ul className="mt-3 space-y-2" aria-label={`${item.name} add-ons and upgrades`}>
            {modifiers.map((variant, index) => <VariantRow key={`${variant.name}-${variant.sizeLabel}-${index}`} variant={variant} modifier />)}
          </ul>
        </div>
      )}
    </article>
  );
}

export function MenuPage() {
  const [state, setState] = useState<MenuState>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    fetchPublicMenu(controller.signal).then(
      (feed) => { if (!controller.signal.aborted) setState({ status: "ready", items: feed.items }); },
      () => { if (!controller.signal.aborted) setState({ status: "error" }); },
    );
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (state.status !== "ready" || !window.location.hash) return;
    const anchor = decodeURIComponent(window.location.hash.slice(1));
    window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
  }, [state]);

  useEffect(() => {
    document.title = "Menu | Lutz Scoops";
    const description = "Explore the current Lutz Scoops menu, including ice cream, sundaes, milkshakes, floats, coffee and açaí bowls in Lutz, Florida.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, []);

  const groups = state.status === "ready" ? groupPublicMenuItems(state.items) : [];
  return (
    <div className="bg-[#fffaf4]">
      <section className="px-5 py-12 text-center sm:px-8 sm:py-16 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d] sm:text-sm">Scoops, sips &amp; more</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-5xl lg:text-6xl">Our Menu</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#102a54]/70 sm:text-lg">See what we’re serving, from handcrafted scoops to coffee, shakes and bowls.</p>
        <a href="https://lutzscoops.square.site/" target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3.5 text-sm font-black uppercase tracking-[0.04em] text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960]">
          <ShoppingBag size={17} aria-hidden="true" />Order Online
        </a>
      </section>

      <div className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        {state.status === "loading" && <p role="status" className="py-14 text-center font-bold text-[#0873ae]">Loading our current menu…</p>}
        {state.status === "ready" && groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-28 border-t border-[#102a54]/10 py-10 first:border-t-0 first:pt-0 sm:py-12">
            <div className="mb-6 sm:mb-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#df336d]">Lutz Scoops</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#102a54] sm:text-4xl">{group.category}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {group.items.map((item, index) => <MenuItemCard key={`${item.name}-${index}`} item={item} />)}
            </div>
          </section>
        ))}
        {state.status === "ready" && groups.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-[1.6rem] border border-[#102a54]/10 bg-white p-8 text-center shadow-sm sm:p-10">
            <Utensils className="mx-auto text-[#df336d]" size={42} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black text-[#102a54]">Our menu is being refreshed</h2>
            <p className="mt-3 leading-7 text-[#102a54]/70">Check back shortly, or stop in and let our team help you find something delicious.</p>
          </div>
        )}
        {state.status === "error" && (
          <div className="mx-auto max-w-2xl rounded-[1.6rem] border border-[#102a54]/10 bg-white p-8 text-center shadow-sm sm:p-10">
            <AlertCircle className="mx-auto text-[#df336d]" size={42} aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black text-[#102a54]">Our menu is taking a moment</h2>
            <p className="mt-3 leading-7 text-[#102a54]/70">We couldn’t load the current menu. Please try again shortly, or call us for today’s options.</p>
            <a href="tel:+17275044722" className="mt-5 inline-flex min-h-11 items-center font-extrabold underline underline-offset-4">Call 727-504-4722</a>
          </div>
        )}
      </div>
    </div>
  );
}
