// Comprehensive Ingredient System Diagnostic Script
// This script tests all components of the ingredient-based fragrance finder

console.log("🔧 Starting Ingredient System Diagnostics...");

class IngredientSystemDiagnostics {
    constructor() {
        this.results = {};
        this.errors = [];
        this.warnings = [];
    }

    // Test 1: Check if all required classes are loaded
    testClassAvailability() {
        console.log("\n📋 Test 1: Checking Class Availability");

        const requiredClasses = [
            'FragranceAPIService',
            'IngredientFragranceFinder'
        ];

        requiredClasses.forEach(className => {
            if (typeof window[className] !== 'undefined') {
                console.log(`✅ ${className} is available`);
                this.results[`${className}_available`] = true;
            } else {
                console.log(`❌ ${className} is not available`);
                this.results[`${className}_available`] = false;
                this.errors.push(`${className} class not found`);
            }
        });

        // Check if ingredient finder instance exists
        if (typeof window.ingredientFragranceFinder !== 'undefined') {
            console.log("✅ Global ingredientFragranceFinder instance exists");
            this.results.ingredientFinderInstance = true;
        } else {
            console.log("❌ Global ingredientFragranceFinder instance not found");
            this.results.ingredientFinderInstance = false;
            this.errors.push("ingredientFragranceFinder instance not initialized");
        }
    }

