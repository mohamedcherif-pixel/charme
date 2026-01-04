// Test the profile save API directly
const { default: fetch } = require('node-fetch');

async function testProfileSave() {
    console.log('🧪 TESTING PROFILE SAVE API...');
    
    // You'll need to get your actual auth token from the browser
    // For now, let's test without authentication to see the error
    
    const profileData = {
        name: "lol",
        phone: null,
        birthday: null,
        avatar: "default.jpg"
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer YOUR_TOKEN_HERE`
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        console.log('📝 Response status:', response.status);
        console.log('📝 Response data:', data);
        
        if (data.success) {
            console.log('✅ Profile save successful!');
            console.log('👤 Updated user:', data.user);
        } else {
            console.log('❌ Profile save failed:', data.error);
        }
        
    } catch (error) {
        console.error('❌ Error testing profile save:', error.message);
    }
}

testProfileSave();
