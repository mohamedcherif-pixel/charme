const sqlite3 = require('sqlite3').verbose();

console.log('🔍 DEEP INVESTIGATION: Reply System Analysis');
console.log('='.repeat(60));

// Open database
const db = new sqlite3.Database('./database/parfumerie.db', (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database');
});

async function investigateReplySystem() {
    console.log('\n📋 1. CHECKING DATABASE SCHEMA');
    console.log('-'.repeat(40));
    
    // Check if reply tables exist
    await checkTableExists('review_replies');
    await checkTableExists('reply_likes');
    
    // Check table schemas
    await checkTableSchema('review_replies');
    await checkTableSchema('reply_likes');
    
    console.log('\n📋 2. CHECKING FOREIGN KEY CONSTRAINTS');
    console.log('-'.repeat(40));
    await checkForeignKeys();
    
    console.log('\n📋 3. CHECKING INDEXES');
    console.log('-'.repeat(40));
    await checkIndexes();
    
    console.log('\n📋 4. CHECKING DATA INTEGRITY');
    console.log('-'.repeat(40));
    await checkDataIntegrity();
    
    console.log('\n📋 5. TESTING REPLY OPERATIONS');
    console.log('-'.repeat(40));
    await testReplyOperations();
    
    console.log('\n📋 6. CHECKING FOR ORPHANED DATA');
    console.log('-'.repeat(40));
    await checkOrphanedData();
    
    console.log('\n📋 7. PERFORMANCE ANALYSIS');
    console.log('-'.repeat(40));
    await performanceAnalysis();
    
    db.close();
}

function checkTableExists(tableName) {
    return new Promise((resolve) => {
        db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
            [tableName],
            (err, row) => {
                if (err) {
                    console.error(`❌ Error checking ${tableName}:`, err.message);
                } else if (row) {
                    console.log(`✅ Table ${tableName} exists`);
                } else {
                    console.log(`❌ Table ${tableName} does NOT exist`);
                }
                resolve();
            }
        );
    });
}

function checkTableSchema(tableName) {
    return new Promise((resolve) => {
        db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
            if (err) {
                console.error(`❌ Error getting schema for ${tableName}:`, err.message);
            } else if (columns.length === 0) {
                console.log(`❌ Table ${tableName} has no columns or doesn't exist`);
            } else {
                console.log(`📊 ${tableName} schema:`);
                columns.forEach(col => {
                    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
                });
            }
            resolve();
        });
    });
}

function checkForeignKeys() {
    return new Promise((resolve) => {
        // Check foreign keys for review_replies
        db.all("PRAGMA foreign_key_list(review_replies)", (err, fks) => {
            if (err) {
                console.error('❌ Error checking foreign keys:', err.message);
            } else {
                console.log('🔗 review_replies foreign keys:');
                fks.forEach(fk => {
                    console.log(`   ${fk.from} -> ${fk.table}.${fk.to}`);
                });
            }
            
            // Check foreign keys for reply_likes
            db.all("PRAGMA foreign_key_list(reply_likes)", (err, fks) => {
                if (err) {
                    console.error('❌ Error checking reply_likes foreign keys:', err.message);
                } else {
                    console.log('🔗 reply_likes foreign keys:');
                    fks.forEach(fk => {
                        console.log(`   ${fk.from} -> ${fk.table}.${fk.to}`);
                    });
                }
                resolve();
            });
        });
    });
}

function checkIndexes() {
    return new Promise((resolve) => {
        db.all("SELECT name, sql FROM sqlite_master WHERE type='index' AND (tbl_name='review_replies' OR tbl_name='reply_likes')", (err, indexes) => {
            if (err) {
                console.error('❌ Error checking indexes:', err.message);
            } else {
                console.log('📇 Reply system indexes:');
                indexes.forEach(idx => {
                    console.log(`   ${idx.name}: ${idx.sql || 'AUTO'}`);
                });
            }
            resolve();
        });
    });
}

