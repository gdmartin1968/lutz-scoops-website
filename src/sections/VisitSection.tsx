import {
  Clock3,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";

const hours = [
  ["Sunday", "12 PM – 8 PM"],
  ["Monday – Thursday", "10 AM – 9 PM"],
  ["Friday – Saturday", "10 AM – 10 PM"],
];

export function VisitSection() {
  return (
    <section id="visit" className="bg-[#fffaf6] py-24 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-[#102a54]/6 sm:p-11">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#df336d]">
            Come say hello
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-[#102a54] sm:text-6xl">
            Your neighborhood happy place.
          </h2>

          <div className="mt-10 space-y-7">
            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f5] text-[#df336d]">
                <MapPin size={23} />
              </div>

              <div>
                <h3 className="font-black text-[#102a54]">
                  Lutz Lake Crossing
                </h3>

                <p className="mt-1 leading-7 text-[#102a54]/62">
                  Lutz, Florida 33548
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf8fc] text-[#0873ae]">
                <Phone size={22} />
              </div>

              <div>
                <h3 className="font-black text-[#102a54]">Call or text</h3>

                <a
                  href="tel:+17275044722"
                  className="mt-1 block text-lg font-black text-[#0873ae]"
                >
                  727-504-4722
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Lutz+Scoops+Lutz+Florida"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0873ae] px-6 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-[#086596]"
            >
              <Navigation size={18} />
              Get Directions
            </a>

            <a
              href="https://lutzscoops.square.site/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#102a54]/12 bg-white px-6 py-4 font-black text-[#102a54] transition hover:-translate-y-1"
            >
              Order Online
              <ExternalLink size={17} />
            </a>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-[#df336d] p-8 text-white shadow-xl shadow-[#df336d]/18 sm:p-11">
          <Clock3 size={38} />

          <p className="mt-8 text-sm font-black uppercase tracking-[0.26em] text-white/65">
            Open seven days
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Hours
          </h2>

          <div className="mt-9 divide-y divide-white/20">
            {hours.map(([days, time]) => (
              <div
                key={days}
                className="flex items-start justify-between gap-5 py-5 first:pt-0"
              >
                <span className="font-bold text-white/75">{days}</span>
                <span className="text-right font-black">{time}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-white/12 p-6">
            <p className="text-lg font-black">
              Ice cream tastes better together.
            </p>

            <p className="mt-2 leading-7 text-white/72">
              Bring the family, meet a friend or treat yourself. We’ll be
              ready with the scoops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
