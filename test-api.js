const { default: fetch } = require('node-fetch');

async function testUpdateProfileAPI() {
    try {
        // First, let's try to login to get a token
        console.log('🔐 Logging in to get token...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'cherifmed1200@gmail.com',
                password: 'Medmedmed88'
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('✅ Login successful, got token');

        // Now test the update profile API
        console.log('📝 Testing update profile API...');
        const updateResponse = await fetch('http://localhost:3000/api/reviews/update-user-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'API Test Name',
                avatar: 'api-test-avatar.jpg'
            })
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Update failed: ${updateResponse.status} - ${errorText}`);
        }

        const updateData = await updateResponse.json();
        console.log('✅ Update successful:', updateData);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testUpdateProfileAPI();
