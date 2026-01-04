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

// Check all users
console.log('🔍 CHECKING ALL USERS IN DATABASE...\n');

db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error querying users:', err.message);
    } else {
        console.log(`Found ${rows.length} users:`);
        rows.forEach((row, index) => {
            console.log(`${index + 1}. ID:${row.id} Email:"${row.email}" Name:"${row.name}" Avatar:"${row.avatar}"`);
        });
    }
    
    // Also check reviews to see user names there
    console.log('\n🔍 CHECKING USER NAMES IN REVIEWS...\n');
    
    db.all('SELECT id, user_id, user_name, user_avatar, fragrance FROM reviews', [], (err, rows) => {
        if (err) {
            console.error('Error querying reviews:', err.message);
        } else {
            console.log(`Found ${rows.length} reviews:`);
            rows.forEach((row, index) => {
                console.log(`${index + 1}. ID:${row.id} UserID:${row.user_id} UserName:"${row.user_name}" Avatar:"${row.user_avatar}" Fragrance:${row.fragrance}`);
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
});
