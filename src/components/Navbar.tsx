import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./BrandMark";

const links = [
  { label: "Flavors", href: "#flavors" },
  { label: "Menu", href: "#menu" },
  { label: "Visit", href: "#visit" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#102a54]/8 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Lutz Scoops home">
          <BrandMark />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-extrabold text-[#102a54]/70 transition hover:text-[#df336d]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://lutzscoops.square.site/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#df336d] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#df336d]/20 transition hover:-translate-y-0.5 hover:bg-[#c92960] sm:flex"
          >
            <ShoppingBag size={17} />
            Order Online
          </a>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#102a54]/12 bg-white text-[#102a54] lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[#102a54]/8 bg-white px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-lg font-black text-[#102a54] hover:bg-[#fff3f7]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="https://lutzscoops.square.site/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-[#df336d] px-6 py-4 text-center font-black text-white"
            >
              Order Online
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
