const fs = require('fs');

let code = fs.readFileSync('src/popup.js', 'utf8');

// 1. In applyPageActionOrSelection
const targetApply = `    if (url) currentAnnotationContext.url = url;
    if (title) currentAnnotationContext.mediaTitle = title;
    if (text) currentAnnotationContext.selectedText = text;`;

const newApply = `    if (url) currentAnnotationContext.url = url;
    if (title) currentAnnotationContext.mediaTitle = title;
    if (text) currentAnnotationContext.selectedText = text;
    if (typeof act.startTime === 'number') currentAnnotationContext.startTime = act.startTime;
    if (typeof act.endTime === 'number') currentAnnotationContext.endTime = Math.min(act.startTime + 90, act.endTime);
    if (typeof act.duration === 'number') currentAnnotationContext.duration = act.duration;
    if (mode === 'video' || (url && (url.includes('youtube.com') || url.includes('youtu.be')))) {
      currentAnnotationContext.type = 'video';
    }`;

if (code.includes(targetApply)) {
  code = code.replace(targetApply, newApply);
  console.log('applyPageActionOrSelection updated');
}

// 2. Arabic replacements
code = code.replace(/⚠️ يتعذر الوصول لنص الصفحة الحالية\. جرب تحديث الصفحة\./g, '⚠️ Unable to access current page text. Try refreshing the page.');
code = code.replace(/جاري تحليل وتلخيص الصفحة باستخدام الذكاء الاصطناعي\.\.\./g, 'Analyzing and summarizing page with AI...');
code = code.replace(/❌ خطأ: /g, '❌ Error: ');
code = code.replace(/❌ حدث خطأ أثناء التلخيص: /g, '❌ Error during summarization: ');
code = code.replace(/✅ تم النسخ/g, '✅ Copied');
code = code.replace(/'📋 نسخ'/g, "'📋 Copy'");
code = code.replace(/ملخص_\$\{\(activePageData\?\.title \|\| 'صفحة'\)\.substring\(0, 20\)\}\.txt/g, "summary_${(activePageData?.title || 'page').substring(0, 20)}.txt");
code = code.replace(/⌛ جاري التفكير والإجابة\.\.\./g, '⌛ Thinking and formulating answer...');
code = code.replace(/عذراً، لم أستطع فهم الاستفسار\./g, 'Sorry, could not process request.');
code = code.replace(/لا يوجد ملخصات مطابقة\./g, 'No matching summaries found.');
code = code.replace(/هل أنت تأكد من مسح جميع الملخصات المحفوظة من السجل؟/g, 'Are you sure you want to clear all saved summaries?');
code = code.replace(/⚠️ يرجى إدخال نص للترجمة أو فتح صفحة صالحة\./g, '⚠️ Please enter text to translate or open a valid page.');
code = code.replace(/جاري الترجمة الفورية إلى \(\$\{targetLang\}\)\.\.\./g, 'Translating live to (${targetLang})...');
code = code.replace(/❌ خطأ في الترجمة: /g, '❌ Translation error: ');
code = code.replace(/✅ تم استخراج الأكواد من الصفحة بنجاح! اختر نوع التحليل أعلاه\./g, '✅ Code extracted successfully! Select an action above.');
code = code.replace(/لم يتم العثور على وسوم أكواد \(pre\/code\) في هذه الصفحة\. يمكنك لصق الكود يدوياً\./g, 'No code tags (pre/code) found on this page. You can paste code manually.');
code = code.replace(/⚠️ يرجى لصق كود أو استخراجه من الصفحة أولاً\./g, '⚠️ Please paste code or extract it from page first.');
code = code.replace(/جاري \$\{label\} بواسطة الذكاء الاصطناعي\.\.\./g, 'Processing ${label} via AI...');
code = code.replace(/❌ خطأ في المعالجة: /g, '❌ Processing error: ');
code = code.replace(/'شرح وتحليل الكود'/g, "'Explain & Analyze Code'");
code = code.replace(/'فحص واكتشاف الأخطاء'/g, "'Debug & Detect Bugs'");
code = code.replace(/'تحسين الأداء'/g, "'Optimize Code'");
code = code.replace(/💬 ترجمة منطوقة/g, '💬 Speech Translation');
code = code.replace(/🎙️ صوت مسموع/g, '🎙️ Spoken Audio');
code = code.replace(/جاري تفريغ الصوت المسموع بواسطة الذكاء الاصطناعي\.\.\./g, 'Transcribing spoken audio via AI...');
code = code.replace(/تم تسجيل الصوت \(\$\{currentRecordedSessionDuration\}\)\. جاهز للحفظ والمشاركة\./g, 'Audio clip recorded (${currentRecordedSessionDuration}). Ready to save & share.');
code = code.replace(/مقطع مسجل \(\$\{currentRecordedSessionDuration\}\)/g, 'Recorded Clip (${currentRecordedSessionDuration})');
code = code.replace(/تم تسجيل وحفظ المقطع الصوتي \(\$\{currentRecordedSessionDuration\}\)\./g, 'Audio clip recorded and saved (${currentRecordedSessionDuration}).');
code = code.replace(/🔴 جاري تسجيل وحفظ المقطع الصوتي\.\.\./g, '🔴 Recording and capturing audio clip...');
code = code.replace(/استماع حي مباشر نشط \(Live Listening Active\)/g, 'Live Listening Active');
code = code.replace(/تسجيل صوتي - WebMind AI/g, 'Voice Recording - WebMind AI');
code = code.replace(/تاريخ: \$\{new Date\(\)\.toLocaleString\('ar'\)\}/g, "Date: ${new Date().toLocaleString('en-US')}");
code = code.replace(/✅ تم الحفظ!/g, '✅ Saved!');
code = code.replace(/'💾 حفظ'/g, "'💾 Save'");
code = code.replace(/تفريغ مقطع صوتي - WebMind AI/g, 'Audio Clip Transcript - WebMind AI');
code = code.replace(/تم حفظ المقطع الصوتي بنجاح\./g, 'Audio clip saved successfully.');
code = code.replace(/✅ تمت المشاركة/g, '✅ Shared!');
code = code.replace(/'🔗 مشاركة'/g, "'🔗 Share'");
code = code.replace(/المقطع المسجل قصير جداً لتلخيصه\./g, 'Recorded clip is too short to summarize.');
code = code.replace(/جاري تحليل وتلخيص المقطع بواسطة Gemini AI\.\.\./g, 'Analyzing and summarizing clip with Gemini AI...');
code = code.replace(/يرجى تلخيص المقطع المباشر المسجل التالي بإيجاز وبنقاط واضحة مع إبراز الفكرة الرئيسية:\\n\\n\$\{sessionText\}/g, 'Please summarize the following recorded audio clip with concise key points and takeaways:\\n\\n${sessionText}');
code = code.replace(/📌 ملخص الذكاء الاصطناعي للمقطع:/g, '📌 AI Summary of Audio Clip:');
code = code.replace(/تعذر توليد الملخص في الوقت الحالي\./g, 'Unable to generate summary at this time.');
code = code.replace(/يرجى تشغيل بعض الصوت أولاً قبل التلخيص\./g, 'Please play some audio first before summarizing.');
code = code.replace(/✨ جاري توليد ملخص ذكي للتفريغ بواسطة Gemini AI\.\.\./g, '✨ Generating smart transcript summary with Gemini AI...');
code = code.replace(/📌 ملخص الذكاء الاصطناعي:/g, '📌 AI Summary:');
code = code.replace(/يرجى السماح بصلاحية الميكروفون لتسجيل تعليقك الصوتي\./g, 'Please allow microphone permissions to record voice commentary.');
code = code.replace(/اكتب تعليقك \/ ردك:/g, 'Write your reply:');
code = code.replace(/\/\/ Copy URL Button \(زر للنسخ URL\)/g, '// Copy URL Button');

fs.writeFileSync('src/popup.js', code, 'utf8');
console.log('Popup.js clean completed successfully');
