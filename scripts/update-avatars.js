const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const db = new sqlite3.Database('./database/parfumerie.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Update existing users to use default.jpg avatar
async function updateExistingUsersAvatars() {
    try {
        console.log('🔄 Updating existing users to use default.jpg avatar...');

        // Get all users who don't have a custom avatar (avatar_url is NULL or contains ui-avatars.com)
        const usersToUpdate = await new Promise((resolve, reject) => {
            db.all(`
                SELECT id, first_name, last_name, email, avatar_url 
                FROM users 
                WHERE avatar_url IS NULL 
                   OR avatar_url LIKE '%ui-avatars.com%'
                   OR avatar_url = ''
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        console.log(`📊 Found ${usersToUpdate.length} users to update:`);
        
        if (usersToUpdate.length === 0) {
            console.log('✅ No users need avatar updates');
            return;
        }

        // Display users that will be updated
        usersToUpdate.forEach(user => {
            console.log(`   • ${user.first_name} ${user.last_name} (${user.email})`);
            console.log(`     Current avatar: ${user.avatar_url || 'NULL'}`);
        });

        console.log('\n🔄 Updating avatars to default.jpg...');

        // Update all these users to use default.jpg
        const updateResult = await new Promise((resolve, reject) => {
            const stmt = db.prepare(`
                UPDATE users 
                SET avatar_url = 'default.jpg', 
                    updated_at = datetime('now')
                WHERE avatar_url IS NULL 
                   OR avatar_url LIKE '%ui-avatars.com%'
                   OR avatar_url = ''
            `);

            stmt.run(function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
            stmt.finalize();
        });

        console.log(`✅ Successfully updated ${updateResult} users to use default.jpg`);

        // Verify the updates
        console.log('\n📋 Verification - Current avatar status:');
        const allUsers = await new Promise((resolve, reject) => {
            db.all(`
                SELECT id, first_name, last_name, email, avatar_url 
                FROM users 
                ORDER BY id
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        allUsers.forEach(user => {
            console.log(`   • ${user.first_name} ${user.last_name} (${user.email})`);
            console.log(`     Avatar: ${user.avatar_url || 'NULL'}`);
        });

        console.log('\n🎉 Avatar update completed successfully!');
        console.log('💡 Users can now upload custom avatars to replace default.jpg');

    } catch (error) {
        console.error('❌ Error updating user avatars:', error);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(0);
        });
    }
}

// Run the migration
updateExistingUsersAvatars();
