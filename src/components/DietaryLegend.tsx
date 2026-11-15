import { DIETARY_LABELS } from '../lib/dietary-labels';
import { DIETARY_CODES } from '../lib/public-flavors';

export function DietaryLegend() {
  return <section aria-label="Dietary legend" className="mx-auto mt-6 max-w-4xl border-y border-[#102a54]/10 py-4 text-[#102a54]">
    <h2 className="text-center text-xs font-black uppercase tracking-[0.12em]">Dietary guide</h2>
    <dl className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
      {DIETARY_CODES.map(code => <div key={code} className="flex items-baseline gap-1.5"><dt className="font-black text-[#0873ae]">{code}</dt><dd>{DIETARY_LABELS[code]}</dd></div>)}
    </dl>
    <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-[#102a54]/70">Dietary labels reflect ingredient information. Products are handled in a shared environment, so cross-contact is possible. Please ask our team about specific allergies.</p>
  </section>;
}
