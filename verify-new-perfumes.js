const fs = require('fs');

const cssFiles = [
    'css/yvsl-profile.css',
    'css/aquadigio-profile.css',
    'css/dy-profile.css',
    'css/versaceeros-profile.css',
    'css/jpgultramale-profile.css',
    'css/invictus-profile.css',
    'css/valentinouomo-profile.css',
    'css/spicebomb-profile.css',
    'css/explorer-profile.css',
    'css/blv-profile.css'
];

let allOk = true;
for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const opens = (content.match(/{/g) || []).length;
    const closes = (content.match(/}/g) || []).length;
    const status = opens === closes ? '✓' : '✗ MISMATCH';
    console.log(`${status} ${file}: { = ${opens}, } = ${closes}`);
    if (opens !== closes) allOk = false;
}

// Also check the generated HTML
const html = fs.readFileSync('new-perfumes-html.txt', 'utf8');
const sections = (html.match(/<section class="content /g) || []).length;
const closeSections = (html.match(/<\/section>/g) || []).length;
console.log(`\nHTML sections: ${sections} opened, ${closeSections} closed`);

// Check index.html head has all the CSS links
const indexHtml = fs.readFileSync('index.html', 'utf8');
for (const file of cssFiles) {
    const found = indexHtml.includes(`href="${file}"`);
    console.log(`${found ? '✓' : '✗'} <link> for ${file} in <head>`);
}

// Check script.js has the new fragrances
const scriptJs = fs.readFileSync('script.js', 'utf8');
const newIds = ['yvsl', 'aquadigio', 'dy', 'versaceeros', 'jpgultramale', 'invictus', 'valentinouomo', 'spicebomb', 'explorer', 'blv'];
for (const id of newIds) {
    const count = (scriptJs.match(new RegExp(`"${id}"`, 'g')) || []).length;
    console.log(`${count > 0 ? '✓' : '✗'} "${id}" in script.js (${count} occurrences)`);
}

console.log(`\nAll CSS balanced: ${allOk ? 'YES ✓' : 'NO ✗'}`);
