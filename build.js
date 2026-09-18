const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = __dirname;
const dist = path.join(__dirname, 'dist');

// Build Tailwind CSS first
console.log('Building Tailwind CSS...');
try {
  execSync('npx --yes tailwindcss -i ./css/tailwind.src.css -o ./css/tailwind.css --minify', { stdio: 'inherit', cwd: src });
  console.log('  ✓ Tailwind built');
} catch (e) {
  console.warn('  ✓ Using pre-compiled Tailwind CSS');
}

// Clean + create
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist, { recursive: true });

// Files to copy
const files = [
  ...fs.readdirSync(src).filter(f => f.endsWith('.html')),
  'manifest.json',
  'sw.js',
  'icon.svg',
  ...fs.readdirSync(src).filter(f => f.endsWith('.png')),
  ...fs.readdirSync(src).filter(f => f.endsWith('.ico')),
  ...fs.readdirSync(src).filter(f => f.endsWith('.bat')),
  ...fs.readdirSync(src).filter(f => f.endsWith('.exe')),
  ...fs.readdirSync(src).filter(f => f.endsWith('.apk')),
];

// Dirs to copy
const dirs = ['js', 'css', 'images', 'assets', 'fonts', 'logo', 'landing-page'];

// Copy files
files.forEach(f => {
  fs.copyFileSync(path.join(src, f), path.join(dist, f));
  console.log('  file:', f);
});

// Copy dirs
dirs.forEach(d => {
  const srcDir = path.join(src, d);
  if (!fs.existsSync(srcDir)) return;
  copyDir(srcDir, path.join(dist, d));
  console.log('  dir:', d + '/');
});

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ensure Android public assets are synced with the latest App
const androidPublic = path.join(src, 'android/app/src/main/assets/public');
const appHtml = path.join(src, 'app.html');
if (fs.existsSync(androidPublic)) {
  if (fs.existsSync(appHtml)) {
    fs.copyFileSync(appHtml, path.join(androidPublic, 'index.html'));
  }
  const syncHtmlFiles = ['app.html', 'admin.html', 'student.html', 'summaries.html', 'prayer.html'];
  syncHtmlFiles.forEach(h => {
    const p = path.join(src, h);
    if (fs.existsSync(p)) fs.copyFileSync(p, path.join(androidPublic, h));
  });
  ['js', 'css'].forEach(d => {
    const s = path.join(src, d);
    if (fs.existsSync(s)) copyDir(s, path.join(androidPublic, d));
  });
  console.log('  ✓ Synced all latest web assets to Android App');
}

console.log('\nBuild done → dist/');
