import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildNextExtension() {
  const outDir = path.join(__dirname, 'out');
  const distDir = path.join(__dirname, 'dist');
  const srcDir = path.join(__dirname, 'src');

  console.log('🧹 Step 0: Cleaning old build artifacts (out/ & dist/)...');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(distDir, { recursive: true });

  console.log('🚀 Step 1: Building Next.js Static Export App...');
  try {
    execSync('npx next build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Next.js Static Export successfully generated in out/');
  } catch (err) {
    console.error('❌ Next.js build error:', err.message);
  }

  console.log('🚀 Step 2: Fixing Chrome Reserved Prefix (_next -> next_assets & deleting _ files)...');
  fixNextUnderscoreDirectories(outDir);

  console.log('🚀 Step 3: Bundling Extension Service Worker & Content Scripts...');

  // 1. Bundle Background Service Worker with @google/genai
  await esbuild.build({
    entryPoints: [path.join(srcDir, 'background.js')],
    bundle: true,
    outfile: path.join(outDir, 'background.js'),
    format: 'esm',
    target: 'es2022',
    platform: 'browser',
    minify: false
  });
  console.log('✅ Bundled background.js with @google/genai -> out/background.js');

  // 2. Bundle Content Script
  await esbuild.build({
    entryPoints: [path.join(srcDir, 'content.js')],
    bundle: true,
    outfile: path.join(outDir, 'content.js'),
    format: 'iife',
    target: 'es2020',
    platform: 'browser'
  });
  console.log('✅ Bundled content.js -> out/content.js');

  // 3. Copy Manifest V3, options.html, content.css, popup, and icons into out/
  const staticFiles = ['manifest.json', 'options.html', 'content.css', 'popup.html', 'popup.js', 'popup.css'];
  staticFiles.forEach(file => {
    const srcFile = fs.existsSync(path.join(srcDir, file))
      ? path.join(srcDir, file)
      : path.join(__dirname, file);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(outDir, file));
      console.log(`📄 Copied ${file} -> out/`);
    }
  });

  // Copy Icons
  const iconsSrcDir = fs.existsSync(path.join(srcDir, 'icons'))
    ? path.join(srcDir, 'icons')
    : path.join(__dirname, 'icons');
  const iconsOutDir = path.join(outDir, 'icons');

  if (!fs.existsSync(iconsOutDir)) {
    fs.mkdirSync(iconsOutDir, { recursive: true });
  }

  if (fs.existsSync(iconsSrcDir)) {
    fs.readdirSync(iconsSrcDir).forEach(iconFile => {
      fs.copyFileSync(path.join(iconsSrcDir, iconFile), path.join(iconsOutDir, iconFile));
    });
    console.log('🖼️  Copied icons -> out/icons/');
  }

  // Clean mirror out/ into dist/
  fs.cpSync(outDir, distDir, { recursive: true });
  console.log('✨ Clean synced out/ to dist/');

  // Also sync out/content.js and out/background.js to workspace root so root extension works
  fs.copyFileSync(path.join(outDir, 'content.js'), path.join(__dirname, 'content.js'));
  fs.copyFileSync(path.join(outDir, 'background.js'), path.join(__dirname, 'background.js'));
  console.log('✨ Synced content.js and background.js to root directory');

  console.log('\n🎉 SUCCESS! Next.js Chrome Extension is ready in folder: out/ (and dist/ & root)');
  console.log('👉 Load unpacked extension in Chrome from root, out/, or dist/');
}

function fixNextUnderscoreDirectories(dir) {
  // 1. Rename _next directory to next_assets
  const oldNextPath = path.join(dir, '_next');
  const newNextPath = path.join(dir, 'next_assets');

  if (fs.existsSync(oldNextPath)) {
    if (fs.existsSync(newNextPath)) {
      fs.rmSync(newNextPath, { recursive: true, force: true });
    }
    try {
      fs.renameSync(oldNextPath, newNextPath);
    } catch (e) {
      fs.cpSync(oldNextPath, newNextPath, { recursive: true });
      try {
        fs.rmSync(oldNextPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      } catch (rmErr) {
        // Safe to ignore if Windows file watcher holds temporary lock
      }
    }
    console.log('  ✅ Renamed _next/ -> next_assets/');
  }

  // 2. Delete ALL files and folders starting with _ (Chrome prohibits filenames starting with _)
  removeAllUnderscoreFilesAndDirs(dir);

  // 3. Replace all instances of _next/ with next_assets/ in text files
  replaceInDirectory(dir);

  // 4. Ensure directories like out/home/ and out/login/ have an index.html that redirects or opens the HTML page directly
  createDirectoryFallbacks(dir);
}

function createDirectoryFallbacks(outDir) {
  const routes = ['home', 'login', 'auth/callback'];
  for (const route of routes) {
    const routeDir = path.join(outDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    const depth = route.split('/').length;
    const relPrefix = '../'.repeat(depth);
    const htmlName = route.replace(/\//g, '_') + '.html';
    const targetHtml = path.join(routeDir, 'index.html');
    const redirectContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${relPrefix}${route}.html">
<script>window.location.replace('${relPrefix}${route}.html');</script>
<title>Redirecting...</title>
</head>
<body style="font-family:sans-serif;text-align:center;padding:50px;">
  <p>Redirecting to <a href="${relPrefix}${route}.html">${route}.html</a>...</p>
</body>
</html>`;
    fs.writeFileSync(targetHtml, redirectContent, 'utf8');
    console.log(`  📄 Created fallback redirect index.html for ${route}/`);
  }
}

function removeAllUnderscoreFilesAndDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    
    if (item.startsWith('_') && item !== '_locales') {
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
          console.log(`  🗑️ Deleted reserved directory: ${item}`);
        } else {
          fs.rmSync(fullPath, { force: true, maxRetries: 5, retryDelay: 150 });
          console.log(`  🗑️ Deleted reserved file: ${item}`);
        }
      } catch (err) {
        // Ignored
      }
    } else {
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          removeAllUnderscoreFilesAndDirs(fullPath);
        }
      } catch (err) {}
    }
  }
}

function replaceInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      replaceInDirectory(fullPath);
    } else if (
      file.endsWith('.html') ||
      file.endsWith('.js') ||
      file.endsWith('.css') ||
      file.endsWith('.json') ||
      file.endsWith('.txt')
    ) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('_next')) {
        content = content.replace(/\/_next\//g, '/next_assets/').replace(/_next\//g, 'next_assets/');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

buildNextExtension().catch(err => {
  console.error('❌ Extension build failed:', err);
  process.exit(1);
});
