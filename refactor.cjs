const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /(?<!dark:)(bg-slate-950)/g, replace: 'bg-white dark:bg-slate-950' },
  { search: /(?<!dark:)(bg-slate-900)/g, replace: 'bg-slate-100 dark:bg-slate-900' },
  { search: /(?<!dark:)(bg-\[\#0d0d0f\])/g, replace: 'bg-white dark:bg-[#0d0d0f]' },
  { search: /(?<!dark:)(bg-\[\#08080a\])/g, replace: 'bg-slate-50 dark:bg-[#08080a]' },
  { search: /(?<!dark:)(text-white)/g, replace: 'text-slate-900 dark:text-white' },
  { search: /(?<!dark:)(text-slate-100)/g, replace: 'text-slate-800 dark:text-slate-100' },
  { search: /(?<!dark:)(text-slate-300)/g, replace: 'text-slate-700 dark:text-slate-300' },
  { search: /(?<!dark:)(text-slate-400)/g, replace: 'text-slate-500 dark:text-slate-400' },
  { search: /(?<!dark:)(border-white\/10)/g, replace: 'border-slate-200 dark:border-white/10' },
  { search: /(?<!dark:)(border-white\/5)/g, replace: 'border-slate-100 dark:border-white/5' },
  { search: /(?<!dark:)(border-slate-800)/g, replace: 'border-slate-200 dark:border-slate-800' },
  { search: /(?<!dark:)(divide-slate-800)/g, replace: 'divide-slate-200 dark:divide-slate-800' },
  { search: /(?<!dark:)(hover:bg-slate-800\/40)/g, replace: 'hover:bg-slate-200/50 dark:hover:bg-slate-800/40' },
  { search: /(?<!dark:)(bg-white\/5)(?!\w)/g, replace: 'bg-slate-100 dark:bg-white/5' },
  { search: /(?<!dark:)(bg-white\/10)(?!\w)/g, replace: 'bg-slate-200 dark:bg-white/10' },
  { search: /(?<!dark:)(bg-slate-950\/50)/g, replace: 'bg-slate-100 dark:bg-slate-950/50' },
  { search: /(?<!dark:)(bg-slate-950\/80)/g, replace: 'bg-slate-900/40 dark:bg-slate-950/80' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
