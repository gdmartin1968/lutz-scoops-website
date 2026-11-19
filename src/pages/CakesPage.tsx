import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, CakeSlice, CheckCircle2, Heart, Phone, Sparkles } from 'lucide-react';
import { business } from '../config/business';
import './cakes.css';

const endpoint = 'https://os.lutzscoops.us/api/public/cake-inquiries';
const cakes = [
  { name: 'Classic Crunch Cake', price: '$34.99', image: 'classic-crunch', description: 'Chocolate and vanilla ice cream layered with delicious chocolate cookie crunch and finished with whipped topping.', alt: 'Illustrative white cake with chocolate topping and a cutaway of chocolate, vanilla and cookie-crunch layers.' },
  { name: 'Cookies & Cream Cake', price: '$39.99', image: 'cookies-and-cream', description: 'Cookies & Cream ice cream, chocolate cookie crunch, and a delicious whipped topping with cookie decorations.', alt: 'Illustrative cookies-and-cream cake with whipped rosettes, cookie crumbs and sandwich-cookie decorations.' },
  { name: 'Birthday Celebration Cake', price: '$39.99', image: 'birthday-celebration', description: 'Choose your favorite ice cream flavors and celebrate with colorful sprinkles and a personalized message.', alt: 'Illustrative birthday cake with pastel pink and blue rosettes and colorful sprinkles.' },
  { name: 'Triple Chocolate Cake', price: '$49.99', image: 'triple-chocolate', description: 'Chocolate ice cream, rich fudge, chocolate cookie crunch, and decadent chocolate decorations.', alt: 'Illustrative chocolate cake with glossy fudge drips and chocolate curls.' },
  { name: 'Custom Ice Cream Cake', price: '$44.99', image: 'custom-celebration', description: 'Create something uniquely yours with your choice of ice cream flavors, fillings, decorations, and optional baked cake layers.', alt: 'Illustrative blush pink custom cake with blue piping and a cutaway showing ice cream and a requested baked layer.' },
];

function CakeInquiryForm() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal, cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error();
      const result = await response.json(); setAvailable(result.available === true);
    }).catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || reference || !available) return;
    sending.current = true; setBusy(true); setError('');
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.received !== true || typeof result.reference !== 'string') throw new Error(result.message || 'We could not confirm receipt. Please call before submitting again.');
      setReference(result.reference);
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== 'AbortError' && failure.message !== 'Failed to fetch' ? failure.message : 'We could not confirm receipt. Please call 727-504-4722 before submitting again.');
    } finally {
      clearTimeout(timeout); sending.current = false; setBusy(false);
      window.setTimeout(() => status.current?.focus(), 0);
    }
  }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return <div className="cake-form-shell">
    <div ref={status} tabIndex={-1} role={error ? 'alert' : 'status'} aria-live="polite">
      {reference && <div className="cake-success"><CheckCircle2 aria-hidden="true" size={32} /><h3>Your cake inquiry is on its way!</h3><p>Our mail service has accepted your inquiry for the Lutz Scoops team. The team will follow up to confirm the details, final price and pickup availability.</p><p>This is not a confirmed order.</p><p className="cake-reference">Inquiry reference: {reference}</p></div>}
      {error && <p className="cake-error">{error}</p>}
    </div>
    {!reference && <form onSubmit={submit} aria-label="Cake inquiry" aria-busy={busy}>
      <p className="cake-form-note">Fields marked * are required. No payment is collected.</p>
      <fieldset disabled={busy || available !== true}>
        <legend className="sr-only">Your cake inquiry details</legend>
        <div className="cake-fields">
          <label>Your name *<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
          <label>Phone number *<input name="phone" type="tel" autoComplete="tel" required minLength={10} maxLength={30} /></label>
          <label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label>Requested pickup date *<input name="pickupDate" type="date" min={today} required aria-describedby="cake-pickup-note" /></label>
          <label>Approximate servings *<input name="servings" type="number" min={1} max={500} step={1} required inputMode="numeric" /></label>
          <label>Occasion<input name="occasion" maxLength={200} placeholder="Birthday, anniversary, just because…" /></label>
          <label className="cake-full">Preferred ice cream flavors<input name="flavors" maxLength={300} placeholder="Tell us your favorites — subject to availability" /></label>
          <label>Cake construction<select name="construction" defaultValue="Undecided"><option>Undecided</option><option>Classic ice cream crunch</option><option>Baked cake layers</option></select></label>
          <label>Preferred cake design<select name="design" defaultValue=""><option value="">Let’s decide together</option>{cakes.map(cake => <option key={cake.name}>{cake.name}</option>)}</select></label>
          <label className="cake-full">Personalized cake message<input name="message" maxLength={200} placeholder="What would you like your cake to say?" /></label>
          <label className="cake-full">Special instructions<textarea name="instructions" rows={4} maxLength={2000} placeholder="Colors, design ideas, allergy concerns, or anything else we should know." /></label>
        </div>
        <div className="cake-honeypot" aria-hidden="true"><label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p id="cake-pickup-note" className="cake-form-note">Requested dates, flavors, fillings and baked cake layers are subject to team confirmation. Sharing allergy concerns helps us discuss your options; our products are handled in a shared environment.</p>
        <p className="cake-form-note">Your contact details are sent to our team to respond to this inquiry. Please don’t include payment information.</p>
        <button className="cake-button cake-button-pink" type="submit">{busy ? 'Sending your inquiry…' : 'Send Cake Inquiry'}<ArrowRight size={18} aria-hidden="true" /></button>
      </fieldset>
      {available === null && <p role="status">Checking online inquiry availability…</p>}
      {available === false && <p role="alert" className="cake-error">Online inquiries are currently unavailable. Please call <a href={business.phone.href}>{business.phone.display}</a> to discuss your cake.</p>}
    </form>}
  </div>;
}

