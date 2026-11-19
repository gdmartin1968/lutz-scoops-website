import { readFile, mkdir, writeFile } from 'node:fs/promises';

// Give link-preview crawlers real route-specific metadata without requiring JS.
const title = 'Custom Ice Cream Cakes in Lutz, FL | Lutz Scoops';
const description = 'Explore custom Lutz Scoops ice cream cake designs and send a pickup inquiry. Final designs, prices and availability are confirmed by our team.';
const url = 'https://lutzscoops.us/ice-cream-cakes';
const image = 'https://lutzscoops.us/images/cakes/birthday-celebration.webp';
let html = await readFile('dist/index.html', 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
  .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
  .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`)
  .replace('</head>', `<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" /><meta property="og:image" content="${image}" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${image}" /></head>`);
await mkdir('dist/ice-cream-cakes', { recursive: true });
await writeFile('dist/ice-cream-cakes/index.html', html);
await writeFile('dist/ice-cream-cakes.html', html);
