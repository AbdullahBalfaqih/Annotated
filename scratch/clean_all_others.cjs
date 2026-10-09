const fs = require('fs');

// 1. src/manifest.json
let m = fs.readFileSync('src/manifest.json', 'utf8');
m = m.replace(/"description":\s*".*?"/, '"description": "Smart AI extension for webpage annotations, video moment clipping, AI summaries, and community discussion."');
fs.writeFileSync('src/manifest.json', m, 'utf8');

// Also manifest.json in root if exists
if (fs.existsSync('manifest.json')) {
  let mr = fs.readFileSync('manifest.json', 'utf8');
  mr = mr.replace(/"description":\s*".*?"/, '"description": "Smart AI extension for webpage annotations, video moment clipping, AI summaries, and community discussion."');
  fs.writeFileSync('manifest.json', mr, 'utf8');
}

// 2. src/permission.html
if (fs.existsSync('src/permission.html')) {
  let p = fs.readFileSync('src/permission.html', 'utf8');
  p = p.replace('<title>تفعيل الميكروفون - WebMind AI</title>', '<title>Enable Microphone - WebMind AI</title>');
  p = p.replace('<h1>تفعيل إذن الصوت والميكروفون</h1>', '<h1>Enable Microphone Access</h1>');
  p = p.replace('<p>يرجى النقر على الزر أدناه ثم اختيار <strong>"سماح" (Allow)</strong> لتمكين الإضافة من الاستماع وتفريغ الصوت الحي.</p>', '<p>Please click the button below and select <strong>"Allow"</strong> to enable audio listening and speech transcription.</p>');
  p = p.replace('<button id="btn-request-mic">تفعيل الميكروفون الآن</button>', '<button id="btn-request-mic">Enable Microphone Now</button>');
  p = p.replace("status.innerText = '✅ تم تفعيل الميكروفون بنجاح! سيتم إغلاق الصفحة تلقائياً...';", "status.innerText = '✅ Microphone access granted! Window closing automatically...';");
  p = p.replace("status.innerText = '❌ لم يتم منح الإذن: ' + (err.message || 'يرجى النقر واختيار Allow');", "status.innerText = '❌ Permission not granted: ' + (err.message || 'Please click and choose Allow');");
  fs.writeFileSync('src/permission.html', p, 'utf8');
}

// 3. src/popup.css comments
let css = fs.readFileSync('src/popup.css', 'utf8');
css = css.replace(/\/\* Large Spacious Input Field \("كبر هذا الحقل"\) \*\//g, '/* Large Spacious Input Field */');
css = css.replace(/border-radius: 6px; \/\* مربعات مو بيضاوي \*\//g, 'border-radius: 6px;');
css = css.replace(/background: transparent !important; \/\* غير معبأ \*\//g, 'background: transparent !important;');
fs.writeFileSync('src/popup.css', css, 'utf8');

console.log('Cleaned manifest, permission.html and popup.css comments');
