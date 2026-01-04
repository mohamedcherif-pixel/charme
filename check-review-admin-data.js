const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./database/parfumerie.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
    }
});

console.log('🔍 Checking review admin data...\n');

// Check reviews table structure
db.all("PRAGMA table_info(reviews)", (err, columns) => {
    if (err) {
        console.error('❌ Error checking table structure:', err);
        return;
    }
    
    console.log('📋 Reviews table structure:');
    columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type} (${col.notnull ? 'NOT NULL' : 'NULL'}) ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });
    console.log('');
    
    // Check existing review data
    db.all("SELECT id, user_name, user_email, is_admin, fragrance FROM reviews", (err, reviews) => {
        if (err) {
            console.error('❌ Error fetching reviews:', err);
            return;
        }
        
        console.log(`📊 Found ${reviews.length} reviews:`);
        reviews.forEach(review => {
            console.log(`  Review ${review.id}: ${review.user_name} | Email: ${review.user_email || 'NULL'} | Admin: ${review.is_admin || 'NULL'} | Fragrance: ${review.fragrance}`);
        });
        console.log('');
        
        // Check users table for admin data
        db.all("SELECT id, first_name, last_name, email, is_admin FROM users WHERE email = 'cherifmed1200@gmail.com' OR is_admin = 1", (err, users) => {
            if (err) {
                console.error('❌ Error fetching admin users:', err);
                return;
            }
            
            console.log(`👑 Found ${users.length} admin users:`);
            users.forEach(user => {
                console.log(`  User ${user.id}: ${user.first_name} ${user.last_name} | Email: ${user.email} | Admin: ${user.is_admin}`);
            });
            console.log('');
            
            // Fix admin data in reviews
            console.log('🔧 Fixing admin data in reviews...');
            
            users.forEach(adminUser => {
                const fullName = `${adminUser.first_name} ${adminUser.last_name || ''}`.trim();
                
                db.run(`
                    UPDATE reviews 
                    SET user_email = ?, is_admin = 1 
                    WHERE user_id = ? OR user_name = ?
                `, [adminUser.email, adminUser.id, fullName], function(err) {
                    if (err) {
                        console.error(`❌ Error updating reviews for ${fullName}:`, err);
                    } else {
                        console.log(`✅ Updated ${this.changes} reviews for admin user: ${fullName} (${adminUser.email})`);
                    }
                });
            });
            
            // Wait a moment then check results
            setTimeout(() => {
                db.all("SELECT id, user_name, user_email, is_admin, fragrance FROM reviews WHERE is_admin = 1", (err, adminReviews) => {
                    if (err) {
                        console.error('❌ Error fetching admin reviews:', err);
                        return;
                    }
                    
                    console.log(`\n🎯 Admin reviews after fix (${adminReviews.length} found):`);
                    adminReviews.forEach(review => {
                        console.log(`  Review ${review.id}: ${review.user_name} | Email: ${review.user_email} | Admin: ${review.is_admin} | Fragrance: ${review.fragrance}`);
                    });
                    
                    db.close();
                    console.log('\n✅ Database check and fix completed!');
                });
            }, 1000);
        });
    });
});
