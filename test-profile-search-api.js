const http = require('http');
const querystring = require('querystring');

// Test configuration
const HOST = 'localhost';
const PORT = 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

// Test queries
const testQueries = [
    '', // Empty query
    'a', // Single character
    'jo', // Two characters
    'john', // Common name
    'admin', // Search for admin users
    'test', // Generic test search
    'nonexistent_user_12345' // Non-existent user
];

// Function to make HTTP GET request
function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const url = `${BASE_URL}${path}`;
        console.log(`\n🔍 Testing: ${url}`);

        const req = http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data,
                        parseError: error.message
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

// Function to test user search API
async function testUserSearchAPI() {
    console.log('🚀 Starting User Search API Tests');
    console.log('=====================================');

    for (const query of testQueries) {
        try {
            const encodedQuery = encodeURIComponent(query);
            const path = `/api/search/users?q=${encodedQuery}`;
            const response = await makeRequest(path);

            console.log(`📊 Status: ${response.statusCode}`);

            if (response.statusCode === 200) {
                console.log('✅ Request successful');

                if (Array.isArray(response.data)) {
                    console.log(`📋 Results count: ${response.data.length}`);

                    if (response.data.length > 0) {
                        console.log('👥 Sample results:');
                        response.data.slice(0, 3).forEach((user, index) => {
                            console.log(`   ${index + 1}. ${user.display_name || 'N/A'}`);
                            console.log(`      - ID: ${user.id || 'N/A'}`);
                            console.log(`      - Email: ${user.email || 'N/A'}`);
                            console.log(`      - Level: ${user.level || 'N/A'}`);
                            console.log(`      - Badge: ${user.badge || 'N/A'}`);
                            console.log(`      - Admin: ${user.is_admin ? 'Yes' : 'No'}`);
                            console.log(`      - Avatar: ${user.avatar_url || 'N/A'}`);
                            console.log(`      - Member since: ${user.member_since || 'N/A'}`);
                        });

                        if (response.data.length > 3) {
                            console.log(`   ... and ${response.data.length - 3} more results`);
                        }
                    } else {
                        console.log('📝 No users found for this query');
                    }
                } else {
                    console.log('❌ Response is not an array:', response.data);
                }
            } else {
                console.log(`❌ Request failed with status ${response.statusCode}`);
                console.log('Response:', response.data);
            }

            // Validate response structure for successful requests
            if (response.statusCode === 200 && Array.isArray(response.data) && response.data.length > 0) {
                const firstUser = response.data[0];
                const requiredFields = ['id', 'display_name', 'first_name', 'last_name', 'email'];
                const optionalFields = ['avatar_url', 'level', 'experience', 'member_since', 'is_admin', 'badge'];

                console.log('🔍 Field validation:');

                requiredFields.forEach(field => {
                    if (firstUser.hasOwnProperty(field)) {
                        console.log(`   ✅ ${field}: present`);
                    } else {
                        console.log(`   ❌ ${field}: missing (required)`);
                    }
                });

                optionalFields.forEach(field => {
                    if (firstUser.hasOwnProperty(field)) {
                        console.log(`   ✅ ${field}: present`);
                    } else {
                        console.log(`   ⚠️  ${field}: missing (optional)`);
                    }
                });
            }

        } catch (error) {
            console.log(`❌ Error testing query "${query}":`, error.message);
        }

        console.log('─'.repeat(50));
    }
}

// Function to test API availability
async function testAPIAvailability() {
    console.log('\n🏥 Testing API Availability');
    console.log('============================');

    try {
        const response = await makeRequest('/');
        console.log(`✅ Server is running (Status: ${response.statusCode})`);
        return true;
    } catch (error) {
        console.log(`❌ Server is not accessible: ${error.message}`);
        console.log(`💡 Make sure the server is running on ${BASE_URL}`);
        return false;
    }
}

// Main test execution
async function runTests() {
    console.log('🧪 Profile Search API Test Suite');
    console.log('==================================');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Time: ${new Date().toISOString()}`);

    // Test server availability first
    const serverAvailable = await testAPIAvailability();

    if (serverAvailable) {
        // Run user search API tests
        await testUserSearchAPI();

        console.log('\n📈 Test Summary');
        console.log('===============');
        console.log('✅ API endpoint tests completed');
        console.log('💡 Check the results above for any issues');
        console.log('\n🔧 Next steps:');
        console.log('   1. Verify that user search returns expected results');
        console.log('   2. Test the frontend integration');
        console.log('   3. Check search performance with different queries');
    }

    console.log('\n🏁 Test execution finished');
}

// Run the tests
runTests().catch((error) => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
});
