const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 XP/Level System Removal Verification Test');
console.log('=============================================');
console.log(`Time: ${new Date().toISOString()}\n`);

// Test configuration
const HOST = 'localhost';
const PORT = 3000;
const dbPath = './database/parfumerie.db';

// Test results
let testResults = {
    database: { passed: 0, failed: 0, tests: [] },
    api: { passed: 0, failed: 0, tests: [] },
    frontend: { passed: 0, failed: 0, tests: [] },
    server: { passed: 0, failed: 0, tests: [] }
};

// Helper functions
function addTest(category, testName, passed, message) {
    testResults[category].tests.push({ testName, passed, message });
    if (passed) {
        testResults[category].passed++;
    } else {
        testResults[category].failed++;
    }
}

function logTest(category, testName, passed, message) {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} [${category.toUpperCase()}] ${testName}: ${message}`);
    addTest(category, testName, passed, message);
}

// Database tests
async function testDatabase() {
    return new Promise((resolve) => {
        console.log('🗄️ Testing Database Schema...\n');

        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                logTest('database', 'Connection', false, `Failed to connect: ${err.message}`);
                return resolve();
            }

            // Test 1: Check users table schema
            db.all("PRAGMA table_info(users)", (err, columns) => {
                if (err) {
                    logTest('database', 'Schema Check', false, `Error checking schema: ${err.message}`);
                } else {
                    const hasLevel = columns.some(col => col.name === 'level');
                    const hasExperience = columns.some(col => col.name === 'experience');

                    logTest('database', 'Level Column Removed', !hasLevel,
                        hasLevel ? 'Level column still exists!' : 'Level column successfully removed');

                    logTest('database', 'Experience Column Removed', !hasExperience,
                        hasExperience ? 'Experience column still exists!' : 'Experience column successfully removed');

                    // Show current schema
                    console.log('📋 Current users table schema:');
                    columns.forEach(col => {
                        console.log(`   ${col.name}: ${col.type}`);
                    });
                }

                // Test 2: Check for backup tables
                db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'users_backup_%'", (err, backups) => {
                    if (err) {
                        logTest('database', 'Backup Check', false, `Error checking backups: ${err.message}`);
                    } else {
                        logTest('database', 'Backup Tables Created', backups.length > 0,
                            backups.length > 0 ? `Found ${backups.length} backup tables` : 'No backup tables found');
                    }

                    // Test 3: Sample user data
                    db.get("SELECT * FROM users LIMIT 1", (err, user) => {
                        if (err) {
                            logTest('database', 'User Data Check', false, `Error querying users: ${err.message}`);
                        } else if (user) {
                            const hasLevelData = user.hasOwnProperty('level') || user.hasOwnProperty('experience');
                            logTest('database', 'User Data Clean', !hasLevelData,
                                hasLevelData ? 'User records still contain level/experience data' : 'User records clean of XP data');
                        } else {
                            logTest('database', 'User Data Check', true, 'No users in database (empty table)');
                        }

                        db.close();
                        resolve();
                    });
                });
            });
        });
    });
}

// API tests
async function testAPI() {
    console.log('\n🔌 Testing API Endpoints...\n');

    // Test 1: User search API
    try {
        const response = await makeAPIRequest('/api/search/users?q=test');
        if (response.success) {
            const users = response.data;
            if (Array.isArray(users) && users.length > 0) {
                const hasLevelData = users.some(user =>
                    user.hasOwnProperty('level') ||
                    user.hasOwnProperty('experience') ||
                    user.hasOwnProperty('levelProgress')
                );
                logTest('api', 'User Search Response', !hasLevelData,
                    hasLevelData ? 'API still returns level/experience data' : 'API response clean of XP data');
            } else {
                logTest('api', 'User Search Response', true, 'No users returned (empty response)');
            }
        } else {
            logTest('api', 'User Search API', false, `API request failed: ${response.error}`);
        }
    } catch (error) {
        logTest('api', 'User Search API', false, `API test failed: ${error.message}`);
    }

    // Test 2: Check if server responds
    try {
        const response = await makeAPIRequest('/');
        logTest('api', 'Server Connection', response.success,
            response.success ? 'Server is responding' : 'Server connection failed');
    } catch (error) {
        logTest('api', 'Server Connection', false, `Server not accessible: ${error.message}`);
    }
}

// Frontend tests
async function testFrontend() {
    console.log('\n🎨 Testing Frontend Code...\n');

    try {
        // Test 1: Check main script file
        const scriptPath = path.join(__dirname, 'script.js');
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');

        // Check for level-related functions
        const levelFunctions = [
            'createAvatarWithLevel',
            'createReviewAvatarWithLevel',
            'updateAvatarLevel',
            'showLevelUpNotification',
            'awardExperience',
            'calculateLevel',
            'applyLevelUiEverywhere'
        ];

        let foundFunctions = [];
        levelFunctions.forEach(func => {
            if (scriptContent.includes(func)) {
                foundFunctions.push(func);
            }
        });

        logTest('frontend', 'Level Functions Removed', foundFunctions.length === 0,
            foundFunctions.length === 0 ? 'All level functions removed' : `Found functions: ${foundFunctions.join(', ')}`);

        // Test 2: Check for level-related variables
        const levelVariables = ['LevelState', 'LevelEvents'];
        let foundVariables = [];
        levelVariables.forEach(variable => {
            if (scriptContent.includes(variable) && !scriptContent.includes(`// Level system removed`)) {
                foundVariables.push(variable);
            }
        });

        logTest('frontend', 'Level Variables Removed', foundVariables.length === 0,
            foundVariables.length === 0 ? 'Level variables cleaned up' : `Found variables: ${foundVariables.join(', ')}`);

        // Test 3: Check CSS file
        const cssPath = path.join(__dirname, 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');

        const levelClasses = [
            '.level-badge',
            '.level-progress-ring',
            '.avatar-level-container',
            '.level-tooltip'
        ];

        let foundClasses = [];
        levelClasses.forEach(className => {
            if (cssContent.includes(className)) {
                foundClasses.push(className);
            }
        });

        logTest('frontend', 'Level CSS Classes Removed', foundClasses.length === 0,
            foundClasses.length === 0 ? 'All level CSS classes removed' : `Found classes: ${foundClasses.join(', ')}`);

    } catch (error) {
        logTest('frontend', 'File Access', false, `Error reading files: ${error.message}`);
    }
}

