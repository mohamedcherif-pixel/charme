const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// ============================================================================
// UPDATE PARALLAX CONFIG
// ============================================================================

const newIds = [
    'diorhomme', 'allure', 'tuscanleather', 'armanicode', 'lhommeideal',
    'terredhermes', 'gentleman', 'wantedbynight', 'kbyDG', 'leaudissey',
    'chbadboy', 'ysllibre', 'fireplace', 'pradacarbon', 'burberryhero',
    'narcisoforhim', 'cketernity', 'gucciguilty', 'valentinodonna', 'greenirish',
    'egoiste', 'amenpure', 'declarationcartier', 'laween', 'cedarsmancera',
    'reflectionman', 'sedley', 'sideeffect', 'naxos', 'grandSoir'
];

// Generate the parallax config entries
const parallaxEntries = newIds.map(id => 
    `    { id: '${id}', imageClass: '.${id}-image', infoSelector: '.${id}-theme .product-info-section', scentClass: '.${id}-scent-profile', ingredientsClass: '.${id}-ingredients', descClass: '.${id}-fragrance-description', containerClass: '.${id}-main-container' }`
).join(',\n');

// Find the blv parallax entry and add after it  
const blvParallaxPattern = /(\{ id: 'blv'[^}]+containerClass: '\.blv-main-container' \})\s*\];/;
const blvMatch = script.match(blvParallaxPattern);

if (blvMatch) {
    script = script.replace(blvParallaxPattern, `$1,\n${parallaxEntries}\n  ];`);
    console.log('✓ Updated parallax config');
} else {
    console.log('✗ Could not find parallax blv entry');
    // Debug
    const idx = script.indexOf("id: 'blv'");
    console.log('blv index:', idx);
    if (idx > 0) {
        console.log(JSON.stringify(script.substring(idx, idx+200)));
    }
}

// ============================================================================
// UPDATE SCROLL BACKGROUND TRANSITIONS
// ============================================================================

// Find the end of the scroll transition chain (after blv)
// The pattern is: after the blv transition block, there's a final backgroundColor assignment
const scrollPattern = /else if \(blvSection\) \{[\s\S]*?backgroundColor\s*=\s*["']#0a0804["'];?\s*\}/;
const scrollMatch = script.match(scrollPattern);

if (scrollMatch) {
    // Generate transition blocks for each new section
    // Each uses a dark color transition
    const bgColors = {
        diorhomme: { from: '#0a0804', to: '#0a0a14' },
        allure: { from: '#0a0a14', to: '#0f0f0f' },
        tuscanleather: { from: '#0f0f0f', to: '#1a0e08' },
        armanicode: { from: '#1a0e08', to: '#12060e' },
        lhommeideal: { from: '#12060e', to: '#140d06' },
        terredhermes: { from: '#140d06', to: '#1a0e04' },
        gentleman: { from: '#1a0e04', to: '#0a0a14' },
        wantedbynight: { from: '#0a0a14', to: '#1a0505' },
        kbyDG: { from: '#1a0505', to: '#14100a' },
        leaudissey: { from: '#14100a', to: '#04101a' },
        chbadboy: { from: '#04101a', to: '#04080e' },
        ysllibre: { from: '#04080e', to: '#140e08' },
        fireplace: { from: '#140e08', to: '#1a0e04' },
        pradacarbon: { from: '#1a0e04', to: '#0a0a0a' },
        burberryhero: { from: '#0a0a0a', to: '#120e0a' },
        narcisoforhim: { from: '#120e0a', to: '#060a14' },
        cketernity: { from: '#060a14', to: '#0a120a' },
        gucciguilty: { from: '#0a120a', to: '#110e0a' },
        valentinodonna: { from: '#110e0a', to: '#1a0810' },
        greenirish: { from: '#1a0810', to: '#060e04' },
        egoiste: { from: '#060e04', to: '#0e0e12' },
        amenpure: { from: '#0e0e12', to: '#120a02' },
        declarationcartier: { from: '#120a02', to: '#14060a' },
        laween: { from: '#14060a', to: '#140806' },
        cedarsmancera: { from: '#140806', to: '#0a1206' },
        reflectionman: { from: '#0a1206', to: '#0a0a18' },
        sedley: { from: '#0a0a18', to: '#061208' },
        sideeffect: { from: '#061208', to: '#180606' },
        naxos: { from: '#180606', to: '#140e04' },
        grandSoir: { from: '#140e04', to: '#120e04' },
    };

    let transitionBlocks = '';
    for (const id of newIds) {
        const colors = bgColors[id];
        transitionBlocks += `
            const ${id}Section = getSectionEl('.${id}-section');
            if (${id}Section) {
                const rect = ${id}Section.getBoundingClientRect();
                const p = Math.max(0, Math.min(1, -rect.top / rect.height));
                backgroundColor = interpolateColor('${colors.from}', '${colors.to}', p);
            }
`;
    }

    // Replace the final blv block and add new blocks
    const lastBgColor = '#120e04'; // grandSoir final
    script = script.replace(scrollPattern, (match) => {
        return match + transitionBlocks;
    });
    
    // Also update the final fallback color
    console.log('✓ Updated scroll transitions');
} else {
    console.log('✗ Could not find scroll transition blv block');
    // Try finding it
    const idx = script.indexOf('blvSection');
    console.log('blvSection first occurrence at:', idx);
}

fs.writeFileSync('script.js', script);
console.log('✓ Saved script.js');
