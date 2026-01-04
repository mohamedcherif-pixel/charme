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

// Check current user data in database
console.log('🔍 CHECKING CURRENT USER DATA IN DATABASE...\n');

db.all('SELECT id, first_name, last_name, email, avatar_url, updated_at FROM users ORDER BY id', [], (err, rows) => {
    if (err) {
        console.error('Error querying users:', err.message);
    } else {
        console.log(`Found ${rows.length} users in database:`);
        rows.forEach((row, index) => {
            const fullName = `${row.first_name} ${row.last_name}`;
            console.log(`${index + 1}. ID:${row.id}`);
            console.log(`   Email: "${row.email}"`);
            console.log(`   First Name: "${row.first_name}"`);
            console.log(`   Last Name: "${row.last_name}"`);
            console.log(`   Full Name: "${fullName}"`);
            console.log(`   Avatar: "${row.avatar_url}"`);
            console.log(`   Updated: ${row.updated_at}`);
            console.log('');
        });
    }
    
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
