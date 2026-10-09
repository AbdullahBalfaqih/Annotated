import fs from 'fs';

const content = fs.readFileSync('figma_imported.html', 'utf8');

// Extract all layer-name attributes and their text
const layers = [...content.matchAll(/layer-name="([^"]+)"/g)].map(m => m[1]);
console.log('Unique layers:', [...new Set(layers)]);

const imgMatches = [...content.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
console.log('Image URLs:');
imgMatches.forEach((src, idx) => console.log(`${idx}: ${src}`));

// Extract text nodes
const textSpans = [...content.matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map(m => m[1]);
console.log('\nText Spans:');
textSpans.forEach((txt, idx) => console.log(`${idx}: ${txt}`));
