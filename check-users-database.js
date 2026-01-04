const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path (same as in server.js)
const dbPath = './database/parfumerie.db';

console.log('🔍 Checking Users Database');
console.log('==========================');
console.log(`Database path: ${dbPath}`);

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to SQLite database');
});

// Function to check if users table exists
function checkUsersTable() {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Function to get users table schema
function getUsersSchema() {
    return new Promise((resolve, reject) => {
        db.all("PRAGMA table_info(users)", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to count total users
function getTotalUsers() {
    return new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count);
            }
        });
    });
}

// Function to get all users
function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                avatar_url,
                level,
                experience,
                created_at,
                is_admin,
                is_banned
            FROM users
            ORDER BY id`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Function to get user statistics
function getUserStats() {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT
                COUNT(*) as total_users,
                COUNT(CASE WHEN is_admin = 1 THEN 1 END) as admin_users,
                COUNT(CASE WHEN is_banned = 1 THEN 1 END) as banned_users,
                COUNT(CASE WHEN level > 1 THEN 1 END) as leveled_users,
                AVG(level) as avg_level,
                MAX(level) as max_level,
                AVG(experience) as avg_experience,
                MAX(experience) as max_experience
            FROM users`,
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

// Main execution function
async function checkDatabase() {
    try {
        // Check if users table exists
        console.log('\n📋 Checking users table existence...');
        const tableExists = await checkUsersTable();

        if (!tableExists) {
            console.log('❌ Users table does not exist!');
            db.close();
            return;
        }

        console.log('✅ Users table exists');

        // Get table schema
        console.log('\n🏗️  Users table schema:');
        const schema = await getUsersSchema();
        schema.forEach(column => {
            const nullable = column.notnull ? 'NOT NULL' : 'NULL';
            const defaultValue = column.dflt_value ? ` DEFAULT ${column.dflt_value}` : '';
            console.log(`   ${column.name}: ${column.type} ${nullable}${defaultValue}`);
        });

        // Get total users count
        console.log('\n📊 User Statistics:');
        const totalUsers = await getTotalUsers();
        console.log(`   Total users: ${totalUsers}`);

        if (totalUsers === 0) {
            console.log('   📝 No users found in database');
            db.close();
            return;
        }

        // Get detailed stats
        const stats = await getUserStats();
        console.log(`   Admin users: ${stats.admin_users}`);
        console.log(`   Banned users: ${stats.banned_users}`);
        console.log(`   Users with levels > 1: ${stats.leveled_users}`);
        console.log(`   Average level: ${stats.avg_level ? stats.avg_level.toFixed(2) : 'N/A'}`);
        console.log(`   Maximum level: ${stats.max_level || 'N/A'}`);
        console.log(`   Average experience: ${stats.avg_experience ? Math.round(stats.avg_experience) : 'N/A'}`);
        console.log(`   Maximum experience: ${stats.max_experience || 'N/A'}`);

        // Get all users
        console.log('\n👥 All Users:');
        console.log('═'.repeat(80));

        const users = await getAllUsers();

        if (users.length === 0) {
            console.log('   📝 No users found');
        } else {
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.first_name} ${user.last_name}`);
                console.log(`   ID: ${user.id}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Level: ${user.level || 1} | Experience: ${user.experience || 0}`);
                console.log(`   Admin: ${user.is_admin ? 'Yes' : 'No'} | Banned: ${user.is_banned ? 'Yes' : 'No'}`);
                console.log(`   Avatar: ${user.avatar_url || 'None'}`);
                console.log(`   Created: ${user.created_at || 'Unknown'}`);

                if (index < users.length - 1) {
                    console.log('   ' + '─'.repeat(50));
                }
            });
        }

        // Test search functionality with existing users
        if (users.length > 0) {
            console.log('\n🔍 Testing Search Functionality:');
            console.log('═'.repeat(50));

            // Test with first user's first name
            const firstUser = users[0];
            const searchQuery = firstUser.first_name?.toLowerCase() || firstUser.email?.toLowerCase() || '';

            if (searchQuery) {
                console.log(`\nTesting search with query: "${searchQuery}"`);

                const searchResults = await new Promise((resolve, reject) => {
                    const searchTerm = `%${searchQuery}%`;
                    db.all(
                        `SELECT id, first_name, last_name, email, level, is_admin
                         FROM users
                         WHERE (LOWER(first_name) LIKE ? OR
                                LOWER(last_name) LIKE ? OR
                                LOWER(email) LIKE ?)
                               AND is_banned = 0
                         ORDER BY id
                         LIMIT 5`,
                        [searchTerm, searchTerm, searchTerm],
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });

                console.log(`Found ${searchResults.length} search results:`);
                searchResults.forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.first_name} ${user.last_name} (${user.email})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error checking database:', error.message);
    } finally {
        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('\n✅ Database connection closed');
            }
        });
    }
}

// Run the check
checkDatabase();
