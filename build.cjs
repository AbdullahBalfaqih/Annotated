const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function buildNextExtension() {
  console.log('🚀 Step 1: Building Next.js Static Export App...');
  try {
    execSync('npx next build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Next.js Static Export successfully generated in out/');
  } catch (err) {
    console.error('❌ Next.js build error:', err.message);
  }

  const outDir = path.join(__dirname, 'out');
  const srcDir = path.join(__dirname, 'src');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('🚀 Step 2: Bundling Extension Service Worker & Content Scripts...');

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

  // Also mirror out/ into dist/ for convenience
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.cpSync(outDir, distDir, { recursive: true });
  console.log('✨ Mirror synced out/ to dist/');

  // Also mirror extension files into the root directory in case user loaded from root!
  const rootFiles = ['popup.html', 'popup.js', 'popup.css', 'content.css', 'options.html'];
  rootFiles.forEach(file => {
    const srcFile = path.join(srcDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(__dirname, file));
    }
  });
  if (fs.existsSync(path.join(outDir, 'background.js'))) {
    fs.copyFileSync(path.join(outDir, 'background.js'), path.join(__dirname, 'background.js'));
  }
  if (fs.existsSync(path.join(outDir, 'content.js'))) {
    fs.copyFileSync(path.join(outDir, 'content.js'), path.join(__dirname, 'content.js'));
  }
  console.log('🔄 Mirror synced extension files to ROOT directory for direct unpacked loading!');

  console.log('\n🎉 SUCCESS! Your Next.js Chrome Extension is ready in folder: out/ (and dist/)');
  console.log('👉 Load unpacked extension in Chrome from: ' + outDir);
}

buildNextExtension().catch(err => {
  console.error('❌ Extension build failed:', err);
  process.exit(1);
});
