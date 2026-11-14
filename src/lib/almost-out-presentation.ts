// Shared TV/website presentation contract. Keep this file identical in both repos.
export const ALMOST_OUT_CYCLE_MS = 30_000;
export const ALMOST_OUT_WARNING_MS = 5_000;
export function almostOutWarningAt(now: number): boolean {
  return ((now % ALMOST_OUT_CYCLE_MS) + ALMOST_OUT_CYCLE_MS) % ALMOST_OUT_CYCLE_MS < ALMOST_OUT_WARNING_MS;
}
type Clock = { now: () => number; schedule: (callback: () => void, delay: number) => unknown; cancel: (timer: unknown) => void };
// One document attribute at each boundary; no React state, per-card timers or business writes.
export function startAlmostOutPresentation(root: Pick<HTMLElement, 'setAttribute' | 'removeAttribute'>, clock: Clock = {
  now: Date.now, schedule: (callback, delay) => window.setTimeout(callback, delay), cancel: timer => window.clearTimeout(timer as number),
}): () => void {
  let timer: unknown, stopped = false;
  function update() {
    if (stopped) return;
    const now = clock.now(), phase = ((now % ALMOST_OUT_CYCLE_MS) + ALMOST_OUT_CYCLE_MS) % ALMOST_OUT_CYCLE_MS;
    root.setAttribute('data-almost-out-warning', String(almostOutWarningAt(now)));
    timer = clock.schedule(update, (phase < ALMOST_OUT_WARNING_MS ? ALMOST_OUT_WARNING_MS : ALMOST_OUT_CYCLE_MS) - phase);
  }
  update();
  return () => { stopped = true; clock.cancel(timer); root.removeAttribute('data-almost-out-warning'); };
}
