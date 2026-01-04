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

console.log('🔍 CHECKING CURRENT DATABASE STRUCTURE');
console.log('=====================================');

// Check what tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error('Error fetching tables:', err);
        return;
    }
    
    console.log('\n📋 EXISTING TABLES:');
    tables.forEach(table => {
        console.log(`  - ${table.name}`);
    });
    
    // Check structure of each table
    let tableCount = 0;
    const totalTables = tables.length;
    
    tables.forEach(table => {
        console.log(`\n🔧 STRUCTURE OF TABLE: ${table.name}`);
        console.log('----------------------------------------');
        
        db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
            if (err) {
                console.error(`Error fetching columns for ${table.name}:`, err);
            } else {
                columns.forEach(col => {
                    console.log(`  ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
                });
                
                // Show sample data
                db.all(`SELECT * FROM ${table.name} LIMIT 3`, [], (err, rows) => {
                    if (err) {
                        console.error(`Error fetching sample data for ${table.name}:`, err);
                    } else {
                        console.log(`\n📊 SAMPLE DATA (${rows.length} rows):`);
                        if (rows.length > 0) {
                            console.log(rows);
                        } else {
                            console.log('  (no data)');
                        }
                    }
                    
                    tableCount++;
                    if (tableCount === totalTables) {
                        console.log('\n✅ Database structure check complete!');
                        db.close();
                    }
                });
            }
        });
    });
    
    if (totalTables === 0) {
        console.log('\n❌ No tables found in database!');
        db.close();
    }
});
