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

// Fix the main user (ID 1) with proper data
console.log('🔧 Fixing user data...');

db.run(
    `UPDATE users SET name = ?, avatar = ? WHERE id = ?`,
    ['Cherif', 'default.jpg', 1],
    function(err) {
        if (err) {
            console.error('Error updating user:', err.message);
        } else {
            console.log(`✅ Updated user ID 1 with name "Cherif" and avatar "default.jpg"`);
        }
        
        // Show updated users
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                console.error('Error querying users:', err.message);
            } else {
                console.log(`\nUpdated users:`);
                rows.forEach((row, index) => {
                    console.log(`${index + 1}. ID:${row.id} Email:"${row.email}" Name:"${row.name}" Avatar:"${row.avatar}"`);
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
