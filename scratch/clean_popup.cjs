const fs = require('fs');
let code = fs.readFileSync('src/popup.js', 'utf8');
code = code.replace(/\/\/ ── 2\. Fluid Waveform Visualizer \(التموج فقط بدون أي مستطيلات\) ──────/g, '// ── 2. Fluid Waveform Visualizer ──────');
code = code.replace(/\/\/ Layered flowing sine\/bezier curves \(3 متداخلة لتموج انسيابي ساحر\)/g, '// Layered flowing sine/bezier curves');
code = code.replace(/<span style="color:#ef4444;">خطأ: \${res\.error}<\/span>/g, '<span style="color:#ef4444;">Error: ${res.error}</span>');
fs.writeFileSync('src/popup.js', code, 'utf8');
console.log('Fixed final 3 lines');
