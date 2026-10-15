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

  // 3. Copy Manifest V3, options.html, options.js, content.css, popup, and icons into out/
  const staticFiles = ['manifest.json', 'options.html', 'options.js', 'content.css', 'popup.html', 'popup.js', 'popup.css'];
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

  // Also sync extension files to workspace root so root extension works
  ['content.js', 'background.js', 'popup.js', 'popup.html', 'popup.css', 'content.css', 'manifest.json', 'options.js', 'options.html', 'home.html', 'login.html', 'index.html', '404.html'].forEach(file => {
    const p = path.join(outDir, file);
    if (fs.existsSync(p)) {
      fs.copyFileSync(p, path.join(__dirname, file));
    }
  });

  // Sync next_assets to root
  const rootNextAssets = path.join(__dirname, 'next_assets');
  const outNextAssets = path.join(outDir, 'next_assets');
  if (fs.existsSync(outNextAssets)) {
    fs.cpSync(outNextAssets, rootNextAssets, { recursive: true });
  }

  // Sync home/, login/, auth/ to root
  ['home', 'login', 'auth'].forEach(d => {
    const outD = path.join(outDir, d);
    const rootD = path.join(__dirname, d);
    if (fs.existsSync(outD)) {
      fs.cpSync(outD, rootD, { recursive: true });
    }
  });
  console.log('✨ Synced extension scripts, popup, and manifest to root directory');

  console.log('🚀 Step 4: Packaging latest chrome-extension.zip for landing page download...');
  packageExtensionZip(outDir, distDir);

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

  // 5. Externalize all inline scripts across HTML files for Manifest V3 CSP compliance
  externalizeInlineScripts(dir, dir);
}

function externalizeInlineScripts(currentDir, rootOutDir) {
  if (!fs.existsSync(currentDir)) return;
  const items = fs.readdirSync(currentDir);
  const chunksDir = path.join(rootOutDir, 'next_assets', 'static', 'chunks');
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  for (const item of items) {
    const fullPath = path.join(currentDir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      externalizeInlineScripts(fullPath, rootOutDir);
    } else if (item.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Match inline script tags without src
      const inlineScriptRegex = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
      let scriptIndex = 0;
      let hasReplacements = false;

      const relPath = path.relative(rootOutDir, fullPath);
      const safeBase = relPath.replace(/\.html$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');

      const updatedContent = content.replace(inlineScriptRegex, (match, attrs, scriptBody) => {
        const trimmed = (scriptBody || '').trim();
        if (!trimmed) {
          return ''; // Strip empty scripts
        }

        const scriptFileName = `inline_${safeBase}_${scriptIndex++}.js`;
        const scriptFilePath = path.join(chunksDir, scriptFileName);
        fs.writeFileSync(scriptFilePath, scriptBody, 'utf8');
        hasReplacements = true;

        const cleanAttrs = attrs ? ` ${attrs.trim()}` : '';
        return `<script src="/next_assets/static/chunks/${scriptFileName}"${cleanAttrs}></script>`;
      });

      if (hasReplacements) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`  ⚡ Externalized ${scriptIndex} inline scripts from: ${path.relative(rootOutDir, fullPath)}`);
      }
    }
  }
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
    const targetHtml = path.join(routeDir, 'index.html');
    const redirectContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${relPrefix}${route}.html">
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

function packageExtensionZip(outDir, distDir) {
  const stagingDir = path.join(__dirname, '.extension_staging');
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  const extFiles = [
    'manifest.json', 'background.js', 'content.js', 'content.css',
    'popup.html', 'popup.js', 'popup.css',
    'options.html', 'options.js',
    'home.html', 'login.html', '404.html'
  ];

  extFiles.forEach(f => {
    const src = path.join(outDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(stagingDir, f));
    }
  });

  const extDirs = ['icons', 'next_assets'];
  extDirs.forEach(d => {
    const src = path.join(outDir, d);
    if (fs.existsSync(src)) {
      fs.cpSync(src, path.join(stagingDir, d), { recursive: true });
    }
  });

  const tempZip = path.join(__dirname, '.extension_temp.zip');
  if (fs.existsSync(tempZip)) fs.rmSync(tempZip, { force: true });

  try {
    if (process.platform === 'win32') {
      execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${stagingDir}', '${tempZip}')"`);
    } else {
      execSync(`cd "${stagingDir}" && zip -r "${tempZip}" .`);
    }

    if (fs.existsSync(tempZip)) {
      const zipTargets = [
        path.join(__dirname, 'public', 'chrome-extension.zip'),
        path.join(outDir, 'chrome-extension.zip'),
        path.join(distDir, 'chrome-extension.zip')
      ];

      zipTargets.forEach(dest => {
        const parent = path.dirname(dest);
        if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
        fs.copyFileSync(tempZip, dest);
      });
      fs.rmSync(tempZip, { force: true });
      const sizeKB = Math.round(fs.statSync(zipTargets[0]).size / 1024);
      console.log(`📦 Created latest chrome-extension.zip (${sizeKB} KB) in public/, out/, and dist/`);
    }
  } catch (err) {
    console.warn('⚠️ Warning: Could not package chrome-extension.zip:', err.message);
  } finally {
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
}

buildNextExtension().catch(err => {
  console.error('❌ Extension build failed:', err);
  process.exit(1);
});
