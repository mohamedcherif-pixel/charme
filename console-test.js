// Console test for profile modal - paste this into browser console
console.log('🧪 PROFILE MODAL CONSOLE TEST');

// Test 1: Check if profile modal system exists
console.log('=== TEST 1: System Check ===');
console.log('window.profileModal exists:', typeof window.profileModal !== 'undefined');
console.log('testProfileModal exists:', typeof window.testProfileModal !== 'undefined');
console.log('ProfileModalManager exists:', typeof ProfileModalManager !== 'undefined');

// Test 2: Try to call the test function
console.log('=== TEST 2: Function Call ===');
if (typeof window.testProfileModal === 'function') {
    try {
        console.log('Calling testProfileModal...');
        window.testProfileModal('console-test@example.com');
        console.log('✅ Function called successfully');
    } catch (error) {
        console.error('❌ Error calling function:', error);
    }
} else {
    console.error('❌ testProfileModal function not found');
}

// Test 3: Check DOM for modal elements
console.log('=== TEST 3: DOM Check ===');
setTimeout(() => {
    const modals = document.querySelectorAll('.profile-modal-overlay');
    console.log('Profile modals in DOM:', modals.length);
    
    if (modals.length > 0) {
        modals.forEach((modal, index) => {
            console.log(`Modal ${index + 1}:`, modal);
            console.log(`  - Display: ${modal.style.display}`);
            console.log(`  - Z-index: ${modal.style.zIndex}`);
            console.log(`  - Position: ${modal.style.position}`);
            console.log(`  - Computed display: ${window.getComputedStyle(modal).display}`);
        });
    } else {
        console.log('No profile modals found in DOM');
    }
}, 1000);

// Test 4: Force create a simple modal
console.log('=== TEST 4: Force Modal ===');
function forceCreateModal() {
    console.log('Creating force modal...');
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(255, 0, 0, 0.8) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white !important;
        color: black !important;
        padding: 30px !important;
        border-radius: 8px !important;
        text-align: center !important;
    `;
    
    modal.innerHTML = `
        <h2>🔥 FORCE MODAL TEST</h2>
        <p>If you see this, modals CAN work on this page.</p>
        <button onclick="this.closest('div').remove()">Close</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    console.log('✅ Force modal created');
    
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
            console.log('🗑️ Force modal removed');
        }
    }, 3000);
}

forceCreateModal();

// Test 5: Check for profile search functionality
console.log('=== TEST 5: Profile Search ===');
const profileTab = document.querySelector('.search-tab[data-search-type="profiles"]');
console.log('Profile tab found:', !!profileTab);

const searchInput = document.getElementById('quickSearchInput');
console.log('Search input found:', !!searchInput);

if (profileTab && searchInput) {
    console.log('Testing profile search...');
    profileTab.click();
    
    setTimeout(() => {
        searchInput.value = 'bil';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const suggestions = document.querySelectorAll('.profile-suggestion, .search-suggestion');
            console.log(`Found ${suggestions.length} suggestions`);
            
            if (suggestions.length > 0) {
                console.log('First suggestion:', suggestions[0]);
                console.log('Adding test click handler...');
                
                suggestions[0].addEventListener('click', (e) => {
                    console.log('🔥 SUGGESTION CLICKED!');
                    console.log('Event:', e);
                    console.log('Target:', e.target);
                    
                    // Try to trigger modal manually
                    if (window.profileModal && window.profileModal.showProfileModal) {
                        console.log('Triggering modal manually...');
                        window.profileModal.showProfileModal('test_123', 'clicked@test.com');
                    }
                });
                
                suggestions[0].style.border = '3px solid lime';
                suggestions[0].style.cursor = 'pointer';
                suggestions[0].title = 'CLICK ME - Console Test';
                
                console.log('✅ Test handler added to first suggestion');
            }
        }, 1500);
    }, 200);
}

console.log('🔧 Console test complete. Try clicking the green-bordered suggestion if it appears.');
