const FragranceAPIService = require('./js/fragrance-api-service.js');

try {
  const fragranceAPI = new FragranceAPIService();
  
  // Analyze concentration and size data
  let withSpecs = 0;
  let withoutSpecs = 0;
  let concentrationStats = {};
  let sizeStats = {};
  let sampleEntries = [];
  
  Object.entries(fragranceAPI.comprehensiveDatabase).forEach(([name, profile]) => {
    if (profile.concentration && profile.sizes) {
      withSpecs++;
      
      // Count concentration types
      concentrationStats[profile.concentration] = (concentrationStats[profile.concentration] || 0) + 1;
      
      // Count size varieties
      profile.sizes.forEach(size => {
        sizeStats[size] = (sizeStats[size] || 0) + 1;
      });
      
      // Sample entries with specs
      if (sampleEntries.length < 10) {
        sampleEntries.push({
          name,
          brand: profile.brand,
          concentration: profile.concentration,
          sizes: profile.sizes
        });
      }
    } else {
      withoutSpecs++;
    }
  });
  
  console.log('=== FRAGRANCE DATABASE SPECS COMPLETION REPORT ===\n');
  
  console.log('📊 OVERVIEW:');
  console.log(`✅ Entries WITH concentration/sizes: ${withSpecs}`);
  console.log(`❌ Entries WITHOUT concentration/sizes: ${withoutSpecs}`);
  console.log(`📈 Total coverage: ${Math.round((withSpecs / (withSpecs + withoutSpecs)) * 100)}%`);
  console.log(`🔢 Total database entries: ${withSpecs + withoutSpecs}\n`);
  
  console.log('🧪 CONCENTRATION BREAKDOWN:');
  Object.entries(concentrationStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([concentration, count]) => {
      console.log(`   ${concentration}: ${count} fragrances`);
    });
  
  console.log('\n📏 POPULAR BOTTLE SIZES:');
  Object.entries(sizeStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([size, count]) => {
      console.log(`   ${size}: ${count} fragrances`);
    });
  
  console.log('\n🔍 SAMPLE ENTRIES WITH FULL SPECS:');
  sampleEntries.forEach(entry => {
    console.log(`   "${entry.name}" (${entry.brand})`);
    console.log(`     └─ ${entry.concentration} • ${entry.sizes.join(', ')}`);
  });
  
  console.log('\n✅ Database syntax verified - no errors detected!');
  
} catch (error) {
  console.log('❌ Database error:', error.message);
}
