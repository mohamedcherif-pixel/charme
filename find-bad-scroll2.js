const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('} else if (getSectionEl(\'.diorhomme-section\')) {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('getSectionEl(\'.grandsoir-section\')'));
console.log('Start:', startIdx, 'End:', endIdx);
