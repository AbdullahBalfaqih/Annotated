const fs = require('fs');

let code = fs.readFileSync('src/popup.js', 'utf8');

// 1. Replace updateAnnotMediaDisplay and updateAnnotTimeDisplay and add parseTimeString, playCurrentClip, initClipDeckControls
const targetMediaTime = `  function updateAnnotMediaDisplay(info = {}) {
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');
    const sourceTypeLabel = document.getElementById('annot-source-type-label');

    if (mediaTitleEl && info.title) {
      mediaTitleEl.innerText = info.title;
      mediaTitleEl.title = info.title;
    }
    if (mediaChannelEl && info.channel) {
      mediaChannelEl.innerText = info.channel;
    }
    if (sourceTypeLabel) {
      sourceTypeLabel.innerText = (info.url && info.url.includes('youtube.com')) ? 'YouTube' : 'Video';
    }

    let thumbUrl = info.thumbnailUrl || info.frameSnapshot;
    if (!thumbUrl && info.videoId) {
      thumbUrl = \`https://i.ytimg.com/vi/\${info.videoId}/hqdefault.jpg\`;
    }
    if (!thumbUrl) {
      thumbUrl = DEFAULT_VIDEO_THUMB;
    }

    const frameImgs = document.querySelectorAll('.film-frame-img');
    frameImgs.forEach((img) => {
      img.src = thumbUrl;
      img.onerror = () => {
        if (img.src !== DEFAULT_FRAME_THUMB) img.src = DEFAULT_FRAME_THUMB;
      };
    });

    setTimeout(() => {
      drawWaveformCanvas('timeline-wave-canvas', '#3B82F6');
    }, 50);
  }

  // Interactive CapCut-style Realtime Position & Geometry Updater
  function updateAnnotTimeDisplay() {
    const timeTag = document.getElementById('annot-time-tag');
    const trimBox = document.getElementById('pro-trim-box');
    const dimLeft = document.getElementById('pro-dim-mask-left');
    const dimRight = document.getElementById('pro-dim-mask-right');
    const playheadNeedle = document.getElementById('pro-playhead-needle');
    const scrubberFill = document.getElementById('pro-scrubber-fill');
    const sliderStart = document.getElementById('annot-slider-start');
    const sliderEnd = document.getElementById('annot-slider-end');

    const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
    let s = Math.max(0, currentAnnotationContext.startTime);
    let e = Math.min(totalDur, Math.max(s + 1, currentAnnotationContext.endTime));

    // Enforce 90-second maximum clip limit
    if (e - s > MAX_CLIP_DURATION) {
      e = Math.min(totalDur, s + MAX_CLIP_DURATION);
      if (e - s > MAX_CLIP_DURATION) {
        s = Math.max(0, e - MAX_CLIP_DURATION);
      }
    }

    currentAnnotationContext.startTime = s;
    currentAnnotationContext.endTime = e;

    const sStr = formatTime(s);
    const eStr = formatTime(e);

    if (timeTag) timeTag.innerText = \`\${sStr} ─────── \${eStr}\`;

    const startPct = Math.min(100, Math.max(0, (s / totalDur) * 100));
    const endPct = Math.min(100, Math.max(startPct + 1, (e / totalDur) * 100));
    const widthPct = Math.max(4, endPct - startPct);

    // Visually move & resize the CapCut blue trim frame
    if (trimBox) {
      trimBox.style.left = \`\${startPct}%\`;
      trimBox.style.width = \`\${widthPct}%\`;
    }
    if (dimLeft) {
      dimLeft.style.width = \`\${startPct}%\`;
    }
    if (dimRight) {
      dimRight.style.width = \`\${Math.max(0, 100 - endPct)}%\`;
    }
    if (playheadNeedle) {
      playheadNeedle.style.left = \`\${startPct}%\`;
    }
    if (scrubberFill) {
      scrubberFill.style.left = \`\${startPct}%\`;
      scrubberFill.style.width = \`\${widthPct}%\`;
    }
    if (sliderStart) {
      sliderStart.max = totalDur;
      sliderStart.value = s;
    }
    if (sliderEnd) {
      sliderEnd.max = totalDur;
      sliderEnd.value = e;
    }
  }`;

