const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

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

// 1. Add section variables
let sectionVars = '';
for (const t of transitions) {
    sectionVars += `              const ${t.short}Section = getSectionEl("${t.id}", ".${t.id}-section");\n`;
}

const blvSectionPattern = 'const blvSection = getSectionEl("blv", ".blv-section");';
script = script.replace(blvSectionPattern, blvSectionPattern + '\n' + sectionVars);

// 2. Add offsetTop calculations
let offsetVars = '';
let prevShort = 'blv';
for (const t of transitions) {
    offsetVars += `
                const ${t.short}Top = ${t.short}Section ? ${t.short}Section.offsetTop : ${prevShort}Top + 2000;
                const ${t.short}TransStart = ${t.short}Top - windowHeight * 0.7;
                const ${t.short}TransEnd = ${t.short}TransStart + windowHeight * 0.5;`;
    prevShort = t.short;
}

const blvTransEndPattern = 'const blvTransEnd = blvTransStart + windowHeight * 0.5;';
script = script.replace(blvTransEndPattern, blvTransEndPattern + offsetVars);

// 3. Replace the bad else if blocks with the correct ones
const badStartPattern = '} else if (getSectionEl(\'.diorhomme-section\')) {';
const badEndPattern = '} else {';

const lines = script.split('\n');
const startIdx = lines.findIndex(l => l.includes(badStartPattern));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(badEndPattern));

if (startIdx !== -1 && endIdx !== -1) {
    let newBlocks = '';
    for (const t of transitions) {
        newBlocks += `                } else if (scrollTop < ${t.short}TransStart) {
                  backgroundColor = "${t.from}";
                } else if (scrollTop < ${t.short}TransEnd) {
                  const progress = Math.pow((scrollTop - ${t.short}TransStart) / (${t.short}TransEnd - ${t.short}TransStart), 0.6);
                  backgroundColor = interpolateColor("${t.from}", "${t.to}", progress);\n`;
    }
    
    // The last block should end with the final color
    newBlocks += `                } else {
                  backgroundColor = "${transitions[transitions.length - 1].to}";
                }`;

    lines.splice(startIdx, endIdx - startIdx + 3, newBlocks); // +3 to remove the else block and its closing brace
    script = lines.join('\n');
    fs.writeFileSync('script.js', script);
    console.log('✓ Fixed scroll transitions');
} else {
    console.log('✗ Could not find bad blocks');
}