// Server code tests
async function testServerCode() {
    console.log('\n🖥️ Testing Server Code...\n');

    try {
        const serverPath = path.join(__dirname, 'server.js');
        const serverContent = fs.readFileSync(serverPath, 'utf8');

        // Test 1: Check for XP functions
        const xpFunctions = [
            'calculateRequiredXP',
            'calculateLevel',
            'awardExperience'
        ];

        let foundFunctions = [];
        xpFunctions.forEach(func => {
            if (serverContent.includes(`function ${func}`) || serverContent.includes(`${func}(`)) {
                foundFunctions.push(func);
            }
        });

        logTest('server', 'XP Functions Removed', foundFunctions.length === 0,
            foundFunctions.length === 0 ? 'All XP functions removed from server' : `Found functions: ${foundFunctions.join(', ')}`);

        // Test 2: Check for level/experience in database queries
        const xpQueries = serverContent.match(/SELECT.*?(level|experience)/gi) || [];
        logTest('server', 'Database Queries Clean', xpQueries.length === 0,
            xpQueries.length === 0 ? 'No level/experience in database queries' : `Found ${xpQueries.length} queries with XP data`);

        // Test 3: Check for XP awarding
        const xpAwarding = serverContent.includes('awardExperience') || serverContent.includes('xpAmount');
        logTest('server', 'XP Awarding Removed', !xpAwarding,
            !xpAwarding ? 'XP awarding code removed' : 'XP awarding code still present');

    } catch (error) {
        logTest('server', 'File Access', false, `Error reading server file: ${error.message}`);
    }
}

// API request helper
function makeAPIRequest(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ success: true, statusCode: res.statusCode, data: jsonData });
                } catch (parseError) {
                    resolve({ success: res.statusCode === 200, statusCode: res.statusCode, error: 'Parse error' });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            resolve({ success: false, error: 'Request timeout' });
        });

        req.end();
    });
}

// Print summary
function printSummary() {
    console.log('\n📊 Test Summary');
    console.log('================');

    let totalPassed = 0;
    let totalFailed = 0;

    Object.keys(testResults).forEach(category => {
        const { passed, failed } = testResults[category];
        totalPassed += passed;
        totalFailed += failed;

        const status = failed === 0 ? '✅' : '❌';
        console.log(`${status} ${category.toUpperCase()}: ${passed} passed, ${failed} failed`);
    });

    console.log('\n' + '='.repeat(40));
    const overallStatus = totalFailed === 0 ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED';
    console.log(`${overallStatus}: ${totalPassed} passed, ${totalFailed} failed`);

    if (totalFailed === 0) {
        console.log('\n✅ XP/Level system has been completely removed!');
        console.log('🎯 Your application is now free of the experience/leveling system.');
    } else {
        console.log('\n❌ XP/Level system removal incomplete.');
        console.log('🔧 Please review the failed tests and complete the removal process.');
    }

    // Show detailed failures
    if (totalFailed > 0) {
        console.log('\n📋 Failed Tests Details:');
        Object.keys(testResults).forEach(category => {
            const failedTests = testResults[category].tests.filter(test => !test.passed);
            if (failedTests.length > 0) {
                console.log(`\n${category.toUpperCase()}:`);
                failedTests.forEach(test => {
                    console.log(`   ❌ ${test.testName}: ${test.message}`);
                });
            }
        });
    }
}

// Main execution
async function runTests() {
    console.log('🚀 Starting comprehensive XP/Level system removal verification...\n');

    try {
        await testDatabase();
        await testAPI();
        await testFrontend();
        await testServerCode();

        printSummary();

    } catch (error) {
        console.error('💥 Test execution failed:', error);
        process.exit(1);
    }
}

// Run all tests
runTests();
