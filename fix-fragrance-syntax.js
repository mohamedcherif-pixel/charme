const fs = require('fs');

// Read the fragrance API service file
let fileContent = fs.readFileSync('js/fragrance-api-service.js', 'utf8');

// Fix the systematic indentation issue with "available: false"
// Replace "      available: false," with "        available: false,"
fileContent = fileContent.replace(/^      available: false,$/gm, '        available: false,');

// Write the fixed content back
fs.writeFileSync('js/fragrance-api-service.js', fileContent, 'utf8');

console.log('Fixed fragrance database syntax errors.');
