const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const oldContent = content;

  // 1. Remove `import React from 'react';` completely if it's the only thing imported.
  content = content.replace(/^import\s+React\s+from\s+['"]react['"];?\s*\n?/m, '');

  // 2. Remove `React, ` from `import React, { ... } from 'react';`
  content = content.replace(/^import\s+React\s*,\s*\{\s*(.*?)\s*\}\s+from\s+['"]react['"];?\s*\n?/m, "import { $1 } from 'react';\n");

  if (content !== oldContent) {
    fs.writeFileSync(file, content);
    console.log(`Cleaned React import in ${file}`);
  }
});
