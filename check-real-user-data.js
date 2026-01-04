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

// Check actual user data with correct column names
console.log('🔍 CHECKING REAL USER DATA...\n');

db.all('SELECT id, first_name, last_name, email, avatar_url FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error querying users:', err.message);
    } else {
        console.log(`Found ${rows.length} users:`);
        rows.forEach((row, index) => {
            const fullName = `${row.first_name} ${row.last_name}`;
            console.log(`${index + 1}. ID:${row.id} Email:"${row.email}" FullName:"${fullName}" Avatar:"${row.avatar_url}"`);
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