const replacementMediaTime = `  function parseTimeString(str) {
    if (!str) return 0;
    const clean = str.toString().trim();
    const parts = clean.split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  }

  function playCurrentClip() {
    const s = currentAnnotationContext.startTime;
    const e = currentAnnotationContext.endTime;
    const videoId = currentAnnotationContext.videoId || lastDetectedVideoId;
    const iframe = document.getElementById('annot-youtube-iframe');
    const overlay = document.getElementById('annot-video-thumb-overlay');

    // Instruct YouTube tab to play this exact slice
    getActiveWebTab().then(tab => {
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'PLAY_CLIP', startTime: s, endTime: e });
      }
    });

    // Also update extension embedded video player
    if (iframe && videoId) {
      iframe.src = \`https://www.youtube.com/embed/\${videoId}?start=\${s}&end=\${e}&autoplay=1&rel=0\`;
      if (overlay) overlay.classList.add('hidden');
    }
    showStudioToast(\`Playing clip \${formatTime(s)} - \${formatTime(e)} (Max 90s)\`);
  }

  function initClipDeckControls() {
    const inputStart = document.getElementById('annot-input-start-time');
    const inputEnd = document.getElementById('annot-input-end-time');
    const btnSetStartNow = document.getElementById('btn-set-start-now');
    const btnSetEndNow = document.getElementById('btn-set-end-now');
    const btnPlayClip = document.getElementById('btn-annot-preview');
    const btnThumbPlay = document.getElementById('btn-thumb-play');

    if (inputStart && !inputStart.dataset.bound) {
      inputStart.dataset.bound = 'true';
      const handleStartCommit = () => {
        const s = Math.max(0, parseTimeString(inputStart.value));
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        let e = currentAnnotationContext.endTime;
        if (e <= s) e = Math.min(totalDur, s + 30);
        if (e - s > MAX_CLIP_DURATION) {
          e = Math.min(totalDur, s + MAX_CLIP_DURATION);
          showStudioToast('Clip length capped at 90s max');
        }
        currentAnnotationContext.startTime = s;
        currentAnnotationContext.endTime = e;
        updateAnnotTimeDisplay();
        throttledSeek(s);
      };
      inputStart.addEventListener('change', handleStartCommit);
      inputStart.addEventListener('blur', handleStartCommit);
      inputStart.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleStartCommit();
          inputStart.blur();
        }
      });
    }

    if (inputEnd && !inputEnd.dataset.bound) {
      inputEnd.dataset.bound = 'true';
      const handleEndCommit = () => {
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        let e = Math.min(totalDur, parseTimeString(inputEnd.value));
        let s = currentAnnotationContext.startTime;
        if (e <= s) e = Math.min(totalDur, s + 5);
        if (e - s > MAX_CLIP_DURATION) {
          e = Math.min(totalDur, s + MAX_CLIP_DURATION);
          showStudioToast('Clip length capped at 90s max');
        }
        currentAnnotationContext.endTime = e;
        updateAnnotTimeDisplay();
        throttledSeek(s);
      };
      inputEnd.addEventListener('change', handleEndCommit);
      inputEnd.addEventListener('blur', handleEndCommit);
      inputEnd.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleEndCommit();
          inputEnd.blur();
        }
      });
    }

    if (btnSetStartNow && !btnSetStartNow.dataset.bound) {
      btnSetStartNow.dataset.bound = 'true';
      btnSetStartNow.addEventListener('click', async () => {
        const tab = await getActiveWebTab();
        let cur = lastKnownVideoTime;
        if (tab && tab.id) {
          try {
            const resp = await new Promise(res => chrome.tabs.sendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, res));
            if (typeof resp?.currentTime === 'number') cur = resp.currentTime;
          } catch (_) {}
        }
        const s = Math.max(0, Math.floor(cur));
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        let e = currentAnnotationContext.endTime;
        if (e <= s || e - s > MAX_CLIP_DURATION) {
          e = Math.min(totalDur, s + Math.min(30, MAX_CLIP_DURATION));
        }
        currentAnnotationContext.startTime = s;
        currentAnnotationContext.endTime = e;
        updateAnnotTimeDisplay();
        showStudioToast(\`Start set to \${formatTime(s)}\`);
      });
    }

    if (btnSetEndNow && !btnSetEndNow.dataset.bound) {
      btnSetEndNow.dataset.bound = 'true';
      btnSetEndNow.addEventListener('click', async () => {
        const tab = await getActiveWebTab();
        let cur = lastKnownVideoTime;
        if (tab && tab.id) {
          try {
            const resp = await new Promise(res => chrome.tabs.sendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, res));
            if (typeof resp?.currentTime === 'number') cur = resp.currentTime;
          } catch (_) {}
        }
        let e = Math.floor(cur);
        const s = currentAnnotationContext.startTime;
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        if (e <= s) e = Math.min(totalDur, s + 5);
        if (e - s > MAX_CLIP_DURATION) {
          e = Math.min(totalDur, s + MAX_CLIP_DURATION);
          showStudioToast('End capped at 90s max limit');
        } else {
          showStudioToast(\`End set to \${formatTime(e)}\`);
        }
        currentAnnotationContext.endTime = e;
        updateAnnotTimeDisplay();
      });
    }

    // Preset pills (15s, 30s, 60s, 90s Max)
    document.querySelectorAll('.clip-preset-pill').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const sec = parseInt(btn.dataset.seconds, 10) || 30;
          const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
          const s = currentAnnotationContext.startTime;
          const e = Math.min(totalDur, s + Math.min(sec, MAX_CLIP_DURATION));
          currentAnnotationContext.endTime = e;
          updateAnnotTimeDisplay();
          showStudioToast(\`\${sec}s clip chosen (Max 90s)\`);
        });
      }
    });

    if (btnPlayClip && !btnPlayClip.dataset.bound) {
      btnPlayClip.dataset.bound = 'true';
      btnPlayClip.addEventListener('click', () => playCurrentClip());
    }

    if (btnThumbPlay && !btnThumbPlay.dataset.bound) {
      btnThumbPlay.dataset.bound = 'true';
      btnThumbPlay.addEventListener('click', () => playCurrentClip());
    }
  }

  function updateAnnotMediaDisplay(info = {}) {
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');
    const sourceTypeLabel = document.getElementById('annot-source-type-label');
    const thumbImg = document.getElementById('annot-video-thumb-img');
    const thumbOverlay = document.getElementById('annot-video-thumb-overlay');
    const iframe = document.getElementById('annot-youtube-iframe');

    if (mediaTitleEl && info.title) {
      mediaTitleEl.innerText = info.title;
      mediaTitleEl.title = info.title;
    }
    if (mediaChannelEl && info.channel) {
      mediaChannelEl.innerText = info.channel;
    }
    if (sourceTypeLabel) {
      sourceTypeLabel.innerText = (info.url && info.url.includes('youtube.com')) ? 'YouTube' : 'Video';
    }

    if (info.videoId) {
      currentAnnotationContext.videoId = info.videoId;
    }

    let thumbUrl = info.thumbnailUrl || info.frameSnapshot;
    if (!thumbUrl && (info.videoId || currentAnnotationContext.videoId)) {
      const vid = info.videoId || currentAnnotationContext.videoId;
      thumbUrl = \`https://i.ytimg.com/vi/\${vid}/hqdefault.jpg\`;
    }
    if (!thumbUrl) {
      thumbUrl = DEFAULT_VIDEO_THUMB;
    }

    if (thumbImg) {
      thumbImg.src = thumbUrl;
    }
    if (thumbOverlay) {
      thumbOverlay.classList.remove('hidden');
    }
    if (iframe) {
      iframe.src = '';
    }

    const frameImgs = document.querySelectorAll('.film-frame-img');
    frameImgs.forEach((img) => {
      img.src = thumbUrl;
      img.onerror = () => {
        if (img.src !== DEFAULT_FRAME_THUMB) img.src = DEFAULT_FRAME_THUMB;
      };
    });

    setTimeout(() => {
      drawWaveformCanvas('timeline-wave-canvas', '#3B82F6');
    }, 50);
  }

  // Interactive CapCut-style Realtime Position & Geometry Updater
  function updateAnnotTimeDisplay() {
    const timeTag = document.getElementById('annot-time-tag');
    const trimBox = document.getElementById('pro-trim-box');
    const dimLeft = document.getElementById('pro-dim-mask-left');
    const dimRight = document.getElementById('pro-dim-mask-right');
    const playheadNeedle = document.getElementById('pro-playhead-needle');
    const scrubberFill = document.getElementById('pro-scrubber-fill');
    const sliderStart = document.getElementById('annot-slider-start');
    const sliderEnd = document.getElementById('annot-slider-end');
    const inputStart = document.getElementById('annot-input-start-time');
    const inputEnd = document.getElementById('annot-input-end-time');
    const durVal = document.getElementById('annot-clip-dur-val');

    const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
    let s = Math.max(0, currentAnnotationContext.startTime);
    let e = Math.min(totalDur, Math.max(s + 1, currentAnnotationContext.endTime));

    // Strict 90-second maximum clip limit
    if (e - s > MAX_CLIP_DURATION) {
      e = Math.min(totalDur, s + MAX_CLIP_DURATION);
      if (e - s > MAX_CLIP_DURATION) {
        s = Math.max(0, e - MAX_CLIP_DURATION);
      }
    }

    currentAnnotationContext.startTime = s;
    currentAnnotationContext.endTime = e;

    const sStr = formatTime(s);
    const eStr = formatTime(e);
    const clipDurSec = Math.max(1, Math.round(e - s));

    if (timeTag) timeTag.innerText = \`\${sStr} ─────── \${eStr}\`;

    if (inputStart && document.activeElement !== inputStart) {
      inputStart.value = sStr;
    }
    if (inputEnd && document.activeElement !== inputEnd) {
      inputEnd.value = eStr;
    }
    if (durVal) {
      durVal.innerText = \`\${clipDurSec}s\`;
    }

    // Sync preset pills active state
    document.querySelectorAll('.clip-preset-pill').forEach(btn => {
      const pSec = parseInt(btn.dataset.seconds, 10);
      if (pSec === clipDurSec) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const startPct = Math.min(100, Math.max(0, (s / totalDur) * 100));
    const endPct = Math.min(100, Math.max(startPct + 1, (e / totalDur) * 100));
    const widthPct = Math.max(4, endPct - startPct);

    // Visually move & resize the CapCut blue trim frame
    if (trimBox) {
      trimBox.style.left = \`\${startPct}%\`;
      trimBox.style.width = \`\${widthPct}%\`;
    }
    if (dimLeft) {
      dimLeft.style.width = \`\${startPct}%\`;
    }
    if (dimRight) {
      dimRight.style.width = \`\${Math.max(0, 100 - endPct)}%\`;
    }
    if (playheadNeedle) {
      playheadNeedle.style.left = \`\${startPct}%\`;
    }
    if (scrubberFill) {
      scrubberFill.style.left = \`\${startPct}%\`;
      scrubberFill.style.width = \`\${widthPct}%\`;
    }
    if (sliderStart) {
      sliderStart.max = totalDur;
      sliderStart.value = s;
    }
    if (sliderEnd) {
      sliderEnd.max = totalDur;
      sliderEnd.value = e;
    }
  }`;