export function CakesPage() {
  useEffect(() => {
    document.title = 'Custom Ice Cream Cakes in Lutz, FL | Lutz Scoops';
    const description = 'Celebrate with a custom Lutz Scoops ice cream cake. Explore illustrative designs, request your favorite available flavors, and send a cake inquiry for pickup in Lutz, FL.';
    const values: [string, string, string][] = [['name', 'description', description], ['property', 'og:title', document.title], ['property', 'og:description', description], ['property', 'og:image', 'https://lutzscoops.us/images/cakes/birthday-celebration.webp'], ['property', 'og:url', 'https://lutzscoops.us/ice-cream-cakes'], ['name', 'twitter:title', document.title], ['name', 'twitter:description', description], ['name', 'twitter:image', 'https://lutzscoops.us/images/cakes/birthday-celebration.webp']];
    for (const [attribute, name, content] of values) {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, name); document.head.append(tag); }
      tag.content = content;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = 'https://lutzscoops.us/ice-cream-cakes';
  }, []);
  return <div className="cakes-page">
    <section className="cake-hero" aria-labelledby="cake-title">
      <div className="cake-hero-copy"><p className="cake-eyebrow"><Sparkles size={16} aria-hidden="true" /> A little more celebration</p><h1 id="cake-title">Ice Cream<br /><span>Cakes</span></h1><h2>Your Favorite Ice Cream Flavors in a Custom Cake!</h2><p className="cake-intro">Celebrate birthdays, anniversaries, holidays, and life's sweetest moments with a custom ice cream cake from Lutz Scoops.</p><div className="cake-actions"><a className="cake-button cake-button-pink" href="#cake-inquiry">Request Your Cake<ArrowRight size={18} aria-hidden="true" /></a><a className="cake-text-link" href="#cake-designs">Explore Cake Designs<ArrowDown size={17} aria-hidden="true" /></a></div><p className="cake-hero-caption">Made to order. Made for your moment.</p></div>
      <figure className="cake-hero-image"><img src="/images/cakes/birthday-celebration.webp" width={1000} height={1000} fetchPriority="high" alt="Illustrative ice cream celebration cake with pink and blue rosettes and rainbow sprinkles." /><figcaption><Heart size={17} aria-hidden="true" /> Your flavors. Your celebration.</figcaption></figure>
    </section>
    <div className="cake-ribbon"><span>Favorite flavors</span><span aria-hidden="true">✦</span><span>Joyful designs</span><span aria-hidden="true">✦</span><span>Sweet memories</span></div>
    <section id="cake-designs" className="cake-section" aria-labelledby="cake-designs-title"><div className="cake-section-heading"><p className="cake-eyebrow">Find your sweet inspiration</p><h2 id="cake-designs-title">A cake for every kind of happy.</h2><p>Start with a design you love. Then let’s talk flavors, sizes and the details that make it yours.</p></div><div className="cake-gallery">{cakes.map((cake, index) => <article className={`cake-card ${index === 4 ? 'cake-card-custom' : ''}`} key={cake.name}><div className="cake-card-image"><img src={`/images/cakes/${cake.image}.webp`} width={1000} height={1000} loading="lazy" alt={cake.alt} /></div><div className="cake-card-copy"><p className="cake-card-number">{String(index + 1).padStart(2, '0')} / THE CAKE COLLECTION</p><h3>{cake.name}</h3><p>{cake.description}</p><div className="cake-card-bottom"><p><span>Proposed starting price</span><strong>{cake.price}</strong></p><a href="#cake-inquiry" aria-label={`Inquire about ${cake.name}`}><ArrowRight size={22} aria-hidden="true" /></a></div></div></article>)}</div><div className="cake-gallery-notice"><p>Cake images are illustrative. Final designs may vary.</p><p>Proposed starting prices are not final quotes. Final pricing depends on cake size, design, and customization. All cakes are made to order and subject to confirmation.</p></div></section>
    <section className="cake-customize" aria-labelledby="cake-customize-title"><div className="cake-customize-inner"><div><p className="cake-eyebrow">Let’s make it yours</p><h2 id="cake-customize-title">Big on flavor.<br />Full of possibility.</h2><p>Tell us what you’re dreaming of. Our team will help you explore what’s available for your celebration.</p><a className="cake-text-link" href="/flavors">Explore today’s available flavors<ArrowRight size={17} aria-hidden="true" /></a></div><div className="cake-options">{[
      ['01', 'Your favorite flavors', 'Request your favorite available Lutz Scoops ice cream flavors, with classic ice cream and cookie-crunch layers.'],
      ['02', 'Layers to love', 'Ask about chocolate fudge, cookie crunch and other available fillings. Traditional baked cake layers may be requested, subject to team confirmation.'],
      ['03', 'A personal touch', 'Share a message, colors or a design idea for birthdays, anniversaries, holidays and every happy occasion.'],
      ['04', 'Room for everyone', 'Tell us your approximate serving count. We’ll discuss sizes, options and final pricing with you.'],
    ].map(([number, title, copy]) => <div key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></section>
    <section id="cake-inquiry" className="cake-section cake-inquiry" aria-labelledby="cake-inquiry-title"><div className="cake-inquiry-copy"><p className="cake-eyebrow"><CakeSlice size={17} aria-hidden="true" /> Your celebration starts here</p><h2 id="cake-inquiry-title">Let’s talk cake.</h2><p>Share a few details and our team will follow up to work out the sweet stuff.</p><p>Sending an inquiry doesn’t place a confirmed order. We’ll confirm your design, final price and pickup availability together.</p><div className="cake-call"><Phone size={21} aria-hidden="true" /><div><span>Prefer to talk it through?</span><a href={business.phone.href}>{business.phone.display}</a></div></div><div className="cake-good-to-know"><h3>Good to Know</h3><ul><li>Cakes are made to order; advance notice is recommended.</li><li>Pickup availability must be confirmed by our team.</li><li>Multiple available flavors and celebration designs can be discussed.</li><li>Baked cake layers may be requested and require team confirmation.</li><li>Final pricing is confirmed after reviewing your inquiry.</li><li>An inquiry is not a confirmed order.</li><li>Please tell our team about food allergies.</li></ul></div></div><CakeInquiryForm /></section>
  </div>;
}
