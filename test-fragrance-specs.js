const FragranceAPIService = require('./js/fragrance-api-service.js');

try {
  const fragranceAPI = new FragranceAPIService();
  
  // Count entries with and without concentration data
  let withSpecs = 0;
  let withoutSpecs = 0;
  let sampleEntries = [];
  
  Object.entries(fragranceAPI.comprehensiveDatabase).forEach(([name, profile]) => {
    if (profile.concentration && profile.sizes) {
      withSpecs++;
    } else {
      withoutSpecs++;
      if (sampleEntries.length < 10) {
        sampleEntries.push({ name, brand: profile.brand });
      }
    }
  });
  
  console.log('=== Fragrance Database Specs Status ===');
  console.log(`✅ Entries WITH concentration/sizes: ${withSpecs}`);
  console.log(`❌ Entries WITHOUT concentration/sizes: ${withoutSpecs}`);
  console.log(`📊 Total entries: ${withSpecs + withoutSpecs}`);
  
  console.log('\n=== Sample entries missing specs ===');
  sampleEntries.forEach(entry => {
    console.log(`- ${entry.name} (${entry.brand})`);
  });
  
  console.log('\n✅ Database loaded successfully - no syntax errors!');
  
} catch (error) {
  console.log('❌ Error loading database:', error.message);
}
