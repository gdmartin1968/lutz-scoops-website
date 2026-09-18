import { BrandMark } from "../components/BrandMark";
import { business } from "../config/business";

export function Footer({ showOwner = true }: { showOwner?: boolean }) {
  const links = [["Flavors", "/flavors"], ["Menu", "/menu"], ["About", "/about"], ["Visit Us", "/visit"], ["Order Online", business.orderInfoPath]];
  return <footer className="bg-[#102a54] text-white">
    <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.25fr_0.75fr_1fr] lg:px-10">
      <div><BrandMark light /><p className="mt-5 max-w-sm text-sm leading-6 text-white/60">Premium ice cream, coffee, milkshakes, sundaes, açaí bowls and more in Lutz, Florida.</p></div>
      <nav aria-label="Footer" className="grid content-start gap-3 text-sm font-bold text-white/75">{links.map(([label, href]) => <a key={label} href={href} className="hover:text-white">{label}</a>)}</nav>
      <div className="text-sm leading-6 text-white/65 md:text-right"><p className="font-black text-white">{business.address.street}</p><p>{business.address.cityStateZip}</p><a href={business.phone.href} className="mt-1 block font-bold text-white">{business.phone.display}</a><p className="mt-5">© 2026 {showOwner ? "Northstar Hospitality Group LLC" : "Lutz Scoops"}</p><p>All rights reserved.</p></div>
    </div>
  </footer>;
}
