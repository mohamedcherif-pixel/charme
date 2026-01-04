// Test file for FragranceAPIService functionality
console.log("🧪 Testing FragranceAPIService...");

// Initialize the service
const fragranceService = new FragranceAPIService();

// Test 1: Basic ingredient search
async function testIngredientSearch() {
    console.log("\n🔍 Test 1: Basic Ingredient Search");

    const testIngredients = ["bergamot", "vanilla", "cedar"];
    console.log("Searching for ingredients:", testIngredients);

    try {
        const results = await fragranceService.searchByIngredients(testIngredients);
        console.log("✅ Results found:", results.length);

        if (results.length > 0) {
            console.log("Top 3 matches:");
            results.slice(0, 3).forEach((match, index) => {
                console.log(`${index + 1}. ${match.fragrance} (${match.percentage}% match)`);
                console.log(`   Matched ingredients: ${match.matchedIngredients.join(", ")}`);
                console.log(`   Brand: ${match.profile?.brand || "Unknown"}`);
            });
        } else {
            console.log("❌ No results found");
        }
    } catch (error) {
        console.error("❌ Error in ingredient search:", error);
    }
}

// Test 2: Single ingredient search
async function testSingleIngredient() {
    console.log("\n🔍 Test 2: Single Ingredient Search");

    const ingredient = ["rose"];
    console.log("Searching for ingredient:", ingredient);

    try {
        const results = await fragranceService.searchByIngredients(ingredient);
        console.log("✅ Results found:", results.length);

        if (results.length > 0) {
            console.log("Sample matches:");
            results.slice(0, 5).forEach((match, index) => {
                console.log(`${index + 1}. ${match.fragrance} - ${match.profile?.brand || "Unknown"}`);
            });
        }
    } catch (error) {
        console.error("❌ Error in single ingredient search:", error);
    }
}

// Test 3: Check database statistics
function testDatabaseStats() {
    console.log("\n📊 Test 3: Database Statistics");

    try {
        const stats = fragranceService.getStatistics();
        console.log("Database Statistics:");
        console.log(`- Total fragrances: ${stats.totalFragrances}`);
        console.log(`- Total ingredients: ${stats.totalIngredients}`);
        console.log(`- Popular ingredients: ${stats.popularIngredients.slice(0, 10).join(", ")}`);
        console.log(`- Brands represented: ${stats.brandsCount}`);
    } catch (error) {
        console.error("❌ Error getting database stats:", error);
    }
}

// Test 4: Check popular ingredients
function testPopularIngredients() {
    console.log("\n🌟 Test 4: Popular Ingredients");

    try {
        const popularIngredients = fragranceService.getPopularIngredients();
        console.log("Top 20 popular ingredients:");
        popularIngredients.slice(0, 20).forEach((ingredient, index) => {
            console.log(`${index + 1}. ${ingredient.name} (${ingredient.count} fragrances)`);
        });
    } catch (error) {
        console.error("❌ Error getting popular ingredients:", error);
    }
}

// Test 5: Test ingredient suggestions
async function testIngredientSuggestions() {
    console.log("\n💡 Test 5: Ingredient Suggestions");

    const testQueries = ["van", "ber", "san"];

    for (const query of testQueries) {
        console.log(`\nSuggestions for "${query}":`);
        try {
            const suggestions = fragranceService.getIngredientSuggestions(query);
            console.log(suggestions.slice(0, 5).join(", "));
        } catch (error) {
            console.error(`❌ Error getting suggestions for "${query}":`, error);
        }
    }
}

// Test 6: Test specific fragrance lookup
function testFragranceLookup() {
    console.log("\n🎯 Test 6: Specific Fragrance Lookup");

    const testNames = ["Aventus", "Sauvage", "Black Orchid"];

    testNames.forEach(name => {
        console.log(`\nLooking up "${name}":`);
        try {
            const fragrance = fragranceService.getFragranceByName(name);
            if (fragrance) {
                console.log(`✅ Found: ${fragrance.name} by ${fragrance.brand}`);
                console.log(`Notes: ${fragrance.notes.top?.slice(0, 3).join(", ") || "N/A"}`);
            } else {
                console.log(`❌ "${name}" not found`);
            }
        } catch (error) {
            console.error(`❌ Error looking up "${name}":`, error);
        }
    });
}

// Run all tests
async function runAllTests() {
    console.log("🚀 Starting comprehensive FragranceAPIService tests...\n");

    // Check if service is initialized
    if (!fragranceService) {
        console.error("❌ FragranceAPIService not initialized!");
        return;
    }

    try {
        // Run database stats first to verify data is loaded
        testDatabaseStats();

        // Run async tests
        await testIngredientSearch();
        await testSingleIngredient();
        await testIngredientSuggestions();

        // Run sync tests
        testPopularIngredients();
        testFragranceLookup();

        console.log("\n✅ All tests completed!");

    } catch (error) {
        console.error("❌ Test suite failed:", error);
    }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('DOMContentLoaded', runAllTests);
} else {
    // Node environment
    runAllTests();
}

// Export for manual testing
window.testFragranceService = {
    runAllTests,
    testIngredientSearch,
    testSingleIngredient,
    testDatabaseStats,
    testPopularIngredients,
    testIngredientSuggestions,
    testFragranceLookup
};

console.log("📋 Test functions available in window.testFragranceService");
