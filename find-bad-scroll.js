const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('} else if (getSectionEl(\'.diorhomme-section\')) {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('backgroundColor = interpolateColor("#1a0a05", "#120e04", gsSecP);'));
console.log('Start:', startIdx, 'End:', endIdx);