if (code.includes(targetMediaTime)) {
  code = code.replace(targetMediaTime, replacementMediaTime);
  console.log('updateAnnotMediaDisplay and updateAnnotTimeDisplay replaced successfully');
} else {
  console.log('targetMediaTime match not found');
}

// 2. Update initCreateAnnotationPanel and setupFallbackContext
const targetInitPanel = `    initTimelineDragHandles();
    startAutoVideoWatcher();

    try {
      const tab = await getActiveWebTab();
      if (!tab || !tab.id) {
        setupFallbackContext(mode, false);
        return;
      }

      const isYouTube = !!(tab.url && (tab.url.includes('youtube.com') || tab.url.includes('youtu.be')));`;

const replacementInitPanel = `    initTimelineDragHandles();
    initClipDeckControls();
    startAutoVideoWatcher();

    try {
      const tab = await getActiveWebTab();
      const isYouTube = !!(
        (tab && tab.url && (tab.url.includes('youtube.com') || tab.url.includes('youtu.be'))) ||
        (currentAnnotationContext.url && (currentAnnotationContext.url.includes('youtube.com') || currentAnnotationContext.url.includes('youtu.be'))) ||
        currentAnnotationContext.type === 'video'
      );

      if (!tab || !tab.id) {
        setupFallbackContext(mode, isYouTube);
        return;
      }`;

