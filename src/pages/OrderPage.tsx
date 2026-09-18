import { ArrowUpRight, Clock3, ShoppingBag, Truck } from "lucide-react";
import { useEffect } from "react";
import { commerce, ownedPickupDestination, providerDestination, type CommerceProvider } from "../config/commerce.ts";

const icons = { pickup: ShoppingBag, delivery: Truck } as const;

export function OrderProviderCard({ option }: { option: CommerceProvider }) {
  const destination = providerDestination(option);
  const Icon = icons[option.id];
  const statusId = `${option.id}-status`;
  return (
    <article data-fulfillment={option.id} aria-labelledby={`${option.id}-heading`} className={`rounded-3xl border p-5 sm:p-7 ${destination ? "border-[#df336d]/25 bg-white shadow-lg shadow-[#102a54]/8" : "border-[#102a54]/15 bg-[#f1ede8]"}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${destination ? "bg-[#fff0f5] text-[#df336d]" : "bg-white text-[#0873ae]"}`}><Icon size={24} aria-hidden="true" /></div>
        <h2 id={`${option.id}-heading`} className="text-2xl font-black text-[#102a54]">{option.title}</h2>
        <span className="ml-auto text-sm font-bold text-[#0873ae]">{option.provider}</span>
      </div>
      <p id={statusId} className="mt-3 text-base leading-6 text-[#102a54]">{destination ? option.description : option.enabled ? `${option.title} is temporarily unavailable.` : option.unavailableMessage}</p>
      {destination ? (
        <a href={destination} data-event={`${option.id}_selected`} data-provider={option.provider} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c92960] px-5 py-3 text-base font-bold text-white! hover:bg-[#b52355] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#102a54]">
          {option.actionLabel}<ArrowUpRight size={18} aria-hidden="true" />
        </a>
      ) : (
        <button type="button" disabled aria-describedby={statusId} data-event={`${option.id}_unavailable_interaction`} data-provider={option.provider} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#dce0e6] px-5 py-3 text-base font-bold text-[#102a54] disabled:cursor-not-allowed">
          <Clock3 size={18} aria-hidden="true" />{option.title} unavailable
        </button>
      )}
    </article>
  );
}

export function OrderPage() {
  useEffect(() => { document.title = "Order Online | Lutz Scoops"; }, []);
  const ownedPickupUrl = ownedPickupDestination(window.location.hostname);
  return (
    <div data-event="order_online_opened" className="bg-[#fff8ef] px-5 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-[960px]">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#df336d]">Order online</p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.035em] text-[#102a54] sm:text-4xl">How would you like to get your Lutz Scoops?</h1>
        </header>
        {ownedPickupUrl && <article className="mt-6 rounded-3xl border-2 border-[#df336d] bg-white p-5 shadow-lg shadow-[#102a54]/8 sm:p-7" data-fulfillment="owned-pickup">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#df336d]">Direct from Lutz Scoops</p>
          <h2 className="mt-2 text-2xl font-black text-[#102a54]">Order for pickup · Pay at pickup</h2>
          <p className="mt-2 text-base leading-6 text-[#102a54]">Choose exact flavors from our live menu. No online payment is taken; pay when you pick up your order.</p>
          <a href={ownedPickupUrl} data-event="owned_pickup_selected" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c92960] px-5 py-3 text-base font-bold text-white! hover:bg-[#b52355] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#102a54]">Start a pickup order <ArrowUpRight size={18} aria-hidden="true" /></a>
        </article>}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {commerce.providers.map(option => <OrderProviderCard key={option.id} option={option} />)}
        </div>
      </div>
    </div>
  );
}
