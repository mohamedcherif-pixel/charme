const h = require('fs').readFileSync('index.html','utf8');
const ids = ['yvsl','aquadigio','dy','versaceeros','jpgultramale','invictus','valentinouomo','spicebomb','explorer','blv'];
ids.forEach(id => {
    const found = h.includes('id="' + id + '"');
    console.log((found ? 'OK' : 'MISSING') + ' section id=' + id);
});
console.log('Total lines:', h.split('\n').length);
