const fs = require('fs');

const scriptJs = fs.readFileSync('script.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const listMatch = scriptJs.match(/const fragrances = \[(.*?)\];/s);
if (!listMatch) {
  console.log('Could not find fragrances array in script.js');
  process.exit(1);
}

const ids = [...listMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
const uniqueIds = [...new Set(ids)];

const indexSectionIds = [...indexHtml.matchAll(/<section class="content [^"]*" id="([^"]+)"/g)].map((m) => m[1]);
const uniqueIndexIds = [...new Set(indexSectionIds)];

const missingSections = uniqueIds.filter((id) => !indexHtml.includes(`id="${id}"`));
const missingFavoriteBtns = uniqueIds.filter((id) => !indexHtml.includes(`id="${id}FavoriteBtn"`));
const missingCartBtns = uniqueIds.filter((id) => !indexHtml.includes(`id="${id}CartBtn"`));
const indexOnlyIds = uniqueIndexIds.filter((id) => !uniqueIds.includes(id));

console.log(`Fragrance IDs in script list: ${uniqueIds.length}`);
console.log(`Missing sections in index.html: ${missingSections.length}`);
if (missingSections.length) console.log(missingSections.join(', '));
console.log(`Missing favorite buttons: ${missingFavoriteBtns.length}`);
if (missingFavoriteBtns.length) console.log(missingFavoriteBtns.join(', '));
console.log(`Missing cart buttons: ${missingCartBtns.length}`);
if (missingCartBtns.length) console.log(missingCartBtns.join(', '));
console.log(`Section IDs in index.html: ${uniqueIndexIds.length}`);
console.log(`Section IDs missing from script list: ${indexOnlyIds.length}`);
if (indexOnlyIds.length) console.log(indexOnlyIds.join(', '));
