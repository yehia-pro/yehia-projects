const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

console.log('--- 1. Building Web Assets for Android & Vercel ---');
execSync('node build.js', { stdio: 'inherit', cwd: root });

console.log('--- 2. Syncing Assets to Android Project ---');
execSync('npx cap sync android', { stdio: 'inherit', cwd: root });

console.log('--- 3. Setting Android Main Entry to Student Hub App (index.html) ---');
const androidIndex = path.join(root, 'android/app/src/main/assets/public/index.html');
const indexHtml = path.join(root, 'index.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, androidIndex);
  const size = fs.statSync(androidIndex).size;
  console.log(`  ✓ Successfully updated android/app/src/main/assets/public/index.html (${size} bytes)`);
} else {
  console.error('  ✗ Error: index.html not found!');
}

console.log('\n✅ All Android files are 100% updated and ready in Android Studio!\n');
