const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const originalContent = content;
      
      // Fix relative imports from "./utils"
      content = content.replace(/from ["']\.\/utils["']/g, 'from "../Utilities/utils"');
      content = content.replace(/from ["']\.\/utils\.ts["']/g, 'from "../Utilities/utils.ts"');
      
      // Fix imports from "../utils" - they should go to Utilities
      content = content.replace(/from ["'](\.\.\/)+utils["']/g, 'from "../Utilities/utils"');
      content = content.replace(/from ["'](\.\.\/)+utils\.ts["']/g, 'from "../Utilities/utils.ts"');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(' Fixed: ' + path.relative(process.cwd(), fullPath));
      }
    }
  });
}

walkDir('src/app/components/ui');
console.log('Done!');
