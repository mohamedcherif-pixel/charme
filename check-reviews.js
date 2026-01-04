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

// Check reviews table
db.all('SELECT * FROM reviews', [], (err, rows) => {
    if (err) {
        console.error('Error querying reviews:', err.message);
    } else {
        console.log(`Found ${rows.length} reviews in database:`);
        rows.forEach((row, index) => {
            console.log(`\n--- Review ${index + 1} ---`);
            console.log(`ID: ${row.id}`);
            console.log(`User ID: ${row.user_id}`);
            console.log(`User Name: ${row.user_name}`);
            console.log(`User Avatar: ${row.user_avatar}`);
            console.log(`Fragrance: ${row.fragrance}`);
            console.log(`Rating: ${row.rating}`);
            console.log(`Review Text: ${row.review_text}`);
            console.log(`Likes: ${row.likes}`);
            console.log(`Dislikes: ${row.dislikes}`);
            console.log(`Created: ${row.created_at}`);
            console.log(`Updated: ${row.updated_at}`);
        });
    }
    
    // Close database
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\nDatabase connection closed.');
        }
    });
});