if (code.includes(targetInitPanel)) {
  code = code.replace(targetInitPanel, replacementInitPanel);
  console.log('initCreateAnnotationPanel header replaced');
} else {
  console.log('targetInitPanel match not found');
}

// 3. Update setupFallbackContext
const targetFallback = `  function setupFallbackContext(mode, isYouTube = false) {
    const timelineBox = document.getElementById('annot-timeline-box');
    const snippetBox = document.getElementById('annot-text-snippet-box');
    const screenshotBox = document.getElementById('annot-screenshot-box');
    const voiceStudioBox = document.getElementById('annot-voice-studio-box');
    const codeSnippetBox = document.getElementById('annot-code-snippet-box');
    const sourceBadgeLabel = document.getElementById('annot-source-type-label');
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');

    if (voiceStudioBox) voiceStudioBox.classList.add('hidden');
    if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
    if (screenshotBox) screenshotBox.classList.add('hidden');

    if (isYouTube || currentAnnotationContext.type === 'video') {
      if (timelineBox) timelineBox.classList.remove('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'YouTube';
      if (mediaTitleEl && (!mediaTitleEl.innerText || mediaTitleEl.innerText === 'Detecting media...')) {
        mediaTitleEl.innerText = 'YouTube Video';
      }
      if (mediaChannelEl) mediaChannelEl.innerText = 'YouTube';
    } else {
      if (timelineBox) timelineBox.classList.add('hidden');
      if (snippetBox) snippetBox.classList.remove('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Text Annotation';
    }
  }`;