function checkDataIntegrity() {
    return new Promise((resolve) => {
        // Count records in each table
        db.get("SELECT COUNT(*) as count FROM review_replies", (err, result) => {
            if (err) {
                console.error('❌ Error counting replies:', err.message);
            } else {
                console.log(`📊 Total replies: ${result.count}`);
            }
            
            db.get("SELECT COUNT(*) as count FROM reply_likes", (err, result) => {
                if (err) {
                    console.error('❌ Error counting reply likes:', err.message);
                } else {
                    console.log(`📊 Total reply likes: ${result.count}`);
                }
                
                // Check for invalid foreign key references
                db.all(`
                    SELECT r.id, r.review_id, r.user_id 
                    FROM review_replies r 
                    LEFT JOIN reviews rev ON r.review_id = rev.id 
                    LEFT JOIN users u ON r.user_id = u.id 
                    WHERE rev.id IS NULL OR u.id IS NULL
                `, (err, orphans) => {
                    if (err) {
                        console.error('❌ Error checking orphaned replies:', err.message);
                    } else if (orphans.length > 0) {
                        console.log(`⚠️ Found ${orphans.length} orphaned replies:`);
                        orphans.forEach(orphan => {
                            console.log(`   Reply ${orphan.id}: review_id=${orphan.review_id}, user_id=${orphan.user_id}`);
                        });
                    } else {
                        console.log('✅ No orphaned replies found');
                    }
                    resolve();
                });
            });
        });
    });
}

function testReplyOperations() {
    return new Promise((resolve) => {
        // Test basic query operations
        db.all("SELECT * FROM review_replies LIMIT 5", (err, replies) => {
            if (err) {
                console.error('❌ Error querying replies:', err.message);
            } else {
                console.log(`📋 Sample replies (${replies.length}):`);
                replies.forEach(reply => {
                    console.log(`   ID:${reply.id} Review:${reply.review_id} User:${reply.user_name} Text:"${reply.reply_text.substring(0, 50)}..."`);
                });
            }
            
            // Test join operations
            db.all(`
                SELECT r.*, 
                       COALESCE((SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'like'), 0) as likes,
                       COALESCE((SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'dislike'), 0) as dislikes
                FROM review_replies r 
                LIMIT 3
            `, (err, repliesWithCounts) => {
                if (err) {
                    console.error('❌ Error testing join operations:', err.message);
                } else {
                    console.log('✅ Join operations working correctly');
                    repliesWithCounts.forEach(reply => {
                        console.log(`   Reply ${reply.id}: ${reply.likes} likes, ${reply.dislikes} dislikes`);
                    });
                }
                resolve();
            });
        });
    });
}

function checkOrphanedData() {
    return new Promise((resolve) => {
        // Check for reply_likes pointing to non-existent replies
        db.all(`
            SELECT rl.* 
            FROM reply_likes rl 
            LEFT JOIN review_replies r ON rl.reply_id = r.id 
            WHERE r.id IS NULL
        `, (err, orphanedLikes) => {
            if (err) {
                console.error('❌ Error checking orphaned likes:', err.message);
            } else if (orphanedLikes.length > 0) {
                console.log(`⚠️ Found ${orphanedLikes.length} orphaned reply likes`);
            } else {
                console.log('✅ No orphaned reply likes found');
            }
            resolve();
        });
    });
}

function performanceAnalysis() {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        // Test query performance
        db.all(`
            SELECT r.*, 
                   COALESCE((SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'like'), 0) as likes,
                   COALESCE((SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'dislike'), 0) as dislikes
            FROM review_replies r 
            WHERE r.review_id = 1
            ORDER BY r.created_at ASC
        `, (err, results) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (err) {
                console.error('❌ Performance test failed:', err.message);
            } else {
                console.log(`⚡ Query performance: ${duration}ms for ${results.length} replies`);
                if (duration > 100) {
                    console.log('⚠️ Query is slow, consider adding indexes');
                } else {
                    console.log('✅ Query performance is good');
                }
            }
            resolve();
        });
    });
}

// Run the investigation
investigateReplySystem().then(() => {
    console.log('\n🎯 INVESTIGATION COMPLETE');
    console.log('='.repeat(60));
}).catch(err => {
    console.error('❌ Investigation failed:', err);
});
