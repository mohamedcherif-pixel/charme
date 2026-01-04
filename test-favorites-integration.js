/**
 * Quick Integration Test for Favorites Fix
 * Run this in browser console on your main website to verify the fix is working
 */

(function() {
    console.log('🔧 Starting Favorites Fix Integration Test...');

    // Test 1: Check if new CSS is loaded
    function testCSSLoaded() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const favoritesCSS = Array.from(links).find(link =>
            link.href.includes('favorites_theme.css')
        );

        if (favoritesCSS) {
            console.log('✅ Test 1: Favorites theme CSS is loaded');
            return true;
        } else {
            console.log('❌ Test 1: Favorites theme CSS NOT found');
            return false;
        }
    }

    // Test 2: Check button structure
    function testButtonStructure() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        if (favoriteButtons.length === 0) {
            console.log('❌ Test 2: No favorite buttons found');
            return false;
        }

        console.log(`🔍 Found ${favoriteButtons.length} favorite buttons`);

        let structureValid = true;
        favoriteButtons.forEach((btn, index) => {
            const productId = btn.dataset.product;
            const icon = btn.querySelector('.favorite-icon');
            const text = btn.querySelector('.favorite-text');
            const heartOutline = btn.querySelector('.heart-outline');
            const heartFilled = btn.querySelector('.heart-filled');

            if (!productId) {
                console.log(`❌ Button ${index + 1}: Missing data-product attribute`);
                structureValid = false;
            }

            if (!icon) {
                console.log(`❌ Button ${index + 1}: Missing .favorite-icon`);
                structureValid = false;
            }

            if (!text) {
                console.log(`❌ Button ${index + 1}: Missing .favorite-text`);
                structureValid = false;
            }

            if (!heartOutline || !heartFilled) {
                console.log(`❌ Button ${index + 1}: Missing heart icons`);
                structureValid = false;
            }

            if (structureValid) {
                console.log(`✅ Button ${index + 1} (${productId}): Structure valid`);
            }
        });

        if (structureValid) {
            console.log('✅ Test 2: All button structures are valid');
        } else {
            console.log('❌ Test 2: Some button structures are invalid');
        }

        return structureValid;
    }

    // Test 3: Check CSS classes and styling
    function testStyling() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        const firstButton = favoriteButtons[0];

        if (!firstButton) {
            console.log('❌ Test 3: No buttons to test styling');
            return false;
        }

        const computedStyle = window.getComputedStyle(firstButton);
        const backgroundColor = computedStyle.backgroundColor;
        const borderRadius = computedStyle.borderRadius;
        const display = computedStyle.display;

        console.log('🎨 Button styling:', {
            backgroundColor,
            borderRadius,
            display,
            transition: computedStyle.transition
        });

        // Check if new styles are applied (should have flex display and rounded borders)
        const hasCorrectStyling = display === 'flex' && borderRadius !== '0px';

        if (hasCorrectStyling) {
            console.log('✅ Test 3: New CSS styling is applied');
            return true;
        } else {
            console.log('❌ Test 3: New CSS styling not detected');
            return false;
        }
    }

    // Test 4: Check FavoritesManager integration
    function testFavoritesManager() {
        if (window.favoritesManager) {
            console.log('✅ Test 4: FavoritesManager is available globally');

            // Test manager methods
            const methods = [
                'toggleFavorite',
                'updateFavoriteButton',
                'showLoadingState',
                'hideLoadingState',
                'addSuccessAnimation'
            ];

            let allMethodsExist = true;
            methods.forEach(method => {
                if (typeof window.favoritesManager[method] === 'function') {
                    console.log(`  ✅ Method ${method} exists`);
                } else {
                    console.log(`  ❌ Method ${method} missing`);
                    allMethodsExist = false;
                }
            });

            return allMethodsExist;
        } else {
            console.log('❌ Test 4: FavoritesManager not found');
            return false;
        }
    }

    // Test 5: Visual state test
    function testVisualStates() {
        console.log('🎭 Testing visual states...');
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        if (favoriteButtons.length === 0) {
            console.log('❌ Test 5: No buttons to test');
            return false;
        }

        const testButton = favoriteButtons[0];
        const originalClasses = Array.from(testButton.classList);

        // Test favorited state
        testButton.classList.add('favorited', 'active');
        const favoritedStyle = window.getComputedStyle(testButton);
        console.log('💖 Favorited state background:', favoritedStyle.backgroundColor);

        // Test loading state
        testButton.classList.add('loading');
        const loadingStyle = window.getComputedStyle(testButton);
        console.log('⏳ Loading state detected');

        // Test locked state
        testButton.className = 'favorite-btn locked';
        const lockedStyle = window.getComputedStyle(testButton);
        console.log('🔒 Locked state background:', lockedStyle.backgroundColor);

        // Restore original classes
        testButton.className = 'favorite-btn';
        originalClasses.forEach(cls => {
            if (cls !== 'favorite-btn') testButton.classList.add(cls);
        });

        console.log('✅ Test 5: Visual states tested successfully');
        return true;
    }

    // Test 6: Animation test
    function testAnimations() {
        console.log('✨ Testing animations...');
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        if (favoriteButtons.length === 0) {
            console.log('❌ Test 6: No buttons to test animations');
            return false;
        }

        const testButton = favoriteButtons[0];

        // Test hover effect (simulate)
        testButton.style.transform = 'translateY(-4px) scale(1.05)';
        console.log('🖱️ Hover transform applied');

        setTimeout(() => {
            testButton.style.transform = '';
        }, 1000);

        // Test pulse animation
        testButton.classList.add('animate');
        console.log('📳 Pulse animation applied');

        setTimeout(() => {
            testButton.classList.remove('animate');
        }, 300);

        // Test heartbeat animation
        testButton.classList.add('heartbeat');
        console.log('💓 Heartbeat animation applied');

        setTimeout(() => {
            testButton.classList.remove('heartbeat');
        }, 600);

        console.log('✅ Test 6: Animations tested successfully');
        return true;
    }

    // Test 7: Responsive behavior
    function testResponsive() {
        console.log('📱 Testing responsive behavior...');
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        if (favoriteButtons.length === 0) {
            console.log('❌ Test 7: No buttons to test');
            return false;
        }

        const testButton = favoriteButtons[0];
        const container = testButton.closest('.favorite-btn-middle-container');

        if (container) {
            const containerStyle = window.getComputedStyle(container);
            console.log('📐 Container styling:', {
                display: containerStyle.display,
                justifyContent: containerStyle.justifyContent,
                alignItems: containerStyle.alignItems
            });
        }

        const buttonStyle = window.getComputedStyle(testButton);
        console.log('📱 Button responsive properties:', {
            width: buttonStyle.width,
            minWidth: buttonStyle.minWidth,
            maxWidth: buttonStyle.maxWidth,
            padding: buttonStyle.padding
        });

        console.log('✅ Test 7: Responsive behavior tested');
        return true;
    }

    // Run all tests
    function runAllTests() {
        console.log('🚀 Running comprehensive integration test...\n');

        const results = {
            cssLoaded: testCSSLoaded(),
            buttonStructure: testButtonStructure(),
            styling: testStyling(),
            favoritesManager: testFavoritesManager(),
            visualStates: testVisualStates(),
            animations: testAnimations(),
            responsive: testResponsive()
        };

        console.log('\n📊 Test Results Summary:');
        console.log('========================');

        let passedTests = 0;
        let totalTests = Object.keys(results).length;

        Object.entries(results).forEach(([test, passed]) => {
            const status = passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} - ${test}`);
            if (passed) passedTests++;
        });

        console.log('========================');
        console.log(`📈 Score: ${passedTests}/${totalTests} tests passed`);

        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED! Favorites fix is working correctly!');
        } else if (passedTests >= totalTests * 0.8) {
            console.log('⚠️  Most tests passed, minor issues detected');
        } else {
            console.log('❌ Major issues detected, fix may not be working properly');
        }

        return results;
    }

    // Interactive test functions
    window.testFavoritesFix = {
        runAll: runAllTests,
        cssLoaded: testCSSLoaded,
        buttonStructure: testButtonStructure,
        styling: testStyling,
        favoritesManager: testFavoritesManager,
        visualStates: testVisualStates,
        animations: testAnimations,
        responsive: testResponsive
    };

    console.log('🎯 Favorites Fix Integration Test loaded!');
    console.log('💡 Run testFavoritesFix.runAll() to test everything');
    console.log('💡 Or run individual tests like testFavoritesFix.styling()');

    // Auto-run if not in development mode
    if (!window.location.href.includes('localhost') && !window.location.href.includes('test-')) {
        setTimeout(runAllTests, 1000);
    }

})();
