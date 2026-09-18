import { AlertCircle, ShoppingBag, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPublicMenu, formatMenuPrice, groupPublicMenuItems, isModifierVariant, menuItemAnchor, type PublicMenuItem, type PublicMenuVariant } from "../lib/public-menu";
import { business } from "../config/business";

type MenuState = { status: "loading" } | { status: "ready"; items: PublicMenuItem[] } | { status: "error" };

function VariantRow({ variant, modifier = false }: { variant: PublicMenuVariant; modifier?: boolean }) {
  const price = formatMenuPrice(variant.price); if (!price) return null;
  const label = variant.sizeLabel?.trim() || variant.name?.trim() || "Regular";
  return <li className={`flex items-baseline justify-between gap-4 py-1 ${modifier ? "text-xs text-[#102a54]/62" : "text-sm font-bold text-[#102a54]"}`}><span>{label}</span><span className="shrink-0 font-black tabular-nums text-[#0873ae]">{price}</span></li>;
}

function MenuItemCard({ item }: { item: PublicMenuItem }) {
  const base = item.variants.filter(variant => !isModifierVariant(variant));
  const modifiers = item.variants.filter(isModifierVariant);
  return <article id={menuItemAnchor(item.name) ?? undefined} className="scroll-mt-28 border-b border-[#102a54]/10 py-5 first:pt-0">
    <h3 className="text-lg font-black leading-tight tracking-tight text-[#102a54]">{item.name}</h3>
    {item.description?.trim() && <p className="mt-1.5 text-sm leading-5 text-[#102a54]/65">{item.description}</p>}
    {base.length > 0 && <ul className="mt-3" aria-label={`${item.name} sizes and prices`}>{base.map((variant, index) => <VariantRow key={`${variant.name}-${variant.sizeLabel}-${index}`} variant={variant} />)}</ul>}
    {modifiers.length > 0 && <div className="mt-3 border-t border-dashed border-[#102a54]/12 pt-2"><h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#df336d]">Add-ons &amp; upgrades</h4><ul className="mt-1" aria-label={`${item.name} add-ons and upgrades`}>{modifiers.map((variant, index) => <VariantRow key={`${variant.name}-${index}`} variant={variant} modifier />)}</ul></div>}
  </article>;
}

export function MenuPage() {
  const [state, setState] = useState<MenuState>({ status: "loading" });
  useEffect(() => { const controller = new AbortController(); fetchPublicMenu(controller.signal).then(feed => { if (!controller.signal.aborted) setState({ status: "ready", items: feed.items }); }, () => { if (!controller.signal.aborted) setState({ status: "error" }); }); return () => controller.abort(); }, []);
  useEffect(() => { document.title = "Menu | Lutz Scoops"; }, []);
  useEffect(() => { if (state.status !== "ready" || !window.location.hash) return; const id = decodeURIComponent(window.location.hash.slice(1)); window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView()); }, [state]);
  const groups = state.status === "ready" ? groupPublicMenuItems(state.items) : [];
  return <div className="bg-[#fffaf4]">
    <header className="px-5 py-10 text-center sm:px-8 sm:py-12">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#df336d]">Scoops, sips &amp; more</p>
      <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[#102a54] sm:text-5xl">Our Menu</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#102a54]/68 sm:text-base">Current favorites, handcrafted scoops, coffee, shakes, bowls and more.</p>
      <a href={business.orderInfoPath} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#df336d] px-7 py-3 text-sm font-black uppercase text-white"><ShoppingBag size={17} />Order Online</a>
    </header>
    {groups.length > 0 && <nav aria-label="Menu categories" className="sticky top-[68px] z-30 border-y border-[#102a54]/10 bg-white/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto">{groups.map(group => <a key={group.id} href={`#${group.id}`} className="shrink-0 rounded-full border border-[#102a54]/12 px-4 py-2 text-xs font-black uppercase tracking-[0.05em] text-[#102a54] hover:border-[#df336d] hover:text-[#df336d]">{group.category}</a>)}</div></nav>}
    <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 lg:px-10">
      {state.status === "loading" && <p role="status" className="py-12 text-center font-bold text-[#0873ae]">Loading our current menu…</p>}
      {state.status === "ready" && <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">{groups.map(group => <section key={group.id} id={group.id} className="scroll-mt-32"><div className="mb-5 flex items-end justify-between border-b-2 border-[#102a54] pb-2"><h2 className="text-2xl font-black uppercase tracking-[-0.025em] text-[#102a54]">{group.category}</h2><span className="text-xs font-black text-[#df336d]">Lutz Scoops</span></div><div>{group.items.map((item, index) => <MenuItemCard key={`${item.name}-${index}`} item={item} />)}</div></section>)}</div>}
      {state.status === "ready" && groups.length === 0 && <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center"><Utensils className="mx-auto text-[#df336d]" /><h2 className="mt-3 text-xl font-black">Our menu is being refreshed</h2></div>}
      {state.status === "error" && <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center"><AlertCircle className="mx-auto text-[#df336d]" /><h2 className="mt-3 text-xl font-black">Our menu is taking a moment</h2><p className="mt-2 text-sm text-[#102a54]/68">Please try again shortly or call us for today’s options.</p></div>}
    </div>
  </div>;
}
