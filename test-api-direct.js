const http = require('http');

console.log('🧪 Testing Profile Search API Direct');
console.log('====================================\n');

function testAPI(query) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/search/users?q=${encodeURIComponent(query)}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log(`🔍 Testing query: "${query}"`);
        console.log(`📡 URL: http://localhost:3000${options.path}`);

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    console.log(`📊 Status: ${res.statusCode}`);

                    if (res.statusCode === 200) {
                        const jsonData = JSON.parse(data);
                        console.log(`✅ Success! Found ${jsonData.length} users`);

                        if (jsonData.length > 0) {
                            console.log('👥 Users found:');
                            jsonData.forEach((user, i) => {
                                const name = user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                                console.log(`   ${i+1}. ${name}`);
                                console.log(`      ID: ${user.id}`);
                                console.log(`      Email: ${user.email}`);
                                console.log(`      Level: ${user.level || 1}`);
                                console.log(`      Admin: ${user.is_admin ? 'Yes' : 'No'}`);
                                console.log(`      Avatar: ${user.avatar_url || 'None'}`);
                            });
                        }
                        resolve(jsonData);
                    } else {
                        console.log(`❌ HTTP Error ${res.statusCode}`);
                        console.log(`Response: ${data}`);
                        reject(new Error(`HTTP ${res.statusCode}`));
                    }
                } catch (parseError) {
                    console.log(`❌ Parse Error: ${parseError.message}`);
                    console.log(`Raw response: ${data}`);
                    reject(parseError);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`❌ Request Error: ${error.message}`);
            reject(error);
        });

        req.setTimeout(5000, () => {
            console.log(`❌ Request timeout after 5 seconds`);
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function runTests() {
    const testQueries = [
        'bil',      // Should find billeyyyyy
        'cher',     // Should find users with cher in email
        'gmail',    // Should find gmail users
        'aa',       // Should find users with aa
        'admin'     // Should find admin users
    ];

    console.log(`🎯 Testing ${testQueries.length} different queries...\n`);

    for (const query of testQueries) {
        try {
            await testAPI(query);
        } catch (error) {
            console.log(`💥 Test failed for "${query}": ${error.message}`);
        }
        console.log('-'.repeat(50));
    }

    console.log('\n🏁 All tests completed!');
    console.log('\n💡 If you see users above, the API is working correctly.');
    console.log('🌐 The issue might be in the frontend JavaScript integration.');
}

// Run the tests
runTests().catch((error) => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
});