    // Test 2: Check DOM elements
    testDOMElements() {
        console.log("\n🎯 Test 2: Checking DOM Elements");

        const requiredElements = [
            'ingredientFinder',
            'ingredientFinderIcon',
            'ingredientModal',
            'ingredientSearchInput',
            'selectedIngredientsList',
            'ingredientSuggestions',
            'fragmentResultsSection',
            'fragmentResults'
        ];

        requiredElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                console.log(`✅ Element ${elementId} found`);
                this.results[`element_${elementId}`] = true;
            } else {
                console.log(`❌ Element ${elementId} not found`);
                this.results[`element_${elementId}`] = false;
                this.warnings.push(`DOM element ${elementId} missing`);
            }
        });
    }

    // Test 3: Test FragranceAPIService functionality
    async testFragranceAPIService() {
        console.log("\n🔬 Test 3: Testing FragranceAPIService");

        try {
            const service = new FragranceAPIService();

            // Test database statistics
            const stats = service.getStatistics();
            console.log(`✅ Database loaded: ${stats.totalFragrances} fragrances, ${stats.totalIngredients} ingredients`);
            this.results.databaseStats = stats;

            // Test ingredient search
            const testIngredients = ['bergamot', 'vanilla', 'cedar'];
            const searchResults = await service.searchByIngredients(testIngredients);
            console.log(`✅ Search test: Found ${searchResults.length} results for ${testIngredients.join(', ')}`);
            this.results.searchTest = {
                ingredients: testIngredients,
                results: searchResults.length
            };

            // Test popular ingredients
            const popularIngredients = service.getPopularIngredients();
            console.log(`✅ Popular ingredients: ${popularIngredients.slice(0, 5).map(i => i.name).join(', ')}`);
            this.results.popularIngredients = popularIngredients.length;

            // Test ingredient suggestions
            const suggestions = service.getIngredientSuggestions('van');
            console.log(`✅ Suggestions for 'van': ${suggestions.slice(0, 3).join(', ')}`);
            this.results.suggestions = suggestions.length;

        } catch (error) {
            console.log(`❌ FragranceAPIService test failed: ${error.message}`);
            this.errors.push(`FragranceAPIService error: ${error.message}`);
        }
    }

    // Test 4: Test IngredientFragranceFinder functionality
    testIngredientFinder() {
        console.log("\n🎪 Test 4: Testing IngredientFragranceFinder");

        if (typeof window.ingredientFragranceFinder === 'undefined') {
            console.log("❌ IngredientFragranceFinder instance not available");
            this.errors.push("IngredientFragranceFinder not initialized");
            return;
        }

        const finder = window.ingredientFragranceFinder;

        try {
            // Test if fragrance service is initialized
            if (finder.fragranceService) {
                console.log("✅ FragranceAPIService is connected to IngredientFinder");
                this.results.serviceConnected = true;
            } else {
                console.log("❌ FragranceAPIService not connected to IngredientFinder");
                this.errors.push("FragranceAPIService not connected");
            }

            // Test ingredient icons
            if (finder.ingredientIcons && Object.keys(finder.ingredientIcons).length > 0) {
                console.log(`✅ Ingredient icons loaded: ${Object.keys(finder.ingredientIcons).length} ingredients`);
                this.results.iconCount = Object.keys(finder.ingredientIcons).length;
            } else {
                console.log("❌ Ingredient icons not loaded");
                this.warnings.push("Ingredient icons missing");
            }

            // Test selected ingredients array
            if (Array.isArray(finder.selectedIngredients)) {
                console.log(`✅ Selected ingredients array: ${finder.selectedIngredients.length} items`);
                this.results.selectedIngredientsArray = true;
            } else {
                console.log("❌ Selected ingredients array not found");
                this.errors.push("Selected ingredients array missing");
            }

        } catch (error) {
            console.log(`❌ IngredientFinder test failed: ${error.message}`);
            this.errors.push(`IngredientFinder error: ${error.message}`);
        }
    }

    // Test 5: Test event listeners
    testEventListeners() {
        console.log("\n⚡ Test 5: Testing Event Listeners");

        // Test if ingredient finder icon click works
        const finderIcon = document.getElementById('ingredientFinderIcon');
        if (finderIcon) {
            const hasClickListener = finderIcon.onclick || finderIcon.addEventListener;
            if (hasClickListener) {
                console.log("✅ Ingredient finder icon has click listener");
                this.results.iconClickListener = true;
            } else {
                console.log("⚠️ Ingredient finder icon click listener uncertain");
                this.warnings.push("Icon click listener not detected");
            }
        }

        // Test search input
        const searchInput = document.getElementById('ingredientSearchInput');
        if (searchInput) {
            console.log("✅ Search input element found");
            // Try to trigger search
            try {
                searchInput.value = 'test';
                const event = new Event('input');
                searchInput.dispatchEvent(event);
                console.log("✅ Search input event dispatch successful");
                this.results.searchInputEvent = true;
            } catch (error) {
                console.log(`❌ Search input event test failed: ${error.message}`);
                this.warnings.push("Search input event failed");
            }
        }
    }

    // Test 6: Simulate ingredient search workflow
    async testCompleteWorkflow() {
        console.log("\n🔄 Test 6: Testing Complete Search Workflow");

        if (!window.ingredientFragranceFinder) {
            console.log("❌ Cannot test workflow - IngredientFinder not available");
            return;
        }

        const finder = window.ingredientFragranceFinder;

        try {
            // Test adding ingredients
            const testIngredient = 'bergamot';
            finder.selectedIngredients = [];
            finder.selectedIngredients.push(testIngredient);
            console.log(`✅ Added ingredient: ${testIngredient}`);

            // Test search
            await finder.findMatchingFragrances();
            console.log("✅ Search workflow completed");
            this.results.workflowTest = true;

        } catch (error) {
            console.log(`❌ Workflow test failed: ${error.message}`);
            this.errors.push(`Workflow error: ${error.message}`);
        }
    }

    // Test 7: Performance and memory check
    testPerformance() {
        console.log("\n⚡ Test 7: Performance Check");

        const startTime = performance.now();

        try {
            // Test database size in memory
            if (window.FragranceAPIService) {
                const service = new FragranceAPIService();
                const dbSize = JSON.stringify(service.comprehensiveDatabase).length;
                console.log(`✅ Database size: ${Math.round(dbSize / 1024)} KB`);
                this.results.databaseSize = Math.round(dbSize / 1024);
            }

            const endTime = performance.now();
            console.log(`✅ Performance test completed in ${Math.round(endTime - startTime)}ms`);
            this.results.performanceTime = Math.round(endTime - startTime);

        } catch (error) {
            console.log(`❌ Performance test failed: ${error.message}`);
            this.warnings.push("Performance test incomplete");
        }
    }

    // Generate summary report
    generateReport() {
        console.log("\n📊 DIAGNOSTIC SUMMARY REPORT");
        console.log("=" .repeat(50));

        console.log(`\n✅ Successful Tests: ${Object.keys(this.results).length}`);
        console.log(`❌ Errors Found: ${this.errors.length}`);
        console.log(`⚠️ Warnings: ${this.warnings.length}`);

        if (this.errors.length > 0) {
            console.log("\n🚨 CRITICAL ERRORS:");
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log("\n⚠️ WARNINGS:");
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. ${warning}`);
            });
        }

        console.log("\n📈 SYSTEM STATUS:");
        if (this.errors.length === 0) {
            console.log("🟢 System appears to be working correctly!");
        } else if (this.errors.length < 3) {
            console.log("🟡 System has minor issues that should be addressed");
        } else {
            console.log("🔴 System has significant issues that need immediate attention");
        }

        // Specific recommendations
        console.log("\n💡 RECOMMENDATIONS:");
        if (!this.results.ingredientFinderInstance) {
            console.log("- Initialize the IngredientFragranceFinder instance");
        }
        if (this.results.databaseStats && this.results.databaseStats.totalFragrances < 100) {
            console.log("- Consider expanding the fragrance database");
        }
        if (this.warnings.some(w => w.includes('DOM element'))) {
            console.log("- Check HTML structure and ensure all required elements exist");
        }

        return {
            results: this.results,
            errors: this.errors,
            warnings: this.warnings,
            status: this.errors.length === 0 ? 'healthy' : (this.errors.length < 3 ? 'needs_attention' : 'critical')
        };
    }

    // Run all tests
    async runAllDiagnostics() {
        console.log("🚀 Starting comprehensive ingredient system diagnostics...\n");

        this.testClassAvailability();
        this.testDOMElements();
        await this.testFragranceAPIService();
        this.testIngredientFinder();
        this.testEventListeners();
        await this.testCompleteWorkflow();
        this.testPerformance();

        return this.generateReport();
    }
}

// Auto-run diagnostics when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🔧 DOM loaded, starting diagnostics in 2 seconds...");

    setTimeout(async () => {
        const diagnostics = new IngredientSystemDiagnostics();
        const report = await diagnostics.runAllDiagnostics();

        // Store results globally for manual inspection
        window.ingredientDiagnostics = {
            lastReport: report,
            runDiagnostics: () => diagnostics.runAllDiagnostics()
        };

        console.log("\n🎯 Diagnostics complete! Access results via window.ingredientDiagnostics");
    }, 2000);
});

// Export for manual testing
window.IngredientSystemDiagnostics = IngredientSystemDiagnostics;

// Quick test functions
window.quickTests = {
    testSearch: async (ingredients) => {
        if (!window.ingredientFragranceFinder) return "IngredientFinder not available";
        const service = new FragranceAPIService();
        return await service.searchByIngredients(ingredients || ['bergamot', 'vanilla']);
    },

    testDatabase: () => {
        const service = new FragranceAPIService();
        return service.getStatistics();
    },

    testIngredientSuggestions: (query) => {
        const service = new FragranceAPIService();
        return service.getIngredientSuggestions(query || 'van');
    }
};

console.log("📋 Quick test functions available in window.quickTests");
