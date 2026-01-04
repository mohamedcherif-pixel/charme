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

// Check user ID 5 specifically
console.log('🔍 CHECKING USER ID 5 AVATAR IN DATABASE...\n');

db.get('SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?', [5], (err, row) => {
    if (err) {
        console.error('Error querying user:', err.message);
    } else if (row) {
        const fullName = `${row.first_name} ${row.last_name}`;
        console.log(`👤 User ID 5:`);
        console.log(`   Email: "${row.email}"`);
        console.log(`   Full Name: "${fullName}"`);
        console.log(`   Avatar URL: "${row.avatar_url ? row.avatar_url.substring(0, 100) + '...' : 'None'}"`);
        console.log(`   Avatar Length: ${row.avatar_url ? row.avatar_url.length : 0} characters`);
        console.log(`   Avatar Type: ${row.avatar_url ? (row.avatar_url.startsWith('data:image/') ? 'Base64 Image' : 'File Path') : 'None'}`);
    } else {
        console.log('❌ User ID 5 not found in database');
    }
    
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\nDatabase connection closed.');
        }
    });
});
