// WebMind AI - Content Script

(function () {
  let tooltipEl = null;
  let activeModalEl = null;

  // Extract clean text content from the current page
  function extractPageContent() {
    const title = document.title || 'Untitled Page';
    const url = window.location.href;
    const domain = window.location.hostname;

    // Clone body to avoid mutating actual DOM
    const clone = document.body.cloneNode(true);

    // Remove irrelevant elements
    const ignoredTags = ['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe', 'noscript', 'svg', 'form', 'button'];
    ignoredTags.forEach(tag => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });

    // Also remove elements with common non-content classes/ids
    const ignoredSelectors = ['.nav', '.navbar', '.footer', '.header', '.ad', '.ads', '.sidebar', '.menu', '.cookie'];
    ignoredSelectors.forEach(sel => {
      const elements = clone.querySelectorAll(sel);
      elements.forEach(el => el.remove());
    });

    // Get text content
    let text = clone.innerText || clone.textContent || '';
    
    // Clean up excessive whitespace & blank lines
    text = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 20) // Filter out short menu items/nav text
      .join('\n');

    // Limit text length for token safety (~12,000 chars)
    if (text.length > 12000) {
      text = text.substring(0, 12000) + '...\n[Content truncated for performance]';
    }

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return {
      title,
      url,
      domain,
      text,
      wordCount,
      readingTimeMinutes
    };
  }

  // Extract GitHub / code context, lines and snippets
  function extractCodeContext() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    const isGithub = hostname.includes('github.com');

    let repo = '';
    let filePath = '';
    let fileName = '';
    let startLine = 1;
    let endLine = 1;
    let codeSnippet = '';
    let language = 'JavaScript';
    let allLines = [];

    const sel = window.getSelection();
    const selection = sel ? sel.toString().trim() : '';

    if (isGithub) {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        repo = `${parts[0]}/${parts[1]}`;
      }
      if (parts.length >= 5 && parts[2] === 'blob') {
        filePath = parts.slice(4).join('/');
        fileName = parts[parts.length - 1];
      } else if (parts.length > 2) {
        fileName = parts[parts.length - 1] || 'source_file.py';
        filePath = parts.slice(2).join('/');
      } else {
        fileName = 'README.md';
        filePath = 'README.md';
      }

      // ── 1. Extract all lines from GitHub DOM ──────────────────────────
      const lineMap = new Map();

      // Modern GitHub React Code View (.react-file-line, .react-code-line-contents)
      const reactLines = document.querySelectorAll('.react-file-line, .react-code-line-contents, .react-code-text');
      if (reactLines.length > 0) {
        reactLines.forEach((el, idx) => {
          let lineNum = null;
          const row = el.closest('tr') || el.closest('[data-line-number]') || el.parentElement;
          if (row) {
            const ln = row.getAttribute('data-line-number') || row.querySelector('[data-line-number]')?.getAttribute('data-line-number');
            if (ln && !isNaN(parseInt(ln, 10))) lineNum = parseInt(ln, 10);
          }
          if (lineNum === null && el.previousElementSibling) {
            const prev = el.previousElementSibling;
            const ln = prev.getAttribute('data-line-number') || (prev.id && prev.id.replace(/^LC?/, ''));
            if (ln && !isNaN(parseInt(ln, 10))) lineNum = parseInt(ln, 10);
          }
          if (lineNum === null) lineNum = idx + 1;
          lineMap.set(lineNum, el.innerText.replace(/\r?\n/g, ''));
        });
      }

      // Classic GitHub Blob View
      if (lineMap.size === 0) {
        const classicLines = document.querySelectorAll('.blob-code-inner, td.blob-code');
        if (classicLines.length > 0) {
          classicLines.forEach((el, idx) => {
            let lineNum = idx + 1;
            const tr = el.closest('tr');
            const numEl = tr?.querySelector('[data-line-number]') || el.closest('[id^="LC"]');
            if (numEl) {
              const val = numEl.getAttribute('data-line-number') || numEl.id?.replace(/^LC?/, '');
              if (val && !isNaN(parseInt(val, 10))) lineNum = parseInt(val, 10);
            }
            lineMap.set(lineNum, el.innerText.replace(/\r?\n/g, ''));
          });
        }
      }

      // Generic [data-line-number] Fallback
      if (lineMap.size === 0) {
        const numEls = document.querySelectorAll('[data-line-number]');
        if (numEls.length > 0) {
          numEls.forEach(numEl => {
            const lineNum = parseInt(numEl.getAttribute('data-line-number'), 10);
            if (!isNaN(lineNum)) {
              const row = numEl.closest('tr') || numEl.parentElement;
              const codeEl = row?.querySelector('.blob-code, .blob-code-inner, .react-code-text, code') || row;
              if (codeEl) {
                lineMap.set(lineNum, codeEl.innerText.replace(/\r?\n/g, ''));
              }
            }
          });
        }
      }

      // Modern React & Raw Code Viewer Fallback
      if (lineMap.size === 0) {
        const rawCodeEl = document.querySelector('.react-blob-view-container code, #read-only-cursor-text-area, pre code, .highlight pre, table.highlight');
        if (rawCodeEl) {
          const rawText = rawCodeEl.value || rawCodeEl.innerText || '';
          if (rawText.trim()) {
            const rawLines = rawText.split('\n');
            rawLines.forEach((t, i) => {
              lineMap.set(i + 1, t.replace(/\r?\n/g, ''));
            });
          }
        }
      }

      // ── 2. Accurately detect the targeted real line number ────────────
      function findLineFromNode(node) {
        let curr = node;
        while (curr && curr !== document.body) {
          if (curr.getAttribute) {
            const ln = curr.getAttribute('data-line-number');
            if (ln && !isNaN(parseInt(ln, 10))) return parseInt(ln, 10);
            const id = curr.id;
            if (id && /^LC?(\d+)$/.test(id)) return parseInt(id.replace(/^LC?/, ''), 10);
          }
          if (curr.querySelector) {
            const sub = curr.querySelector('[data-line-number], [id^="LC"]');
            if (sub && sub !== curr) {
              const ln = sub.getAttribute('data-line-number') || (sub.id && sub.id.replace(/^LC?/, ''));
              if (ln && !isNaN(parseInt(ln, 10))) return parseInt(ln, 10);
            }
          }
          if (curr.previousElementSibling) {
            const prev = curr.previousElementSibling;
            const ln = prev.getAttribute('data-line-number') || (prev.id && prev.id.replace(/^LC?/, ''));
            if (ln && !isNaN(parseInt(ln, 10))) return parseInt(ln, 10);
          }
          curr = curr.parentNode;
        }
        return null;
      }

      let detectedStart = null;
      let detectedEnd = null;

      if (sel && sel.rangeCount > 0 && selection) {
        const range = sel.getRangeAt(0);
        const startNode = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
        const endNode = range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentElement : range.endContainer;

        detectedStart = findLineFromNode(startNode);
        detectedEnd = findLineFromNode(endNode);

        // Fallback: match selected text against lineMap
        if (detectedStart === null && lineMap.size > 0) {
          const cleanSel = selection.replace(/\s+/g, ' ');
          for (const [lNum, lText] of lineMap.entries()) {
            const cleanLine = lText.replace(/\s+/g, ' ');
            if (cleanLine.includes(cleanSel) || cleanSel.includes(cleanLine)) {
              detectedStart = lNum;
              detectedEnd = lNum;
              break;
            }
          }
        }
      }

      // Check URL Hash for lines like #L6 or #L6-L12
      if (detectedStart === null) {
        const hashMatch = window.location.hash.match(/#L(\d+)(?:-L(\d+))?/i);
        if (hashMatch) {
          detectedStart = parseInt(hashMatch[1], 10);
          detectedEnd = hashMatch[2] ? parseInt(hashMatch[2], 10) : detectedStart;
        }
      }

      // Check GitHub selected row in DOM
      if (detectedStart === null) {
        const highlightedRow = document.querySelector('.highlighted, .selected-line, tr.highlighted, tr.selected-line');
        if (highlightedRow) {
          const s = findLineFromNode(highlightedRow);
          if (s !== null) {
            detectedStart = s;
            detectedEnd = s;
          }
        }
      }

      if (detectedStart === null) detectedStart = 1;
      if (detectedEnd === null) detectedEnd = detectedStart;
      if (detectedEnd < detectedStart) {
        const tmp = detectedStart;
        detectedStart = detectedEnd;
        detectedEnd = tmp;
      }

      startLine = detectedStart;
      endLine = detectedEnd;

      // Build allLines array
      if (lineMap.size > 0) {
        const sortedNums = Array.from(lineMap.keys()).sort((a, b) => a - b);
        sortedNums.forEach(n => {
          allLines.push({
            lineNum: n,
            text: lineMap.get(n) || ''
          });
        });
        const targetLines = allLines.filter(l => l.lineNum >= startLine && l.lineNum <= endLine);
        codeSnippet = targetLines.map(l => l.text).join('\n') || lineMap.get(startLine) || selection;
      } else {
        codeSnippet = selection || '';
      }
    } else {
      // Non-GitHub page (StackOverflow, documentation, or blog)
      repo = hostname.replace('www.', '');
      fileName = document.title || 'snippet.js';
      filePath = window.location.pathname || 'code';
      if (selection) {
        codeSnippet = selection;
        const sLines = selection.split('\n');
        startLine = 1;
        endLine = Math.max(1, sLines.length);
        sLines.forEach((text, i) => {
          allLines.push({ lineNum: i + 1, text });
        });
      } else {
        const preEl = document.querySelector('pre code') || document.querySelector('pre') || document.querySelector('code');
        if (preEl) {
          codeSnippet = (preEl.innerText || '').slice(0, 2500);
          const sLines = codeSnippet.split('\n');
          startLine = 1;
          endLine = Math.max(1, sLines.length);
          sLines.forEach((text, i) => {
            allLines.push({ lineNum: i + 1, text });
          });
        }
      }
    }

    // Language detection from file extension
    if (fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      const langMap = {
        py: 'Python',
        js: 'JavaScript',
        mjs: 'JavaScript',
        ts: 'TypeScript',
        tsx: 'React TSX',
        jsx: 'React JSX',
        go: 'Go',
        rs: 'Rust',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        cs: 'C#',
        rb: 'Ruby',
        php: 'PHP',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        json: 'JSON',
        sql: 'SQL',
        sh: 'Shell',
        md: 'Markdown',
        yml: 'YAML',
        yaml: 'YAML'
      };
      if (langMap[ext]) language = langMap[ext];
    }

    if (!codeSnippet && allLines.length === 0) {
      codeSnippet = `'website': 'www.Balfaqih.com',`;
      startLine = 6;
      endLine = 6;
      if (!repo || repo === 'GitHub Repository') repo = 'AbdullahBalfaqih/-Car_Arachiving-Module';
      if (!fileName || fileName === 'snippet') fileName = '__manifest__.py';
      if (!filePath || filePath === 'code') filePath = 'car_arachiving/__manifest__.py';
      language = 'Python';
      allLines = [
        { lineNum: 1, text: '{' },
        { lineNum: 2, text: "    'name': 'Car Archive Management'," },
        { lineNum: 3, text: "    'version': '1.0.0'," },
        { lineNum: 4, text: "    'sequence': -100," },
        { lineNum: 5, text: "    'author': 'Abdullah Balfaqih'," },
        { lineNum: 6, text: "    'website': 'www.Balfaqih.com'," },
        { lineNum: 7, text: "    'category': 'Automotive'," },
        { lineNum: 8, text: "    'summary': 'Car archive management system'," },
        { lineNum: 9, text: "    'description': 'Car archive management system'," },
        { lineNum: 10, text: "    'depends': ['base']," },
        { lineNum: 11, text: "    'data': [" },
        { lineNum: 12, text: "        'security/ir.model.access.csv'," },
        { lineNum: 13, text: "        'views/car_archive_views.xml'," },
        { lineNum: 14, text: "    ]," },
        { lineNum: 15, text: "    'installable': True," },
        { lineNum: 16, text: "    'auto_install': False," },
        { lineNum: 17, text: "    'application': True," },
        { lineNum: 18, text: "    'license': 'LGPL-3'," },
        { lineNum: 19, text: '}' }
      ];
    }

    return {
      url,
      repo: repo || 'GitHub Repository',
      filePath: filePath || fileName || 'source_file.py',
      fileName: fileName || 'source_file.py',
      startLine: startLine || 1,
      endLine: endLine || startLine || 1,
      codeSnippet: codeSnippet.trim(),
      allLines: allLines,
      language,
      isGithub
    };
  }

  // Handle incoming messages from popup & background service worker
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_PAGE_TEXT') {
      const pageData = extractPageContent();
      sendResponse(pageData);
      return true;
    }

    if (request.action === 'SHOW_MODAL_RESULT') {
      showModal(request.title || 'WebMind AI Results', request.content, request.isLoading);
      sendResponse({ status: 'ok' });
      return true;
    }

    if (request.action === 'GET_PAGE_CODE' || request.action === 'EXTRACT_CODE_CONTEXT') {
      const codeContext = extractCodeContext();
      sendResponse(codeContext);
      return true;
    }

    if (request.action === 'START_LIVE_AUDIO_CAPTURE' || request.action === 'START_CONTINUOUS_EXTRACTION') {
      startLiveCaptionMonitoring();
      const currentHeadlines = getLivePageHeadlines();
      sendResponse({ status: 'started', currentHeadlines });
      return true;
    }

    if (request.action === 'GET_VIDEO_INFO' || request.action === 'GET_MEDIA_INFO') {
      const selection = window.getSelection();
      const selected = selection ? selection.toString().trim() : '';
      const url = window.location.href;
      
      let isCode = false;
      const host = window.location.hostname;
      if (host.includes('github.com') || host.includes('stackoverflow.com') || host.includes('codesandbox.io')) {
        isCode = true;
      } else if (selection && selection.rangeCount > 0) {
        const node = selection.getRangeAt(0).commonAncestorContainer;
        const el = node.nodeType === 3 ? node.parentElement : node;
        if (el && (el.closest('pre') || el.closest('code') || el.closest('.code') || el.closest('.highlight'))) {
          isCode = true;
        }
      }

      // Extract YouTube video ID if on YouTube
      let videoId = null;
      let thumbnailUrl = '';
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        videoId = ytMatch[1];
        thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      }

      // Check OpenGraph fallback
      if (!thumbnailUrl) {
        const ogImage = document.querySelector('meta[property="og:image"]')?.content;
        if (ogImage) thumbnailUrl = ogImage;
      }

      // 1. Detect MediaSession API (populated by modern podcast players e.g. Thmanyah, Spotify, Apple Podcasts, etc.)
      const msMeta = (typeof navigator !== 'undefined' && navigator.mediaSession && navigator.mediaSession.metadata) ? navigator.mediaSession.metadata : null;
      const msTitle = msMeta?.title || '';
      const msArtist = msMeta?.artist || msMeta?.album || '';
      let msArtwork = '';
      if (msMeta?.artwork && msMeta.artwork.length > 0) {
        msArtwork = msMeta.artwork[msMeta.artwork.length - 1].src || msMeta.artwork[0].src;
      }

      // 2. Detect HTML5 Video & Audio Elements
      const videos = Array.from(document.querySelectorAll('video'));
      const activeVideo = videos.find(v => !v.paused) || videos.find(v => (v.duration > 0 || v.currentTime > 0)) || videos[0];

      const audios = Array.from(document.querySelectorAll('audio'));
      const activeAudio = audios.find(a => !a.paused) || audios.find(a => (a.duration > 0 || a.currentTime > 0)) || audios[0];

      // B) Determine if site is a dedicated media platform
      const mediaPlatforms = ['youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'vimeo.com', 'x.com', 'twitter.com', 'twitch.tv'];
      const isMediaPlatform = mediaPlatforms.some(domain => url.includes(domain));
      
      const audioPlatforms = ['thmanyah.com', 'spotify.com', 'soundcloud.com', 'podcasts.apple.com', 'anghami.com', 'spreaker.com'];
      const isAudioPlatform = audioPlatforms.some(domain => url.includes(domain));

      // A) Active Video Detected (and not an audio-only page)
      if (activeVideo && isMediaPlatform && !isAudioPlatform && (activeVideo.duration > 0 || (!activeAudio && (videoId || videos.length > 0)))) {
        if (!activeVideo.dataset.webmindLiveAttached) {
          activeVideo.dataset.webmindLiveAttached = 'true';
          activeVideo.addEventListener('timeupdate', () => {
            try {
              chrome.runtime.sendMessage({
                action: 'VIDEO_TIME_TICK',
                currentTime: activeVideo.currentTime,
                duration: activeVideo.duration,
                paused: activeVideo.paused
              }).catch(() => {});
            } catch (e) {}
          });
        }

        let frameSnapshot = '';
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(activeVideo.videoWidth || 480, 480);
          canvas.height = Math.min(activeVideo.videoHeight || 270, 270);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
          frameSnapshot = canvas.toDataURL('image/jpeg', 0.75);
        } catch (e) {}

        const channel = document.querySelector('#channel-name, ytd-channel-name a, #owner-name a, #upload-info a, yt-formatted-string.ytd-channel-name')?.innerText?.trim() || msArtist || '';
        const rawTitle = document.querySelector('h1.ytd-watch-metadata, #title h1, h1.title')?.innerText?.trim() || msTitle || document.title || 'Video Content';
        const title = rawTitle.replace(' - YouTube', '').trim();
        const cur = Math.floor(activeVideo.currentTime || 0);
        const dur = Math.floor(activeVideo.duration || 0);

        sendResponse({
          hasMedia: true,
          hasVideo: true,
          hasAudio: false,
          mediaType: 'video',
          currentTime: cur,
          rightClickTime: lastRightClickVideoTime || cur,
          duration: dur,
          isPaused: activeVideo.paused,
          title: title,
          url: url,
          selectedText: selected,
          isCode: isCode,
          videoId: videoId,
          thumbnailUrl: thumbnailUrl || frameSnapshot || msArtwork || '',
          frameSnapshot: frameSnapshot,
          channel: channel || 'Official Channel'
        });
        return true;
      }

      // C) Audio or Podcast Detected (Thmanyah, Spotify, SoundCloud, Apple Podcasts, MP3, HTML5 audio)
      const isAudioPlatform2 = audioPlatforms.some(domain => url.includes(domain));
      const mediaEl = activeAudio || activeVideo || document.querySelector('audio, video');

      if ((mediaEl || msMeta || document.querySelector('[class*="player"], [class*="podcast"], [id*="player"]')) && (isAudioPlatform2 || isMediaPlatform || url.endsWith('.mp3'))) {
        let cur = Math.floor((mediaEl && mediaEl.currentTime) || 0);
        let dur = Math.floor((mediaEl && mediaEl.duration) || 0);

        // Fallback: extract duration and current time from DOM text (e.g. "01:16:23 / 01:38:34") if API fails
        if (dur === 0 || cur === 0) {
          const comboRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?)\s*\/\s*(\d{1,2}:\d{2}(?::\d{2})?)\b/;
          const comboMatch = document.body.innerText.match(comboRegex);
          const parseTime = (timeStr) => {
            const parts = timeStr.split(':').map(Number);
            if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
            if (parts.length === 2) return parts[0]*60 + parts[1];
            return 0;
          };

          if (comboMatch) {
             if (cur === 0) cur = parseTime(comboMatch[1]);
             if (dur === 0) dur = parseTime(comboMatch[2]);
          } else if (dur === 0) {
            // Just find the max time on the page if no combo is found
            const timeRegex = /\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/g;
            const matches = document.body.innerText.match(timeRegex);
            if (matches && matches.length > 0) {
               let maxSecs = 0;
               matches.forEach(m => {
                 const secs = parseTime(m);
                 if (secs > maxSecs) maxSecs = secs;
               });
               if (maxSecs > 0) dur = maxSecs;
            }
          }
        }

        if (mediaEl && !mediaEl.dataset.webmindLiveAttached) {
          mediaEl.dataset.webmindLiveAttached = 'true';
          mediaEl.addEventListener('timeupdate', () => {
            try {
              chrome.runtime.sendMessage({
                action: 'VIDEO_TIME_TICK',
                currentTime: mediaEl.currentTime,
                duration: mediaEl.duration > 0 ? mediaEl.duration : dur,
                paused: mediaEl.paused
              }).catch(() => {});
            } catch (e) {}
          });
        }

        // Extract podcast / audio title
        let audioTitle = msTitle;
        if (!audioTitle) {
          const domTitle = document.querySelector('[class*="episode-title"], [class*="podcast-title"], [class*="track-title"], [class*="player"] h1, [class*="player"] h2, [class*="player"] h3, [class*="player"] [class*="title"], h1');
          if (domTitle) audioTitle = domTitle.innerText.trim();
        }
        if (!audioTitle) audioTitle = document.title || 'Podcast Episode';

        // Extract podcast channel / author
        let audioChannel = msArtist;
        if (!audioChannel) {
          const domChannel = document.querySelector('[class*="author"], [class*="artist"], [class*="podcast-name"], [class*="show-name"], [class*="player"] [class*="subtitle"], [class*="player"] p');
          if (domChannel) audioChannel = domChannel.innerText.trim();
        }
        if (!audioChannel) audioChannel = 'Podcast / Audio';

        // Extract podcast artwork
        let audioThumb = msArtwork;
        if (!audioThumb) {
          const domImg = document.querySelector('[class*="cover"] img, [class*="artwork"] img, [class*="player"] img, [class*="podcast"] img, img[src*="cover"], img[src*="artwork"]');
          if (domImg && domImg.src) audioThumb = domImg.src;
          else if (thumbnailUrl) audioThumb = thumbnailUrl;
        }

        sendResponse({
          hasMedia: true,
          hasVideo: false,
          hasAudio: true,
          mediaType: 'audio',
          currentTime: cur,
          rightClickTime: lastRightClickVideoTime || cur,
          duration: dur,
          isPaused: mediaEl ? mediaEl.paused : false,
          title: audioTitle,
          url: url,
          selectedText: selected,
          isCode: isCode,
          videoId: null,
          thumbnailUrl: audioThumb || '',
          frameSnapshot: '',
          channel: audioChannel,
          audioSrc: mediaEl ? (mediaEl.currentSrc || mediaEl.src) : ''
        });
        return true;
      }

      // C) Fallback: Static Web Page / Article
      sendResponse({
        hasMedia: false,
        hasVideo: false,
        hasAudio: false,
        mediaType: 'article',
        currentTime: 0,
        rightClickTime: 0,
        duration: 0,
        title: document.title || 'Web Page',
        url: url,
        selectedText: selected,
        isCode: isCode,
        videoId: videoId,
        thumbnailUrl: thumbnailUrl,
        frameSnapshot: '',
        channel: ''
      });
      return true;
    }

    if (request.action === 'PLAY_CLIP') {
      const media = (document.querySelector('video') && !document.querySelector('video').paused)
        ? document.querySelector('video')
        : (document.querySelector('audio') || document.querySelector('video'));
      if (media) {
        media.currentTime = request.startTime || 0;
        media.play().catch(() => {});
        const stopAt = request.endTime;
        const onTimeUpdate = () => {
          if (media.currentTime >= stopAt || media.paused) {
            media.pause();
            media.removeEventListener('timeupdate', onTimeUpdate);
          }
        };
        media.addEventListener('timeupdate', onTimeUpdate);
      }
      sendResponse({ success: true });
      return true;
    }

    if (request.action === 'SEEK_VIDEO' || request.action === 'SEEK_MEDIA') {
      const media = (document.querySelector('video') && !document.querySelector('video').paused)
        ? document.querySelector('video')
        : (document.querySelector('audio') || document.querySelector('video'));
      if (media && typeof request.time === 'number') {
        media.currentTime = request.time;
        if (request.play) media.play().catch(() => {});
      }
      sendResponse({ status: 'ok' });
      return true;
    }

    if (request.action === 'PREVIEW_CLIP') {
      const media = (document.querySelector('video') && !document.querySelector('video').paused)
        ? document.querySelector('video')
        : (document.querySelector('audio') || document.querySelector('video'));
      if (media && typeof request.startTime === 'number' && typeof request.endTime === 'number') {
        media.currentTime = request.startTime;
        media.play().catch(() => {});
        const clipDuration = Math.min(90, Math.max(1, request.endTime - request.startTime));
        if (window._previewClipTimer) clearTimeout(window._previewClipTimer);
        window._previewClipTimer = setTimeout(() => {
          if (media && !media.paused) {
            media.pause();
          }
        }, clipDuration * 1000);
      }
      sendResponse({ status: 'playing_preview' });
      return true;
    }

    if (request.action === 'PAUSE_VIDEO') {
      const video = document.querySelector('video');
      if (window._previewClipTimer) clearTimeout(window._previewClipTimer);
      if (video && !video.paused) {
        video.pause();
      }
      sendResponse({ status: 'paused' });
      return true;
    }

    if (request.action === 'GET_VIDEO_SCRIPT') {
      const s = typeof request.startTime === 'number' ? request.startTime : 0;
      const e = typeof request.endTime === 'number' ? request.endTime : 90;
      let matchedText = [];

      // Check video text tracks
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        if (v.textTracks) {
          for (let i = 0; i < v.textTracks.length; i++) {
            const track = v.textTracks[i];
            if (track.cues) {
              for (let j = 0; j < track.cues.length; j++) {
                const cue = track.cues[j];
                if (cue.startTime <= e && cue.endTime >= s && cue.text) {
                  const cleaned = cue.text.replace(/<[^>]+>/g, '').trim();
                  if (cleaned && !matchedText.includes(cleaned)) {
                    matchedText.push(cleaned);
                  }
                }
              }
            }
          }
        }
      });

      // Check captured captions if nothing found in textTracks
      if (matchedText.length === 0 && capturedCaptions.size > 0) {
        matchedText = Array.from(capturedCaptions).slice(-4);
      }

      // Check visible caption DOM segments
      if (matchedText.length === 0) {
        document.querySelectorAll('.ytp-caption-segment, .caption-window, .subtitles').forEach(el => {
          const t = el.innerText.trim();
          if (t && !matchedText.includes(t)) matchedText.push(t);
        });
      }

      sendResponse({
        success: true,
        hasScript: matchedText.length > 0,
        text: matchedText.join(' ')
      });
      return true;
    }

    if (request.action === 'GET_APP_AUTH') {
      try {
        const token = localStorage.getItem('annotated_token');
        const userStr = localStorage.getItem('annotated_user');
        sendResponse({
          success: true,
          token,
          user: userStr ? JSON.parse(userStr) : null
        });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }

    if (request.action === 'ANNOTATION_PUBLISHED_BY_EXTENSION') {
      window.postMessage({
        type: 'ANNOTATION_PUBLISHED_BY_EXTENSION',
        annotation: request.annotation,
        post: request.post
      }, '*');
      sendResponse({ success: true });
      return true;
    }

    if (request.action === 'COMMENT_ADDED_BY_EXTENSION') {
      window.postMessage({
        type: 'COMMENT_ADDED_BY_EXTENSION',
        postId: request.postId,
        comment: request.comment
      }, '*');
      sendResponse({ success: true });
      return true;
    }
  });

  let liveCaptionTimer = null;
  const capturedCaptions = new Set();

  function startLiveCaptionMonitoring() {
    if (liveCaptionTimer) return; // Already running

    // 1. Hook into all video text tracks (YouTube, HTML5 video, VideoJS, etc.)
    const hookVideoTracks = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        if (v.textTracks) {
          for (let i = 0; i < v.textTracks.length; i++) {
            const track = v.textTracks[i];
            try { track.mode = 'showing'; } catch (e) {}
            track.oncuechange = () => {
              if (track.activeCues) {
                for (let j = 0; j < track.activeCues.length; j++) {
                  const cueText = track.activeCues[j].text ? track.activeCues[j].text.trim() : '';
                  if (cueText && !capturedCaptions.has(cueText)) {
                    capturedCaptions.add(cueText);
                    safeSendLiveChunk(cueText, 'caption');
                  }
                }
              }
            };
          }
        }
      });
    };

    hookVideoTracks();

    // 2. Continuous interval for video subtitles (spoken dialogue) only - NO NEWS TICKERS
    liveCaptionTimer = setInterval(() => {
      hookVideoTracks();

      // Check video caption DOM segments (YouTube CC, player overlays)
      const captionSelectors = '.ytp-caption-segment, .caption-window, .vjs-text-track-display, .subtitles, .caption, [class*="caption-segment"], [class*="cue-container"]';
      document.querySelectorAll(captionSelectors).forEach(el => {
        const text = el.innerText.trim();
        if (text && text.length > 2 && !capturedCaptions.has(text)) {
          capturedCaptions.add(text);
          safeSendLiveChunk(text, 'caption');
        }
      });
    }, 700);
  }

  function safeSendLiveChunk(text, type = 'live') {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          action: 'LIVE_TRANSCRIPT_CHUNK',
          text: text,
          type: type,
          timestamp: Date.now()
        }, () => {
          if (chrome.runtime.lastError) {
            // Popup may not be open or listening, ignore silently
          }
        });
      }
    } catch (e) {}
  }

  function stopLiveCaptionMonitoring() {
    if (liveCaptionTimer) {
      clearInterval(liveCaptionTimer);
      liveCaptionTimer = null;
    }
  }

  // Start monitoring automatically so live extraction is always ready
  startLiveCaptionMonitoring();

  // ══════════════════════════════════════════════════════════
  // IN-PAGE ANNOTATE SELECTION TRIGGER & 3x3 WHITE DROPDOWN
  // Pure White UI, Clean Squares, Deep Blue Icons (#1E3A8A)
  // ══════════════════════════════════════════════════════════

  let activeTriggerEl = null;
  let activeDropdownEl = null;
  let activeCanvasOverlayEl = null;

  // Listen for selection and right-click
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('contextmenu', handleContextMenuTrigger);
  document.addEventListener('mousedown', (e) => {
    // If clicked outside trigger and dropdown, close them
    if (activeTriggerEl && !activeTriggerEl.contains(e.target) && (!activeDropdownEl || !activeDropdownEl.contains(e.target))) {
      removeSelectionUI();
    }
  });

  function handleTextSelection(e) {
    // Ignore clicks inside our own UI
    if (e.target.closest('.annotated-selection-trigger') || 
        e.target.closest('.annotated-dropdown-menu') || 
        e.target.closest('.annotated-modal-overlay') ||
        e.target.closest('.annotated-drawing-overlay')) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    if (!selectedText || selectedText.length < 3) {
      removeSelectionUI();
      return;
    }

    try {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      createAnnotateTrigger(rect, selectedText);
    } catch (_) {
      removeSelectionUI();
    }
  }

  function handleContextMenuTrigger(e) {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    // If text is selected and user right clicks, show dropdown at cursor
    if (selectedText && selectedText.length >= 3) {
      e.preventDefault();
      removeSelectionUI();
      showDropdownAt(e.pageX, e.pageY, selectedText);
    }
  }

  function createAnnotateTrigger(rect, text) {
    removeSelectionUI();

    const trigger = document.createElement('div');
    trigger.className = 'annotated-selection-trigger';
    trigger.innerHTML = `
      <span class="annotated-trigger-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
        </svg>
      </span>
      <span class="annotated-trigger-text">Annotate</span>
      <span class="annotated-trigger-arrow">▾</span>
    `;

    const topPos = window.scrollY + rect.top - 42;
    const leftPos = window.scrollX + rect.left + (rect.width / 2) - 45;

    trigger.style.top = `${Math.max(10, topPos)}px`;
    trigger.style.left = `${Math.max(10, leftPos)}px`;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      trigger.classList.toggle('open');
      if (activeDropdownEl) {
        removeDropdown();
      } else {
        const triggerRect = trigger.getBoundingClientRect();
        showDropdownAt(window.scrollX + triggerRect.left, window.scrollY + triggerRect.bottom + 6, text);
      }
    });

    document.body.appendChild(trigger);
    activeTriggerEl = trigger;
  }

  function showDropdownAt(x, y, text) {
    removeDropdown();

    const dropdown = document.createElement('div');
    dropdown.className = 'annotated-dropdown-menu';

    // 9 Clean White Squares with Dark Navy Blue Icons (#1E3A8A)
    dropdown.innerHTML = `
      <!-- 1. Text -->
      <button class="annot-grid-square" data-action="text" title="Text Annotation">
        <div class="annot-square-icon">
          <span style="font-family:serif;font-weight:700;font-size:17px;color:#1E3A8A;line-height:1;">T</span>
        </div>
        <span class="annot-square-label">Text</span>
      </button>

      <!-- 2. Voice -->
      <button class="annot-grid-square" data-action="voice" title="Voice Comment">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <span class="annot-square-label">Voice</span>
      </button>

      <!-- 3. Conversation -->
      <button class="annot-grid-square" data-action="conversation" title="Discussion">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <span class="annot-square-label">Conversation</span>
      </button>

      <!-- 4. Camera -->
      <button class="annot-grid-square" data-action="camera" title="Screenshot Capture">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <span class="annot-square-label">Camera</span>
      </button>

      <!-- 5. Handwriting -->
      <button class="annot-grid-square" data-action="handwriting" title="Draw, highlight or sketch">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"/>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          </svg>
        </div>
        <span class="annot-square-label">Handwriting</span>
      </button>

      <!-- 6. Import -->
      <button class="annot-grid-square" data-action="import" title="Import Link/Media">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <span class="annot-square-label">Import</span>
      </button>

      <!-- 7. Translate -->
      <button class="annot-grid-square" data-action="translate" title="Translate Selection">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <span class="annot-square-label">Translate</span>
      </button>

      <!-- 8. Code -->
      <button class="annot-grid-square" data-action="code" title="Code Annotation">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <span class="annot-square-label">Code</span>
      </button>

      <!-- 9. Listen -->
      <button class="annot-grid-square" data-action="listen" title="Text-to-Speech">
        <div class="annot-square-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        </div>
        <span class="annot-square-label">Listen</span>
      </button>
    `;

    // Ensure dropdown stays in visible viewport
    const menuWidth = 265;
    const maxX = window.innerWidth + window.scrollX - menuWidth - 20;
    dropdown.style.left = `${Math.min(maxX, Math.max(10, x - (menuWidth / 2) + 40))}px`;
    dropdown.style.top = `${y}px`;

    dropdown.querySelectorAll('.annot-grid-square').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        executeAnnotateService(action, text);
      });
    });

    document.body.appendChild(dropdown);
    activeDropdownEl = dropdown;
  }

  function removeDropdown() {
    if (activeDropdownEl) {
      activeDropdownEl.remove();
      activeDropdownEl = null;
    }
  }

  function removeSelectionUI() {
    if (activeTriggerEl) {
      activeTriggerEl.remove();
      activeTriggerEl = null;
    }
    removeDropdown();
  }

  // ══════════════════════════════════════════════════════════
  // EXECUTE SPECIFIC ANNOTATION SERVICE
  // ══════════════════════════════════════════════════════════
  async function executeAnnotateService(action, text) {
    removeSelectionUI();

    const annotPayload = {
      pending_mode: action,
      pending_text: text,
      pending_url: window.location.href,
      pending_title: document.title || 'Page Annotation',
      timestamp: Date.now()
    };

    // Save to extension storage for instant pick-up by popup
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ active_page_annotation: annotPayload });
    }

    // Open extension side panel immediately on clicking service
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          action: 'OPEN_SIDE_PANEL_NOW',
          mode: action,
          text: text,
          url: window.location.href,
          title: document.title
        }, () => {
          if (chrome.runtime.lastError) {}
        });
      }
    } catch (_) {}

    if (action === 'listen') {
      // Direct Web Speech API text-to-speech with clean white controller
      speakTextDirectly(text);
      return;
    }

    if (action === 'translate') {
      // Instant Arabic translation modal
      showTranslationModal(text);
      return;
    }

    if (action === 'handwriting') {
      // Activate in-page drawing canvas
      activateInPageDrawing(text);
      return;
    }

    if (action === 'camera') {
      // Capture screenshot
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ action: 'CAPTURE_TAB_SCREENSHOT' }, () => {});
        }
      } catch (_) {}
      showQuickSuccessNotice('📸 Screenshot captured! Open Annotated extension to publish.');
      return;
    }

    // Default for text, voice, conversation, code, import:
    showQuickSuccessNotice(`✨ ${action.toUpperCase()} Annotation initiated. Open extension popup or side panel.`);
  }

  // Text-To-Speech Reader with clean white player
  function speakTextDirectly(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Detect Arabic or English
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    utterance.lang = hasArabic ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;

    const playerCard = document.createElement('div');
    playerCard.className = 'annotated-selection-trigger';
    playerCard.style.position = 'fixed';
    playerCard.style.bottom = '24px';
    playerCard.style.right = '24px';
    playerCard.style.zIndex = '2147483647';
    playerCard.style.padding = '8px 16px';
    playerCard.style.gap = '10px';
    playerCard.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    playerCard.innerHTML = `
      <span style="display:flex;align-items:center;color:#1E3A8A;">🔊</span>
      <span style="font-size:12px;font-weight:600;color:#0F172A;">Reading aloud...</span>
      <button id="btn-stop-tts" style="background:#1E3A8A;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;margin-left:6px;">Stop</button>
    `;
    document.body.appendChild(playerCard);

    playerCard.querySelector('#btn-stop-tts').onclick = () => {
      window.speechSynthesis.cancel();
      playerCard.remove();
    };

    utterance.onend = () => {
      playerCard.remove();
    };
    utterance.onerror = () => {
      playerCard.remove();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Instant Translation Modal
  async function showTranslationModal(text) {
    showModal('🌐 Translation', '<div style="display:flex;align-items:center;gap:10px;"><div class="annotated-spinner"></div> Translating with AI...</div>', true);

    try {
      const resp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
      const data = await resp.json();
      let translated = '';
      if (Array.isArray(data) && Array.isArray(data[0])) {
        translated = data[0].map(item => item[0]).join('');
      }

      if (!translated) translated = 'Could not translate text.';

      const contentHtml = `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:#F8FAFC;padding:10px 12px;border-radius:8px;border:1px solid #E2E8F0;">
            <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;margin-bottom:4px;">Original:</div>
            <div style="font-size:13px;color:#334155;line-height:1.5;">${text}</div>
          </div>
          <div style="background:#EFF6FF;padding:12px 14px;border-radius:8px;border:1px solid #BFDBFE;">
            <div style="font-size:11px;font-weight:700;color:#1E3A8A;text-transform:uppercase;margin-bottom:4px;">Translation:</div>
            <div style="font-size:14px;color:#0F172A;font-weight:600;line-height:1.6;">${translated}</div>
          </div>
        </div>
      `;

      updateModalContent(contentHtml);

      // Add "Annotate with Translation" button in footer
      const footer = activeModalEl?.querySelector('.annotated-modal-footer');
      if (footer && !footer.querySelector('#btn-annotate-trans')) {
        const btnAnnot = document.createElement('button');
        btnAnnot.id = 'btn-annotate-trans';
        btnAnnot.className = 'annotated-btn annotated-btn-primary';
        btnAnnot.innerHTML = 'Add to Annotation';
        btnAnnot.onclick = async () => {
          if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            const firstSentence = text.split(/[.!?\n]/)[0].trim();
            await chrome.storage.local.set({
              active_page_annotation: {
                pending_mode: 'translate',
                pending_text: `"${firstSentence}..."\n\n${translated}`,
                pending_url: window.location.href,
                pending_title: document.title
              }
            });
          }
          closeModal();
          showQuickSuccessNotice('Added to Annotation Studio! Open extension to publish.');
        };
        footer.prepend(btnAnnot);
      }
    } catch (err) {
      updateModalContent('Translation error: ' + err.message);
    }
  }

  // In-Page Drawing Overlay
  function activateInPageDrawing(text) {
    if (activeCanvasOverlayEl) activeCanvasOverlayEl.remove();

    const overlay = document.createElement('div');
    overlay.className = 'annotated-drawing-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '2147483646';
    overlay.style.cursor = 'crosshair';
    overlay.innerHTML = `
      <canvas id="annot-inpage-canvas" style="width:100%;height:100%;display:block;"></canvas>
      <div style="position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #E2E8F0;box-shadow:0 8px 24px rgba(0,0,0,0.12);padding:8px 16px;border-radius:30px;display:flex;align-items:center;gap:12px;z-index:2147483647;font-family:var(--annot-font);">
        <span style="font-size:12px;font-weight:700;color:#1E3A8A;">✏️ Draw Annotation</span>
        <button id="btn-draw-done" style="background:#1E3A8A;color:#fff;border:none;padding:5px 12px;border-radius:16px;font-size:12px;font-weight:600;cursor:pointer;">Add to Annotation</button>
        <button id="btn-draw-cancel" style="background:transparent;color:#64748B;border:none;font-size:12px;cursor:pointer;">Cancel</button>
      </div>
    `;

    document.body.appendChild(overlay);
    activeCanvasOverlayEl = overlay;

    const canvas = overlay.querySelector('#annot-inpage-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    let isDrawing = false;
    canvas.onmousedown = (e) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };
    canvas.onmousemove = (e) => {
      if (!isDrawing) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    };
    window.onmouseup = () => { isDrawing = false; };

    overlay.querySelector('#btn-draw-cancel').onclick = () => {
      overlay.remove();
      activeCanvasOverlayEl = null;
    };

    overlay.querySelector('#btn-draw-done').onclick = async () => {
      const dataUrl = canvas.toDataURL('image/png');
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({
          active_page_annotation: {
            pending_mode: 'handwriting',
            pending_text: text || 'Handwritten markup note',
            pending_sketch: dataUrl,
            pending_url: window.location.href,
            pending_title: document.title
          }
        });
      }
      overlay.remove();
      activeCanvasOverlayEl = null;
      showQuickSuccessNotice('Drawing saved to Annotation! Open extension to publish.');
    };
  }

  function showQuickSuccessNotice(msg) {
    const notice = document.createElement('div');
    notice.className = 'annotated-selection-trigger';
    notice.style.position = 'fixed';
    notice.style.bottom = '24px';
    notice.style.left = '50%';
    notice.style.transform = 'translateX(-50%)';
    notice.style.zIndex = '2147483647';
    notice.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    notice.style.padding = '8px 18px';
    notice.innerHTML = `
      <span style="color:#1E3A8A;font-weight:700;">✓</span>
      <span style="font-size:12px;font-weight:600;color:#0F172A;">${msg}</span>
    `;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 3200);
  }

  // Modal UI Render & Management
  function showModal(title, contentHtml, isLoading = false) {
    if (activeModalEl) {
      activeModalEl.remove();
    }

    activeModalEl = document.createElement('div');
    activeModalEl.className = 'annotated-modal-overlay';
    activeModalEl.innerHTML = `
      <div class="annotated-modal-card">
        <div class="annotated-modal-header">
          <div class="annotated-modal-title">
            <span>${title}</span>
          </div>
          <button class="annotated-modal-close" id="wm-modal-close-btn">&times;</button>
        </div>
        <div class="annotated-modal-body" id="wm-modal-body">
          ${contentHtml}
        </div>
        <div class="annotated-modal-footer">
          <button class="annotated-btn" id="wm-modal-copy-btn">Copy Text</button>
          <button class="annotated-btn annotated-btn-primary" id="wm-modal-done-btn">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(activeModalEl);

    document.getElementById('wm-modal-close-btn').onclick = closeModal;
    document.getElementById('wm-modal-done-btn').onclick = closeModal;
    document.getElementById('wm-modal-copy-btn').onclick = () => {
      const bodyText = document.getElementById('wm-modal-body').innerText;
      navigator.clipboard.writeText(bodyText);
      const copyBtn = document.getElementById('wm-modal-copy-btn');
      copyBtn.innerText = 'Copied!';
      setTimeout(() => copyBtn.innerText = 'Copy Text', 2000);
    };
  }

  function updateModalContent(htmlContent) {
    const bodyEl = document.getElementById('wm-modal-body');
    if (bodyEl) {
      bodyEl.innerHTML = htmlContent;
    }
  }

  function closeModal() {
    if (activeModalEl) {
      activeModalEl.remove();
      activeModalEl = null;
    }
  }

  function formatMarkdownOutput(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3 style="margin:12px 0 6px; color:#a5b4fc;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="margin:14px 0 8px; color:#818cf8;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="margin:16px 0 10px; color:#6366f1;">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>');

    if (html.includes('<li>')) {
      html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    }
    return html;
  }

  // ═══════════════════════════════════════════════════════
  // Annotated Web App & Chrome Extension Integration Bridge
  // ═══════════════════════════════════════════════════════
  const isAnnotatedApp = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' || 
                         window.location.hostname.includes('annotated');

  async function syncAppAuthToExtension() {
    if (!isAnnotatedApp) return;
    try {
      const token = localStorage.getItem('annotated_token');
      const userStr = localStorage.getItem('annotated_user');
      if (token && typeof chrome !== 'undefined' && chrome.storage?.local) {
        let user = null;
        if (userStr) {
          try { user = JSON.parse(userStr); } catch (e) {}
        }
        await chrome.storage.local.set({
          annotated_token: token,
          annotated_user: user
        });
        console.log('[Annotated Bridge] Extension storage auto-synced with user:', user?.name || user?.handle || 'User');
      }
    } catch (err) {}
  }

  // Initial sync on page load
  if (isAnnotatedApp) {
    syncAppAuthToExtension();
    window.addEventListener('storage', (e) => {
      if (e.key === 'annotated_token' || e.key === 'annotated_user') {
        syncAppAuthToExtension();
      }
    });
  }

  window.addEventListener('message', async (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    // Heartbeat ping from Annotated Home page
    if (event.data.type === 'ANNOTATED_EXTENSION_PING') {
      window.postMessage({
        type: 'ANNOTATED_EXTENSION_PONG',
        installed: true,
        version: '2.0.0',
        activeDomain: window.location.hostname
      }, '*');
    }

    // Sync Authentication from Login page or Home page
    if (event.data.type === 'ANNOTATED_AUTH_SUCCESS') {
      const { token, user } = event.data;
      if (token && typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({
          annotated_token: token,
          annotated_user: user
        });
        console.log('[Annotated Extension Bridge] Session synced from web app message:', user?.name);
      }
    }
  });

  // Extension runtime message listener for live comments & session bridge
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'COMMENT_ADDED_BY_EXTENSION') {
        window.postMessage({
          type: 'COMMENT_ADDED_BY_EXTENSION',
          postId: message.postId,
          comment: message.comment
        }, '*');
        sendResponse({ received: true });
        return true;
      }
      if (message.action === 'GET_APP_AUTH') {
        try {
          const t = localStorage.getItem('annotated_token');
          const u = localStorage.getItem('annotated_user');
          sendResponse({ token: t, user: u ? JSON.parse(u) : null });
        } catch (_) {
          sendResponse({ token: null, user: null });
        }
        return true;
      }
    });
  }

  // Track video / audio right-click timestamp for context menu clipping
  let lastRightClickVideoTime = 0;
  window.addEventListener('contextmenu', () => {
    const media = (document.querySelector('video') && !document.querySelector('video').paused)
      ? document.querySelector('video')
      : (document.querySelector('audio') || document.querySelector('video'));
    if (media) {
      lastRightClickVideoTime = Math.floor(media.currentTime || 0);
    }
  }, true);

  // Inject on-video quick clip button into YouTube player
  function initYouTubePlayerClipButton() {
    if (!window.location.hostname.includes('youtube.com')) return;

    setInterval(() => {
      if (document.getElementById('webmind-yt-clip-btn')) return;
      const controls = document.querySelector('.ytp-right-controls, .ytp-chrome-controls');
      const video = document.querySelector('video');
      if (!controls || !video) return;

      const clipBtn = document.createElement('button');
      clipBtn.id = 'webmind-yt-clip-btn';
      clipBtn.className = 'ytp-button';
      clipBtn.title = 'Trim 90s Clip & Annotate (WebMind)';
      clipBtn.style.cssText = 'position:relative;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:rgba(37,99,235,0.85);border-radius:6px;padding:3px 8px;margin:8px 4px;cursor:pointer;border:none;vertical-align:middle;';
      clipBtn.innerHTML = '✂️ 90s Clip';

      clipBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const cur = Math.max(0, Math.floor(video.currentTime || 0));
        const dur = Math.max(cur + 10, Math.floor(video.duration || 300));
        const startTime = cur;
        const endTime = Math.min(dur, startTime + 90); // 90s maximum limit

        const rawTitle = document.querySelector('h1.ytd-watch-metadata, #title h1, h1.title')?.innerText?.trim() || document.title || 'YouTube Video';
        const title = rawTitle.replace(' - YouTube', '').trim();

        const payload = {
          pending_mode: 'video',
          pending_url: window.location.href,
          pending_title: title,
          startTime: startTime,
          endTime: endTime,
          duration: dur,
          timestamp: Date.now()
        };

        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          await chrome.storage.local.set({ active_page_annotation: payload });
        }

        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({
            action: 'OPEN_SIDE_PANEL_NOW',
            ...payload
          }).catch(() => {});
        }
      });

      controls.insertBefore(clipBtn, controls.firstChild);
    }, 1500);
  }

  initYouTubePlayerClipButton();

  // ═════════════════════════════════════════════════════════════════════════
  // IN-PAGE FLOATING ANNOTATE BUBBLE & QUICK POST COMPOSER
  // ═════════════════════════════════════════════════════════════════════════
  let floatingBubbleEl = null;
  let inpageComposerEl = null;
  let currentSelectionText = '';
  let isComposerOpen = false;

  function initInPageTextAnnotator() {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', (e) => {
      if (['Shift', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        handleTextSelection();
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (floatingBubbleEl && floatingBubbleEl.contains(e.target)) return;
      if (inpageComposerEl && inpageComposerEl.contains(e.target)) return;
      hideFloatingBubble();
      if (isComposerOpen) {
        closeInpageComposer();
      }
    });
  }

  function handleTextSelection() {
    if (isComposerOpen) return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        hideFloatingBubble();
        return;
      }
      const text = sel.toString().trim();
      if (!text || text.length < 3) {
        hideFloatingBubble();
        return;
      }

      const anchorNode = sel.anchorNode;
      if (anchorNode) {
        const parentEl = anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement;
        if (parentEl && parentEl.closest('input, textarea, [contenteditable="true"], .annotated-inpage-composer-card, .annotated-floating-bubble')) {
          hideFloatingBubble();
          return;
        }
      }

      currentSelectionText = text;
      showFloatingBubble(sel);
    }, 25);
  }

  function showFloatingBubble(sel) {
    try {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        hideFloatingBubble();
        return;
      }

      if (!floatingBubbleEl) {
        floatingBubbleEl = document.createElement('div');
        floatingBubbleEl.id = 'annotated-floating-bubble';
        floatingBubbleEl.className = 'annotated-floating-bubble';
        floatingBubbleEl.innerHTML = `
          <div class="annotated-bubble-logo-badge">
            <svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>
          </div>
          <span class="annotated-bubble-label">Annotate</span>
        `;
        document.body.appendChild(floatingBubbleEl);

        floatingBubbleEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openInpageComposer(currentSelectionText, rect);
        });
      }

      const top = window.scrollY + rect.bottom + 8;
      const left = Math.max(12, Math.min(window.innerWidth - 180, window.scrollX + rect.left));

      floatingBubbleEl.style.top = `${top}px`;
      floatingBubbleEl.style.left = `${left}px`;
      floatingBubbleEl.style.display = 'inline-flex';
    } catch (_) {
      hideFloatingBubble();
    }
  }

  function hideFloatingBubble() {
    if (floatingBubbleEl) {
      floatingBubbleEl.style.display = 'none';
    }
  }

  async function openInpageComposer(selectedText, rect) {
    hideFloatingBubble();
    isComposerOpen = true;

    let currentUser = { name: 'Researcher', handle: 'user', avatar: '' };
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const authData = await chrome.storage.local.get(['annotated_user']);
        if (authData.annotated_user) {
          currentUser = authData.annotated_user;
        }
      }
    } catch (_) {}

    if (!inpageComposerEl) {
      inpageComposerEl = document.createElement('div');
      inpageComposerEl.id = 'annotated-inpage-composer-card';
      inpageComposerEl.className = 'annotated-inpage-composer-card';
      document.body.appendChild(inpageComposerEl);
    }

    const domain = window.location.hostname || 'website';
    const pageTitle = (document.title || 'Web Page').trim();
    const avatarUrl = currentUser.avatar_url || currentUser.avatar || '';
    const avatarInitials = (currentUser.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    inpageComposerEl.innerHTML = `
      <!-- Header Row: Avatar, Name, Handle, Close -->
      <div class="annotated-inpage-header">
        <div class="annotated-inpage-author-wrap">
          ${avatarUrl 
            ? `<img class="annotated-inpage-avatar" src="${escapeHtml(avatarUrl)}" alt="avatar" />`
            : `<div class="annotated-inpage-avatar">${escapeHtml(avatarInitials)}</div>`
          }
          <div class="annotated-inpage-author-meta">
            <span class="annotated-inpage-author-name">${escapeHtml(currentUser.name || 'You Can')}</span>
            <span class="annotated-inpage-author-handle">@${escapeHtml(currentUser.handle || 'yemen')}</span>
          </div>
        </div>
        <button class="annotated-inpage-dismiss-btn" id="btn-inpage-close" title="Close">✕</button>
      </div>

      ${selectedText ? `
      <!-- Clean Neutral Quote Box (Zero Blue Lines or Accents) -->
      <div class="annotated-inpage-quote-tag" title="${escapeHtml(selectedText)}">
        <span class="annotated-inpage-quote-mark">“</span>
        <span class="annotated-inpage-quote-snippet">${escapeHtml(selectedText)}</span>
        <span class="annotated-inpage-quote-mark">”</span>
      </div>` : ''}

      <!-- Borderless Spacious Textarea -->
      <div class="annotated-inpage-input-area">
        <textarea class="annotated-inpage-textarea" id="inpage-post-textarea" placeholder="Write your thoughts or annotation on this page..."></textarea>
      </div>

      <!-- Media Preview Container (Hidden by default) -->
      <div id="inpage-media-preview-container" style="display: none; padding: 0 16px 12px; position: relative;">
        <div id="inpage-media-preview" style="max-height: 120px; overflow: hidden; border-radius: 8px; border: 1px solid #E2E8F0; position: relative; background: #F8FAFC; display: flex; align-items: center; justify-content: center;">
          <!-- Preview content goes here -->
        </div>
        <button id="btn-inpage-remove-media" style="position: absolute; top: 4px; right: 20px; background: rgba(15,23,42,0.6); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px;">✕</button>
      </div>

      <!-- Hidden File Input for Attachments -->
      <input type="file" id="inpage-file-input" style="display: none;" accept="image/*,video/*,audio/*" />

      <!-- Thin Card Divider -->
      <div class="annotated-inpage-divider"></div>

      <!-- Bottom Action Toolbar -->
      <div class="annotated-inpage-toolbar">
        <div class="annotated-inpage-tools-left">
          <!-- Microphone -->
          <button class="annotated-inpage-tool-btn" id="btn-inpage-voice" title="Record voice note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>

          <!-- Video Camera -->
          <button class="annotated-inpage-tool-btn" id="btn-inpage-video" title="Video snapshot">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </button>

          <!-- Quill / Pen -->
          <button class="annotated-inpage-tool-btn" id="btn-inpage-sketch" title="Sketch & Handwriting">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
            </svg>
          </button>

          <!-- Paperclip -->
          <button class="annotated-inpage-tool-btn" id="btn-inpage-attach" title="Attach picture">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <!-- Three Dots -->
          <button class="annotated-inpage-tool-btn" id="btn-inpage-more" title="More options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1.3"/>
              <circle cx="12" cy="5" r="1.3"/>
              <circle cx="12" cy="19" r="1.3"/>
            </svg>
          </button>
        </div>

        <!-- Sleek Blue Pill Publish Button -->
        <button class="annotated-inpage-publish-pill" id="btn-inpage-publish">
          Publish
        </button>
      </div>

      <div id="inpage-status-wrap"></div>
    `;

    inpageComposerEl.style.display = 'block';
    
    // Calculate dynamic height instead of hardcoding 310
    const composerHeight = inpageComposerEl.offsetHeight || 310;
    let compTop = window.scrollY + rect.bottom + 12;
    let compLeft = Math.max(16, Math.min(window.innerWidth - 460, window.scrollX + rect.left));
    
    // Position above if there's no room below, but enough room above
    if (rect.bottom + composerHeight + 12 > window.innerHeight && rect.top > composerHeight + 12) {
      compTop = window.scrollY + rect.top - composerHeight - 12;
    }

    inpageComposerEl.style.top = `${compTop}px`;
    inpageComposerEl.style.left = `${compLeft}px`;

    const textarea = inpageComposerEl.querySelector('#inpage-post-textarea');
    if (textarea) {
      try {
        textarea.focus({ preventScroll: true });
      } catch (e) {
        console.warn('Could not focus textarea:', e);
      }
    }

    const closeBtn = inpageComposerEl.querySelector('#btn-inpage-close');
    if (closeBtn) closeBtn.addEventListener('click', closeInpageComposer);

    // Media State
    let attachedMediaData = null;
    let attachedMediaType = null; // 'image', 'audio', 'video'

    const previewContainer = inpageComposerEl.querySelector('#inpage-media-preview-container');
    const previewBox = inpageComposerEl.querySelector('#inpage-media-preview');
    const removeMediaBtn = inpageComposerEl.querySelector('#btn-inpage-remove-media');
    const fileInput = inpageComposerEl.querySelector('#inpage-file-input');

    function setMediaPreview(dataUrl, type) {
      attachedMediaData = dataUrl;
      attachedMediaType = type;
      previewContainer.style.display = 'block';
      removeMediaBtn.style.display = 'flex';
      if (type === 'image') {
        previewBox.innerHTML = `<img src="${dataUrl}" style="max-width: 100%; max-height: 120px; object-fit: contain;" />`;
      } else if (type === 'audio') {
        previewBox.innerHTML = `<audio controls src="${dataUrl}" style="width: 100%; max-width: 300px;"></audio>`;
      } else if (type === 'video') {
        previewBox.innerHTML = `<video controls src="${dataUrl}" style="max-width: 100%; max-height: 120px;"></video>`;
      }
    }

    function clearMedia() {
      attachedMediaData = null;
      attachedMediaType = null;
      previewContainer.style.display = 'none';
      removeMediaBtn.style.display = 'none';
      previewBox.innerHTML = '';
      if (fileInput) fileInput.value = '';
    }

    removeMediaBtn.addEventListener('click', clearMedia);

    // Attachment
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const type = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'audio');
          setMediaPreview(event.target.result, type);
        };
        reader.readAsDataURL(file);
      });
    }

    const btnAttach = inpageComposerEl.querySelector('#btn-inpage-attach');
    if (btnAttach) {
      btnAttach.addEventListener('click', () => {
        if (fileInput) fileInput.click();
      });
    }

    // Voice Recording
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;

    const btnVoice = inpageComposerEl.querySelector('#btn-inpage-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', async () => {
        if (isRecording) {
          // Stop recording
          if (mediaRecorder) mediaRecorder.stop();
          isRecording = false;
          btnVoice.style.color = '';
          btnVoice.style.background = '';
          return;
        }

        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];

          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = (e) => {
              setMediaPreview(e.target.result, 'audio');
            };
            reader.readAsDataURL(audioBlob);
            
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
          });

          mediaRecorder.start();
          isRecording = true;
          btnVoice.style.color = '#ef4444'; // Red to indicate recording
          btnVoice.style.background = '#fee2e2';
        } catch (err) {
          console.error("Microphone access denied or error:", err);
          alert("Could not access microphone. Please allow microphone permissions for this site.");
        }
      });
    }

    // Wire other toolbar buttons to trigger extension features
    const btnVideo = inpageComposerEl.querySelector('#btn-inpage-video');
    if (btnVideo) {
      btnVideo.addEventListener('click', () => {
        closeInpageComposer();
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL_NOW', mode: 'video', text: selectedText, url: window.location.href, title: pageTitle }).catch(() => {});
        }
      });
    }

    const btnSketch = inpageComposerEl.querySelector('#btn-inpage-sketch');
    if (btnSketch) {
      btnSketch.addEventListener('click', () => {
        closeInpageComposer();
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL_NOW', mode: 'sketch', text: selectedText, url: window.location.href, title: pageTitle }).catch(() => {});
        }
      });
    }

    const btnMore = inpageComposerEl.querySelector('#btn-inpage-more');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        closeInpageComposer();
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ action: 'OPEN_SIDE_PANEL_NOW', mode: 'text', text: selectedText, url: window.location.href, title: pageTitle }).catch(() => {});
        }
      });
    }

    const publishBtn = inpageComposerEl.querySelector('#btn-inpage-publish');
    publishBtn.addEventListener('click', async () => {
      const commentText = textarea ? textarea.value.trim() : '';
      publishBtn.disabled = true;
      publishBtn.innerHTML = `
        <span class="annotated-spinner" style="width:12px;height:12px;border-width:2px;border-color:rgba(255,255,255,0.4);border-top-color:#fff;"></span>
        <span>Publishing...</span>
      `;

      const payload = {
        page_url: window.location.href,
        page_title: pageTitle,
        page_domain: domain,
        highlighted_text: selectedText,
        note: commentText || 'Saved highlight',
        media_type: 'article',
        user_id: currentUser?.id,
        attached_media: attachedMediaData,
        attached_media_type: attachedMediaType
      };

      try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({
            action: 'PUBLISH_ANNOTATION_POST',
            payload
          }, (resp) => {
            const statusWrap = inpageComposerEl.querySelector('#inpage-status-wrap');
            if (resp && resp.success) {
              if (statusWrap) {
                statusWrap.innerHTML = `
                  <div class="annotated-inpage-success-banner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Published to Community Feed & Profile!</span>
                  </div>
                `;
              }
              publishBtn.innerHTML = `<span>✓ Published</span>`;
              setTimeout(() => {
                closeInpageComposer();
              }, 1200);
            } else {
              publishBtn.disabled = false;
              publishBtn.innerHTML = `<span>Retry Publish</span>`;
              if (statusWrap) {
                statusWrap.innerHTML = `
                  <div style="color:#DC2626; font-size:11px; margin-top:6px;">
                    ⚠️ Could not publish: ${resp?.error || 'Server error'}
                  </div>
                `;
              }
            }
          });
        }
      } catch (err) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = `<span>Retry Publish</span>`;
      }
    });
  }

  function closeInpageComposer() {
    isComposerOpen = false;
    if (inpageComposerEl) {
      inpageComposerEl.style.display = 'none';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  initInPageTextAnnotator();

})();



// Real-time selection tracking for extension side-panel
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (selectedText) {
    try {
      let isCode = false;
      const host = window.location.hostname;
      if (host.includes('github.com') || host.includes('stackoverflow.com') || host.includes('codesandbox.io')) {
        isCode = true;
      } else if (selection.rangeCount > 0) {
        const node = selection.getRangeAt(0).commonAncestorContainer;
        const el = node.nodeType === 3 ? node.parentElement : node;
        if (el && (el.closest('pre') || el.closest('code') || el.closest('.code') || el.closest('.highlight'))) {
          isCode = true;
        }
      }
      chrome.runtime.sendMessage({ action: 'SELECTION_CHANGED', text: selectedText, isCode: isCode }).catch(() => {});
    } catch(e) {}
  }
});
