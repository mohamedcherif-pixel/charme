const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

const oldArray = '["layton", "haltane", "pegasus", "greenly", "baccaratrouge", "blackorchid", "aventus", "sauvage", "bleudechanel", "tobaccovanille", "oudwood", "lanuit", "lostcherry"]';
const newArray = '["layton", "haltane", "pegasus", "greenly", "baccaratrouge", "blackorchid", "aventus", "sauvage", "bleudechanel", "tobaccovanille", "oudwood", "lanuit", "lostcherry", "yvsl", "aquadigio", "dy", "versaceeros", "jpgultramale", "invictus", "valentinouomo", "spicebomb", "explorer", "blv"]';

const count = (js.match(new RegExp(oldArray.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`Found ${count} occurrences of fragrances array`);

js = js.split(oldArray).join(newArray);

const newCount = (js.match(new RegExp(newArray.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`Replaced with new array: ${newCount} occurrences`);

fs.writeFileSync('script.js', js);
console.log('script.js updated successfully');
