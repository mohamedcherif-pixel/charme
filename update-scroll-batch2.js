const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// The scroll transition chain ends with:
// } else {
//   backgroundColor = "#0a0804";
// }
// We need to replace that final else block with new transition blocks

// Find the exact pattern: the blv transition end + else block
const oldEndPattern = `interpolateColor("#0d1318", "#0a0804", progress);
                } else {
                  backgroundColor = "#0a0804";
                }`;

if (!script.includes(oldEndPattern)) {
    // Try with CRLF
    const oldEndPatternCRLF = oldEndPattern.replace(/\n/g, '\r\n');
    if (script.includes(oldEndPatternCRLF)) {
        console.log('Found pattern with CRLF');
        doReplace(oldEndPatternCRLF);
    } else {
        console.log('✗ Could not find pattern. Trying regex...');
        const rx = /interpolateColor\("#0d1318",\s*"#0a0804",\s*progress\);\s*\}\s*else\s*\{\s*backgroundColor\s*=\s*"#0a0804";\s*\}/;
        const m = script.match(rx);
        if (m) {
            console.log('Found via regex');
            doReplaceRegex(rx);
        } else {
            console.log('✗ Pattern not found at all!');
            // Debug: show context
            const idx = script.indexOf('#0d1318');
            if (idx > 0) console.log(JSON.stringify(script.substring(idx, idx+300)));
        }
    }
} else {
    console.log('Found pattern with LF');
    doReplace(oldEndPattern);
}

function doReplace(pattern) {
    script = script.replace(pattern, buildReplacement());
    fs.writeFileSync('script.js', script);
    console.log('✓ Updated scroll transitions');
    console.log('✓ Saved script.js');
}

function doReplaceRegex(rx) {
    script = script.replace(rx, buildReplacement());
    fs.writeFileSync('script.js', script);
    console.log('✓ Updated scroll transitions');
    console.log('✓ Saved script.js');
}

function buildReplacement() {
    const transitions = [
        { id: 'diorhomme', short: 'dh', from: '#0a0804', to: '#0a0a14' },
        { id: 'allure', short: 'al', from: '#0a0a14', to: '#0f0f0f' },
        { id: 'tuscanleather', short: 'tl', from: '#0f0f0f', to: '#1a0e08' },
        { id: 'armanicode', short: 'ac', from: '#1a0e08', to: '#12060e' },
        { id: 'lhommeideal', short: 'lhi', from: '#12060e', to: '#140d06' },
        { id: 'terredhermes', short: 'tdh', from: '#140d06', to: '#1a0e04' },
        { id: 'gentleman', short: 'gent', from: '#1a0e04', to: '#0a0a14' },
        { id: 'wantedbynight', short: 'wbn', from: '#0a0a14', to: '#1a0505' },
        { id: 'kbyDG', short: 'kdg', from: '#1a0505', to: '#14100a' },
        { id: 'leaudissey', short: 'ldi', from: '#14100a', to: '#04101a' },
        { id: 'chbadboy', short: 'cbb', from: '#04101a', to: '#04080e' },
        { id: 'ysllibre', short: 'yslb', from: '#04080e', to: '#140e08' },
        { id: 'fireplace', short: 'fp', from: '#140e08', to: '#1a0e04' },
        { id: 'pradacarbon', short: 'pc', from: '#1a0e04', to: '#0a0a0a' },
        { id: 'burberryhero', short: 'bh', from: '#0a0a0a', to: '#120e0a' },
        { id: 'narcisoforhim', short: 'nfh', from: '#120e0a', to: '#060a14' },
        { id: 'cketernity', short: 'cke', from: '#060a14', to: '#0a120a' },
        { id: 'gucciguilty', short: 'gg', from: '#0a120a', to: '#110e0a' },
        { id: 'valentinodonna', short: 'vd', from: '#110e0a', to: '#1a0810' },
        { id: 'greenirish', short: 'gi', from: '#1a0810', to: '#060e04' },
        { id: 'egoiste', short: 'ego', from: '#060e04', to: '#0e0e12' },
        { id: 'amenpure', short: 'amp', from: '#0e0e12', to: '#120a02' },
        { id: 'declarationcartier', short: 'dc', from: '#120a02', to: '#14060a' },
        { id: 'laween', short: 'lw', from: '#14060a', to: '#140806' },
        { id: 'cedarsmancera', short: 'cm', from: '#140806', to: '#0a1206' },
        { id: 'reflectionman', short: 'rm', from: '#0a1206', to: '#0a0a18' },
        { id: 'sedley', short: 'sed', from: '#0a0a18', to: '#061208' },
        { id: 'sideeffect', short: 'se', from: '#061208', to: '#180606' },
        { id: 'naxos', short: 'nax', from: '#180606', to: '#140e04' },
        { id: 'grandSoir', short: 'gs', from: '#140e04', to: '#120e04' },
    ];

    // First, we need to declare the section variables and their transition start/end
    // These should be added BEFORE the if/else chain, but since we're replacing inline,
    // we'll add new elif blocks after the blv transition
    
    let result = `interpolateColor("#0d1318", "#0a0804", progress);\n`;

    // Build the chain of else-if blocks for each new section
    let prevTo = '#0a0804';
    for (let i = 0; i < transitions.length; i++) {
        const t = transitions[i];
        const sectionVar = `${t.short}Sec`;
        
        result += `                } else if (getSectionEl('.${t.id}-section')) {\n`;
        result += `                  const ${sectionVar} = getSectionEl('.${t.id}-section');\n`;
        result += `                  const ${sectionVar}Rect = ${sectionVar}.getBoundingClientRect();\n`;
        result += `                  const ${sectionVar}P = Math.max(0, Math.min(1, -${sectionVar}Rect.top / ${sectionVar}Rect.height));\n`;
        result += `                  backgroundColor = interpolateColor("${t.from}", "${t.to}", ${sectionVar}P);\n`;
    }

    result += `                } else {\n`;
    result += `                  backgroundColor = "${transitions[transitions.length - 1].to}";\n`;
    result += `                }`;

    return result;
}
