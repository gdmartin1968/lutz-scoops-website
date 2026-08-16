import {
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

const links = [
  { label: "Home", href: "#top" },
  { label: "Flavors", href: "#flavors" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Visit", href: "#visit" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#102a54]/8 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[78px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          aria-label="Lutz Scoops home"
          onClick={closeMenu}
          className="shrink-0"
        >
          <BrandMark />
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-3 text-sm font-extrabold text-[#102a54]/72 transition hover:text-[#df336d]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/order.html"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#df336d] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960] sm:inline-flex"
          >
            <ShoppingBag size={17} />
            Order Online
          </a>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#102a54]/12 bg-white text-[#102a54] transition hover:border-[#df336d]/30 hover:text-[#df336d] lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#102a54]/8 bg-white px-5 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-lg font-black text-[#102a54] transition hover:bg-[#fff3f7] hover:text-[#df336d]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/order.html"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#df336d] px-6 py-4 text-center font-black text-white shadow-lg shadow-[#df336d]/20"
            >
              <ShoppingBag size={18} />
              Order Online
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
