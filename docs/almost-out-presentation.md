# Almost Out customer presentation

TV and website use the same small clock, React effect and stylesheet contract.
The files under `lib/almost-out-presentation.ts`, `lib/use-almost-out-presentation.ts`
and `styles/almost-out.css` must remain byte-identical in the two independently
built repositories (TV paths are under `client/src`, website paths under `src`).
Keep both browser-contract copies identical too. This avoids a runtime stylesheet
or package dependency between the two production services.

The wall-clock phase is `Date.now() % 30000`: [0,5000) warns, [5000,30000) is normal.
One timer per mounted customer page updates a document attribute only at the next
boundary. It does not update React state or the flavor records. Delayed callbacks
recompute the actual phase. Cleanup cancels the timer and removes the attribute.

During the warning window, the badge is visible and a noninteractive overlay
pulses once per second. During the normal window, the badge has display:none,
the overlay has content:none, and no pulse animation runs. Base card shadows,
borders, dimensions, names, image, dietary badges and order remain intact.
Reduced-motion users always see the static badge and never the animated overlay.

Run `test:almost-out-presentation` in both repositories. The actual browser
contract tests 0/4999/5000/29999/30000/35000 ms, reduced motion in both phases,
normal-style equivalence, repeated cycles and responsive cards. TV coverage is
in `test:iccc-front-cooler:browser`; website coverage is `test:almost-out-browser`.
When changing the contract, validate both builds and compare the shared files.
