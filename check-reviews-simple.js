const sqlite3 = require('sqlite3').verbose();

// Open database
const db = new sqlite3.Database('./database/parfumerie.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

// Check reviews table - just the key info
db.all('SELECT id, user_id, user_name, user_avatar, fragrance, rating FROM reviews', [], (err, rows) => {
    if (err) {
        console.error('Error querying reviews:', err.message);
    } else {
        console.log(`Found ${rows.length} reviews in database:`);
        rows.forEach((row, index) => {
            console.log(`${index + 1}. ID:${row.id} User:${row.user_name} Avatar:${row.user_avatar} Fragrance:${row.fragrance}`);
        });
    }
    
    db.close();
});
