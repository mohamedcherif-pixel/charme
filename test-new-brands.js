const FragranceAPIService = require('./js/fragrance-api-service.js');

// Initialize the service
const fragranceAPI = new FragranceAPIService();

// Test newly added brands
const newBrands = [
  'Afnan', 'Armaf', 'Azzaro', 'Burberry', 'Calvin Klein', 
  'Clinique', 'Coach', 'Davidoff', 'Dolce & Gabbana', 
  'Elizabeth Arden', 'Estee Lauder', 'Giorgio Armani', 
  'Hugo Boss', 'Issey Miyake', 'Jimmy Choo', 'Lattafa', 
  'Paco Rabanne', 'Ralph Lauren', 'Versace'
];

console.log('Testing newly added brand fragrances...\n');

newBrands.forEach(brand => {
  const brandFragrances = Object.entries(fragranceAPI.comprehensiveDatabase)
    .filter(([name, profile]) => profile.brand === brand)
    .map(([name]) => name);
  
  console.log(`${brand}: ${brandFragrances.length} fragrances`);
  brandFragrances.slice(0, 2).forEach(fragrance => {
    console.log(`  - ${fragrance}`);
  });
  if (brandFragrances.length > 2) {
    console.log(`  ... and ${brandFragrances.length - 2} more`);
  }
  console.log('');
});

// Test database statistics
const stats = fragranceAPI.getStatistics();
console.log('=== Database Statistics ===');
console.log(`Total fragrances: ${stats.totalFragrances}`);
console.log(`Total ingredients: ${stats.totalIngredients}`);
console.log(`Top brands: ${stats.topBrands.slice(0, 5).map(b => `${b.brand} (${b.count})`).join(', ')}`);

console.log('\n=== Test completed successfully! ===');
