const https = require('https');
const http = require('http');

// Test the profile search API
async function testProfileSearchAPI() {
    console.log('🧪 Testing Profile Search API');
    console.log('==============================\n');

    const testQueries = [
        'bil', // Should find billeyyyyy
        'cher', // Should find users with cher in email
        'gmail', // Should find gmail users
        'aa' // Should find users with aa
    ];

    for (const query of testQueries) {
        try {
            console.log(`🔍 Testing query: "${query}"`);

            const result = await makeAPIRequest(`/api/search/users?q=${encodeURIComponent(query)}`);

            if (result.success) {
                console.log(`✅ Status: ${result.statusCode}`);
                console.log(`📊 Found ${result.data.length} users`);

                if (result.data.length > 0) {
                    result.data.forEach((user, index) => {
                        console.log(`   ${index + 1}. ${user.display_name || user.first_name + ' ' + user.last_name}`);
                        console.log(`      Email: ${user.email}`);
                        console.log(`      Level: ${user.level || 1}`);
                        console.log(`      Badge: ${user.badge || 'Member'}`);
                        console.log(`      Admin: ${user.is_admin ? 'Yes' : 'No'}`);
                    });
                }
            } else {
                console.log(`❌ Request failed: ${result.error}`);
            }

        } catch (error) {
            console.log(`❌ Error testing "${query}": ${error.message}`);
        }

        console.log('-'.repeat(50));
    }
}

// Make HTTP request to API
function makeAPIRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        success: true,
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (parseError) {
                    resolve({
                        success: false,
                        error: `Parse error: ${parseError.message}`,
                        rawData: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message
            });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Request timeout'
            });
        });

        req.end();
    });
}

// Run the test
testProfileSearchAPI()
    .then(() => {
        console.log('\n✅ Profile search API test completed!');
        console.log('\n💡 If you see results above, the API is working correctly.');
        console.log('🌐 You can now test the frontend at: http://localhost:3000');
    })
    .catch((error) => {
        console.error('💥 Test failed:', error);
    });
