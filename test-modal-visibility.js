// Simple test to check if profile modal is working
console.log('🧪 Testing profile modal visibility...');

// Test 1: Check if ProfileModalManager exists
if (typeof ProfileModalManager !== 'undefined') {
    console.log('✅ ProfileModalManager class exists');
} else {
    console.error('❌ ProfileModalManager class not found');
}

// Test 2: Check if window.profileModal exists
if (typeof window.profileModal !== 'undefined') {
    console.log('✅ window.profileModal exists');
    console.log('Type:', typeof window.profileModal);
    console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.profileModal)));
} else {
    console.error('❌ window.profileModal not found');
}

// Test 3: Try to create a simple modal manually
function testSimpleProfileModal() {
    console.log('🔧 Creating simple profile modal manually...');
    
    // Remove any existing modal
    const existing = document.querySelector('.profile-modal-overlay');
    if (existing) {
        existing.remove();
        console.log('🗑️ Removed existing modal');
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'profile-modal-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.8) !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.style.cssText = `
        background: white !important;
        color: black !important;
        padding: 30px !important;
        border-radius: 8px !important;
        max-width: 500px !important;
        width: 90% !important;
        text-align: center !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
    `;
    
    modal.innerHTML = `
        <h2>🧪 Test Profile Modal</h2>
        <p>This is a manual test modal to verify modal functionality works.</p>
        <p><strong>User:</strong> test@example.com</p>
        <button onclick="this.closest('.profile-modal-overlay').remove()" style="padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Modal</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    console.log('✅ Manual modal created and added to DOM');
    console.log('Modal element:', modal);
    console.log('Overlay element:', overlay);
    
    // Check if it's actually visible
    setTimeout(() => {
        const rect = overlay.getBoundingClientRect();
        console.log('Modal position:', rect);
        console.log('Modal computed style:', window.getComputedStyle(overlay));
        
        if (rect.width > 0 && rect.height > 0) {
            console.log('✅ Modal is visible on screen');
        } else {
            console.error('❌ Modal is not visible (0 dimensions)');
        }
    }, 100);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
            console.log('🗑️ Auto-closed test modal');
        }
    }, 5000);
}

// Test 4: Test the actual profile modal system
function testActualProfileModal() {
    console.log('🔧 Testing actual profile modal system...');
    
    if (window.profileModal && window.profileModal.showProfileModal) {
        try {
            console.log('Calling showProfileModal...');
            window.profileModal.showProfileModal('test_123', 'test@example.com');
            console.log('✅ showProfileModal called without error');
            
            // Check if modal was actually created
            setTimeout(() => {
                const modal = document.querySelector('.profile-modal-overlay');
                if (modal) {
                    console.log('✅ Profile modal found in DOM');
                    console.log('Modal style:', modal.style.cssText);
                    console.log('Modal computed style:', window.getComputedStyle(modal));
                } else {
                    console.error('❌ Profile modal not found in DOM after call');
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Error calling showProfileModal:', error);
        }
    } else {
        console.error('❌ profileModal.showProfileModal not available');
    }
}

// Run tests
console.log('=== RUNNING PROFILE MODAL TESTS ===');
setTimeout(() => {
    testSimpleProfileModal();
}, 1000);

setTimeout(() => {
    testActualProfileModal();
}, 3000);

// Make functions available globally for manual testing
window.testSimpleProfileModal = testSimpleProfileModal;
window.testActualProfileModal = testActualProfileModal;

console.log('🔧 Test functions available:');
console.log('  • testSimpleProfileModal() - Test basic modal');
console.log('  • testActualProfileModal() - Test profile modal system');
