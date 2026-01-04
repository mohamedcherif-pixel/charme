// Simple syntax checker
const fs = require('fs');

try {
    const content = fs.readFileSync('script.js', 'utf8');
    
    // Count braces
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    console.log(`Open braces: ${openBraces}`);
    console.log(`Close braces: ${closeBraces}`);
    console.log(`Difference: ${openBraces - closeBraces}`);
    
    // Try to parse
    eval(content);
    console.log('✅ No syntax errors found');
} catch (error) {
    console.log('❌ Syntax error:', error.message);
    console.log('Line:', error.lineNumber || 'unknown');
}
