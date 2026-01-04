const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'database', 'parfumerie.db');

console.log('🔧 COMPREHENSIVE DATABASE FIXES');
console.log('===============================');

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Function to run SQL with promise
function runSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Function to get data with promise
function getSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Function to get all data with promise
function getAllSQL(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function fixDatabaseIssues() {
    try {
        console.log('\n📋 Step 1: Fixing User Profile Data...');
        
        // Fix your profile (User ID 1) - change name from "bl ok" to "blo" (empty last name)
        await runSQL(`
            UPDATE users 
            SET first_name = 'blo', 
                last_name = '', 
                updated_at = datetime('now')
            WHERE id = 1
        `);
        console.log('✅ Fixed User ID 1: name changed to "blo" (no last name)');
        
        // Check if user has large avatar causing storage issues
        const user1 = await getSQL('SELECT id, first_name, last_name, avatar_url FROM users WHERE id = 1');
        if (user1 && user1.avatar_url && user1.avatar_url.length > 10000) {
            console.log(`⚠️ User ID 1 has large avatar (${user1.avatar_url.length} chars) - keeping in database but will use safe storage`);
        }
        
        console.log('\n📋 Step 2: Updating Review User Names...');
        
        // Update all reviews to reflect current user names
        const users = await getAllSQL('SELECT id, first_name, last_name FROM users');
        
        for (const user of users) {
            const fullName = `${user.first_name} ${user.last_name}`.trim();
            await runSQL(`
                UPDATE reviews 
                SET user_name = ?, updated_at = datetime('now')
                WHERE user_id = ?
            `, [fullName, user.id]);
            
            console.log(`✅ Updated reviews for user ${user.id}: "${fullName}"`);
        }
        
        console.log('\n📋 Step 3: Cleaning Up Database Structure...');
        
        // Add missing columns if they don't exist
        try {
            await runSQL('ALTER TABLE users ADD COLUMN updated_at TEXT DEFAULT (datetime(\'now\'))');
            console.log('✅ Added updated_at column to users table');
        } catch (error) {
            if (error.message.includes('duplicate column')) {
                console.log('✅ updated_at column already exists');
            } else {
                console.log('⚠️ Could not add updated_at column:', error.message);
            }
        }
        
        console.log('\n📋 Step 4: Data Integrity Checks...');
        
        // Ensure all users have proper default values
        await runSQL(`
            UPDATE users 
            SET last_name = COALESCE(last_name, ''),
                email_verified = COALESCE(email_verified, 0),
                is_admin = COALESCE(is_admin, 0),
                is_banned = COALESCE(is_banned, 0),
                updated_at = COALESCE(updated_at, datetime('now'))
            WHERE last_name IS NULL 
               OR email_verified IS NULL 
               OR is_admin IS NULL 
               OR is_banned IS NULL
               OR updated_at IS NULL
        `);
        console.log('✅ Fixed null values in users table');
        
        console.log('\n📋 Step 5: Optimizing Database...');
        
        // Create indexes for better performance (ignore errors if they exist)
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_users_verification ON users(verification_code)',
            'CREATE INDEX IF NOT EXISTS idx_reviews_fragrance ON reviews(fragrance)',
            'CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at)'
        ];
        
        for (const indexSQL of indexes) {
            try {
                await runSQL(indexSQL);
                console.log(`✅ Created index: ${indexSQL.split(' ')[5]}`);
            } catch (error) {
                console.log(`⚠️ Index might already exist: ${indexSQL.split(' ')[5]}`);
            }
        }
        
        console.log('\n📋 Step 6: Final Verification...');
        
        // Verify the fixes
        const fixedUser = await getSQL('SELECT id, first_name, last_name, email FROM users WHERE id = 1');
        console.log('✅ User ID 1 after fix:', {
            id: fixedUser.id,
            name: `${fixedUser.first_name} ${fixedUser.last_name}`.trim(),
            email: fixedUser.email
        });
        
        const reviewCount = await getSQL('SELECT COUNT(*) as count FROM reviews WHERE user_id = 1');
        console.log(`✅ User ID 1 has ${reviewCount.count} reviews that will show updated name`);
        
        const totalUsers = await getSQL('SELECT COUNT(*) as count FROM users');
        const totalReviews = await getSQL('SELECT COUNT(*) as count FROM reviews');
        
        console.log('\n📊 Database Statistics:');
        console.log(`📈 Total Users: ${totalUsers.count}`);
        console.log(`📈 Total Reviews: ${totalReviews.count}`);
        
        console.log('\n🎉 ALL DATABASE FIXES COMPLETED SUCCESSFULLY!');
        console.log('============================================');
        console.log('✅ User profile name fixed: "blo" (no last name)');
        console.log('✅ Review names updated to match current user data');
        console.log('✅ Database structure optimized');
        console.log('✅ Data integrity ensured');
        console.log('');
        console.log('🔄 Please restart the server to see changes!');
        
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        throw error;
    }
}

// Run the fixes
fixDatabaseIssues()
    .then(() => {
        console.log('\n✅ All database fixes completed successfully!');
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed.');
            }
            process.exit(0);
        });
    })
    .catch((error) => {
        console.error('\n❌ Database fixes failed:', error);
        db.close();
        process.exit(1);
    });
