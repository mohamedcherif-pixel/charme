const fs = require('fs');

// Read the current fragrance database file
let fileContent = fs.readFileSync('js/fragrance-api-service.js', 'utf8');

// Define brand-based defaults for concentration and sizes
const brandDefaults = {
  "Parfums de Marly": { concentration: "EDP", sizes: ["75ml", "125ml"] },
  "Tom Ford": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Creed": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] },
  "Chanel": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Dior": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Yves Saint Laurent": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Giorgio Armani": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Versace": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Calvin Klein": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Hugo Boss": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Burberry": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Paco Rabanne": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Lattafa": { concentration: "EDP", sizes: ["100ml"] },
  "Armaf": { concentration: "EDP", sizes: ["100ml"] },
  "Afnan": { concentration: "EDP", sizes: ["100ml"] },
  "Azzaro": { concentration: "EDT", sizes: ["50ml", "100ml", "200ml"] },
  "Davidoff": { concentration: "EDT", sizes: ["75ml", "125ml", "200ml"] },
  "Clinique": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Elizabeth Arden": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Coach": { concentration: "EDP", sizes: ["50ml", "90ml"] },
  "Jimmy Choo": { concentration: "EDP", sizes: ["60ml", "100ml"] },
  "Issey Miyake": { concentration: "EDT", sizes: ["50ml", "100ml", "125ml"] },
  "Ralph Lauren": { concentration: "EDT", sizes: ["50ml", "100ml"] },
  "Estee Lauder": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Dolce & Gabbana": { concentration: "EDT", sizes: ["50ml", "100ml"] }
};

// Specific overrides for certain fragrances
const specificOverrides = {
  "Dior Sauvage Elixir": { concentration: "Parfum", sizes: ["60ml", "100ml"] },
  "Chanel No. 5": { concentration: "EDP", sizes: ["35ml", "50ml", "100ml"] },
  "Clinique Aromatics Elixir": { concentration: "Parfum", sizes: ["45ml", "100ml"] },
  "Dior Sauvage": { concentration: "EDT", sizes: ["60ml", "100ml", "200ml"] },
  "Tom Ford Oud Wood": { concentration: "EDP", sizes: ["50ml", "100ml"] },
  "Creed Aventus": { concentration: "EDP", sizes: ["50ml", "100ml", "120ml"] }
};

console.log('Adding concentration and size specifications to ALL fragrance entries...');

let updateCount = 0;

// Function to extract brand from a fragrance entry
function extractBrandFromEntry(entryText) {
  const brandMatch = entryText.match(/brand:\s*["']([^"']+)["']/);
  return brandMatch ? brandMatch[1] : null;
}

// Function to get concentration and sizes for a fragrance
function getSpecsForFragrance(fragranceName, brand) {
  // Check for specific overrides first
  if (specificOverrides[fragranceName]) {
    return specificOverrides[fragranceName];
  }
  
  // Use brand defaults
  if (brandDefaults[brand]) {
    return brandDefaults[brand];
  }
  
  // Generic defaults
  return { concentration: "EDT", sizes: ["50ml", "100ml"] };
}

// Find all fragrance entries that don't already have concentration/sizes
const fragrancePattern = /(\w+|\"\w[^"]*\"):\s*\{([^}]*?)available:\s*(true|false),?\s*\}/g;

let match;
while ((match = fragrancePattern.exec(fileContent)) !== null) {
  const [fullMatch, fragranceName, entryContent] = match;
  
  // Skip if already has concentration
  if (entryContent.includes('concentration:')) {
    continue;
  }
  
  // Extract fragrance name (remove quotes if present)
  const cleanFragranceName = fragranceName.replace(/"/g, '');
  
  // Extract brand from entry content
  const brand = extractBrandFromEntry(entryContent);
  if (!brand) continue;
  
  // Get appropriate specs
  const specs = getSpecsForFragrance(cleanFragranceName, brand);
  
  // Replace the entry with concentration and sizes added
  const updatedMatch = fullMatch.replace(
    /(available:\s*(?:true|false),?)\s*\}/,
    `$1\n        concentration: "${specs.concentration}",\n        sizes: ${JSON.stringify(specs.sizes)},\n      }`
  );
  
  fileContent = fileContent.replace(fullMatch, updatedMatch);
  updateCount++;
}

// Additional pass for any remaining entries using a different pattern
const alternatePattern = /(\w+):\s*\{([^}]*?)available:\s*(true|false),?\s*\}/g;

match = null;
while ((match = alternatePattern.exec(fileContent)) !== null) {
  const [fullMatch, fragranceName, entryContent] = match;
  
  // Skip if already has concentration
  if (entryContent.includes('concentration:')) {
    continue;
  }
  
  // Extract brand from entry content
  const brand = extractBrandFromEntry(entryContent);
  if (!brand) continue;
  
  // Get appropriate specs
  const specs = getSpecsForFragrance(fragranceName, brand);
  
  // Replace the entry with concentration and sizes added
  const updatedMatch = fullMatch.replace(
    /(available:\s*(?:true|false),?)\s*\}/,
    `$1\n        concentration: "${specs.concentration}",\n        sizes: ${JSON.stringify(specs.sizes)},\n      }`
  );
  
  fileContent = fileContent.replace(fullMatch, updatedMatch);
  updateCount++;
}

// Write the updated content back to the file
fs.writeFileSync('js/fragrance-api-service.js', fileContent, 'utf8');

console.log(`Successfully added concentration and size specifications to ${updateCount} fragrance entries!`);

// Verify syntax
console.log('Verifying file syntax...');
try {
  require('./js/fragrance-api-service.js');
  console.log('✅ Syntax verification passed!');
} catch (error) {
  console.log('❌ Syntax error detected:', error.message);
}
