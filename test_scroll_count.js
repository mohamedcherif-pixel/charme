const fs = require('fs');
const s = fs.readFileSync('script.js', 'utf8');
console.log(s.match(/addEventListener\(['"]scroll/g));
