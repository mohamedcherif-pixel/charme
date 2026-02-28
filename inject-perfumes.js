const fs = require('fs');

// Read current index.html
let html = fs.readFileSync('index.html', 'utf8');

// Read generated perfume HTML
const newHTML = fs.readFileSync('new-perfumes-html.txt', 'utf8');

// Find insertion point: just before the first empty <section class="content"></section>
const insertMarker = `            </section>

            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>`;

if (!html.includes(insertMarker)) {
    console.error('ERROR: Could not find insertion marker in index.html');
    process.exit(1);
}

// Insert new perfume HTML right before the empty sections
const replacement = `            </section>
${newHTML}
            <section class="content"></section>
            <section class="content"></section>
            <section class="content final"></section>`;

html = html.replace(insertMarker, replacement);

fs.writeFileSync('index.html', html);
console.log('Successfully injected new perfume sections into index.html');
console.log('New line count: ' + html.split('\n').length);