const replacementFallback = `  function setupFallbackContext(mode, isYouTube = false) {
    const timelineBox = document.getElementById('annot-timeline-box');
    const snippetBox = document.getElementById('annot-text-snippet-box');
    const screenshotBox = document.getElementById('annot-screenshot-box');
    const voiceStudioBox = document.getElementById('annot-voice-studio-box');
    const codeSnippetBox = document.getElementById('annot-code-snippet-box');
    const sourceBadgeLabel = document.getElementById('annot-source-type-label');
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');

    if (voiceStudioBox) voiceStudioBox.classList.add('hidden');
    if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
    if (screenshotBox) screenshotBox.classList.add('hidden');

    const isYT = isYouTube ||
      (currentAnnotationContext.url && (currentAnnotationContext.url.includes('youtube.com') || currentAnnotationContext.url.includes('youtu.be'))) ||
      currentAnnotationContext.type === 'video';

    if (isYT) {
      currentAnnotationContext.type = 'video';
      if (timelineBox) timelineBox.classList.remove('hidden');
      if (snippetBox) snippetBox.classList.add('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'YouTube';
      if (mediaTitleEl && (!mediaTitleEl.innerText || mediaTitleEl.innerText === 'Detecting media...')) {
        mediaTitleEl.innerText = currentAnnotationContext.mediaTitle || 'YouTube Video';
      }
      if (mediaChannelEl) mediaChannelEl.innerText = 'YouTube';
      initClipDeckControls();
      updateAnnotTimeDisplay();
      updateRulerTicks(currentAnnotationContext.duration || 300);
    } else {
      if (timelineBox) timelineBox.classList.add('hidden');
      if (snippetBox) snippetBox.classList.remove('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Text Annotation';
    }
  }`;

if (code.includes(targetFallback)) {
  code = code.replace(targetFallback, replacementFallback);
  console.log('setupFallbackContext replaced');
} else {
  console.log('targetFallback match not found');
}

fs.writeFileSync('src/popup.js', code, 'utf8');
console.log('update_timeline_deck.cjs completed successfully');
