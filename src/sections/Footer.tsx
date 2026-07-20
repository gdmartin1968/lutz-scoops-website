import { BrandMark } from "../components/BrandMark";

export function Footer() {
  return (
    <footer className="bg-[#102a54] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end lg:px-12">
        <div>
          <BrandMark light />
          <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
            Premium ice cream, coffee, milkshakes, sundaes, açaí bowls and
            more in Lutz, Florida.
          </p>
        </div>

        <div className="text-sm text-white/55 md:text-right">
          <p>© 2026 Northstar Hospitality Group LLC</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
