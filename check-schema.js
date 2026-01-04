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

// Check the schema of users table
console.log('🔍 CHECKING DATABASE SCHEMA...\n');

db.all("PRAGMA table_info(users)", [], (err, rows) => {
    if (err) {
        console.error('Error getting users table schema:', err.message);
    } else {
        console.log('USERS TABLE SCHEMA:');
        rows.forEach((row) => {
            console.log(`  Column: ${row.name} | Type: ${row.type} | NotNull: ${row.notnull} | Default: ${row.dflt_value}`);
        });
    }
    
    // Check reviews table schema too
    db.all("PRAGMA table_info(reviews)", [], (err, rows) => {
        if (err) {
            console.error('Error getting reviews table schema:', err.message);
        } else {
            console.log('\nREVIEWS TABLE SCHEMA:');
            rows.forEach((row) => {
                console.log(`  Column: ${row.name} | Type: ${row.type} | NotNull: ${row.notnull} | Default: ${row.dflt_value}`);
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
