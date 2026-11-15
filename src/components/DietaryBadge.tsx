import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DietaryCode } from '../lib/public-flavors';
import { DIETARY_LABELS } from '../lib/dietary-labels';

export function DietaryBadge({ code }: { code: DietaryCode }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  const label = `${code}: ${DIETARY_LABELS[code]}`;
  const show = () => {
    clearTimeout(timer.current);
    document.dispatchEvent(new CustomEvent('dietary-tooltip-open', { detail: id }));
    setOpen(true);
  };
  const leave = () => {
    hovered.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!hovered.current && document.activeElement !== button.current) setOpen(false);
    }, 120);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (!button.current || !tooltip.current) return;
      const anchor = button.current.getBoundingClientRect();
      const box = tooltip.current.getBoundingClientRect();
      const margin = 8;
      const ceiling = Math.max(margin, (document.querySelector('header')?.getBoundingClientRect().bottom ?? 0) + margin);
      // Focus may scroll the badge into view after its focus event fires.
      // Hide an offscreen anchor's tooltip without covering navigation.
      if (anchor.bottom < ceiling || anchor.top > innerHeight - margin) { setPosition(null); return; }
      setPosition({
        left: Math.max(margin, Math.min(anchor.left + anchor.width / 2 - box.width / 2, innerWidth - box.width - margin)),
        top: Math.max(ceiling, Math.min(anchor.bottom + margin + box.height <= innerHeight - margin ? anchor.bottom + margin : anchor.top - box.height - margin, innerHeight - box.height - margin)),
      });
    };
    const outside = (event: PointerEvent) => {
      if (!button.current?.contains(event.target as Node) && !tooltip.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const another = (event: Event) => { if ((event as CustomEvent<string>).detail !== id) setOpen(false); };
    place();
    const frame = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    document.addEventListener('dietary-tooltip-open', another);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      document.removeEventListener('dietary-tooltip-open', another);
    };
  }, [open, id]);

  return <>
    <button ref={button} type="button" data-dietary-badge aria-label={label} aria-describedby={open ? id : undefined}
      className="min-h-6 min-w-6 rounded-full bg-[#eaf6fb] px-2 py-0.5 text-[10px] font-black text-[#0873ae] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#df336d]"
      onPointerEnter={event => {
        const focused = document.activeElement;
        // Scrolling a keyboard-focused badge into view can move another badge
        // beneath a stationary mouse. Keep the focused explanation in that case.
        if (focused !== button.current && focused?.hasAttribute('data-dietary-badge') && focused.hasAttribute('aria-describedby')) return;
        if (event.pointerType !== 'touch') { hovered.current = true; show(); }
      }}
      onPointerLeave={leave} onFocus={show} onBlur={leave} onClick={show}>{code}</button>
    {open && createPortal(<div ref={tooltip} id={id} role="tooltip" style={{ position: 'fixed', left: position?.left ?? 0, top: position?.top ?? 0, visibility: position ? 'visible' : 'hidden', zIndex: 60, maxWidth: 'calc(100vw - 16px)' }}
      className="rounded-lg bg-[#102a54] px-3 py-2 text-xs font-bold text-white shadow-lg"
      onPointerEnter={() => { hovered.current = true; clearTimeout(timer.current); }} onPointerLeave={leave}>{label}</div>, document.body)}
  </>;
}
