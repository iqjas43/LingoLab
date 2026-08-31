const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;
            if (content.includes('http://localhost:3000')) {
                content = content.split('http://localhost:3000').join('http://localhost:3000');
                updated = true;
            }
            if (content.includes('http://localhost:5000')) {
                content = content.split('http://localhost:5000').join('http://localhost:3000');
                updated = true;
            }
            if (updated) {
                fs.writeFileSync(filePath, content);
                console.log('Updated:', filePath);
            }
        }
    });
}
walk('d:/PROJECT/bck/fnt/client/src');
