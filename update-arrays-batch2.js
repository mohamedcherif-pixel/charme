const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

const oldArray = `"layton", "haltane", "pegasus", "greenly", "baccaratrouge", "blackorchid", "aventus", "sauvage", "bleudechanel", "tobaccovanille", "oudwood", "lanuit", "lostcherry", "yvsl", "aquadigio", "dy", "versaceeros", "jpgultramale", "invictus", "valentinouomo", "spicebomb", "explorer", "blv"`;

const newArray = `"layton", "haltane", "pegasus", "greenly", "baccaratrouge", "blackorchid", "aventus", "sauvage", "bleudechanel", "tobaccovanille", "oudwood", "lanuit", "lostcherry", "yvsl", "aquadigio", "dy", "versaceeros", "jpgultramale", "invictus", "valentinouomo", "spicebomb", "explorer", "blv", "diorhomme", "allure", "tuscanleather", "armanicode", "lhommeideal", "terredhermes", "gentleman", "wantedbynight", "kbyDG", "leaudissey", "chbadboy", "ysllibre", "fireplace", "pradacarbon", "burberryhero", "narcisoforhim", "cketernity", "gucciguilty", "valentinodonna", "greenirish", "egoiste", "amenpure", "declarationcartier", "laween", "cedarsmancera", "reflectionman", "sedley", "sideeffect", "naxos", "grandSoir"`;

const count = (script.match(new RegExp(oldArray.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log(`Found ${count} occurrences of the fragrance array`);

script = script.split(oldArray).join(newArray);
console.log('✓ Updated all fragrance array occurrences');

fs.writeFileSync('script.js', script);
console.log('✓ Saved script.js');
