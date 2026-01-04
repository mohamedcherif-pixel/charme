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

// Check your current user data (ID 5)
console.log('🔍 CHECKING YOUR CURRENT USER DATA IN DATABASE...\n');

db.get('SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?', [5], (err, row) => {
    if (err) {
        console.error('Error querying user:', err.message);
    } else if (row) {
        console.log(`👤 Your User Data (ID ${row.id}):`);
        console.log(`   Email: "${row.email}"`);
        console.log(`   First Name: "${row.first_name}"`);
        console.log(`   Last Name: "${row.last_name}"`);
        console.log(`   Full Name: "${row.first_name} ${row.last_name}"`);
        console.log(`   Avatar: ${row.avatar_url ? 'Custom avatar (' + row.avatar_url.length + ' chars)' : 'No avatar'}`);
        
        console.log('\n🔧 ISSUE FOUND:');
        console.log(`   Database shows: "${row.first_name} ${row.last_name}"`);
        console.log(`   You want: "blo" (no last name)`);
        console.log('\n💡 SOLUTION: Update your profile to set first_name="blo" and last_name=""');
    } else {
        console.log('❌ User not found in database');
    }
    
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\nDatabase connection closed.');
        }
    });
});
