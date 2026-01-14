const fs = require('fs');
const path = require('path');

const importMap = {
  '@/app/components/ui/card': '@/app/components/ui/Card/card',
  '@/app/components/ui/button': '@/app/components/ui/Button/button',
  '@/app/components/ui/input': '@/app/components/ui/Input/input',
  '@/app/components/ui/textarea': '@/app/components/ui/Textarea/textarea',
  '@/app/components/ui/label': '@/app/components/ui/Label/label',
  '@/app/components/ui/badge': '@/app/components/ui/Badge/badge',
  '@/app/components/ui/select': '@/app/components/ui/Select/select',
  '@/app/components/ui/avatar': '@/app/components/ui/Avatar/avatar',
  '@/app/components/ui/skeleton': '@/app/components/ui/Skeleton/skeleton',
  '@/app/components/ui/table': '@/app/components/ui/Table/table',
  '@/app/components/ui/progress': '@/app/components/ui/Progress/progress',
  '@/app/components/ui/switch': '@/app/components/ui/Switch/switch',
  '@/app/components/ui/separator': '@/app/components/ui/Separator/separator',
  '@/app/components/ui/dropdown-menu': '@/app/components/ui/DropdownMenu/dropdown-menu'
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let modified = false;
      
      for (const [oldPath, newPath] of Object.entries(importMap)) {
        const oldRegex = new RegExp(rom ["']c:\Users\hp\OneDrive\Desktop\AI-Regenration\src\app\pages\VideoGenerationPage.jsx["'], 'g');
        if (oldRegex.test(content)) {
          content = content.replace(oldRegex, \rom "\"\);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  });
}

walkDir('c:\\Users\\hp\\OneDrive\\Desktop\\AI-Regenration\\src');
console.log('All imports updated!');
