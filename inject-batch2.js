const fs = require('fs');

// Read the HTML content to inject
const newHTML = fs.readFileSync('new-perfumes-batch2-html.txt', 'utf8');

// Read index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Find insert point: after the blv section closing </section> and before the empty content sections
const insertMarker = `            </section>

            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>
        </div>

        <!-- Floating Cart Icon -->`;

if (!indexHtml.includes(insertMarker)) {
    console.error('ERROR: Could not find insertion marker in index.html!');
    process.exit(1);
}

// Insert the new HTML right after the blv section closes
indexHtml = indexHtml.replace(insertMarker, `            </section>
${newHTML}

            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>
        </div>

        <!-- Floating Cart Icon -->`);

fs.writeFileSync('index.html', indexHtml);
console.log('✓ Injected new perfume sections into index.html');

// Now add CSS <link> tags in the head
const newCSSIds = [
    'diorhomme', 'allure', 'tuscanleather', 'armanicode', 'lhommeideal',
    'terredhermes', 'gentleman', 'wantedbynight', 'kbyDG', 'leaudissey',
    'chbadboy', 'ysllibre', 'fireplace', 'pradacarbon', 'burberryhero',
    'narcisoforhim', 'cketernity', 'gucciguilty', 'valentinodonna', 'greenirish',
    'egoiste', 'amenpure', 'declarationcartier', 'laween', 'cedarsmancera',
    'reflectionman', 'sedley', 'sideeffect', 'naxos', 'grandSoir'
];

// Find the last CSS link (blv-profile.css)
const lastCSSLink = `<link rel="stylesheet" href="css/blv-profile.css" />`;
if (!indexHtml.includes(lastCSSLink)) {
    console.log('WARNING: blv-profile.css link not found, looking for alternative...');
    // Try with double quotes
    const alt = `<link rel="stylesheet" href="css/blv-profile.css">`;
    if (indexHtml.includes(alt)) {
        console.log('Found alternative format');
    }
}

const newCSSLinks = newCSSIds.map(id => `    <link rel="stylesheet" href="css/${id}-profile.css" />`).join('\n');

indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
    lastCSSLink,
    lastCSSLink + '\n' + newCSSLinks
);

fs.writeFileSync('index.html', indexHtml);
console.log('✓ Added CSS link tags to head');

// Count total sections
const sectionMatches = indexHtml.match(/id="[a-zA-Z]+-reviews"/g);
console.log(`✓ Total perfume sections with reviews: ${sectionMatches ? sectionMatches.length : 'unknown'}`);
