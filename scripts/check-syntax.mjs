import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const root = path.resolve(process.cwd());

function findJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      files.push(...findJsFiles(path.join(dir, entry.name)));
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  return files;
}

(async function () {
  const files = findJsFiles(root);
  let errors = [];
  for (const file of files) {
    try {
      // dynamic import to parse file and evaluate top-level syntax
      await import(pathToFileURL(file).href + (file.endsWith('.js') && !file.endsWith('.mjs') ? '' : ''));
    } catch (err) {
      // If it's a runtime error while importing, still capture it because it may be syntax-related
      errors.push({ file, message: err.message, stack: err.stack });
    }
  }

  if (errors.length === 0) {
    console.log('✅ No import/parsing errors detected in JS files');
    process.exit(0);
  } else {
    console.error('❌ Import/parsing errors found in JS files:');
    for (const e of errors) {
      console.error(`- ${e.file}: ${e.message}`);
    }
    process.exit(2);
  }
})();
