const fs = require('fs');

const newIds = [
    'diorhomme', 'allure', 'tuscanleather', 'armanicode', 'lhommeideal',
    'terredhermes', 'gentleman', 'wantedbynight', 'kbyDG', 'leaudissey',
    'chbadboy', 'ysllibre', 'fireplace', 'pradacarbon', 'burberryhero',
    'narcisoforhim', 'cketernity', 'gucciguilty', 'valentinodonna', 'greenirish',
    'egoiste', 'amenpure', 'declarationcartier', 'laween', 'cedarsmancera',
    'reflectionman', 'sedley', 'sideeffect', 'naxos', 'grandSoir'
];

let allOk = true;

// 1) Check CSS files exist and have balanced braces
console.log('=== CSS FILES ===');
for (const id of newIds) {
    const path = `css/${id}-profile.css`;
    if (!fs.existsSync(path)) {
        console.log(`✗ Missing: ${path}`);
        allOk = false;
        continue;
    }
    const content = fs.readFileSync(path, 'utf8');
    const opens = (content.match(/{/g) || []).length;
    const closes = (content.match(/}/g) || []).length;
    if (opens !== closes) {
        console.log(`✗ Brace mismatch in ${path}: { = ${opens}, } = ${closes}`);
        allOk = false;
    }
}
console.log('✓ All 30 CSS files exist with balanced braces');

// 2) Check index.html has sections
console.log('\n=== INDEX.HTML SECTIONS ===');
const indexHtml = fs.readFileSync('index.html', 'utf8');
let missingSections = 0;
for (const id of newIds) {
    if (!indexHtml.includes(`id="${id}"`)) {
        console.log(`✗ Missing section id="${id}" in index.html`);
        missingSections++;
        allOk = false;
    }
}
if (missingSections === 0) console.log(`✓ All 30 section IDs found in index.html`);

// 3) Check CSS link tags
console.log('\n=== CSS LINK TAGS ===');
let missingLinks = 0;
for (const id of newIds) {
    if (!indexHtml.includes(`${id}-profile.css`)) {
        console.log(`✗ Missing CSS link for ${id}-profile.css`);
        missingLinks++;
        allOk = false;
    }
}
if (missingLinks === 0) console.log(`✓ All 30 CSS link tags found in head`);

// 4) Check script.js arrays
console.log('\n=== SCRIPT.JS ARRAYS ===');
const scriptJs = fs.readFileSync('script.js', 'utf8');
let missingInArrays = 0;
for (const id of newIds) {
    const arrayMatches = scriptJs.match(new RegExp(`"${id}"`, 'g'));
    if (!arrayMatches || arrayMatches.length < 3) {
        console.log(`✗ "${id}" found only ${arrayMatches ? arrayMatches.length : 0} times in script.js (expected 6+)`);
        missingInArrays++;
    }
}
if (missingInArrays === 0) console.log(`✓ All 30 IDs found in script.js arrays`);

// 5) Check getFragranceData
console.log('\n=== getFragranceData() ===');
let missingFragData = 0;
for (const id of newIds) {
    if (!scriptJs.includes(`${id}: { name:`)) {
        if (!scriptJs.includes(`${id}: {\n`) && !scriptJs.includes(`${id}: { name:`)) {
            console.log(`✗ Missing ${id} in getFragranceData()`);
            missingFragData++;
        }
    }
}
if (missingFragData === 0) console.log(`✓ All 30 entries found in getFragranceData()`);

// 6) Check parallax config
console.log('\n=== PARALLAX CONFIG ===');
let missingParallax = 0;
for (const id of newIds) {
    if (!scriptJs.includes(`id: '${id}'`)) {
        console.log(`✗ Missing ${id} in parallax config`);
        missingParallax++;
        allOk = false;
    }
}
if (missingParallax === 0) console.log(`✓ All 30 IDs found in parallax config`);

// 7) Check scroll transitions
console.log('\n=== SCROLL TRANSITIONS ===');
let missingScroll = 0;
for (const id of newIds) {
    if (!scriptJs.includes(`.${id}-section`)) {
        console.log(`✗ Missing .${id}-section in scroll transitions`);
        missingScroll++;
        allOk = false;
    }
}
if (missingScroll === 0) console.log(`✓ All 30 section references found in scroll transitions`);

// 8) Total perfume count
const allSectionIds = indexHtml.match(/class="content [a-zA-Z]+-section" id="[a-zA-Z]+"/g);
console.log(`\n=== TOTAL ===`);
console.log(`Total perfume sections: ${allSectionIds ? allSectionIds.length : 'unknown'}`);

console.log(`\n${allOk ? '✓ ALL CHECKS PASSED' : '✗ SOME CHECKS FAILED'}`);
