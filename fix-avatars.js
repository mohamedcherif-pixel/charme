const sqlite3 = require('sqlite3').verbose();

// Open database
const db = new sqlite3.Database('./database/parfumerie.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Fix invalid avatar URLs in reviews
console.log('🔧 Fixing invalid avatar URLs in reviews...');

db.run(
    `UPDATE reviews SET user_avatar = 'default.jpg' 
     WHERE user_avatar = 'api-test-avatar.jpg' OR user_avatar = 'test-avatar.jpg'`,
    function(err) {
        if (err) {
            console.error('Error updating avatars:', err.message);
        } else {
            console.log(`✅ Fixed ${this.changes} avatar URLs`);
        }
        
        // Show current reviews
        db.all('SELECT id, user_id, user_name, user_avatar, fragrance FROM reviews', [], (err, rows) => {
            if (err) {
                console.error('Error querying reviews:', err.message);
            } else {
                console.log(`\nCurrent reviews in database:`);
                rows.forEach((row, index) => {
                    console.log(`${index + 1}. ID:${row.id} User:"${row.user_name}" Avatar:"${row.user_avatar}" Fragrance:${row.fragrance}`);
                });
            }
            
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('\nDatabase connection closed.');
                }
            });
        });
    }
);
