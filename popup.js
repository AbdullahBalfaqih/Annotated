// WebMind AI - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  let activePageData = null;

  // DOM Elements
  const navButtons = document.querySelectorAll('.wm-nav-btn');
  const panels = document.querySelectorAll('.wm-panel');

  const pageTitleEl = document.getElementById('wm-page-title');
  const pageDomainEl = document.getElementById('wm-page-domain');
  const wordCountEl = document.getElementById('wm-word-count');
  const readTimeEl = document.getElementById('wm-read-time');
  const apiStatusEl = document.getElementById('wm-api-status');

  const btnSummarizeNow = document.getElementById('btn-summarize-now');
  const summaryResultBox = document.getElementById('summary-result-box');
  const summaryToolbar = document.getElementById('summary-actions-toolbar');
  const btnCopySummary = document.getElementById('btn-copy-summary');
  const btnDownloadSummary = document.getElementById('btn-download-summary');

  const chatHistoryList = document.getElementById('chat-history-list');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  const historyContainer = document.getElementById('history-items-container');
  const historySearch = document.getElementById('history-search');
  const btnClearHistory = document.getElementById('btn-clear-history');

  const apiKeyInput = document.getElementById('setting-api-key');
  const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility');
  const modelSelect = document.getElementById('setting-model');
  const lengthSelect = document.getElementById('setting-summary-length');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const saveToast = document.getElementById('save-toast');

  // ── Global Annotation State & Configurations ─────────────────
  const MAX_CLIP_DURATION = 90; // Video preview and clip annotation maximum limit: 90 seconds
  let currentAnnotationContext = {
    type: 'text', // Defaults to 'text' for generic websites, only 'video' on dedicated video sites
    startTime: 0,
    endTime: 30,
    duration: 300,
    mediaTitle: '',
    url: '',
    selectedText: '',
    screenshotUrl: '',
    voiceBlobUrl: null,
    attachedImageUrl: null
  };
  let lastDetectedVideoId = null;
  let lastDetectedTitle = null;
  let lastActiveTabId = null;
  let lastActiveTabUrl = null;

  // ── Video Platform Classification & Safe Messaging Helpers ──
  function isDedicatedVideoPlatform(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      const path = u.pathname.toLowerCase();
      
      if (host.includes('youtube.com') || host.includes('youtu.be')) return true;
      if (host.includes('tiktok.com')) return true;
      if (host.includes('instagram.com') && (path.includes('/reel') || path.includes('/tv/') || path.includes('/p/'))) return true;
      if (host.includes('vimeo.com')) return true;
      if (host.includes('twitch.tv')) return true;
      if (host.includes('dailymotion.com')) return true;
      if (host.includes('thmanyah.com') || host.includes('spotify.com') || host.includes('soundcloud.com') || host.includes('podcasts.apple.com') || host.includes('anghami.com') || host.includes('spreaker.com')) return true;
      return false;
    } catch (_) {
      return false;
    }
  }

  function getPlatformInfo(url, fallbackTitle = 'Web Page') {
    if (!url) return { name: fallbackTitle, domain: 'web', type: 'web', isDedicatedVideo: false };
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      const domain = host.replace(/^www\./, '');

      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        return { name: 'YouTube', domain, type: 'youtube', isDedicatedVideo: true };
      }
      if (host.includes('tiktok.com')) {
        return { name: 'TikTok', domain, type: 'tiktok', isDedicatedVideo: true };
      }
      if (host.includes('instagram.com')) {
        return { name: 'Instagram', domain, type: 'instagram', isDedicatedVideo: true };
      }
      if (host.includes('vimeo.com')) {
        return { name: 'Vimeo', domain, type: 'vimeo', isDedicatedVideo: true };
      }
      if (host.includes('twitch.tv')) {
        return { name: 'Twitch', domain, type: 'twitch', isDedicatedVideo: true };
      }
      if (host.includes('thmanyah.com') || host.includes('spotify.com') || host.includes('soundcloud.com') || host.includes('podcasts.apple.com') || host.includes('anghami.com') || host.includes('spreaker.com')) {
        return { name: 'Podcast', domain, type: 'audio', isDedicatedVideo: true };
      }
      if (host.includes('github.com')) {
        return { name: 'GitHub', domain, type: 'github', isDedicatedVideo: false };
      }

      let brand = domain.split('.')[0];
      brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      return { name: brand, domain, type: 'web', isDedicatedVideo: false };
    } catch (_) {
      return { name: fallbackTitle, domain: 'web', type: 'web', isDedicatedVideo: false };
    }
  }

  function safeTabSendMessage(tabId, message, callback) {
    if (!tabId || typeof chrome === 'undefined' || !chrome.tabs) {
      if (callback) callback(null);
      return;
    }
    try {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        // Accessing chrome.runtime.lastError explicitly clears unchecked errors
        const err = chrome.runtime.lastError;
        if (err) {
          if (callback) callback(null);
          return;
        }
        if (callback) callback(response);
      });
    } catch (e) {
      if (callback) callback(null);
    }
  }

  // Reliable Active Tab Resolver (Works in both Chrome Side Panel and Popup)
  async function getActiveWebTab() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return null;
    try {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (tab && tab.id && tab.url && !tab.url.startsWith('chrome-extension://')) return tab;
    } catch (_) {}
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && tab.url && !tab.url.startsWith('chrome-extension://')) return tab;
    } catch (_) {}
    try {
      const tabs = await chrome.tabs.query({});
      const activeWeb = tabs.find(t => t.active && t.url && (t.url.startsWith('http://') || t.url.startsWith('https://')));
      if (activeWeb) return activeWeb;
      const anyWeb = tabs.find(t => t.url && (t.url.startsWith('http://') || t.url.startsWith('https://')));
      if (anyWeb) return anyWeb;
    } catch (_) {}
    return null;
  }

  // Apply service selection or text action dispatched from page or context menu
  async function applyPageActionOrSelection(act) {
    if (!act) return;
    const mode = act.pending_mode || act.mode || 'text';
    const text = (act.pending_text || act.text || '').trim();
    const url = act.pending_url || act.url || '';
    const title = act.pending_title || act.title || '';

    if (url) currentAnnotationContext.url = url;
    if (title) currentAnnotationContext.mediaTitle = title;
    if (text) currentAnnotationContext.selectedText = text;
    if (typeof act.startTime === 'number') currentAnnotationContext.startTime = act.startTime;
    if (typeof act.endTime === 'number') currentAnnotationContext.endTime = Math.min(act.startTime + 90, act.endTime);
    if (typeof act.duration === 'number') currentAnnotationContext.duration = act.duration;
    if (mode === 'video' || (url && (url.includes('youtube.com') || url.includes('youtu.be')))) {
      currentAnnotationContext.type = 'video';
    }

    if (mode === 'conversation') {
      switchPanel('conversation');
    } else if (mode === 'handwriting') {
      switchPanel('handwriting', 'create-annotation');
    } else if (mode === 'translate') {
      switchPanel('translate');
      const translateCustomInput = document.getElementById('translate-custom-input');
      if (text && translateCustomInput) {
        translateCustomInput.value = text;
        if (typeof executeTranslation === 'function') executeTranslation(text);
      }
    } else if (mode === 'listen') {
      switchPanel('listen');
      const ttsCustomText = document.getElementById('tts-custom-text');
      const ttsSourceSelect = document.getElementById('tts-source-select');
      const ttsCustomWrap = document.getElementById('tts-custom-wrap');
      if (text && ttsCustomText && ttsSourceSelect) {
        ttsSourceSelect.value = 'custom';
        if (ttsCustomWrap) ttsCustomWrap.classList.remove('hidden');
        ttsCustomText.value = text;
        if (typeof speakText === 'function') speakText(text);
      }
    } else if (mode === 'import') {
      switchPanel('import');
      const importUrlInput = document.getElementById('import-url-input');
      if (url && importUrlInput) importUrlInput.value = url;
    } else {
      switchPanel('create-annotation', mode);
      if (typeof initCreateAnnotationPanel === 'function') {
        await initCreateAnnotationPanel(mode);
      }
    }
  }

  // Continuously synchronize UI with currently active browser tab / interface
  // Ensures NO stale sessions from old tabs are retained
  async function syncActiveInterface(force = false) {
    try {
      const tab = await getActiveWebTab();
      if (!tab || !tab.id) return;

      const isChanged = (tab.id !== lastActiveTabId) || (tab.url !== lastActiveTabUrl);
      if (!isChanged && !force) return;

      lastActiveTabId = tab.id;
      lastActiveTabUrl = tab.url;

      const isYT = !!(tab.url && (tab.url.includes('youtube.com') || tab.url.includes('youtu.be')));
      const cleanTabTitle = tab.title ? tab.title.replace(' - YouTube', '').trim() : '';

      // Reset stale session context for the newly active page
      currentAnnotationContext = {
        type: isYT ? 'video' : 'text',
        startTime: 0,
        endTime: 30,
        duration: 300,
        mediaTitle: cleanTabTitle,
        url: tab.url || '',
        selectedText: '',
        screenshotUrl: '',
        voiceBlobUrl: null,
        attachedImageUrl: null
      };

      const annotCommentInput = document.getElementById('annot-comment-input');
      if (annotCommentInput && isChanged) {
        annotCommentInput.value = '';
      }
      const customUrlInput = document.getElementById('annot-custom-url-input');
      if (customUrlInput) {
        customUrlInput.value = tab.url || '';
      }

      checkActiveTab(tab).catch(() => {});

      const createPanel = document.getElementById('panel-create-annotation');
      if (createPanel && createPanel.classList.contains('active')) {
        if (typeof initCreateAnnotationPanel === 'function') {
          await initCreateAnnotationPanel();
        }
      }
    } catch (e) {
      console.warn('syncActiveInterface error:', e);
    }
  }

  // Initialize Extension
  initTabs();
  initPanelTriggers();
  initCardsTrack();
  initHeroHeadlineSlider();
  loadAnnotatedUser();
  loadSettings().catch(() => {});
  checkActiveTab().catch(() => {});
  loadHistory().catch(() => {});

  const initialActivePanel = document.querySelector('.wm-panel.active');
  if (initialActivePanel && initialActivePanel.id === 'panel-voice' && typeof initVoicePanel === 'function') {
    initVoicePanel();
  }

  // Check if opened with pending action from storage
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const pageAct = await chrome.storage.local.get(['active_page_annotation']);
      if (pageAct && pageAct.active_page_annotation) {
        const act = pageAct.active_page_annotation;
        await chrome.storage.local.remove(['active_page_annotation']);
        await applyPageActionOrSelection(act);
      }
    }
  } catch (actErr) {
    console.warn('Active page action check error:', actErr);
  }

  // Listen to live runtime broadcasts (e.g. user clicked service menu while side panel is already open)
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && (msg.action === 'APPLY_PAGE_ACTION' || msg.action === 'OPEN_SIDE_PANEL_NOW')) {
        applyPageActionOrSelection(msg);
        sendResponse({ status: 'ok' });
      }
    });
  }

  // Storage listener fallback for action dispatch
  if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.active_page_annotation?.newValue) {
        const val = changes.active_page_annotation.newValue;
        chrome.storage.local.remove(['active_page_annotation']).catch(() => {});
        applyPageActionOrSelection(val);
      }
    });
  }

  // Auto-sync tab switches and navigations: DO NOT retain old sessions
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.onActivated.addListener(() => {
      syncActiveInterface(true);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' || changeInfo.url) {
        syncActiveInterface(true);
      }
    });
    if (chrome.windows?.onFocusChanged) {
      chrome.windows.onFocusChanged.addListener((winId) => {
        if (winId !== chrome.windows.WINDOW_ID_NONE) {
          syncActiveInterface(true);
        }
      });
    }
  }

  // Keep synced across YouTube single-page video changes (every 1200ms)
  setInterval(() => {
    syncActiveInterface(false);
  }, 1200);

  // ── Panel Switcher ───────────────────────────
  function switchPanel(targetPanel, extraMode = null) {
    panels.forEach(p => p.classList.remove('active'));
    const matchPanel = document.getElementById(`panel-${targetPanel}`);
    if (matchPanel) matchPanel.classList.add('active');
    if (targetPanel === 'history') loadHistory();
    if (targetPanel === 'voice' && typeof initVoicePanel === 'function') initVoicePanel();
    if (targetPanel === 'create-annotation' && typeof initCreateAnnotationPanel === 'function') initCreateAnnotationPanel(extraMode);
    if (targetPanel === 'conversation' && typeof initConversationPanel === 'function') initConversationPanel();
    if (targetPanel === 'handwriting' && typeof initHandwritingPanel === 'function') initHandwritingPanel(extraMode);
    if (targetPanel === 'code' && typeof initCodeReviewPanel === 'function') initCodeReviewPanel();
    if (targetPanel === 'listen' && typeof initListenPanel === 'function') initListenPanel();
    if (targetPanel === 'translate' && typeof initTranslatePanel === 'function') initTranslatePanel();
  }

  function initTabs() {
    // no bottom nav buttons needed
  }

  // ── Helper to query active web app tabs for session ──
  async function syncSessionFromWebTabs() {
    if (typeof chrome === 'undefined' || !chrome.tabs) return null;
    try {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (!tab.url) continue;
        if (tab.url.includes('localhost:3000') || tab.url.includes('127.0.0.1:3000') || tab.url.includes('annotated')) {
          // 1. Try sending message to content script
          try {
            const resp = await new Promise((resolve) => {
              safeTabSendMessage(tab.id, { action: 'GET_APP_AUTH' }, (r) => {
                resolve(r);
              });
            });
            if (resp && resp.token) {
              if (chrome.storage?.local) {
                await chrome.storage.local.set({ annotated_token: resp.token, annotated_user: resp.user });
              }
              return { token: resp.token, user: resp.user };
            }
          } catch (e) {}

          // 2. Scripting fallback
          if (chrome.scripting && tab.id) {
            try {
              const [res] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                  try {
                    const t = localStorage.getItem('annotated_token');
                    const u = localStorage.getItem('annotated_user');
                    return { token: t, user: u ? JSON.parse(u) : null };
                  } catch (err) { return null; }
                }
              });
              if (res?.result?.token) {
                if (chrome.storage?.local) {
                  await chrome.storage.local.set({
                    annotated_token: res.result.token,
                    annotated_user: res.result.user
                  });
                }
                return res.result;
              }
            } catch (err) {}
          }
        }
      }
    } catch (e) {
      console.warn('Error querying tabs for auth session:', e);
    }
    return null;
  }

  // ── Sync User Auth from Annotated Web App & Database ──
  async function loadAnnotatedUser() {
    try {
      const greetingEl = document.querySelector('.hero-hello');
      const authorNameEl = document.getElementById('comment-author-name');
      const authorHandleEl = document.getElementById('comment-author-handle');
      const authorAvatarEl = document.getElementById('comment-avatar-img');
      const publishedAuthorEl = document.getElementById('published-author-name');

      const applyUserData = (user) => {
        if (!user) return;
        const realName = user.name || user.handle || 'Researcher';
        if (greetingEl) {
          greetingEl.innerHTML = `Hello, <strong>${realName}</strong> <span style="display:inline-block;width:8px;height:8px;background:#22c55e;border-radius:50%;margin-left:4px;box-shadow:0 0 6px rgba(34,197,94,0.6);" title="Synced with Annotated Database"></span>`;
        }
        if (authorNameEl) authorNameEl.textContent = realName;
        if (authorHandleEl) authorHandleEl.textContent = `@${user.handle || 'researcher'}`;
        if (authorAvatarEl && user.avatar_url) authorAvatarEl.src = user.avatar_url;
        if (publishedAuthorEl) publishedAuthorEl.textContent = realName;
      };

      // 1. Check local storage cache
      let data = {};
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        data = await chrome.storage.local.get(['annotated_user', 'annotated_token']);
      }

      if (data.annotated_user) {
        applyUserData(data.annotated_user);
      }

      // 2. If user or token missing, actively query open tabs
      let token = data.annotated_token;
      let user = data.annotated_user;

      if (!user || !token) {
        const synced = await syncSessionFromWebTabs();
        if (synced?.user) {
          user = synced.user;
          applyUserData(user);
        }
        if (synced?.token) {
          token = synced.token;
        }
      }

      // 3. If token is available, verify & fetch fresh profile from PostgreSQL /api/auth/me
      if (token) {
        try {
          const resp = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const meData = await resp.json();
          if (meData?.success && meData?.user) {
            user = meData.user;
            applyUserData(user);
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
              await chrome.storage.local.set({ annotated_user: user });
            }
          }
        } catch (fetchErr) {
          console.warn('Could not verify token with /api/auth/me:', fetchErr);
        }
      }

      // If still no user, show login prompt and poll open tabs
      if (!user && greetingEl) {
        greetingEl.innerHTML = `Hello, <strong>Guest</strong> <a href="http://localhost:3000/home" target="_blank" style="margin-left:6px;font-size:11px;font-weight:600;text-decoration:underline;color:#ffffff;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:12px;">Sync Account</a>`;
        if (!window._authPollingTimer) {
          window._authPollingTimer = setInterval(async () => {
            const synced = await syncSessionFromWebTabs();
            if (synced?.user) {
              clearInterval(window._authPollingTimer);
              window._authPollingTimer = null;
              loadAnnotatedUser();
            }
          }, 2000);
        }
      } else if (user) {
        if (window._authPollingTimer) {
          clearInterval(window._authPollingTimer);
          window._authPollingTimer = null;
        }
      }

      // Listen for runtime updates from login/home tabs
      if (typeof chrome !== 'undefined' && chrome.storage?.onChanged && !window._authStorageListenerAdded) {
        window._authStorageListenerAdded = true;
        chrome.storage.onChanged.addListener((changes, area) => {
          if (area === 'local' && (changes.annotated_user || changes.annotated_token)) {
            loadAnnotatedUser();
          }
        });
      }
    } catch (err) {
      console.warn('Could not sync user with popup:', err);
    }
  }

  // ── Panel Navigation Triggers ─────────────────
  function initPanelTriggers() {
    document.querySelectorAll('[data-panel]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.panel;
        const mode = btn.dataset.mode || null;
        if (target) switchPanel(target, mode);
      });
    });
  }

  // ── 3x3 Grid Cards Click & Active State ─────────
  function initCardsTrack() {
    const cards = document.querySelectorAll('.sc-box');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('sc-selected'));
        card.classList.add('sc-selected');
        const target = card.dataset.panel;
        const mode = card.dataset.mode || null;
        if (target) switchPanel(target, mode);
      });
    });
  }

  // ── Hero Headline Auto-Slider (Every 4 seconds from Right to Left) ─────
  function initHeroHeadlineSlider() {
    const track = document.getElementById('hero-slider-track');
    const slides = document.querySelectorAll('.hero-slide');
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 4000);
  }

  // Check Active Chrome Tab
  async function checkActiveTab(providedTab = null) {
    try {
      if (typeof chrome === 'undefined' || !chrome.tabs) return;
      const tab = providedTab || await getActiveWebTab();
      if (!tab) return;

      if (pageTitleEl) pageTitleEl.innerText = tab.title || 'Current web page';
      if (pageDomainEl) {
        try {
          pageDomainEl.innerText = tab.url ? new URL(tab.url).hostname : 'website';
        } catch (_) {
          pageDomainEl.innerText = 'website';
        }
      }

      if (tab.id) {
        safeTabSendMessage(tab.id, { action: 'GET_PAGE_TEXT' }, (response) => {
          if (!response) {
            if (wordCountEl) wordCountEl.innerText = 'N/A';
            if (readTimeEl) readTimeEl.innerText = '-- min';
            return;
          }
          activePageData = response;
          if (pageTitleEl) pageTitleEl.innerText = response.title || tab.title;
          if (pageDomainEl) pageDomainEl.innerText = response.domain || 'website';
          if (wordCountEl) wordCountEl.innerText = `${response.wordCount.toLocaleString()} words`;
          if (readTimeEl) readTimeEl.innerText = `${response.readingTimeMinutes} min read`;
        });
      }
    } catch (err) {
      console.warn('Could not inspect tab:', err);
    }
  }

  // Load User Settings
  async function loadSettings() {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage) return;
      const settings = await chrome.storage.sync.get(['apiKey', 'model', 'summaryLength']);
      if (settings.apiKey) {
        apiKeyInput.value = settings.apiKey;
        if (apiStatusEl) {
          apiStatusEl.classList.add('active');
          const st = apiStatusEl.querySelector('.status-text');
          if (st) st.innerText = 'Gemini API active';
        }
      } else {
        if (apiStatusEl) {
          apiStatusEl.classList.remove('active');
          const st = apiStatusEl.querySelector('.status-text');
          if (st) st.innerText = 'Demo mode';
        }
      }
      if (settings.model && modelSelect) modelSelect.value = settings.model;
      if (settings.summaryLength && lengthSelect) lengthSelect.value = settings.summaryLength;
    } catch (err) {
      console.warn('Could not load settings:', err);
    }
  }

  // Save Settings
  btnSaveSettings.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    const summaryLength = lengthSelect.value;

    await chrome.storage.sync.set({ apiKey, model, summaryLength });
    
    saveToast.classList.remove('hidden');
    setTimeout(() => saveToast.classList.add('hidden'), 2500);

    loadSettings();
  });

  toggleKeyVisibilityBtn.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      toggleKeyVisibilityBtn.innerText = 'Hide';
    } else {
      apiKeyInput.type = 'password';
      toggleKeyVisibilityBtn.innerText = 'Show';
    }
  });

  // Summarize Now Action
  btnSummarizeNow.addEventListener('click', async () => {
    if (!activePageData || !activePageData.text) {
      summaryResultBox.innerHTML = '<div class="wm-placeholder">⚠️ Unable to access current page text. Try refreshing the page.</div>';
      return;
    }

    summaryResultBox.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <div class="webmind-loading-spinner" style="display:inline-block; width:24px; height:24px; border:3px solid rgba(255,255,255,0.2); border-top-color:#06b6d4; border-radius:50%; animation:wmSpin 0.8s linear infinite;"></div>
        <p style="margin-top:12px; font-size:12px; color:#94a3b8;">Analyzing and summarizing page with AI...</p>
      </div>
    `;
    summaryToolbar.classList.add('hidden');

    chrome.runtime.sendMessage(
      {
        action: 'RUN_PAGE_SUMMARY',
        text: activePageData.text,
        title: activePageData.title,
        url: activePageData.url
      },
      (response) => {
        if (chrome.runtime.lastError) {
          summaryResultBox.innerHTML = `<div class="wm-placeholder">Error: ${chrome.runtime.lastError.message}</div>`;
          return;
        }

        if (response && response.summary) {
          summaryResultBox.innerHTML = formatMarkdownOutput(response.summary);
          summaryToolbar.classList.remove('hidden');
        } else if (response && response.error) {
          summaryResultBox.innerHTML = `<div class="wm-placeholder">Error during summarization: ${response.error}</div>`;
        }
      }
    );
  });

  // Copy & Download Summary
  btnCopySummary.addEventListener('click', () => {
    const text = summaryResultBox.innerText;
    navigator.clipboard.writeText(text);
    btnCopySummary.innerText = 'Copied';
    setTimeout(() => btnCopySummary.innerText = 'Copy', 2000);
  });

  btnDownloadSummary.addEventListener('click', () => {
    const text = summaryResultBox.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${(activePageData?.title || 'page').substring(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // AI Chat Functionality
  chatSendBtn.addEventListener('click', handleChatSubmit);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
  });

  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chatInput.value = chip.dataset.prompt;
      handleChatSubmit();
    });
  });

  function handleChatSubmit() {
    const query = chatInput.value.trim();
    if (!query) return;

    appendChatBubble('user', query);
    chatInput.value = '';

    const botLoadingBubble = appendChatBubble('bot', 'Thinking and formulating answer...');

    chrome.runtime.sendMessage(
      {
        action: 'ASK_AI_CHAT',
        query,
        contextText: activePageData ? activePageData.text : ''
      },
      (response) => {
        if (response && response.reply) {
          botLoadingBubble.innerHTML = formatMarkdownOutput(response.reply);
        } else if (response && response.error) {
          botLoadingBubble.innerText = 'Error: ' + response.error;
        } else {
          botLoadingBubble.innerText = 'Sorry, could not process request.';
        }
        chatHistoryList.scrollTop = chatHistoryList.scrollHeight;
      }
    );
  }

  function appendChatBubble(role, text) {
    const bubble = document.createElement('div');
    bubble.className = `wm-chat-bubble ${role}`;
    bubble.innerHTML = text;
    chatHistoryList.appendChild(bubble);
    chatHistoryList.scrollTop = chatHistoryList.scrollHeight;
    return bubble;
  }

  // Load History List
  async function loadHistory(filterQuery = '') {
    const data = await chrome.storage.local.get(['wm_history']);
    const history = data.wm_history || [];

    historyContainer.innerHTML = '';

    const filtered = history.filter(item => 
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      historyContainer.innerHTML = '<div class="wm-empty-state">No matching summaries found.</div>';
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <div class="history-card-header">
          <span class="history-card-title">${item.title}</span>
          <span class="history-card-date">${item.timestamp}</span>
        </div>
        <div class="history-card-snippet">${item.summary.substring(0, 100)}...</div>
      `;

      card.addEventListener('click', () => {
        // Open in Summary Tab
        document.querySelector('[data-tab="summary"]').click();
        summaryResultBox.innerHTML = formatMarkdownOutput(item.summary);
        summaryToolbar.classList.remove('hidden');
      });

      historyContainer.appendChild(card);
    });
  }

  historySearch.addEventListener('input', (e) => {
    loadHistory(e.target.value);
  });

  btnClearHistory.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all saved summaries?')) {
      await chrome.storage.local.set({ wm_history: [] });
      loadHistory();
    }
  });

  function formatMarkdownOutput(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3 style="margin:10px 0 4px; color:#a5b4fc;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="margin:12px 0 6px; color:#818cf8;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="margin:14px 0 8px; color:#6366f1;">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>');
  }

  // ── Translate Feature ──────────────────────────
  const translateTargetLang = document.getElementById('translate-target-lang');
  const btnTranslatePage = document.getElementById('btn-translate-page');
  const translateCustomInput = document.getElementById('translate-custom-input');
  const btnTranslateCustom = document.getElementById('btn-translate-custom');
  const translateResultBox = document.getElementById('translate-result-box');
  const translateActionsToolbar = document.getElementById('translate-actions-toolbar');
  const btnCopyTranslate = document.getElementById('btn-copy-translate');
  const btnSpeakTranslate = document.getElementById('btn-speak-translate');

  let lastTranslatedOriginalText = '';

  async function executeTranslation(textToTranslate) {
    if (!textToTranslate || !textToTranslate.trim()) {
      translateResultBox.innerHTML = '<div class="wm-placeholder">⚠️ Please enter text to translate or open a valid page.</div>';
      return;
    }
    lastTranslatedOriginalText = textToTranslate.trim();
    const targetLang = translateTargetLang ? translateTargetLang.value : 'English';
    translateResultBox.innerHTML = `
      <div style="text-align: center; padding: 24px 0;">
        <div class="wm-spinner" style="margin: 0 auto 10px;"></div>
        <p style="font-size:12px; color:#64748b; font-weight:500;">Translating to ${targetLang}...</p>
      </div>
    `;
    if (translateActionsToolbar) translateActionsToolbar.classList.add('hidden');

    chrome.runtime.sendMessage(
      {
        action: 'PROCESS_TEXT_ACTION',
        type: 'TRANSLATE',
        text: textToTranslate.substring(0, 7000),
        options: { targetLang }
      },
      async (res) => {
        let result = res?.result;
        if (chrome.runtime.lastError || !res || res.error || !result || result.includes('Add your Gemini API Key')) {
          try {
            const langMap = {
              'arabic': 'ar', 'ar': 'ar', 'english': 'en', 'en': 'en',
              'french': 'fr', 'fr': 'fr', 'spanish': 'es', 'es': 'es',
              'german': 'de', 'de': 'de', 'turkish': 'tr', 'tr': 'tr',
              'japanese': 'ja', 'ja': 'ja', 'chinese': 'zh-CN', 'zh': 'zh-CN'
            };
            const tl = langMap[targetLang.toLowerCase()] || 'en';
            const fetchResp = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(textToTranslate.substring(0, 5000))}`);
            const data = await fetchResp.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
              const trans = data[0].filter(Boolean).map(item => item[0] || '').join('');
              if (trans) {
                result = `🌐 **Translation (${targetLang}):**\n${trans}`;
              }
            }
          } catch (e) {
            console.error('Direct translation fallback error:', e);
          }
        }

        if (!result) {
          translateResultBox.innerHTML = `<div class="wm-placeholder">Translation error: ${res?.error || chrome.runtime.lastError?.message || 'Could not complete translation.'}</div>`;
          return;
        }

        translateResultBox.innerHTML = formatMarkdownOutput(result);
        if (translateActionsToolbar) translateActionsToolbar.classList.remove('hidden');
      }
    );
  }

  function initTranslatePanel() {
    let txtToTranslate = '';
    if (activePageData && activePageData.selectedText) {
      txtToTranslate = activePageData.selectedText;
    } else if (currentAnnotationContext && currentAnnotationContext.selectedText) {
      txtToTranslate = currentAnnotationContext.selectedText;
    }
    
    if (txtToTranslate) {
      if (translateCustomInput) {
        translateCustomInput.value = txtToTranslate;
      }
      executeTranslation(txtToTranslate);
    }
  }

  if (btnTranslatePage) {
    btnTranslatePage.addEventListener('click', () => {
      const text = activePageData ? activePageData.text : '';
      executeTranslation(text);
    });
  }

  if (btnTranslateCustom) {
    btnTranslateCustom.addEventListener('click', () => {
      const text = translateCustomInput ? translateCustomInput.value.trim() : '';
      executeTranslation(text);
    });
  }

  if (btnCopyTranslate) {
    btnCopyTranslate.addEventListener('click', () => {
      const text = translateResultBox.innerText;
      navigator.clipboard.writeText(text);
      btnCopyTranslate.innerText = 'Copied!';
      setTimeout(() => btnCopyTranslate.innerText = 'Copy', 2000);
    });
  }

  if (btnSpeakTranslate) {
    btnSpeakTranslate.addEventListener('click', () => {
      const text = translateResultBox.innerText;
      if (text) speakText(text);
    });
  }

  // ── Code Assistant Feature ─────────────────────
  const btnExtractPageCode = document.getElementById('btn-extract-page-code');
  const codeCustomInput = document.getElementById('code-custom-input');
  const btnCodeExplain = document.getElementById('btn-code-explain');
  const btnCodeDebug = document.getElementById('btn-code-debug');
  const btnCodeOptimize = document.getElementById('btn-code-optimize');
  const codeResultBox = document.getElementById('code-result-box');
  const codeActionsToolbar = document.getElementById('code-actions-toolbar');
  const btnCopyCode = document.getElementById('btn-copy-code');

  if (btnExtractPageCode) {
    btnExtractPageCode.addEventListener('click', async () => {
      try {
        if (typeof chrome === 'undefined' || !chrome.tabs) return;
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.id) return;

        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              const blocks = Array.from(document.querySelectorAll('pre, code, .highlight, .blob-code'))
                .map(el => el.innerText.trim())
                .filter(t => t.length > 20);
              return blocks.slice(0, 8).join('\n\n// -----------------------------\n\n');
            }
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              codeCustomInput.value = results[0].result;
              codeResultBox.innerHTML = '<div class="wm-placeholder">Code extracted successfully. Select an action above.</div>';
            } else {
              codeResultBox.innerHTML = '<div class="wm-placeholder">No code tags (pre/code) found on this page. You can paste code manually.</div>';
            }
          }
        );
      } catch (err) {
        console.warn('Extract code error:', err);
      }
    });
  }

  async function executeCodeAction(taskType, label) {
    const code = codeCustomInput ? codeCustomInput.value.trim() : '';
    if (!code) {
      codeResultBox.innerHTML = '<div class="wm-placeholder">⚠️ Please paste code or extract it from page first.</div>';
      return;
    }
    codeResultBox.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <div class="wm-spinner"></div>
        <p style="margin-top:10px; font-size:12px; color:#94a3b8;">Processing ${label} via AI...</p>
      </div>
    `;
    if (codeActionsToolbar) codeActionsToolbar.classList.add('hidden');

    chrome.runtime.sendMessage(
      {
        action: 'PROCESS_TEXT_ACTION',
        type: taskType,
        text: code.substring(0, 6000)
      },
      (res) => {
        if (chrome.runtime.lastError || !res || res.error) {
          codeResultBox.innerHTML = `<div class="wm-placeholder">Processing error: ${res?.error || chrome.runtime.lastError?.message}</div>`;
          return;
        }
        codeResultBox.innerHTML = formatMarkdownOutput(res.result);
        if (codeActionsToolbar) codeActionsToolbar.classList.remove('hidden');
      }
    );
  }

  if (btnCodeExplain) btnCodeExplain.addEventListener('click', () => executeCodeAction('CODE', 'Explain & Analyze Code'));
  if (btnCodeDebug) btnCodeDebug.addEventListener('click', () => executeCodeAction('CODE_DEBUG', 'Debug & Detect Bugs'));
  if (btnCodeOptimize) btnCodeOptimize.addEventListener('click', () => executeCodeAction('CODE_OPTIMIZE', 'Optimize Code'));

  if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
      navigator.clipboard.writeText(codeResultBox.innerText);
      btnCopyCode.innerText = 'Copied!';
      setTimeout(() => btnCopyCode.innerText = 'Copy Analysis', 2000);
    });
  }

  // ═════════════════════════════════════════════════════════════════
  // ── Listen Panel: Audio Stream of Opinions & Discussions ─────────
  // ═════════════════════════════════════════════════════════════════
  let listenPlaylist = [];
  let currentListenIndex = 0;
  let activeListenSource = 'opinions'; // 'opinions' | 'summary' | 'custom'
  let currentSpeechRate = 1.0;
  let isSpeaking = false;
  let isPaused = false;
  let autoAdvance = true;

  const btnTtsPlay = document.getElementById('btn-tts-play');
  const btnTtsStop = document.getElementById('btn-tts-stop');
  const btnListenPrev = document.getElementById('btn-listen-prev');
  const btnListenNext = document.getElementById('btn-listen-next');
  const btnListenReplay = document.getElementById('btn-listen-replay');
  const ttsPlayIcon = document.getElementById('tts-play-icon');
  const ttsPauseIcon = document.getElementById('tts-pause-icon');
  const ttsWaveVisualizer = document.getElementById('tts-wave-visualizer');
  const listenLiveBadge = document.getElementById('listen-live-badge');
  const ttsStatusLabel = document.getElementById('tts-status-label');
  const ttsSubtext = document.getElementById('tts-subtext');
  const listenCounterPill = document.getElementById('listen-counter-pill');
  const listenAuthorRow = document.getElementById('listen-author-row');
  const listenAuthorAvatar = document.getElementById('listen-author-avatar');
  const listenAuthorName = document.getElementById('listen-author-name');
  const listenAuthorRole = document.getElementById('listen-author-role');
  const listenItemTypeBadge = document.getElementById('listen-item-type-badge');
  const listenQuoteBox = document.getElementById('listen-quote-box');
  const listenQuoteText = document.getElementById('listen-quote-text');
  const listenQueueBadge = document.getElementById('listen-queue-badge');
  const listenQueueCount = document.getElementById('listen-queue-count');
  const listenQueueList = document.getElementById('listen-queue-list');
  const ttsCustomWrap = document.getElementById('tts-custom-wrap');
  const ttsCustomText = document.getElementById('tts-custom-text');
  const chkAutoAdvance = document.getElementById('chk-auto-advance');
  const listenSpeedPills = document.querySelectorAll('#panel-listen .speed-pill');
  const listenNavTabs = document.querySelectorAll('.listen-nav-btn');

  // Source selection tabs
  listenNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      listenNavTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeListenSource = tab.dataset.source || 'opinions';
      stopSpeech();

      const queueSection = document.getElementById('listen-queue-section');

      if (activeListenSource === 'opinions') {
        if (ttsCustomWrap) ttsCustomWrap.classList.add('hidden');
        if (queueSection) queueSection.classList.remove('hidden');
        if (listenAuthorRow) listenAuthorRow.classList.remove('hidden');
        loadItemInPlayer(currentListenIndex);
      } else if (activeListenSource === 'summary') {
        if (ttsCustomWrap) ttsCustomWrap.classList.add('hidden');
        if (queueSection) queueSection.classList.add('hidden');
        if (listenAuthorRow) listenAuthorRow.classList.add('hidden');
        if (listenQuoteBox) listenQuoteBox.classList.add('hidden');
        if (listenCounterPill) {
          listenCounterPill.innerText = '';
          listenCounterPill.style.display = 'none';
        }
        if (ttsStatusLabel) ttsStatusLabel.innerText = 'Page Summary';
        const summaryText = summaryResultBox ? summaryResultBox.innerText.trim() : '';
        const hasSummary = summaryText && !summaryText.includes('Click Summarize');
        if (ttsSubtext) ttsSubtext.innerText = hasSummary ? summaryText : (activePageData ? activePageData.text.substring(0, 3000) : 'No summary generated yet. Click play to read page text.');
      } else {
        if (ttsCustomWrap) ttsCustomWrap.classList.remove('hidden');
        if (queueSection) queueSection.classList.add('hidden');
        if (listenAuthorRow) listenAuthorRow.classList.add('hidden');
        if (listenQuoteBox) listenQuoteBox.classList.add('hidden');
        if (listenCounterPill) {
          listenCounterPill.innerText = '';
          listenCounterPill.style.display = 'none';
        }
        if (ttsStatusLabel) ttsStatusLabel.innerText = 'Custom Audio';
        if (ttsSubtext) ttsSubtext.innerText = ttsCustomText?.value.trim() || 'Type or paste custom text below and press Play.';
      }
    });
  });

  if (ttsCustomText) {
    ttsCustomText.addEventListener('input', () => {
      if (activeListenSource === 'custom' && ttsSubtext) {
        ttsSubtext.innerText = ttsCustomText.value.trim() || 'Type or paste custom text below and press Play.';
      }
    });
  }

  if (chkAutoAdvance) {
    chkAutoAdvance.addEventListener('change', () => {
      autoAdvance = chkAutoAdvance.checked;
    });
  }

  listenSpeedPills.forEach(pill => {
    pill.addEventListener('click', () => {
      listenSpeedPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentSpeechRate = parseFloat(pill.dataset.speed || '1.0');
      if (isSpeaking && !isPaused) {
        speakCurrentItem();
      }
    });
  });

  function formatSpokenText(author, quote, text, isReply) {
    const cleanText = (text || '').trim();
    const cleanQuote = (quote || '').trim();
    const isAr = /[\u0600-\u06FF]/.test(cleanText + cleanQuote);

    if (isAr) {
      if (isReply) {
        return `تعليق من ${author}: ${cleanText}`;
      } else if (cleanQuote) {
        return `رأي من ${author}، حول الاقتباس: "${cleanQuote}". قال: ${cleanText}`;
      } else {
        return `رأي من ${author}: ${cleanText}`;
      }
    } else {
      if (isReply) {
        return `Reply by ${author}: ${cleanText}`;
      } else if (cleanQuote) {
        return `Annotation by ${author}. Regarding quote: "${cleanQuote}". ${cleanText}`;
      } else {
        return `Annotation by ${author}: ${cleanText}`;
      }
    }
  }

  function loadItemInPlayer(index) {
    if (activeListenSource !== 'opinions') return;
    if (!listenPlaylist || listenPlaylist.length === 0) {
      if (listenCounterPill) {
        listenCounterPill.innerText = '';
        listenCounterPill.style.display = 'none';
      }
      if (ttsStatusLabel) ttsStatusLabel.innerText = 'Ready to Listen';
      if (ttsSubtext) ttsSubtext.innerText = 'No published opinions on this page yet. Listen to Page Summary or add your opinion!';
      if (listenQuoteBox) listenQuoteBox.classList.add('hidden');
      if (listenAuthorAvatar) listenAuthorAvatar.innerText = 'A';
      if (listenAuthorName) listenAuthorName.innerText = 'Annotated Community';
      if (listenAuthorRole) listenAuthorRole.innerText = 'Current Page';
      if (listenItemTypeBadge) listenItemTypeBadge.innerText = 'Empty';
      return;
    }

    if (index < 0) index = 0;
    if (index >= listenPlaylist.length) index = listenPlaylist.length - 1;
    currentListenIndex = index;

    const item = listenPlaylist[currentListenIndex];
    if (listenCounterPill) {
      if (listenPlaylist.length > 1) {
        listenCounterPill.style.display = 'inline-block';
        listenCounterPill.innerText = `${currentListenIndex + 1} / ${listenPlaylist.length}`;
      } else {
        listenCounterPill.innerText = '';
        listenCounterPill.style.display = 'none';
      }
    }
    if (listenAuthorAvatar) listenAuthorAvatar.innerText = (item.author || 'A').charAt(0).toUpperCase();
    if (listenAuthorName) listenAuthorName.innerText = item.author || 'Community Member';
    if (listenAuthorRole) listenAuthorRole.innerText = item.handle || (item.type === 'reply' ? 'Reply comment' : 'Page opinion');
    if (listenItemTypeBadge) listenItemTypeBadge.innerText = item.type === 'reply' ? 'Reply' : 'Annotation';

    if (item.quote && item.quote.trim()) {
      if (listenQuoteBox) listenQuoteBox.classList.remove('hidden');
      if (listenQuoteText) listenQuoteText.innerText = `"${item.quote.trim()}"`;
    } else {
      if (listenQuoteBox) listenQuoteBox.classList.add('hidden');
      if (listenQuoteText) listenQuoteText.innerText = '';
    }

    if (ttsSubtext) ttsSubtext.innerText = item.text || 'No text provided.';
    if (!isSpeaking && ttsStatusLabel) {
      ttsStatusLabel.innerText = 'Ready to Listen';
    }

    // Highlight in playlist queue
    if (listenQueueList) {
      const queueItems = listenQueueList.querySelectorAll('.listen-queue-item');
      queueItems.forEach((el, i) => {
        if (i === currentListenIndex) {
          el.classList.add('active');
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          el.classList.remove('active');
        }
      });
    }
  }

  function getCurrentTtsText() {
    if (activeListenSource === 'opinions' && listenPlaylist.length > 0) {
      return listenPlaylist[currentListenIndex]?.text || '';
    } else if (activeListenSource === 'summary') {
      const summaryText = summaryResultBox ? summaryResultBox.innerText.trim() : '';
      if (summaryText && !summaryText.includes('Click Summarize')) return summaryText;
      return activePageData ? activePageData.text.substring(0, 3000) : 'No content available to read.';
    } else {
      return ttsCustomText ? ttsCustomText.value.trim() : '';
    }
  }

  function speakCurrentItem() {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = '';
    if (activeListenSource === 'opinions') {
      if (!listenPlaylist || listenPlaylist.length === 0) {
        textToSpeak = getCurrentTtsText();
      } else {
        const item = listenPlaylist[currentListenIndex];
        textToSpeak = item ? item.spokenText : '';
      }
    } else if (activeListenSource === 'summary') {
      textToSpeak = getCurrentTtsText();
    } else {
      textToSpeak = ttsCustomText ? ttsCustomText.value.trim() : '';
    }

    if (!textToSpeak || !textToSpeak.trim()) {
      if (ttsStatusLabel) ttsStatusLabel.innerText = 'No text to read';
      stopSpeech();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = currentSpeechRate;

    // Detect Arabic
    if (/[\u0600-\u06FF]/.test(textToSpeak)) {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      isSpeaking = true;
      isPaused = false;
      if (ttsPlayIcon) ttsPlayIcon.style.display = 'none';
      if (ttsPauseIcon) ttsPauseIcon.style.display = 'block';
      if (ttsWaveVisualizer) ttsWaveVisualizer.classList.add('playing');
      if (listenLiveBadge) listenLiveBadge.classList.add('playing');
      if (ttsStatusLabel) ttsStatusLabel.innerText = 'Reading Aloud...';
    };

    utterance.onend = () => {
      if (activeListenSource === 'opinions' && autoAdvance && currentListenIndex < listenPlaylist.length - 1) {
        // Automatically progress to next opinion in queue!
        currentListenIndex++;
        loadItemInPlayer(currentListenIndex);
        setTimeout(() => {
          speakCurrentItem();
        }, 500);
      } else {
        stopSpeech();
        if (activeListenSource === 'opinions' && currentListenIndex >= listenPlaylist.length - 1 && listenPlaylist.length > 0) {
          if (ttsStatusLabel) ttsStatusLabel.innerText = 'Finished All Opinions';
        }
      }
    };

    utterance.onerror = () => {
      stopSpeech();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    isPaused = false;
    if (ttsPlayIcon) ttsPlayIcon.style.display = 'block';
    if (ttsPauseIcon) ttsPauseIcon.style.display = 'none';
    if (ttsWaveVisualizer) ttsWaveVisualizer.classList.remove('playing');
    if (listenLiveBadge) listenLiveBadge.classList.remove('playing');
    if (ttsStatusLabel) ttsStatusLabel.innerText = 'Ready to Listen';
  }

  if (btnTtsPlay) {
    btnTtsPlay.addEventListener('click', () => {
      if (!isSpeaking) {
        speakCurrentItem();
      } else if (!isPaused) {
        window.speechSynthesis.pause();
        isPaused = true;
        if (ttsPlayIcon) ttsPlayIcon.style.display = 'block';
        if (ttsPauseIcon) ttsPauseIcon.style.display = 'none';
        if (ttsWaveVisualizer) ttsWaveVisualizer.classList.remove('playing');
        if (listenLiveBadge) listenLiveBadge.classList.remove('playing');
        if (ttsStatusLabel) ttsStatusLabel.innerText = 'Paused';
      } else {
        window.speechSynthesis.resume();
        isPaused = false;
        if (ttsPlayIcon) ttsPlayIcon.style.display = 'none';
        if (ttsPauseIcon) ttsPauseIcon.style.display = 'block';
        if (ttsWaveVisualizer) ttsWaveVisualizer.classList.add('playing');
        if (listenLiveBadge) listenLiveBadge.classList.add('playing');
        if (ttsStatusLabel) ttsStatusLabel.innerText = 'Reading Aloud...';
      }
    });
  }

  if (btnTtsStop) {
    btnTtsStop.addEventListener('click', () => {
      stopSpeech();
    });
  }

  if (btnListenPrev) {
    btnListenPrev.addEventListener('click', () => {
      if (activeListenSource === 'opinions' && currentListenIndex > 0) {
        currentListenIndex--;
        loadItemInPlayer(currentListenIndex);
        if (isSpeaking) {
          speakCurrentItem();
        }
      }
    });
  }

  if (btnListenNext) {
    btnListenNext.addEventListener('click', () => {
      if (activeListenSource === 'opinions' && currentListenIndex < listenPlaylist.length - 1) {
        currentListenIndex++;
        loadItemInPlayer(currentListenIndex);
        if (isSpeaking) {
          speakCurrentItem();
        }
      }
    });
  }

  if (btnListenReplay) {
    btnListenReplay.addEventListener('click', () => {
      loadItemInPlayer(currentListenIndex);
      speakCurrentItem();
    });
  }

  async function initListenPanel() {
    stopSpeech();
    currentListenIndex = 0;

    // 1. Get active tab URL
    const tab = await getActiveWebTab();
    const activeUrl = tab?.url || '';

    // 2. Fetch fresh posts from backend
    let allPosts = [];
    try {
      const dbRes = await fetch('http://localhost:5000/api/posts');
      const dbJson = await dbRes.json();
      if (dbJson?.success && Array.isArray(dbJson.posts)) {
        allPosts = dbJson.posts;
      }
    } catch (e) {
      console.warn('Error fetching posts for listen:', e);
    }

    // 3. Also check local annotations
    let localList = [];
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        const stored = await chrome.storage.local.get(['wm_annotations']);
        localList = stored.wm_annotations || [];
      }
    } catch (_) {}

    // 4. Build playlist of opinions & discussions for this page
    listenPlaylist = [];
    allPosts.forEach(p => {
      const postUrl = p.media_url || p.page_url || '';
      if (isMatchingPage(postUrl, activeUrl)) {
        // Main Annotation
        listenPlaylist.push({
          id: `post-${p.id}`,
          type: 'annotation',
          author: p.author_name || p.author_handle || 'Community Member',
          handle: p.author_handle ? (p.author_handle.startsWith('@') ? p.author_handle : `@${p.author_handle}`) : '@user',
          avatar: p.author_avatar || '',
          quote: p.quote || p.highlighted_text || '',
          text: p.content || p.text || '',
          timestamp: p.created_at,
          spokenText: formatSpokenText(p.author_name || p.author_handle || 'User', p.quote || p.highlighted_text, p.content || p.text, false)
        });

        // Associated comments / replies
        if (Array.isArray(p.comments)) {
          p.comments.forEach(c => {
            listenPlaylist.push({
              id: `comment-${c.id}`,
              type: 'reply',
              author: c.author_name || c.author_handle || 'User',
              handle: c.author_handle ? (c.author_handle.startsWith('@') ? c.author_handle : `@${c.author_handle}`) : '@user',
              avatar: c.author_avatar || '',
              quote: `In reply to ${p.author_name || 'annotation'}`,
              text: c.content || '',
              timestamp: c.created_at,
              spokenText: formatSpokenText(c.author_name || c.author_handle || 'User', '', c.content, true)
            });
          });
        }
      }
    });

    // Also include any local annotations for this page
    localList.forEach(loc => {
      if (isMatchingPage(loc.url, activeUrl)) {
        const exists = listenPlaylist.some(item => item.text === loc.text || item.text === loc.comment);
        if (!exists && (loc.text || loc.comment)) {
          listenPlaylist.push({
            id: `loc-${loc.id || Math.random()}`,
            type: 'annotation',
            author: loc.author || 'You',
            handle: '@you',
            avatar: '',
            quote: loc.highlighted_text || loc.quote || '',
            text: loc.text || loc.comment || '',
            timestamp: loc.created_at,
            spokenText: formatSpokenText(loc.author || 'You', loc.highlighted_text || loc.quote, loc.text || loc.comment, false)
          });
        }
      }
    });

    // 5. Update UI Badges & Counts
    const count = listenPlaylist.length;
    if (listenQueueBadge) listenQueueBadge.innerText = `${count} Opinion${count === 1 ? '' : 's'}`;
    if (listenQueueCount) listenQueueCount.innerText = `${count} item${count === 1 ? '' : 's'}`;

    // 6. Render Playlist Queue
    if (listenQueueList) {
      listenQueueList.innerHTML = '';
      if (count === 0) {
        listenQueueList.innerHTML = `
          <div class="listen-queue-empty">
            <p style="margin:0 0 6px 0;">No annotations published on this page yet.</p>
            <p style="margin:0; font-size:11px; color:#94A3B8;">Switch to <strong>Summary</strong> to listen to the AI summary of this page.</p>
          </div>
        `;
      } else {
        listenPlaylist.forEach((item, idx) => {
          const itemEl = document.createElement('div');
          itemEl.className = `listen-queue-item ${idx === 0 ? 'active' : ''}`;
          itemEl.innerHTML = `
            <div class="listen-queue-item-icon">
              ${item.type === 'reply' ? '↳' : (idx + 1)}
            </div>
            <div class="listen-queue-item-content">
              <div class="listen-queue-item-header">
                <span class="listen-queue-item-author">${escapeHtml(item.author)}</span>
                <span class="listen-queue-item-type">${item.type === 'reply' ? 'Reply' : 'Annotation'}</span>
              </div>
              <span class="listen-queue-item-snippet">${escapeHtml(item.text)}</span>
            </div>
          `;
          itemEl.addEventListener('click', () => {
            currentListenIndex = idx;
            loadItemInPlayer(currentListenIndex);
            speakCurrentItem();
          });
          listenQueueList.appendChild(itemEl);
        });
      }
    }

    // 7. Load first item in Player
    loadItemInPlayer(0);
  }

  // ═════════════════════════════════════════════════════════════════
  // ── Voice Clipping Feature (Fluid Wave & Live Audio STT) ───────────
  // ═════════════════════════════════════════════════════════════════
  const waveCanvas = document.getElementById('voice-wave-canvas');
  const waveCtx = waveCanvas ? waveCanvas.getContext('2d') : null;
  let waveAnimId = null;

  // DOM Elements
  const btnVoiceRecord = document.getElementById('btn-voice-record');
  const recordBtnText = document.getElementById('record-btn-text');
  const voiceTimer = document.getElementById('voice-timer');
  const voiceLangSelect = document.getElementById('voice-lang-select');
  const voiceTranscriptBox = document.getElementById('voice-transcript-box');
  const voiceEmptyHint = document.getElementById('voice-empty-hint');
  const voiceRealtimeText = document.getElementById('voice-realtime-text');
  const voiceStatusBar = document.getElementById('voice-status-bar');
  const voiceLiveDot = document.getElementById('voice-live-dot');
  const voiceStatusText = document.getElementById('voice-status-text');
  const btnFixMicPerm = document.getElementById('btn-fix-mic-perm');

  // Session Card Elements
  const voiceSessionCard = document.getElementById('voice-session-card');
  const sessionCardTitle = document.getElementById('session-card-title');
  const sessionCardSnippet = document.getElementById('session-card-snippet');
  const btnSessionSummary = document.getElementById('btn-session-summary');
  const btnSessionSave = document.getElementById('btn-session-save');
  const btnSessionShare = document.getElementById('btn-session-share');
  const btnCloseSession = document.getElementById('btn-close-session');
  const sessionSummaryResult = document.getElementById('session-summary-result');

  // Toolbar Action Elements
  const btnVoiceClear = document.getElementById('btn-voice-clear');
  const btnVoiceStar = document.getElementById('btn-voice-star');
  const voiceStarIcon = document.getElementById('voice-star-icon');
  const btnVoiceCopy = document.getElementById('btn-voice-copy');
  const btnVoiceAiSummary = document.getElementById('btn-voice-ai-summary');

  // State
  let isVoiceRecording = false;
  let isContinuousListening = false;
  let voiceRecognition = null;
  let voiceTimerInterval = null;
  let voiceElapsedSeconds = 0;
  let allLiveTranscripts = [];
  let currentRecordedSessionTexts = [];
  let currentRecordedSessionDuration = '0:00 secs';

  // Audio Context & Analyser
  let audioCtx = null;
  let analyserNode = null;
  let micStream = null;
  let freqDataArray = null;
  let mediaRecorder = null;
  let recordedAudioChunks = [];
  let currentAudioBlob = null;

  // ── 1. Setup Audio Stream (Tab Capture + Mic Fallback) ─────────────
  async function setupAudioStream() {
    if (audioCtx && analyserNode && micStream) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 128;
      analyserNode.smoothingTimeConstant = 0.82;
      freqDataArray = new Uint8Array(analyserNode.frequencyBinCount);
    }

    // A. Try Tab Audio Capture (Captures internal video/live sound directly!)
    try {
      if (chrome.tabCapture && chrome.tabCapture.capture) {
        chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
          if (!chrome.runtime.lastError && stream) {
            micStream = stream;
            const source = audioCtx.createMediaStreamSource(stream);
            // Route to speakers so the user can continue hearing the video!
            source.connect(audioCtx.destination);
            source.connect(analyserNode);
            console.log('✅ Tab audio captured successfully');
            if (btnFixMicPerm) btnFixMicPerm.classList.add('hidden');
            return;
          }
          // If tab capture not available, fall back to microphone
          setupMicrophoneFallback();
        });
        return;
      }
    } catch (e) {}

    setupMicrophoneFallback();
  }

  async function setupMicrophoneFallback() {
    if (micStream) return;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.createMediaStreamSource(micStream);
      source.connect(analyserNode);
      if (btnFixMicPerm) btnFixMicPerm.classList.add('hidden');
      console.log('✅ Microphone audio stream ready');
    } catch (err) {
      console.warn('Microphone permission required:', err.message);
      if (btnFixMicPerm) btnFixMicPerm.classList.remove('hidden');
    }
  }

  // ── 2. Fluid Waveform Visualizer ──────
  function renderFluidWaveform(time) {
    if (!waveCanvas || !waveCtx) return;

    const w = waveCanvas.width;
    const h = waveCanvas.height;
    waveCtx.clearRect(0, 0, w, h);

    const midY = h / 2;

    // Live audio energy detection
    let avgEnergy = 0;
    if (analyserNode && freqDataArray) {
      analyserNode.getByteFrequencyData(freqDataArray);
      let sum = 0;
      for (let i = 0; i < freqDataArray.length; i++) sum += freqDataArray[i];
      avgEnergy = sum / freqDataArray.length;
    }

    const energyBoost = (avgEnergy / 255) * 45;
    const baseAmp = (isVoiceRecording ? 28 : 13) + energyBoost;
    const speed = isVoiceRecording ? 0.0055 : 0.0028;

    // Layered flowing sine/bezier curves
    const waveLayers = [
      { color: 'rgba(255, 255, 255, 0.98)', width: 2.8, freq: 0.019, speedMult: 1.0, phaseOffset: 0, ampMult: 1.0 },
      { color: 'rgba(165, 215, 255, 0.72)', width: 2.0, freq: 0.026, speedMult: 1.35, phaseOffset: 2.2, ampMult: 0.78 },
      { color: 'rgba(255, 255, 255, 0.38)', width: 1.5, freq: 0.015, speedMult: 0.85, phaseOffset: 4.4, ampMult: 0.58 }
    ];

    waveLayers.forEach(layer => {
      waveCtx.beginPath();
      waveCtx.strokeStyle = layer.color;
      waveCtx.lineWidth = layer.width;
      waveCtx.lineCap = 'round';
      waveCtx.lineJoin = 'round';

      const phase = time * speed * layer.speedMult + layer.phaseOffset;
      const amp = baseAmp * layer.ampMult;

      for (let x = 0; x <= w; x += 2) {
        // Taper towards both edges (sin window to gracefully pinch to 0 at edges)
        const taper = Math.sin((x / w) * Math.PI);
        const y = midY + Math.sin(x * layer.freq + phase) * amp * taper
                       + Math.sin(x * layer.freq * 2.2 + phase * 1.6) * (amp * 0.28) * taper;

        if (x === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
      }
      waveCtx.stroke();
    });

    waveAnimId = requestAnimationFrame(renderFluidWaveform);
  }

  function startWaveformAnimation() {
    if (!waveAnimId) {
      waveAnimId = requestAnimationFrame(renderFluidWaveform);
    }
  }

  // ── 3. Continuous Live Listening & Speech Recognition ─────────────
  function startContinuousLiveListening() {
    isContinuousListening = true;
    updateStatusIndicator('active');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (voiceRecognition) {
        try { voiceRecognition.onend = null; voiceRecognition.stop(); } catch (e) {}
      }

      try {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = true;
        voiceRecognition.interimResults = true;
        voiceRecognition.lang = voiceLangSelect ? voiceLangSelect.value : 'ar-SA';

        voiceRecognition.onresult = (event) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + ' ';
            } else {
              interim += transcript;
            }
          }

          if (final.trim()) {
            appendVoiceChunk(final.trim(), 'voice');
          }
          updateVoiceInterimDisplay(interim);
        };

        voiceRecognition.onerror = (err) => {
          console.warn('SpeechRecognition status:', err.error);
          if (err.error === 'not-allowed') {
            if (btnFixMicPerm) btnFixMicPerm.classList.remove('hidden');
          }
          if (isContinuousListening && (err.error === 'no-speech' || err.error === 'network' || err.error === 'aborted')) {
            setTimeout(() => {
              if (isContinuousListening) {
                try { voiceRecognition.start(); } catch (e) {}
              }
            }, 600);
          }
        };

        voiceRecognition.onend = () => {
          if (isContinuousListening) {
            setTimeout(() => {
              if (isContinuousListening) {
                try { voiceRecognition.start(); } catch (e) {}
              }
            }, 300);
          }
        };

        voiceRecognition.start();
      } catch (err) {
        console.warn('Could not launch SpeechRecognition:', err);
      }
    }

    // Trigger tab subtitle observer
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0]) {
            safeTabSendMessage(tabs[0].id, { action: 'START_CONTINUOUS_EXTRACTION' });
          }
        });
      }
    } catch (e) {}
  }

  // ── 4. Append Spoken Transcript Chunk ──────────────────────────────
  function appendVoiceChunk(text, type = 'voice') {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    // Prevent immediate duplicate lines
    if (allLiveTranscripts.length > 0 && allLiveTranscripts[allLiveTranscripts.length - 1] === cleanText) {
      return;
    }

    allLiveTranscripts.push(cleanText);
    if (isVoiceRecording) {
      currentRecordedSessionTexts.push(cleanText);
    }

    if (voiceEmptyHint) voiceEmptyHint.style.display = 'none';

    // Clear interim span
    const oldInterim = document.getElementById('voice-interim-span');
    if (oldInterim) oldInterim.remove();

    const p = document.createElement('p');

    let badgeHtml = '';
    if (type === 'caption') {
      badgeHtml = '<span class="live-source-tag caption">Speech Translation</span>';
    } else {
      badgeHtml = '<span class="live-source-tag voice">Spoken Audio</span>';
    }

    p.innerHTML = `${badgeHtml} ${cleanText}`;

    if (voiceRealtimeText) {
      voiceRealtimeText.appendChild(p);
    }
    if (voiceTranscriptBox) {
      voiceTranscriptBox.scrollTop = voiceTranscriptBox.scrollHeight;
    }
  }

  function updateVoiceInterimDisplay(interimText) {
    let interimSpan = document.getElementById('voice-interim-span');
    if (!interimText) {
      if (interimSpan) interimSpan.remove();
      return;
    }
    if (!interimSpan) {
      interimSpan = document.createElement('span');
      interimSpan.id = 'voice-interim-span';
      interimSpan.className = 'voice-interim';
      if (voiceRealtimeText) voiceRealtimeText.appendChild(interimSpan);
    }
    interimSpan.innerText = ' ' + interimText;
    if (voiceTranscriptBox) {
      voiceTranscriptBox.scrollTop = voiceTranscriptBox.scrollHeight;
    }
  }

  // Listen for spoken subtitles from video (ignore news tickers!)
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'LIVE_TRANSCRIPT_CHUNK' && msg.text && msg.type !== 'ticker') {
        appendVoiceChunk(msg.text, msg.type || 'caption');
      }
    });
  }

  // ── 5. Recording Session (Captures Audio & Transcribes with Gemini) ─
  function startVoiceRecording() {
    isVoiceRecording = true;
    voiceElapsedSeconds = 0;
    currentRecordedSessionTexts = [];
    recordedAudioChunks = [];
    currentAudioBlob = null;
    updateVoiceTimerDisplay();

    if (btnVoiceRecord) btnVoiceRecord.classList.add('recording');
    if (recordBtnText) recordBtnText.innerText = 'stop';
    if (voiceSessionCard) voiceSessionCard.classList.add('hidden');

    updateStatusIndicator('recording');

    // Timer interval
    clearInterval(voiceTimerInterval);
    voiceTimerInterval = setInterval(() => {
      voiceElapsedSeconds++;
      updateVoiceTimerDisplay();
    }, 1000);

    // If audio stream not yet connected, capture now
    if (!micStream) {
      setupAudioStream();
    }

    // Start MediaRecorder to capture audio
    if (micStream && typeof MediaRecorder !== 'undefined') {
      try {
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        mediaRecorder = new MediaRecorder(micStream, { mimeType: mime });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedAudioChunks.push(e.data);
          }
        };
        mediaRecorder.start(250);
      } catch (e) {
        console.warn('MediaRecorder error:', e);
      }
    }
  }

  async function stopVoiceRecording() {
    isVoiceRecording = false;
    clearInterval(voiceTimerInterval);

    if (btnVoiceRecord) btnVoiceRecord.classList.remove('recording');
    if (recordBtnText) recordBtnText.innerText = 'record now';

    updateStatusIndicator('active');
    updateVoiceInterimDisplay('');

    currentRecordedSessionDuration = voiceTimer ? voiceTimer.innerText : '0:00 secs';

    // Stop MediaRecorder and transcribe
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.onstop = async () => {
        if (recordedAudioChunks.length > 0) {
          currentAudioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
          await transcribeRecordedAudio(currentAudioBlob);
        } else {
          showRecordedSessionCard();
        }
      };
      mediaRecorder.stop();
    } else {
      showRecordedSessionCard();
    }
  }

  // Transcribe captured audio with Gemini 1.5 Flash
  async function transcribeRecordedAudio(blob) {
    showRecordedSessionCard();
    if (sessionCardSnippet) {
      sessionCardSnippet.innerHTML = '<div style="display:flex;align-items:center;gap:6px;color:#4f46e5;"><div class="webmind-loading-spinner" style="width:14px;height:14px;border-width:2px;"></div> Transcribing spoken audio via AI...</div>';
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        chrome.runtime.sendMessage(
          {
            action: 'TRANSCRIBE_AUDIO',
            audioData: base64Data,
            mimeType: 'audio/webm',
            lang: voiceLangSelect ? voiceLangSelect.value : 'ar-SA'
          },
          (res) => {
            if (res && res.text) {
              const text = res.text.trim();
              currentRecordedSessionTexts.push(text);
              appendVoiceChunk(text, 'voice');
              if (sessionCardSnippet) {
                sessionCardSnippet.innerText = text;
              }
            } else if (res && res.error) {
              const fallback = currentRecordedSessionTexts.join(' ') || allLiveTranscripts.slice(-3).join(' ');
              if (fallback && sessionCardSnippet) {
                sessionCardSnippet.innerText = fallback;
              } else if (sessionCardSnippet) {
                sessionCardSnippet.innerHTML = `<span style="color:#d97706;">Audio clip recorded (${currentRecordedSessionDuration}). Ready to save & share.</span>`;
              }
            }
          }
        );
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.warn('Transcribe error:', e);
    }
  }

  function showRecordedSessionCard() {
    if (!voiceSessionCard) return;

    if (sessionCardTitle) {
      sessionCardTitle.innerText = `Recorded Clip (${currentRecordedSessionDuration})`;
    }

    const sessionText = currentRecordedSessionTexts.join('\n') || allLiveTranscripts.slice(-4).join('\n') || (voiceRealtimeText ? voiceRealtimeText.innerText.trim() : '');

    if (sessionCardSnippet) {
      sessionCardSnippet.innerText = sessionText || `Audio clip recorded and saved (${currentRecordedSessionDuration}).`;
    }

    if (sessionSummaryResult) {
      sessionSummaryResult.classList.add('hidden');
      sessionSummaryResult.innerHTML = '';
    }

    voiceSessionCard.classList.remove('hidden');
    if (voiceTranscriptBox) {
      voiceTranscriptBox.scrollTop = 0;
    }
  }

  function updateStatusIndicator(mode) {
    if (!voiceLiveDot || !voiceStatusText) return;
    if (mode === 'recording') {
      voiceLiveDot.classList.add('recording-mode');
      voiceStatusText.innerText = 'Recording and capturing audio clip...';
    } else {
      voiceLiveDot.classList.remove('recording-mode');
      voiceStatusText.innerText = 'Live Listening Active';
    }
  }

  function updateVoiceTimerDisplay() {
    if (!voiceTimer) return;
    const mins = Math.floor(voiceElapsedSeconds / 60);
    const secs = voiceElapsedSeconds % 60;
    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs} secs`;
    voiceTimer.innerText = formatted;
  }

  // ── 6. Session Card Action Handlers ────────────────────────────────
  // 1. Save (Download text + audio)
  if (btnSessionSave) {
    btnSessionSave.addEventListener('click', () => {
      let sessionText = currentRecordedSessionTexts.join('\n').trim();
      if (!sessionText) {
        sessionText = allLiveTranscripts.join('\n').trim();
      }
      if (!sessionText && voiceRealtimeText) {
        sessionText = voiceRealtimeText.innerText.trim();
      }
      if (!sessionText) {
        sessionText = `Voice Recording - WebMind AI (${currentRecordedSessionDuration})\nDate: ${new Date().toLocaleString('en-US')}`;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

      // Download text
      const textBlob = new Blob([sessionText], { type: 'text/plain;charset=utf-8' });
      const textUrl = URL.createObjectURL(textBlob);
      const aText = document.createElement('a');
      aText.href = textUrl;
      aText.download = `voice_transcript_${timestamp}.txt`;
      aText.click();
      URL.revokeObjectURL(textUrl);

      // Download audio if captured
      if (currentAudioBlob) {
        const audioUrl = URL.createObjectURL(currentAudioBlob);
        const aAudio = document.createElement('a');
        aAudio.href = audioUrl;
        aAudio.download = `voice_audio_${timestamp}.webm`;
        aAudio.click();
        URL.revokeObjectURL(audioUrl);
      }

      btnSessionSave.innerHTML = 'Saved!';
      setTimeout(() => { btnSessionSave.innerHTML = 'Save'; }, 1800);
    });
  }

  // 2. Share
  if (btnSessionShare) {
    btnSessionShare.addEventListener('click', async () => {
      const sessionText = currentRecordedSessionTexts.join('\n') || allLiveTranscripts.slice(-6).join('\n') || (voiceRealtimeText ? voiceRealtimeText.innerText.trim() : '');
      const shareTitle = `Audio Clip Transcript - WebMind AI (${currentRecordedSessionDuration})`;
      const shareBody = `${shareTitle}\n-------------------------\n${sessionText || 'Audio clip saved successfully.'}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareBody
          });
          btnSessionShare.innerHTML = 'Shared!';
          setTimeout(() => { btnSessionShare.innerHTML = 'Share'; }, 1800);
          return;
        } catch (e) {}
      }

      navigator.clipboard.writeText(shareBody).then(() => {
        btnSessionShare.innerHTML = 'Copied!';
        setTimeout(() => { btnSessionShare.innerHTML = 'Share'; }, 1800);
      });
    });
  }

  // 3. Summarize with Gemini AI
  if (btnSessionSummary) {
    btnSessionSummary.addEventListener('click', () => {
      const sessionText = currentRecordedSessionTexts.join(' ') || allLiveTranscripts.slice(-8).join(' ') || (voiceRealtimeText ? voiceRealtimeText.innerText.trim() : '');
      if (!sessionText || sessionText.length < 10) {
        alert('Recorded clip is too short to summarize.');
        return;
      }

      if (sessionSummaryResult) {
        sessionSummaryResult.classList.remove('hidden');
        sessionSummaryResult.innerHTML = '<div class="webmind-loading-spinner" style="margin:8px auto;"></div> <center style="color:#637EFF;">Analyzing and summarizing clip with Gemini AI...</center>';
      }

      chrome.runtime.sendMessage(
        {
          action: 'PROCESS_TEXT_ACTION',
          type: 'SUMMARIZE',
          text: `Please summarize the following recorded audio clip with concise key points and takeaways:\n\n${sessionText}`
        },
        (res) => {
          if (sessionSummaryResult) {
            if (res && res.result) {
              sessionSummaryResult.innerHTML = `<strong>AI Summary of Audio Clip:</strong><br><br>${formatMarkdownOutput(res.result)}`;
            } else if (res && res.error) {
              sessionSummaryResult.innerHTML = `<span style="color:#ef4444;">Error: ${res.error}</span>`;
            } else {
              sessionSummaryResult.innerHTML = 'Unable to generate summary at this time.';
            }
          }
        }
      );
    });
  }

  if (btnCloseSession) {
    btnCloseSession.addEventListener('click', () => {
      if (voiceSessionCard) voiceSessionCard.classList.add('hidden');
    });
  }

  // ── 7. Toolbar Controls ───────────────────────────────────────────
  if (btnVoiceRecord) {
    btnVoiceRecord.addEventListener('click', () => {
      if (!isVoiceRecording) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    });
  }

  if (btnFixMicPerm) {
    btnFixMicPerm.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('permission.html') });
    });
  }

  if (voiceLangSelect) {
    voiceLangSelect.addEventListener('change', () => {
      if (isContinuousListening) {
        startContinuousLiveListening();
      }
    });
  }

  if (btnVoiceClear) {
    btnVoiceClear.addEventListener('click', () => {
      allLiveTranscripts = [];
      currentRecordedSessionTexts = [];
      if (voiceRealtimeText) voiceRealtimeText.innerHTML = '';
      if (voiceEmptyHint) voiceEmptyHint.style.display = 'block';
      if (voiceSessionCard) voiceSessionCard.classList.add('hidden');
    });
  }

  if (btnVoiceCopy) {
    btnVoiceCopy.addEventListener('click', () => {
      const fullText = allLiveTranscripts.join('\n') || (voiceRealtimeText ? voiceRealtimeText.innerText : '');
      if (fullText) {
        navigator.clipboard.writeText(fullText);
        btnVoiceCopy.style.color = '#10b981';
        setTimeout(() => { btnVoiceCopy.style.color = '#303677'; }, 1500);
      }
    });
  }

  if (btnVoiceStar) {
    let isStarred = false;
    btnVoiceStar.addEventListener('click', () => {
      isStarred = !isStarred;
      if (voiceStarIcon) {
        voiceStarIcon.style.color = isStarred ? '#eab308' : '#FFA72C';
        voiceStarIcon.style.transform = isStarred ? 'scale(1.2)' : 'scale(1)';
      }
    });
  }

  if (btnVoiceAiSummary) {
    btnVoiceAiSummary.addEventListener('click', () => {
      const fullText = allLiveTranscripts.join(' ') || (voiceRealtimeText ? voiceRealtimeText.innerText : '');
      if (!fullText || fullText.length < 15) {
        alert('Please play some audio first before summarizing.');
        return;
      }

      appendVoiceChunk('Generating smart transcript summary with Gemini AI...', 'voice');

      chrome.runtime.sendMessage(
        {
          action: 'PROCESS_TEXT_ACTION',
          type: 'SUMMARIZE',
          text: fullText
        },
        (res) => {
          if (res && res.result) {
            const summaryBox = document.createElement('div');
            summaryBox.style.cssText = 'background:#EEF0FF; padding:12px; border-radius:14px; margin-top:10px; border:1px solid #637EFF;';
            summaryBox.innerHTML = `<strong style="color:#293CFF;">AI Summary:</strong><br><br>${formatMarkdownOutput(res.result)}`;
            if (voiceRealtimeText) voiceRealtimeText.appendChild(summaryBox);
            if (voiceTranscriptBox) voiceTranscriptBox.scrollTop = voiceTranscriptBox.scrollHeight;
          }
        }
      );
    });
  }

  // ── 8. Initialize Voice Panel ─────────────────────────────────────
  async function initVoicePanel() {
    startWaveformAnimation();
    await setupAudioStream();

    // Auto-detect tab language (Arabic vs English)
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.title) {
          const isArabic = /[\u0600-\u06FF]/.test(tab.title);
          if (voiceLangSelect) {
            voiceLangSelect.value = isArabic ? 'ar-SA' : 'en-US';
          }
        }
      }
    } catch (e) {}

    // Immediately start continuous live extraction
    startContinuousLiveListening();
  }

  // ─────────────────────────────────────────────────────────────────
  // ── SECTION: CREATE ANNOTATION (HEART OF THE PROJECT) ────────────
  // ─────────────────────────────────────────────────────────────────
  // (Annotation state & MAX_CLIP_DURATION are initialized at top of module)
  let annotVoiceRecorder = null;
  let annotVoiceChunks = [];
  let isAnnotVoiceRecording = false;
  let annotVoiceTimerInterval = null;
  let annotVoiceSeconds = 0;
  let lastKnownVideoTime = 0;

  let studioToastTimeout = null;
  function showStudioToast(message) {
    const toast = document.getElementById('pro-studio-toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.remove('hidden');
    if (studioToastTimeout) clearTimeout(studioToastTimeout);
    studioToastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  const DEFAULT_VIDEO_THUMB = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80';
  const DEFAULT_FRAME_THUMB = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=80';

  function drawWaveformCanvas(canvasId, barColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : 340;
    const height = 26;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const barWidth = 2;
    const gap = 1.5;
    const step = barWidth + gap;
    const count = Math.floor(width / step);
    const midY = height / 2;

    ctx.fillStyle = barColor;

    for (let i = 0; i < count; i++) {
      const p = i / count;
      const envelope = Math.sin(p * Math.PI) * 0.35 + 0.65;
      const wave = Math.abs(Math.sin(i * 0.38) * 0.6 + Math.cos(i * 0.72) * 0.3 + Math.sin(i * 1.1) * 0.1);
      const barHeight = Math.max(3, wave * envelope * (height - 6));
      const x = i * step + 1;
      const y = midY - barHeight / 2;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, 1);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }
  }

  function updateRulerTicks(dur = 300) {
    const t0 = document.getElementById('ruler-t0');
    const t1 = document.getElementById('ruler-t1');
    const t2 = document.getElementById('ruler-t2');
    if (t0) t0.innerText = '00:00';
    if (t1) t1.innerText = formatTime(Math.round(dur * 0.5));
    if (t2) t2.innerText = formatTime(Math.round(dur));
  }

  function parseTimeString(str) {
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

    // Instruct YouTube / Audio tab to play this exact slice
    getActiveWebTab().then(tab => {
      if (tab && tab.id) {
        safeTabSendMessage(tab.id, { action: 'PLAY_CLIP', startTime: s, endTime: e });
      }
    });

    // Also update extension embedded video player (if YouTube video)
    if (iframe && videoId && currentAnnotationContext.type !== 'audio') {
      iframe.src = `https://www.youtube.com/embed/${videoId}?start=${s}&end=${e}&autoplay=1&rel=0`;
      if (overlay) overlay.classList.add('hidden');
    }
    showStudioToast(`Playing clip ${formatTime(s)} - ${formatTime(e)} (max 90s)`);
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
            const resp = await new Promise(res => safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, res));
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
        showStudioToast(`Start set to ${formatTime(s)}`);
      });
    }

    if (btnSetEndNow && !btnSetEndNow.dataset.bound) {
      btnSetEndNow.dataset.bound = 'true';
      btnSetEndNow.addEventListener('click', async () => {
        const tab = await getActiveWebTab();
        let cur = lastKnownVideoTime;
        if (tab && tab.id) {
          try {
            const resp = await new Promise(res => safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, res));
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
          showStudioToast(`End set to ${formatTime(e)}`);
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
          showStudioToast(`${sec}s clip chosen (max 90s)`);
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
    const sourceBadgeIcon = document.getElementById('annot-source-type-icon');
    const thumbImg = document.getElementById('annot-video-thumb-img');
    const thumbOverlay = document.getElementById('annot-video-thumb-overlay');
    const iframe = document.getElementById('annot-youtube-iframe');

    const targetUrl = info.url || currentAnnotationContext.url || '';
    const platform = getPlatformInfo(targetUrl);
    const isAudio = info.mediaType === 'audio' || info.hasAudio || currentAnnotationContext.type === 'audio';

    if (mediaTitleEl && info.title) {
      mediaTitleEl.innerText = info.title;
      mediaTitleEl.title = info.title;
    }
    if (mediaChannelEl) {
      mediaChannelEl.innerText = info.channel || platform.domain || platform.name;
    }
    if (sourceTypeLabel) {
      if (isAudio) {
        sourceTypeLabel.innerText = 'Podcast';
      } else if (platform.type === 'youtube') {
        sourceTypeLabel.innerText = 'YouTube';
      } else if (platform.isDedicatedVideo) {
        sourceTypeLabel.innerText = platform.name;
      } else {
        sourceTypeLabel.innerText = platform.name || 'Web Article';
      }
    }
    if (sourceBadgeIcon) {
      if (isAudio) {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6"/></svg>';
      } else if (platform.type === 'youtube') {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="#EF4444"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>';
      } else if (platform.isDedicatedVideo) {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
      } else {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      }
    }

    if (info.videoId) {
      currentAnnotationContext.videoId = info.videoId;
    }

    let thumbUrl = info.thumbnailUrl || info.frameSnapshot;
    if (!thumbUrl && (info.videoId || currentAnnotationContext.videoId)) {
      const vid = info.videoId || currentAnnotationContext.videoId;
      thumbUrl = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
    }
    if (!thumbUrl) {
      thumbUrl = DEFAULT_FRAME_THUMB;
    }

    if (thumbImg) {
      thumbImg.src = thumbUrl;
    }
    currentAnnotationContext.thumbnailUrl = thumbUrl;
    if (thumbOverlay) {
      thumbOverlay.classList.remove('hidden');
    }
    if (iframe) {
      if (isAudio) {
        iframe.src = '';
        iframe.style.display = 'none';
      } else {
        iframe.style.display = 'block';
      }
    }

    const frameImgs = document.querySelectorAll('.film-frame-img');
    frameImgs.forEach((img) => {
      img.src = thumbUrl;
      img.onerror = () => {
        if (img.src !== DEFAULT_FRAME_THUMB) img.src = DEFAULT_FRAME_THUMB;
      };
    });

    setTimeout(() => {
      drawWaveformCanvas('timeline-wave-canvas', isAudio ? '#2563EB' : '#3B82F6');
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

    if (timeTag) timeTag.innerText = `${sStr} – ${eStr}`;

    if (inputStart && document.activeElement !== inputStart) {
      inputStart.value = sStr;
    }
    if (inputEnd && document.activeElement !== inputEnd) {
      inputEnd.value = eStr;
    }
    if (durVal) {
      durVal.innerText = `${clipDurSec}s`;
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
      trimBox.style.left = `${startPct}%`;
      trimBox.style.width = `${widthPct}%`;
    }
    if (dimLeft) {
      dimLeft.style.width = `${startPct}%`;
    }
    if (dimRight) {
      dimRight.style.width = `${Math.max(0, 100 - endPct)}%`;
    }
    if (playheadNeedle) {
      playheadNeedle.style.left = `${startPct}%`;
    }
    if (scrubberFill) {
      scrubberFill.style.left = `${startPct}%`;
      scrubberFill.style.width = `${widthPct}%`;
    }
    if (sliderStart) {
      sliderStart.max = totalDur;
      sliderStart.value = s;
    }
    if (sliderEnd) {
      sliderEnd.max = totalDur;
      sliderEnd.value = e;
    }
  }

  let seekThrottleTimer = null;
  function throttledSeek(time) {
    if (seekThrottleTimer) return;
    seekThrottleTimer = setTimeout(() => {
      seekThrottleTimer = null;
      seekTabTo(time);
    }, 40);
  }

  async function seekTabTo(time) {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          safeTabSendMessage(tab.id, { action: 'SEEK_VIDEO', time: time, play: false });
        }
      }
    } catch (e) {}
  }

  // Live video time listener for real-time playhead and progress inside clip
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'VIDEO_TIME_TICK' && typeof msg.currentTime === 'number') {
        const cur = msg.currentTime;
        lastKnownVideoTime = cur;
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        const curPct = Math.min(100, Math.max(0, (cur / totalDur) * 100));

        const playheadNeedle = document.getElementById('pro-playhead-needle');
        if (playheadNeedle) {
          playheadNeedle.style.left = `${curPct}%`;
        }

        const s = currentAnnotationContext.startTime;
        const e = currentAnnotationContext.endTime;
        const span = Math.max(1, e - s);
        const playFill = document.getElementById('pro-scrubber-play-fill');
        if (playFill) {
          if (cur <= s) {
            playFill.style.width = '0%';
          } else if (cur >= e) {
            playFill.style.width = '100%';
          } else {
            const pct = Math.min(100, Math.max(0, ((cur - s) / span) * 100));
            playFill.style.width = `${pct}%`;
          }
        }
      } else if (msg.action === 'SELECTION_CHANGED' && msg.text) {
        // Update translation panel if active
        const translatePanel = document.getElementById('panel-translate');
        if (translatePanel && translatePanel.classList.contains('active')) {
          const translateInput = document.getElementById('translate-custom-input');
          if (translateInput && document.activeElement !== translateInput) {
            translateInput.value = msg.text;
          }
        }
        
        // Update create annotation panel if active
        const annotPanel = document.getElementById('panel-create-annotation');
        if (annotPanel && annotPanel.classList.contains('active')) {
          currentAnnotationContext.selectedText = msg.text;
          const snippetTextEl = document.getElementById('annot-snippet-text');
          const snippetBox = document.getElementById('annot-text-snippet-box');
          const codeSnippetBox = document.getElementById('annot-code-snippet-box');
          const codePre = document.getElementById('annot-code-pre-code');
          
          if (msg.isCode) {
             currentAnnotationContext.isCode = true;
             if (snippetBox) snippetBox.classList.add('hidden');
             if (codeSnippetBox) {
               codeSnippetBox.classList.remove('hidden');
               if (codePre) codePre.innerText = msg.text;
             }
          } else {
             currentAnnotationContext.isCode = false;
             if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
             if (snippetTextEl && snippetBox) {
               snippetBox.classList.remove('hidden');
               snippetTextEl.innerText = msg.text;
             }
          }
        }
      }
    });
  }

  // CapCut Interactive Dragging & Scrubbing
  function initTimelineDragHandles() {
    const tracksWrapper = document.getElementById('pro-tracks-wrapper');
    const handleLeft = document.getElementById('trim-handle-left');
    const handleRight = document.getElementById('trim-handle-right');
    const dragBody = document.getElementById('trim-drag-body');
    const scrubberWrap = document.getElementById('pro-scrubber-track-wrap');

    if (!tracksWrapper) return;

    function getTimeFromEvent(e) {
      const rect = tracksWrapper.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
      return (offsetX / rect.width) * totalDur;
    }

    // 1. Drag Left Handle (Trim Start - Never exceed 90 seconds clip length)
    if (handleLeft && !handleLeft.dataset.bound) {
      handleLeft.dataset.bound = 'true';
      handleLeft.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const onMouseMove = (moveEv) => {
          const time = getTimeFromEvent(moveEv);
          let newStart = Math.max(0, Math.min(Math.round(time), currentAnnotationContext.endTime - 1));
          if (currentAnnotationContext.endTime - newStart > MAX_CLIP_DURATION) {
            newStart = currentAnnotationContext.endTime - MAX_CLIP_DURATION;
          }
          currentAnnotationContext.startTime = newStart;
          updateAnnotTimeDisplay();
          throttledSeek(currentAnnotationContext.startTime);
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          seekTabTo(currentAnnotationContext.startTime);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    // 2. Drag Right Handle (Trim End - Never exceed 90 seconds clip length)
    if (handleRight && !handleRight.dataset.bound) {
      handleRight.dataset.bound = 'true';
      handleRight.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const onMouseMove = (moveEv) => {
          const time = getTimeFromEvent(moveEv);
          const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
          let newEnd = Math.min(totalDur, Math.max(Math.round(time), currentAnnotationContext.startTime + 1));
          if (newEnd - currentAnnotationContext.startTime > MAX_CLIP_DURATION) {
            newEnd = currentAnnotationContext.startTime + MAX_CLIP_DURATION;
          }
          currentAnnotationContext.endTime = newEnd;
          updateAnnotTimeDisplay();
          throttledSeek(currentAnnotationContext.endTime);
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          seekTabTo(currentAnnotationContext.endTime);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    // 3. Drag Middle Clip Body (Move entire range across video)
    if (dragBody && !dragBody.dataset.bound) {
      dragBody.dataset.bound = 'true';
      dragBody.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startMouseX = e.clientX;
        const initStart = currentAnnotationContext.startTime;
        const initEnd = currentAnnotationContext.endTime;
        const clipLen = Math.min(MAX_CLIP_DURATION, Math.max(1, initEnd - initStart));
        const rect = tracksWrapper.getBoundingClientRect();
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);

        const onMouseMove = (moveEv) => {
          const deltaPx = moveEv.clientX - startMouseX;
          const deltaSec = Math.round((deltaPx / rect.width) * totalDur);
          let newStart = Math.max(0, Math.min(initStart + deltaSec, totalDur - clipLen));
          currentAnnotationContext.startTime = newStart;
          currentAnnotationContext.endTime = newStart + clipLen;
          updateAnnotTimeDisplay();
          throttledSeek(currentAnnotationContext.startTime);
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          seekTabTo(currentAnnotationContext.startTime);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    // 4. Click anywhere on track to seek
    if (!tracksWrapper.dataset.bound) {
      tracksWrapper.dataset.bound = 'true';
      tracksWrapper.addEventListener('click', (e) => {
        if (e.target.closest('.trim-handle') || e.target.closest('.trim-drag-body')) return;
        const clickTime = Math.round(getTimeFromEvent(e));
        const clipLen = Math.min(MAX_CLIP_DURATION, Math.max(5, currentAnnotationContext.endTime - currentAnnotationContext.startTime));
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        currentAnnotationContext.startTime = Math.max(0, Math.min(clickTime, totalDur - clipLen));
        currentAnnotationContext.endTime = currentAnnotationContext.startTime + clipLen;
        updateAnnotTimeDisplay();
        seekTabTo(currentAnnotationContext.startTime);
      });
    }

    // 5. Scrubber click
    if (scrubberWrap && !scrubberWrap.dataset.bound) {
      scrubberWrap.dataset.bound = 'true';
      scrubberWrap.addEventListener('click', (e) => {
        const rect = scrubberWrap.getBoundingClientRect();
        const pct = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
        const totalDur = Math.max(10, currentAnnotationContext.duration || 300);
        const clickTime = Math.round(pct * totalDur);
        const clipLen = Math.min(MAX_CLIP_DURATION, Math.max(5, currentAnnotationContext.endTime - currentAnnotationContext.startTime));
        currentAnnotationContext.startTime = Math.max(0, Math.min(clickTime, totalDur - clipLen));
        currentAnnotationContext.endTime = currentAnnotationContext.startTime + clipLen;
        updateAnnotTimeDisplay();
        seekTabTo(currentAnnotationContext.startTime);
      });
    }
  }

  // Auto-detect when user switches or navigates videos in active tab
  function startAutoVideoWatcher() {
    if (window._videoWatcherStarted) return;
    window._videoWatcherStarted = true;

    setInterval(async () => {
      try {
        if (typeof chrome === 'undefined' || !chrome.tabs) return;
        const panel = document.getElementById('panel-create-annotation');
        if (!panel || !panel.classList.contains('active')) return;

        const tab = await getActiveWebTab();
        if (!tab || !tab.id || !tab.url) return;

        // CRITICAL: ONLY run video watcher on dedicated video platforms! Never hijack normal websites.
        if (!isDedicatedVideoPlatform(tab.url)) return;

        const isYT = !!(tab.url && (tab.url.includes('youtube.com') || tab.url.includes('youtu.be')));
        safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, (resp) => {
          if (!resp && !isYT) return;
          const isAudio = !isYT && (resp?.hasAudio || resp?.mediaType === 'audio' || (!resp?.hasVideo && currentAnnotationContext.type === 'audio'));
          const info = resp || {
            hasVideo: !isAudio,
            hasAudio: isAudio,
            mediaType: isAudio ? 'audio' : 'video',
            title: tab.title ? tab.title.replace(' - YouTube', '').trim() : (isAudio ? 'Podcast Episode' : 'YouTube Video'),
            channel: isAudio ? 'Podcast Channel' : 'YouTube',
            duration: 300,
            currentTime: 0,
            url: tab.url
          };

          const realTitle = (info.title && info.title !== 'Video Content' && info.title !== 'Podcast Episode') 
            ? info.title 
            : (tab.title || '').replace(' - YouTube', '').trim();
          const isNewVideo = (info.videoId && info.videoId !== lastDetectedVideoId) ||
                             (realTitle && realTitle !== lastDetectedTitle) ||
                             (tab.url && tab.url !== currentAnnotationContext.url);

          if (isNewVideo) {
            lastDetectedVideoId = info.videoId || null;
            lastDetectedTitle = realTitle;

            currentAnnotationContext.url = tab.url || info.url || '';
            currentAnnotationContext.mediaTitle = realTitle;
            currentAnnotationContext.type = isAudio ? 'audio' : 'video';
            currentAnnotationContext.duration = Math.max(10, info.duration || 300);
            currentAnnotationContext.startTime = Math.max(0, Math.floor(info.currentTime || 0));
            currentAnnotationContext.endTime = Math.min(currentAnnotationContext.duration, currentAnnotationContext.startTime + Math.min(30, MAX_CLIP_DURATION));

            updateAnnotMediaDisplay(info);
            updateAnnotTimeDisplay();
            updateRulerTicks(currentAnnotationContext.duration);
          }
        });
      } catch (e) {}
    }, 1200);
  }

  function drawStudioWaveform(isActive = false) {
    const canvas = document.getElementById('annot-studio-wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const numBars = 42;
    const barWidth = 3;
    const gap = (width - (numBars * barWidth)) / (numBars - 1);

    for (let i = 0; i < numBars; i++) {
      let h;
      if (isActive) {
        h = Math.max(4, Math.sin(Date.now() / 140 + i * 0.45) * 12 + Math.random() * 8 + 8);
      } else {
        h = Math.max(3, Math.sin(i * 0.28) * 6 + 7);
      }
      const x = i * (barWidth + gap);
      const y = (height - h) / 2;
      ctx.fillStyle = isActive ? '#2563EB' : '#94A3B8';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barWidth, h, 2);
      else ctx.rect(x, y, barWidth, h);
      ctx.fill();
    }
  }

  async function initCreateAnnotationPanel(mode = null) {
    const contextLabel = document.getElementById('annot-context-label');
    const sourceType = document.getElementById('annot-source-type');
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');
    const timelineBox = document.getElementById('annot-timeline-box');
    const snippetBox = document.getElementById('annot-text-snippet-box');
    const snippetTextEl = document.getElementById('annot-snippet-text');
    const screenshotBox = document.getElementById('annot-screenshot-box');
    const screenshotImg = document.getElementById('annot-screenshot-img');
    const editorSection = document.getElementById('annot-editor-section');
    const successCard = document.getElementById('annot-published-success-card');
    const voiceStudioBox = document.getElementById('annot-voice-studio-box');
    const codeSnippetBox = document.getElementById('annot-code-snippet-box');
    const sourceBadgeLabel = document.getElementById('annot-source-type-label');
    const sourceBadgeIcon = document.getElementById('annot-source-type-icon');
    const annotCommentInput = document.getElementById('annot-comment-input');
    const customUrlInput = document.getElementById('annot-custom-url-input');

    // Reset visibility to editor
    if (editorSection) editorSection.classList.remove('hidden');
    if (successCard) successCard.classList.add('hidden');
    if (voiceStudioBox) voiceStudioBox.classList.add('hidden');
    if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
    loadAnnotatedUser().catch(() => {});

    // Sync custom URL input
    if (customUrlInput) {
      if (currentAnnotationContext.url) {
        customUrlInput.value = currentAnnotationContext.url;
      }
      customUrlInput.oninput = (e) => {
        currentAnnotationContext.url = e.target.value.trim();
      };
    }

    // If this is a sketch annotation, display sketch and do not switch to YouTube
    if (currentAnnotationContext.type === 'sketch' || currentAnnotationContext.sketch) {
      if (timelineBox) timelineBox.classList.add('hidden');
      if (snippetBox) snippetBox.classList.add('hidden');
      if (screenshotBox && screenshotImg && currentAnnotationContext.attachedImageUrl) {
        screenshotImg.src = currentAnnotationContext.attachedImageUrl;
        screenshotBox.classList.remove('hidden');
      }
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Handwriting & Sketch';
      if (sourceBadgeIcon) {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>';
      }
      return;
    }

    initTimelineDragHandles();
    initClipDeckControls();
    startAutoVideoWatcher();

    try {
      const tab = await getActiveWebTab();
      const tabUrl = (tab && tab.url) ? tab.url : (currentAnnotationContext.url || '');
      const platform = getPlatformInfo(tabUrl, tab?.title);
      const isVideoPlatform = platform.isDedicatedVideo;
      const isYouTube = platform.type === 'youtube';

      if (!tab || !tab.id) {
        setupFallbackContext(mode, isVideoPlatform);
        return;
      }
      currentAnnotationContext.url = tab.url || '';
      if (customUrlInput) customUrlInput.value = tab.url || '';

      if (isVideoPlatform) {
        // 🎬 DEDICATED VIDEO PLATFORM (YouTube, TikTok, Instagram Reels, Vimeo, Twitch, Podcasts)
        currentAnnotationContext.type = platform.type === 'audio' ? 'audio' : 'video';
        const rawTabTitle = (tab.title || '').replace(' - YouTube', '').trim();
        const initialTitle = rawTabTitle || `${platform.name} Video`;
        currentAnnotationContext.mediaTitle = initialTitle;

        if (mediaTitleEl) {
          mediaTitleEl.innerText = initialTitle;
          mediaTitleEl.title = initialTitle;
        }
        if (mediaChannelEl) mediaChannelEl.innerText = platform.name;
        if (sourceBadgeLabel) sourceBadgeLabel.innerText = platform.name;
        if (sourceBadgeIcon) {
          if (isYouTube) {
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="#EF4444"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>';
          } else {
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
          }
        }

        // Timeline trimmer active on dedicated video platforms
        if (timelineBox) timelineBox.classList.remove('hidden');
        if (snippetBox) snippetBox.classList.add('hidden');
        updateAnnotTimeDisplay();
        updateRulerTicks(currentAnnotationContext.duration || 300);

        // Safe query tab for video duration & position
        safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, (resp) => {
          if (resp) {
            const realTitle = (resp.title && resp.title !== 'Video Content') ? resp.title : initialTitle;
            const realChannel = resp.channel || platform.name;
            const cur = Math.max(0, Math.floor(resp.currentTime || 0));
            const dur = Math.max(cur + 30, Math.floor(resp.duration || 300));

            currentAnnotationContext.mediaTitle = realTitle;
            currentAnnotationContext.duration = dur;
            currentAnnotationContext.startTime = cur;
            currentAnnotationContext.endTime = Math.min(dur, cur + Math.min(30, MAX_CLIP_DURATION));
            lastDetectedVideoId = resp.videoId || null;
            lastDetectedTitle = realTitle;

            if (mediaTitleEl) mediaTitleEl.innerText = realTitle;
            if (mediaChannelEl) mediaChannelEl.innerText = realChannel;
            updateAnnotMediaDisplay(resp);
            updateAnnotTimeDisplay();
            updateRulerTicks(dur);
          }
        });
      } else {
        // 📄 REGULAR WEBSITE / ARTICLE / BLOG (Never force YouTube or video clipping!)
        const isVoiceMode = mode === 'voice';
        const isCodeMode = mode === 'code' || platform.type === 'github';
        const isCameraMode = mode === 'camera';

        currentAnnotationContext.type = isVoiceMode ? 'voice' : (isCodeMode ? 'code' : (isCameraMode ? 'screenshot' : 'text'));
        if (timelineBox) timelineBox.classList.add('hidden');

        const pageTitle = (tab.title || 'Web Page').trim();
        currentAnnotationContext.mediaTitle = pageTitle;
        if (mediaTitleEl) {
          mediaTitleEl.innerText = pageTitle;
          mediaTitleEl.title = pageTitle;
        }
        if (mediaChannelEl) {
          mediaChannelEl.innerText = platform.domain || platform.name;
        }

        if (isVoiceMode) {
          if (voiceStudioBox) voiceStudioBox.classList.remove('hidden');
          if (snippetBox) snippetBox.classList.add('hidden');
          if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Voice Commentary';
          if (sourceBadgeIcon) {
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
          }
          drawStudioWaveform(false);
        } else if (isCodeMode) {
          if (codeSnippetBox) codeSnippetBox.classList.remove('hidden');
          if (snippetBox) snippetBox.classList.add('hidden');
          if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Code Review & Annotation';
          if (sourceBadgeIcon) {
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
          }
        } else if (isCameraMode) {
          if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Camera / Screenshot';
          chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            if (dataUrl && screenshotImg && screenshotBox) {
              screenshotImg.src = dataUrl;
              currentAnnotationContext.screenshotUrl = dataUrl;
              screenshotBox.classList.remove('hidden');
              attachImageToComment(dataUrl, false);
            }
          });
        } else {
          // Standard text / article annotation mode
          if (snippetBox) snippetBox.classList.remove('hidden');
          if (sourceBadgeLabel) sourceBadgeLabel.innerText = platform.name || 'Web Article';
          if (sourceBadgeIcon) {
            // Elegant modern web globe icon - NOT YouTube!
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
          }

          if (annotCommentInput && !annotCommentInput.value) {
            annotCommentInput.placeholder = 'Write your thoughts or annotation on this page...';
          }
        }

        // Check local storage for any pending selection text first
        if (!currentAnnotationContext.selectedText) {
          try {
            if (chrome.storage?.local) {
              const stored = await chrome.storage.local.get(['active_page_annotation']);
              if (stored.active_page_annotation?.pending_text) {
                currentAnnotationContext.selectedText = stored.active_page_annotation.pending_text;
              }
            }
          } catch (_) {}
        }

        if (currentAnnotationContext.selectedText) {
          if (snippetBox) snippetBox.classList.remove('hidden');
          if (snippetTextEl) snippetTextEl.innerText = currentAnnotationContext.selectedText;
        }

        // Safe query tab for any currently highlighted text on the page
        safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, (resp) => {
          const textToQuote = (resp && resp.selectedText) || currentAnnotationContext.selectedText;
          const isCode = (resp && resp.isCode) || currentAnnotationContext.isCode;
          if (textToQuote && textToQuote.trim()) {
            currentAnnotationContext.selectedText = textToQuote.trim();
            if (isCode) {
               currentAnnotationContext.isCode = true;
               if (snippetBox) snippetBox.classList.add('hidden');
               if (codeSnippetBox) {
                 codeSnippetBox.classList.remove('hidden');
                 const codePre = document.getElementById('annot-code-pre-code');
                 if (codePre) codePre.innerText = textToQuote.trim();
               }
            } else {
               currentAnnotationContext.isCode = false;
               if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
               if (snippetBox) snippetBox.classList.remove('hidden');
               if (snippetTextEl) snippetTextEl.innerText = textToQuote.trim();
            }
          } else {
            if (!platform.isDedicatedVideo && snippetBox) {
              if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
              snippetBox.classList.remove('hidden');
              if (snippetTextEl) {
                snippetTextEl.innerText = currentAnnotationContext.mediaTitle || 'Highlight any sentence on this page to quote it directly.';
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn('Annotation tab query error:', e);
      setupFallbackContext(mode, false);
    }
  }

  function setupFallbackContext(mode, isDedicatedVideo = false) {
    const timelineBox = document.getElementById('annot-timeline-box');
    const snippetBox = document.getElementById('annot-text-snippet-box');
    const screenshotBox = document.getElementById('annot-screenshot-box');
    const voiceStudioBox = document.getElementById('annot-voice-studio-box');
    const codeSnippetBox = document.getElementById('annot-code-snippet-box');
    const sourceBadgeLabel = document.getElementById('annot-source-type-label');
    const sourceBadgeIcon = document.getElementById('annot-source-type-icon');
    const mediaTitleEl = document.getElementById('annot-media-title');
    const mediaChannelEl = document.getElementById('annot-media-channel');

    if (voiceStudioBox) voiceStudioBox.classList.add('hidden');
    if (codeSnippetBox) codeSnippetBox.classList.add('hidden');
    if (screenshotBox) screenshotBox.classList.add('hidden');

    const platform = getPlatformInfo(currentAnnotationContext.url);

    if (isDedicatedVideo || platform.isDedicatedVideo) {
      currentAnnotationContext.type = 'video';
      if (timelineBox) timelineBox.classList.remove('hidden');
      if (snippetBox) snippetBox.classList.add('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = platform.name;
      if (mediaTitleEl && (!mediaTitleEl.innerText || mediaTitleEl.innerText === 'Detecting media...')) {
        mediaTitleEl.innerText = currentAnnotationContext.mediaTitle || `${platform.name} Video`;
      }
      if (mediaChannelEl) mediaChannelEl.innerText = platform.name;
      initClipDeckControls();
      updateAnnotTimeDisplay();
      updateRulerTicks(currentAnnotationContext.duration || 300);
    } else {
      currentAnnotationContext.type = 'text';
      if (timelineBox) timelineBox.classList.add('hidden');
      if (snippetBox) snippetBox.classList.remove('hidden');
      if (sourceBadgeLabel) sourceBadgeLabel.innerText = platform.name || 'Web Article';
      if (sourceBadgeIcon) {
        sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      }
    }
  }

  // ═════════════════════════════════════════════════════════════════
  // ── STUDIO TOOLBAR ACTIONS: RECORD, SCRIPT, PLAY, SPLIT ──────────
  // ═════════════════════════════════════════════════════════════════

  // 1. Voice commentary recording (shared between #btn-pro-record, #btn-comment-voice and #btn-annot-voice-toggle)
  const btnProRecord = document.getElementById('btn-pro-record');
  const btnCommentVoice = document.getElementById('btn-comment-voice');
  const btnAnnotVoice = document.getElementById('btn-annot-voice-toggle');
  const annotVoiceText = document.getElementById('annot-voice-toggle-text');
  const annotVoiceDur = document.getElementById('annot-voice-duration');
  const annotPreviewWrap = document.getElementById('annot-voice-preview-wrap');
  const annotPreviewAudio = document.getElementById('annot-preview-audio');
  const chipVoicePreview = document.getElementById('chip-voice-preview');
  const chipVoiceDur = document.getElementById('chip-voice-dur');
  const chipVoiceAudio = document.getElementById('chip-voice-audio');
  const commentAttachmentsStrip = document.getElementById('comment-attachments-strip');
  const btnAnnotStudioRecord = document.getElementById('btn-annot-studio-record');
  const annotStudioRecordText = document.getElementById('annot-studio-record-text');
  const annotStudioRecordDot = document.getElementById('annot-studio-record-dot');
  const annotStudioVoiceTimer = document.getElementById('annot-studio-voice-timer');

  async function toggleVoiceCommentary() {
    if (!isAnnotVoiceRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        annotVoiceChunks = [];
        annotVoiceRecorder = new MediaRecorder(stream);
        annotVoiceRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) annotVoiceChunks.push(e.data);
        };
        annotVoiceRecorder.onstop = () => {
          const blob = new Blob(annotVoiceChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(blob);
          currentAnnotationContext.voiceBlobUrl = audioUrl;
          if (annotPreviewAudio) annotPreviewAudio.src = audioUrl;
          if (annotPreviewWrap) annotPreviewWrap.classList.remove('hidden');

          // Reveal voice preview chip in comment card
          if (chipVoicePreview && chipVoiceAudio && commentAttachmentsStrip) {
            chipVoiceAudio.src = audioUrl;
            if (chipVoiceDur) chipVoiceDur.innerText = formatTime(annotVoiceSeconds) + ' voice';
            chipVoicePreview.classList.remove('hidden');
            commentAttachmentsStrip.classList.remove('hidden');
          }

          stream.getTracks().forEach(t => t.stop());
          showStudioToast('Voice commentary saved');
        };

        annotVoiceRecorder.start(250);
        isAnnotVoiceRecording = true;

        if (btnProRecord) {
          btnProRecord.classList.add('recording');
          btnProRecord.innerHTML = '<span class="pro-tool-dot"></span> Stop';
        }
        if (btnAnnotStudioRecord) {
          btnAnnotStudioRecord.classList.add('recording');
          btnAnnotStudioRecord.style.background = '#DC2626';
        }
        if (annotStudioRecordText) annotStudioRecordText.innerText = 'Stop Recording';
        if (btnCommentVoice) btnCommentVoice.classList.add('recording');
        if (btnAnnotVoice) btnAnnotVoice.classList.add('recording');
        if (annotVoiceText) annotVoiceText.innerText = 'Stop recording';
        if (annotVoiceDur) {
          annotVoiceDur.classList.remove('hidden');
          annotVoiceSeconds = 0;
          annotVoiceDur.innerText = '0:00 secs';
        }
        if (annotStudioVoiceTimer) {
          annotStudioVoiceTimer.innerText = '0:00 secs';
        }

        if (annotVoiceTimerInterval) clearInterval(annotVoiceTimerInterval);
        annotVoiceTimerInterval = setInterval(() => {
          annotVoiceSeconds++;
          const tStr = formatTime(annotVoiceSeconds);
          if (annotVoiceDur) annotVoiceDur.innerText = tStr + ' secs';
          if (annotStudioVoiceTimer) annotStudioVoiceTimer.innerText = tStr + ' secs';
          if (chipVoiceDur) chipVoiceDur.innerText = tStr + ' voice';
          if (btnProRecord && isAnnotVoiceRecording) {
            btnProRecord.innerHTML = `<span class="pro-tool-dot"></span> ${tStr}`;
          }
          drawStudioWaveform(true);
        }, 1000);

        showStudioToast('Recording commentary...');
      } catch (e) {
        alert('Please allow microphone permissions to record voice commentary.');
      }
    } else {
      isAnnotVoiceRecording = false;
      if (annotVoiceRecorder && annotVoiceRecorder.state !== 'inactive') {
        annotVoiceRecorder.stop();
      }
      clearInterval(annotVoiceTimerInterval);
      if (btnProRecord) {
        btnProRecord.classList.remove('recording');
        btnProRecord.innerHTML = '<span class="pro-tool-dot"></span> Record';
      }
      if (btnAnnotStudioRecord) {
        btnAnnotStudioRecord.classList.remove('recording');
        btnAnnotStudioRecord.style.background = '';
      }
      if (annotStudioRecordText) annotStudioRecordText.innerText = 'Record Voice';
      if (btnCommentVoice) btnCommentVoice.classList.remove('recording');
      if (btnAnnotVoice) btnAnnotVoice.classList.remove('recording');
      if (annotVoiceText) annotVoiceText.innerText = 'Re-record voice';
      drawStudioWaveform(false);
    }
  }

  if (btnProRecord) {
    btnProRecord.addEventListener('click', toggleVoiceCommentary);
  }
  if (btnCommentVoice) {
    btnCommentVoice.addEventListener('click', toggleVoiceCommentary);
  }
  if (btnAnnotVoice) {
    btnAnnotVoice.addEventListener('click', toggleVoiceCommentary);
  }
  if (btnAnnotStudioRecord) {
    btnAnnotStudioRecord.addEventListener('click', toggleVoiceCommentary);
  }

  // 2. Script Button: Extract transcript/captions for the active clip range
  const btnProScript = document.getElementById('btn-pro-script');
  if (btnProScript) {
    btnProScript.addEventListener('click', async () => {
      btnProScript.innerHTML = '<svg class="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Script';

      const s = currentAnnotationContext.startTime;
      const e = currentAnnotationContext.endTime;
      const sStr = formatTime(s);
      const eStr = formatTime(e);
      const commentInput = document.getElementById('annot-comment-input');

      try {
        const tab = await getActiveWebTab();
        if (tab && tab.id) {
          safeTabSendMessage(tab.id, {
            action: 'GET_VIDEO_SCRIPT',
            startTime: s,
            endTime: e
          }, (resp) => {
            btnProScript.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/></svg> Script';

            let note = '';
            if (resp && resp.hasScript && resp.text) {
              note = `[${sStr} - ${eStr} Script Quote]:\n"${resp.text}"\n\n`;
              showStudioToast('Script quote added to notes');
            } else {
              note = `[${sStr} - ${eStr}]: ${currentAnnotationContext.mediaTitle}\nTranscript Note:\n`;
              showStudioToast('Timestamp note added');
            }

            if (commentInput) {
              commentInput.value = note + (commentInput.value ? commentInput.value : '');
              commentInput.focus();
              commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
          return;
        }
      } catch (err) {}

      btnProScript.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/></svg> Script';
      if (commentInput) {
        commentInput.value = `[${sStr} - ${eStr}]: ${currentAnnotationContext.mediaTitle}\nTranscript Note:\n` + (commentInput.value || '');
        commentInput.focus();
      }
      showStudioToast('Timestamp note added');
    });
  }

  // 3. Play Button: Plays clip in the YouTube video with toggle and 90s max limit
  let isPreviewPlaying = false;
  let previewTimeoutTimer = null;
  const btnAnnotPreview = document.getElementById('btn-annot-preview');
  if (btnAnnotPreview) {
    btnAnnotPreview.addEventListener('click', async () => {
      if (isPreviewPlaying) {
        isPreviewPlaying = false;
        if (previewTimeoutTimer) clearTimeout(previewTimeoutTimer);
        btnAnnotPreview.classList.remove('playing');
        btnAnnotPreview.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play';

        try {
          const tab = await getActiveWebTab();
          if (tab && tab.id) safeTabSendMessage(tab.id, { action: 'PAUSE_VIDEO' });
        } catch (e) {}
        showStudioToast('Preview paused');
        return;
      }

      // Enforce 90-second maximum clip limit for preview
      const s = currentAnnotationContext.startTime;
      const e = Math.min(s + MAX_CLIP_DURATION, currentAnnotationContext.endTime);
      currentAnnotationContext.endTime = e;
      updateAnnotTimeDisplay();

      isPreviewPlaying = true;
      btnAnnotPreview.classList.add('playing');
      btnAnnotPreview.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
      showStudioToast(`Playing ${e - s}s clip`);

      try {
        const tab = await getActiveWebTab();
        if (tab && tab.id) {
          safeTabSendMessage(tab.id, {
            action: 'PREVIEW_CLIP',
            startTime: s,
            endTime: e
          });
        }
      } catch (err) {}

      const durationMs = (e - s) * 1000;
      if (previewTimeoutTimer) clearTimeout(previewTimeoutTimer);
      previewTimeoutTimer = setTimeout(() => {
        isPreviewPlaying = false;
        btnAnnotPreview.classList.remove('playing');
        btnAnnotPreview.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play';
      }, durationMs);
    });
  }

  // 4. Split Button: Split/Trim clip at current playhead position or in half
  const btnProSplit = document.getElementById('btn-pro-split');
  if (btnProSplit) {
    btnProSplit.addEventListener('click', () => {
      const s = currentAnnotationContext.startTime;
      const e = currentAnnotationContext.endTime;

      // Determine split cut position:
      // If playhead/video needle is inside active range with at least 1s margin:
      let cutPoint;
      if (lastKnownVideoTime > s + 1 && lastKnownVideoTime < e - 1) {
        cutPoint = Math.round(lastKnownVideoTime);
      } else {
        // Otherwise split the current clip in half!
        cutPoint = Math.round(s + (e - s) / 2);
      }

      if (cutPoint - s >= 2) {
        currentAnnotationContext.endTime = cutPoint;
        showStudioToast(`Trimmed to ${formatTime(s)} - ${formatTime(cutPoint)}`);
      } else if (e - cutPoint >= 2) {
        currentAnnotationContext.startTime = cutPoint;
        showStudioToast(`Trimmed to ${formatTime(cutPoint)} - ${formatTime(e)}`);
      }

      // Enforce 90-second maximum clip limit
      if (currentAnnotationContext.endTime - currentAnnotationContext.startTime > MAX_CLIP_DURATION) {
        currentAnnotationContext.endTime = currentAnnotationContext.startTime + MAX_CLIP_DURATION;
      }

      updateAnnotTimeDisplay();
      seekTabTo(currentAnnotationContext.startTime);

      const trimBox = document.getElementById('pro-trim-box');
      if (trimBox) {
        trimBox.style.transform = 'scale(1.03)';
        setTimeout(() => { trimBox.style.transform = 'scale(1)'; }, 180);
      }
    });
  }

  // ═════════════════════════════════════════════════════════════════
  // ── COMMENT CARD ATTACHMENTS & TOOLBAR ACTIONS ───────────────────
  // ═════════════════════════════════════════════════════════════════

  // Dismiss / Clear Comment Button
  const btnClearComment = document.getElementById('btn-clear-comment');
  if (btnClearComment) {
    btnClearComment.addEventListener('click', () => {
      const commentInput = document.getElementById('annot-comment-input');
      if (commentInput) commentInput.value = '';
      currentAnnotationContext.attachedImageUrl = null;
      currentAnnotationContext.voiceBlobUrl = null;
      const chipImg = document.getElementById('chip-image-preview');
      const chipVoice = document.getElementById('chip-voice-preview');
      const strip = document.getElementById('comment-attachments-strip');
      if (chipImg) chipImg.classList.add('hidden');
      if (chipVoice) chipVoice.classList.add('hidden');
      if (strip) strip.classList.add('hidden');
      showStudioToast('Note cleared');
    });
  }

  // Camera / Video Snapshot (Take current frame snapshot from video)
  const btnCommentSnapshot = document.getElementById('btn-comment-snapshot');
  if (btnCommentSnapshot) {
    btnCommentSnapshot.addEventListener('click', async () => {
      try {
        const tab = await getActiveWebTab();
        if (tab && tab.id) {
          safeTabSendMessage(tab.id, { action: 'GET_VIDEO_INFO' }, (resp) => {
            const frameUrl = (resp && (resp.frameSnapshot || resp.thumbnailUrl)) || DEFAULT_FRAME_THUMB;
            attachImageToComment(frameUrl);
            showStudioToast('Video frame attached');
          });
          return;
        }
      } catch (e) {}
      attachImageToComment(DEFAULT_FRAME_THUMB);
      showStudioToast('Video frame attached');
    });
  }

  // Paperclip (Upload image/photo from computer)
  const btnCommentAttach = document.getElementById('btn-comment-attach');
  const annotImageUpload = document.getElementById('annot-image-upload');
  if (btnCommentAttach && annotImageUpload) {
    btnCommentAttach.addEventListener('click', () => {
      annotImageUpload.click();
    });
    annotImageUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          attachImageToComment(dataUrl);
          showStudioToast('Photo attached');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function attachImageToComment(url, isSketch = false) {
    currentAnnotationContext.attachedImageUrl = url;
    const chipImg = document.getElementById('chip-image-preview');
    const chipImgSrc = document.getElementById('chip-img-src');
    const chipLabel = document.getElementById('chip-img-label');
    const redrawBtn = document.getElementById('btn-redraw-sketch');
    const strip = document.getElementById('comment-attachments-strip');
    if (chipImgSrc) chipImgSrc.src = url;
    if (chipLabel) chipLabel.innerText = isSketch ? 'Sketch' : 'Photo';
    if (redrawBtn) {
      if (isSketch) redrawBtn.classList.remove('hidden');
      else redrawBtn.classList.add('hidden');
    }
    if (chipImg) chipImg.classList.remove('hidden');
    if (strip) strip.classList.remove('hidden');
  }

  const btnRemoveChipImg = document.getElementById('btn-remove-chip-img');
  if (btnRemoveChipImg) {
    btnRemoveChipImg.addEventListener('click', () => {
      const wasSketch = currentAnnotationContext.type === 'sketch' || !!currentAnnotationContext.sketch;
      currentAnnotationContext.attachedImageUrl = null;
      currentAnnotationContext.sketch = null;
      if (currentAnnotationContext.type === 'sketch') {
        currentAnnotationContext.type = 'video';
      }
      const chipImg = document.getElementById('chip-image-preview');
      const redrawBtn = document.getElementById('btn-redraw-sketch');
      const chipLabel = document.getElementById('chip-img-label');
      if (chipImg) chipImg.classList.add('hidden');
      if (redrawBtn) redrawBtn.classList.add('hidden');
      if (chipLabel) chipLabel.innerText = 'Photo';

      const screenshotBox = document.getElementById('annot-screenshot-box');
      if (screenshotBox && wasSketch) {
        screenshotBox.classList.add('hidden');
        const timelineBox = document.getElementById('annot-timeline-box');
        if (timelineBox) timelineBox.classList.remove('hidden');
      }

      checkAttachmentsStripVisibility();
      showStudioToast(wasSketch ? 'Sketch removed' : 'Photo removed');
    });
  }

  const btnRedrawSketch = document.getElementById('btn-redraw-sketch');
  if (btnRedrawSketch) {
    btnRedrawSketch.addEventListener('click', () => {
      sketchReturnPanel = 'create-annotation';
      switchPanel('handwriting', 'create-annotation');
    });
  }

  const btnCommentSketch = document.getElementById('btn-comment-sketch');
  if (btnCommentSketch) {
    btnCommentSketch.addEventListener('click', () => {
      sketchReturnPanel = 'create-annotation';
      switchPanel('handwriting', 'create-annotation');
    });
  }

  // Play voice preview in comment card chip
  const btnChipPlayVoice = document.getElementById('btn-chip-play-voice');
  const chipVoiceAudioEl = document.getElementById('chip-voice-audio');
  if (btnChipPlayVoice && chipVoiceAudioEl) {
    btnChipPlayVoice.addEventListener('click', () => {
      if (chipVoiceAudioEl.paused) {
        chipVoiceAudioEl.play();
        btnChipPlayVoice.innerHTML = '<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      } else {
        chipVoiceAudioEl.pause();
        btnChipPlayVoice.innerHTML = '<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      }
    });
    chipVoiceAudioEl.addEventListener('ended', () => {
      btnChipPlayVoice.innerHTML = '<svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    });
  }

  // Remove voice note chip
  const btnRemoveChipVoice = document.getElementById('btn-remove-chip-voice');
  if (btnRemoveChipVoice) {
    btnRemoveChipVoice.addEventListener('click', () => {
      currentAnnotationContext.voiceBlobUrl = null;
      const chipVoice = document.getElementById('chip-voice-preview');
      if (chipVoice) chipVoice.classList.add('hidden');
      checkAttachmentsStripVisibility();
      showStudioToast('Voice note removed');
    });
  }

  function checkAttachmentsStripVisibility() {
    const strip = document.getElementById('comment-attachments-strip');
    const chipImg = document.getElementById('chip-image-preview');
    const chipVoice = document.getElementById('chip-voice-preview');
    const hasImg = chipImg && !chipImg.classList.contains('hidden');
    const hasVoice = chipVoice && !chipVoice.classList.contains('hidden');
    if (strip) {
      if (hasImg || hasVoice) {
        strip.classList.remove('hidden');
      } else {
        strip.classList.add('hidden');
      }
    }
  }

  // More options / Template button
  const btnCommentMore = document.getElementById('btn-comment-more');
  if (btnCommentMore) {
    btnCommentMore.addEventListener('click', () => {
      const s = formatTime(currentAnnotationContext.startTime);
      const commentInput = document.getElementById('annot-comment-input');
      if (commentInput) {
        const quoteTemplate = `\nHighlight at [${s}]:\n• `;
        commentInput.value = (commentInput.value || '').trim() + quoteTemplate;
        commentInput.focus();
        showStudioToast('Template added');
      }
    });
  }

  // Publish Annotation Action
  const btnPublishAnnotation = document.getElementById('btn-publish-annotation');
  const annotEditorSection = document.getElementById('annot-editor-section');
  const annotSuccessCard = document.getElementById('annot-published-success-card');
  const publishedMetaTimestamp = document.getElementById('published-meta-timestamp');
  const publishedCommentBubble = document.getElementById('published-comment-bubble');
  const publishedVoiceWrap = document.getElementById('published-voice-wrap');
  const publishedVoicePlayer = document.getElementById('published-voice-player');
  const btnViewDiscussion = document.getElementById('btn-view-discussion');
  const btnSharePublished = document.getElementById('btn-share-published-annotation');
  const btnCreateAnother = document.getElementById('btn-create-another-annotation');
  const annotCommentInput = document.getElementById('annot-comment-input');

  if (btnPublishAnnotation) {
    btnPublishAnnotation.addEventListener('click', async () => {
      // Check custom URL input
      const customUrlInput = document.getElementById('annot-custom-url-input');
      if (customUrlInput && customUrlInput.value.trim()) {
        currentAnnotationContext.url = customUrlInput.value.trim();
      }

      const commentText = (annotCommentInput ? annotCommentInput.value.trim() : '') || 'Insightful moment';
      const sFormatted = formatTime(currentAnnotationContext.startTime);
      const eFormatted = formatTime(currentAnnotationContext.endTime);
      const timeIntervalStr = `${sFormatted} → ${eFormatted}`;

      const newAnnotation = {
        id: 'annot_' + Date.now(),
        type: currentAnnotationContext.type,
        title: currentAnnotationContext.mediaTitle,
        url: currentAnnotationContext.url,
        startTime: currentAnnotationContext.startTime,
        endTime: currentAnnotationContext.endTime,
        timeFormatted: timeIntervalStr,
        comment: commentText,
        voiceBlobUrl: currentAnnotationContext.voiceBlobUrl,
        attachedImageUrl: currentAnnotationContext.attachedImageUrl || null,
        sketchId: currentAnnotationContext.sketch?.sketchId || null,
        sketchUrl: currentAnnotationContext.sketch?.imageUrl || null,
        createdAt: currentAnnotationContext.sketch?.createdAt || new Date().toISOString(),
        drawingMetadata: currentAnnotationContext.sketch?.drawingMetadata || null,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        replies: []
      };

      // 1. Save in extension local storage
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          const data = await chrome.storage.local.get(['wm_annotations']);
          const list = data.wm_annotations || [];
          list.unshift(newAnnotation);
          await chrome.storage.local.set({ wm_annotations: list });
        }
      } catch (err) {
        console.warn('Storage error:', err);
      }

      // 2. Publish directly to PostgreSQL Platform Database
      try {
        let authData = {};
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          authData = await chrome.storage.local.get(['annotated_token', 'annotated_user']);
        }
        let token = authData.annotated_token;
        let user = authData.annotated_user;
        if (!token || !user) {
          const synced = await syncSessionFromWebTabs();
          if (synced?.token) token = synced.token;
          if (synced?.user) user = synced.user;
        }

        const pageUrl = currentAnnotationContext.url || 'https://annotated.ai';
        let domain = 'website';
        try { domain = new URL(pageUrl).hostname; } catch (e) {}

        let finalPageUrl = pageUrl;
        let startSec = 0;
        let endSec = 90;
        const platform = getPlatformInfo(pageUrl);
        const isMediaContext = platform.isDedicatedVideo || currentAnnotationContext.type === 'video' || currentAnnotationContext.type === 'audio';

        if (isMediaContext) {
          startSec = Math.max(0, Math.floor(currentAnnotationContext.startTime || 0));
          endSec = currentAnnotationContext.endTime ? Math.floor(currentAnnotationContext.endTime) : (startSec + 30);
          if (endSec <= startSec) endSec = startSec + 30;
          if (endSec - startSec > 90) endSec = startSec + 90;

          try {
            const u = new URL(pageUrl);
            u.searchParams.set('start', startSec);
            u.searchParams.set('end', endSec);
            u.searchParams.set('t', `${startSec}s`);
            finalPageUrl = u.toString();
          } catch (_) {
            const sep = finalPageUrl.includes('?') ? '&' : '?';
            finalPageUrl = `${finalPageUrl}${sep}start=${startSec}&end=${endSec}&t=${startSec}s`;
          }
        }

        let cleanMediaType = 'article';
        if (currentAnnotationContext.type === 'audio') cleanMediaType = 'audio';
        else if (currentAnnotationContext.type === 'video' || isMediaContext) cleanMediaType = 'video';
        else if (currentAnnotationContext.type === 'sketch') cleanMediaType = 'sketch';
        else if (currentAnnotationContext.type === 'screenshot') cleanMediaType = 'image';

        const payload = {
          page_url: finalPageUrl,
          page_title: currentAnnotationContext.mediaTitle || 'Web Research',
          page_domain: domain,
          highlighted_text: currentAnnotationContext.selectedText || currentAnnotationContext.mediaTitle || commentText,
          note: commentText,
          color: currentAnnotationContext.color || '#3297EE',
          anchor_selector: currentAnnotationContext.type || 'text',
          media_type: cleanMediaType,
          thumbnail_url: currentAnnotationContext.thumbnailUrl || null,
          start_time: startSec,
          end_time: endSec,
          clip_duration: endSec - startSec
        };

        const reqHeaders = {
          'Content-Type': 'application/json'
        };
        if (token) reqHeaders['Authorization'] = `Bearer ${token}`;
        if (user?.id) reqHeaders['X-User-Id'] = user.id;

        const apiRes = await fetch('http://localhost:5000/api/annotations', {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(payload)
        });
        const apiJson = await apiRes.json();
        if (apiJson?.success) {
          console.log('[Annotated Extension] Successfully published to platform PostgreSQL:', apiJson);
          // Notify open web app tabs to immediately update their feed and annotations
          if (typeof chrome !== 'undefined' && chrome.tabs) {
            const allTabs = await chrome.tabs.query({});
            allTabs.forEach(t => {
              if (t.url && (t.url.includes('localhost:3000') || t.url.includes('127.0.0.1:3000') || t.url.includes('annotated'))) {
                safeTabSendMessage(t.id, {
                  action: 'ANNOTATION_PUBLISHED_BY_EXTENSION',
                  annotation: apiJson.annotation,
                  post: apiJson.post
                });
              }
            });
          }
        }
      } catch (postErr) {
        console.warn('[Annotated Extension] Error syncing annotation to backend:', postErr);
      }

      // Hide editor, reveal published success card (Clean minimal view - no post in extension)
      if (annotEditorSection) annotEditorSection.classList.add('hidden');
      if (annotSuccessCard) {
        annotSuccessCard.classList.remove('hidden');
      }
    });
  }


  // Inside published card: View Discussion
  if (btnViewDiscussion) {
    btnViewDiscussion.addEventListener('click', () => {
      switchPanel('conversation');
    });
  }

  // Inside published card: Share
  if (btnSharePublished) {
    btnSharePublished.addEventListener('click', () => {
      const sFormatted = formatTime(currentAnnotationContext.startTime);
      const eFormatted = formatTime(currentAnnotationContext.endTime);
      const shareText = `[Annotation ${sFormatted} → ${eFormatted}]: "${annotCommentInput.value.trim() || 'Commentary'}" on ${currentAnnotationContext.mediaTitle} (${currentAnnotationContext.url})`;
      navigator.clipboard.writeText(shareText);
      const originalText = btnSharePublished.innerHTML;
      btnSharePublished.innerHTML = '✓ Copied!';
      btnSharePublished.style.background = '#10B981';
      btnSharePublished.style.color = '#FFFFFF';
      setTimeout(() => {
        btnSharePublished.innerHTML = originalText;
        btnSharePublished.style.background = '';
        btnSharePublished.style.color = '';
      }, 1500);
    });
  }

  // Inside published card: Create another annotation
  if (btnCreateAnother) {
    btnCreateAnother.addEventListener('click', () => {
      if (annotCommentInput) annotCommentInput.value = '';
      currentAnnotationContext.voiceBlobUrl = null;
      currentAnnotationContext.attachedImageUrl = null;
      currentAnnotationContext.sketch = null;
      const chipImg = document.getElementById('chip-image-preview');
      const chipVoice = document.getElementById('chip-voice-preview');
      const redrawBtn = document.getElementById('btn-redraw-sketch');
      const chipLabel = document.getElementById('chip-img-label');
      const strip = document.getElementById('comment-attachments-strip');
      if (chipImg) chipImg.classList.add('hidden');
      if (redrawBtn) redrawBtn.classList.add('hidden');
      if (chipLabel) chipLabel.innerText = 'Photo';
      if (chipVoice) chipVoice.classList.add('hidden');
      if (strip) strip.classList.add('hidden');

      if (annotPreviewWrap) annotPreviewWrap.classList.add('hidden');
      if (annotEditorSection) annotEditorSection.classList.remove('hidden');
      if (annotSuccessCard) annotSuccessCard.classList.add('hidden');
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // ── SECTION: CONVERSATION & DISCUSSIONS FEED ─────────────────────
  // ─────────────────────────────────────────────────────────────────
  // ── SECTION: CONVERSATION & DISCUSSIONS FEED ─────────────────────
  // ─────────────────────────────────────────────────────────────────
  let conversationPollTimer = null;

  // Helper: Compare post URL against active tab URL
  function isMatchingPage(itemUrl, currentTabUrl) {
    if (!itemUrl || !currentTabUrl) return false;
    try {
      const u1 = new URL(itemUrl);
      const u2 = new URL(currentTabUrl);

      // Hostname must match (ignoring www.)
      const h1 = u1.hostname.replace(/^www\./, '').toLowerCase();
      const h2 = u2.hostname.replace(/^www\./, '').toLowerCase();
      if (h1 !== h2) return false;

      // YouTube: match video ID (v query param or pathname)
      if (h1.includes('youtube.com') || h1.includes('youtu.be')) {
        const v1 = u1.searchParams.get('v') || u1.pathname.split('/').pop();
        const v2 = u2.searchParams.get('v') || u2.pathname.split('/').pop();
        return Boolean(v1 && v2 && v1 === v2);
      }

      // Spreaker: match episode ID
      if (h1.includes('spreaker.com')) {
        const ep1 = u1.pathname.match(/(?:--|\/episode\/)(\d+)/);
        const ep2 = u2.pathname.match(/(?:--|\/episode\/)(\d+)/);
        if (ep1 && ep2 && ep1[1] === ep2[1]) return true;
      }

      // Spotify: match episode or track path
      if (h1.includes('spotify.com')) {
        const s1 = u1.pathname.split('/').slice(0, 3).join('/');
        const s2 = u2.pathname.split('/').slice(0, 3).join('/');
        if (s1 === s2) return true;
      }

      // General web pages: compare pathname (ignoring trailing slash)
      const p1 = u1.pathname.replace(/\/+$/, '').toLowerCase();
      const p2 = u2.pathname.replace(/\/+$/, '').toLowerCase();
      return p1 === p2;
    } catch (_) {
      return false;
    }
  }

  function getClipBadge(postUrl) {
    if (!postUrl) return null;
    try {
      const u = new URL(postUrl);
      let start = u.searchParams.get('start');
      let end = u.searchParams.get('end');
      if (!start && u.searchParams.has('t')) {
        start = parseInt(u.searchParams.get('t'), 10);
      }
      if (start != null) {
        const sSec = parseInt(start, 10);
        const eSec = end ? parseInt(end, 10) : sSec + 30;
        const sM = Math.floor(sSec / 60);
        const sS = sSec % 60;
        const eM = Math.floor(eSec / 60);
        const eS = eSec % 60;
        return `${String(sM).padStart(2,'0')}:${String(sS).padStart(2,'0')} → ${String(eM).padStart(2,'0')}:${String(eS).padStart(2,'0')}`;
      }
    } catch (_) {}
    return null;
  }

  async function initConversationPanel() {
    const feed = document.getElementById('discussions-feed');
    const countPill = document.getElementById('discussions-count-pill');
    if (!feed) return;

    // 1. Get current active web tab
    const tab = await getActiveWebTab();
    const activeUrl = tab?.url || '';
    let currentDomain = '';
    try {
      currentDomain = new URL(activeUrl).hostname.replace(/^www\./, '');
    } catch (_) {}

    // 2. Get current auth user & token
    let authData = {};
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        authData = await chrome.storage.local.get(['annotated_token', 'annotated_user']);
      }
    } catch (_) {}
    let token = authData.annotated_token || localStorage.getItem('annotated_token') || '';
    let currentUser = authData.annotated_user;
    if (!token || !currentUser) {
      const synced = await syncSessionFromWebTabs();
      if (synced?.token) token = synced.token;
      if (synced?.user) currentUser = synced.user;
    }

    // 3. Fetch fresh posts from backend
    let allPosts = [];
    try {
      const dbRes = await fetch('http://localhost:5000/api/posts');
      const dbJson = await dbRes.json();
      if (dbJson?.success && Array.isArray(dbJson.posts)) {
        allPosts = dbJson.posts;
      }
    } catch (e) {
      console.warn('Error fetching posts for conversation:', e);
    }

    // Filter posts:
    // Only posts published on this specific active tab URL, and belonging to the current user
    const currentUserId = currentUser?.id;
    const currentUserHandle = currentUser?.handle;

    const pagePosts = allPosts.filter(p => {
      const postUrl = p.media_url || p.page_url || '';
      const matchesPage = isMatchingPage(postUrl, activeUrl);
      if (!matchesPage) return false;

      // Filter to current user's posts
      if (currentUserId || currentUserHandle) {
        return (p.user_id && p.user_id === currentUserId) || (p.author_handle && p.author_handle === currentUserHandle);
      }
      return true;
    });

    if (countPill) {
      countPill.innerText = `${pagePosts.length} Post${pagePosts.length === 1 ? '' : 's'}`;
    }

    feed.innerHTML = '';

    // If no posts on this page
    if (pagePosts.length === 0) {
      feed.innerHTML = `
        <div class="wm-empty-state" style="padding: 28px 16px; text-align: center;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #EFF6FF; color: #2563EB; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p style="font-size: 13.5px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">No posts on this page</p>
          <p style="font-size: 11.5px; color: #64748B; line-height: 1.5; max-width: 260px; margin: 0 auto 14px auto;">
            Your annotations on <strong>${currentDomain || 'this page'}</strong> will appear here along with live discussion and feedback.
          </p>
          <button class="wm-ghost-btn" id="btn-create-annot-empty" style="margin: 0 auto; display: inline-flex; align-items: center; gap: 4px;">
            + Annotate This Page
          </button>
        </div>
      `;

      const emptyBtn = document.getElementById('btn-create-annot-empty');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => switchPanel('create-annotation'));
      }
      return;
    }

    // Render cards for pagePosts
    pagePosts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'discussion-card';
      card.id = `disc-card-${post.id}`;

      const avatarSeed = encodeURIComponent(post.author_name || currentUser?.name || 'User');
      const authorAvatar = post.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`;
      const timeStr = post.created_at ? new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
      const clipBadgeText = getClipBadge(post.media_url);

      const comments = Array.isArray(post.comments) ? post.comments : [];

      card.innerHTML = `
        <div class="disc-card-header">
          <div class="disc-author-wrap">
            <img src="${authorAvatar}" class="disc-avatar" alt="${post.author_name || 'User'}" />
            <div class="disc-author-meta">
              <span class="disc-author-name">${post.author_name || 'You Can'}</span>
              <span class="disc-date">${timeStr}</span>
            </div>
          </div>
          ${clipBadgeText ? `<span class="disc-timestamp-badge" title="Clip time range">${clipBadgeText}</span>` : ''}
        </div>

        <div class="disc-text">${post.content || ''}</div>

        ${Array.isArray(post.hashtags) && post.hashtags.length > 0 ? `
          <div class="disc-hashtags">
            ${post.hashtags.map(h => `<span class="disc-tag">${h.startsWith('#') ? h : '#' + h}</span>`).join(' ')}
          </div>
        ` : ''}

        <!-- Comments / Replies List -->
        <div class="disc-comments-container">
          <div class="disc-comments-label">
            <span>Replies</span>
            <span class="disc-comments-count" id="count-comments-${post.id}">${comments.length}</span>
          </div>
          <div class="disc-comments-list" id="list-comments-${post.id}">
            ${comments.length === 0 ? `
              <div class="disc-no-comments">No replies yet. Comments from people on your post will appear here in real time.</div>
            ` : comments.map(c => `
              <div class="disc-comment-row" id="comment-${c.id}">
                <img src="${c.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.author_name || 'User')}`}" class="disc-comment-avatar" />
                <div class="disc-comment-bubble">
                  <div class="disc-comment-bubble-header">
                    <span class="disc-comment-bubble-author">${c.author_name || 'User'}</span>
                    <span class="disc-comment-bubble-time">${c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                  </div>
                  <p class="disc-comment-bubble-content">${c.content}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Inline Reply Input (Designed to match the post comment box) -->
        <div class="disc-reply-input-wrap">
          <img src="${currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}" class="disc-input-avatar" />
          <div class="disc-input-pill">
            <input 
              type="text" 
              class="disc-reply-input" 
              id="input-reply-${post.id}" 
              placeholder="Write a reply... (Press Enter to post)"
            />
            <button 
              type="button" 
              class="disc-send-btn" 
              id="btn-send-${post.id}" 
              title="Send reply"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      `;

      feed.appendChild(card);

      // Handle submitting reply
      const inputEl = card.querySelector(`#input-reply-${post.id}`);
      const sendBtn = card.querySelector(`#btn-send-${post.id}`);

      const doSendReply = async () => {
        const text = inputEl.value.trim();
        if (!text) return;
        inputEl.value = '';
        inputEl.disabled = true;

        // Dynamic auth resolution
        if (!currentUser || !token) {
          try {
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
              const freshAuth = await chrome.storage.local.get(['annotated_token', 'annotated_user']);
              if (freshAuth.annotated_token) token = freshAuth.annotated_token;
              if (freshAuth.annotated_user) currentUser = freshAuth.annotated_user;
            }
            if (!token || !currentUser) {
              const synced = await syncSessionFromWebTabs();
              if (synced?.token) token = synced.token;
              if (synced?.user) currentUser = synced.user;
            }
          } catch (_) {}
        }

        const tempId = 'temp-' + Date.now();
        const optimisticComment = {
          id: tempId,
          post_id: post.id,
          user_id: currentUser?.id,
          content: text,
          created_at: new Date().toISOString(),
          author_name: currentUser?.name || 'You Can',
          author_handle: currentUser?.handle || 'yemen',
          author_avatar: currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`
        };

        const listEl = card.querySelector(`#list-comments-${post.id}`);
        const countEl = card.querySelector(`#count-comments-${post.id}`);

        // Remove empty placeholder if present
        const noCommentsEl = listEl ? listEl.querySelector('.disc-no-comments') : null;
        if (noCommentsEl) noCommentsEl.remove();

        // 1. Optimistically append new comment to Extension DOM immediately!
        const newCommentRow = document.createElement('div');
        newCommentRow.className = 'disc-comment-row';
        newCommentRow.id = `comment-${tempId}`;
        newCommentRow.innerHTML = `
          <img src="${optimisticComment.author_avatar}" class="disc-comment-avatar" />
          <div class="disc-comment-bubble">
            <div class="disc-comment-bubble-header">
              <span class="disc-comment-bubble-author">${optimisticComment.author_name}</span>
              <span class="disc-comment-bubble-time">Just now</span>
            </div>
            <p class="disc-comment-bubble-content">${optimisticComment.content}</p>
          </div>
        `;
        if (listEl) listEl.appendChild(newCommentRow);

        if (countEl) {
          const curCount = parseInt(countEl.innerText || '0', 10);
          countEl.innerText = curCount + 1;
        }

        // 2. Immediately notify web app tabs (localhost:3000)
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          try {
            const allTabs = await chrome.tabs.query({});
            allTabs.forEach(t => {
              if (t.url && (t.url.includes('localhost:3000') || t.url.includes('127.0.0.1:3000') || t.url.includes('annotated'))) {
                safeTabSendMessage(t.id, {
                  action: 'COMMENT_ADDED_BY_EXTENSION',
                  postId: post.id,
                  comment: optimisticComment
                });
              }
            });
          } catch (_) {}
        }

        // 3. Post to backend PostgreSQL database
        try {
          const reqHeaders = { 'Content-Type': 'application/json' };
          const activeAuthToken = token || currentUser?.id;
          if (activeAuthToken) reqHeaders['Authorization'] = `Bearer ${activeAuthToken}`;
          if (currentUser?.id) reqHeaders['X-User-Id'] = currentUser.id;

          const res = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`, {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify({ content: text, user_id: currentUser?.id })
          });
          const data = await res.json();
          if (data.success && data.comment) {
            newCommentRow.id = `comment-${data.comment.id}`;
            // Notify web app again with confirmed ID
            if (typeof chrome !== 'undefined' && chrome.tabs) {
              const allTabs = await chrome.tabs.query({});
              allTabs.forEach(t => {
                if (t.url && (t.url.includes('localhost:3000') || t.url.includes('127.0.0.1:3000') || t.url.includes('annotated'))) {
                  safeTabSendMessage(t.id, {
                    action: 'COMMENT_ADDED_BY_EXTENSION',
                    postId: post.id,
                    comment: data.comment
                  });
                }
              });
            }
          }
        } catch (err) {
          console.error('Error posting comment to backend from extension:', err);
        } finally {
          inputEl.disabled = false;
          inputEl.focus();
        }
      };

      if (sendBtn) sendBtn.addEventListener('click', doSendReply);
      if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            doSendReply();
          }
        });
      }
    });

    // 4. Live Polling for new comments on these posts
    if (conversationPollTimer) {
      clearInterval(conversationPollTimer);
      conversationPollTimer = null;
    }

    conversationPollTimer = setInterval(async () => {
      // Only poll if panel-conversation is currently active
      const convPanel = document.getElementById('panel-conversation');
      if (!convPanel || !convPanel.classList.contains('active')) {
        clearInterval(conversationPollTimer);
        conversationPollTimer = null;
        return;
      }

      for (const p of pagePosts) {
        try {
          const res = await fetch(`http://localhost:5000/api/posts/${p.id}/comments`);
          const data = await res.json();
          if (data.success && Array.isArray(data.comments)) {
            const listEl = document.getElementById(`list-comments-${p.id}`);
            const countEl = document.getElementById(`count-comments-${p.id}`);
            if (listEl) {
              const existingIds = new Set(Array.from(listEl.querySelectorAll('.disc-comment-row')).map(el => el.id.replace('comment-', '')));
              const newComments = data.comments.filter(c => !existingIds.has(c.id));
              if (newComments.length > 0) {
                const noCommentsEl = listEl.querySelector('.disc-no-comments');
                if (noCommentsEl) noCommentsEl.remove();

                newComments.forEach(c => {
                  const row = document.createElement('div');
                  row.className = 'disc-comment-row';
                  row.id = `comment-${c.id}`;
                  row.innerHTML = `
                    <img src="${c.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.author_name || 'User')}`}" class="disc-comment-avatar" />
                    <div class="disc-comment-bubble">
                      <div class="disc-comment-bubble-header">
                        <span class="disc-comment-bubble-author">${c.author_name || 'User'}</span>
                        <span class="disc-comment-bubble-time">${c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                      </div>
                      <p class="disc-comment-bubble-content">${c.content}</p>
                    </div>
                  `;
                  listEl.appendChild(row);
                });

                if (countEl) countEl.innerText = data.comments.length;
              }
            }
          }
        } catch (_) {}
      }
    }, 3000);
  }

  // Re-check discussions when switching tabs or navigating
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.onActivated.addListener(async () => {
      const convPanel = document.getElementById('panel-conversation');
      if (convPanel && convPanel.classList.contains('active')) {
        initConversationPanel();
      }
    });
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
      if (changeInfo.url) {
        const convPanel = document.getElementById('panel-conversation');
        if (convPanel && convPanel.classList.contains('active')) {
          initConversationPanel();
        }
      }
    });
  }

  // Wire New Annotation from Conversation
  const btnNewAnnotFromConv = document.getElementById('btn-new-annot-from-conv');
  if (btnNewAnnotFromConv) {
    btnNewAnnotFromConv.addEventListener('click', () => {
      switchPanel('create-annotation', 'text');
    });
  }

  // Wire Import Panel
  const btnImportUrl = document.getElementById('btn-import-url');
  const importUrlInput = document.getElementById('import-url-input');
  if (btnImportUrl && importUrlInput) {
    btnImportUrl.addEventListener('click', () => {
      const u = importUrlInput.value.trim();
      if (u) {
        currentAnnotationContext.url = u;
        currentAnnotationContext.mediaTitle = u;
        const isVideo = u.includes('youtube') || u.includes('youtu.be') || u.match(/\.(mp4|webm|mov)$/i);
        switchPanel('create-annotation', isVideo ? 'video' : 'text');
      }
    });
  }

  const btnImportFile = document.getElementById('btn-import-file');
  const importFileInput = document.getElementById('import-file-input');
  if (btnImportFile && importFileInput) {
    btnImportFile.addEventListener('click', () => {
      importFileInput.click();
    });
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          attachImageToComment(dataUrl, false);
          switchPanel('create-annotation', 'text');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Wire Translate Panel -> Create Annotation
  const btnAnnotFromTranslate = document.getElementById('btn-annot-from-translate');
  if (btnAnnotFromTranslate) {
    btnAnnotFromTranslate.addEventListener('click', () => {
      const rawTransText = translateResultBox ? translateResultBox.innerText.trim() : '';
      if (rawTransText) {
        // Strip duplicate labels: [Translation], 🌐, Translation (xxx): etc.
        const cleanTrans = rawTransText
          .replace(/^\[Translation\]\s*:\s*/i, '')
          .replace(/^(?:🌐\s*)?(?:\*\*)?Translation(?:\s*\([^)]*\))?(?:\*\*)?\s*:\s*/i, '')
          .trim();

        // 1. Preserve the ORIGINAL source text (e.g., Chinese, Japanese, etc.)
        const customInputText = translateCustomInput ? translateCustomInput.value.trim() : '';
        const originalSourceText = (lastTranslatedOriginalText || customInputText || currentAnnotationContext.selectedText || '').trim();

        if (originalSourceText) {
          currentAnnotationContext.selectedText = originalSourceText;
          const snippetTextEl = document.getElementById('annot-snippet-text');
          const snippetBox = document.getElementById('annot-text-snippet-box');
          if (snippetTextEl) snippetTextEl.innerText = originalSourceText;
          if (snippetBox) snippetBox.classList.remove('hidden');
        }

        const formattedComment = `[Translation]: ${cleanTrans}\n\n`;
        currentAnnotationContext.type = 'text';
        const commentInput = document.getElementById('annot-comment-input');
        if (commentInput) {
          commentInput.value = formattedComment;
        }
        switchPanel('create-annotation', 'text');
      }
    });
  }

  // Wire Listen Panel -> Create Annotation
  const btnAnnotFromListen = document.getElementById('btn-annot-from-listen');
  if (btnAnnotFromListen) {
    btnAnnotFromListen.addEventListener('click', () => {
      const text = getCurrentTtsText();
      if (text) {
        currentAnnotationContext.selectedText = text;
        currentAnnotationContext.type = 'text';
        switchPanel('create-annotation', 'text');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // ── SECTION: HANDWRITING & SKETCH ────────────────────────────────
  // ─────────────────────────────────────────────────────────────────
  let sketchReturnPanel = 'home';
  let sketchStrokes = [];
  let sketchRedoStack = [];
  let sketchCurrentTool = 'pen'; // 'pen' | 'highlighter' | 'eraser'
  let sketchCurrentColor = '#2F3BF5';
  let sketchStrokeSize = 'medium'; // 'thin' | 'medium' | 'thick'
  let sketchIsDrawing = false;
  let sketchActiveStroke = null;
  let sketchCanvasInitialized = false;
  let sketchBackgroundImage = null;
  let sketchBackgroundDataUrl = null;
  let offscreenSketchCanvas = null;

  function getToolStrokeWidth(tool, size) {
    if (tool === 'eraser') {
      if (size === 'thin') return 16;
      if (size === 'thick') return 36;
      return 24; // medium
    }
    if (tool === 'highlighter') {
      if (size === 'thin') return 14;
      if (size === 'thick') return 30;
      return 22; // medium
    }
    // pen
    if (size === 'thin') return 2.5;
    if (size === 'thick') return 8.5;
    return 4.5; // medium
  }

  function initHandwritingPanel(fromPanel = null) {
    if (fromPanel) {
      sketchReturnPanel = fromPanel;
    }

    const canvas = document.getElementById('sketch-canvas');
    const wrap = document.getElementById('sketch-canvas-wrap');
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('sketch-color');
    const colorSwatch = document.getElementById('sketch-color-swatch');
    const colorWrap = document.getElementById('sketch-color-wrap');
    const btnPen = document.getElementById('btn-tool-pen');
    const btnHighlighter = document.getElementById('btn-tool-highlighter');
    const btnEraser = document.getElementById('btn-tool-eraser');
    const btnCapture = document.getElementById('btn-sketch-capture');
    const btnHintCapture = document.getElementById('btn-hint-capture-page');
    const btnUndo = document.getElementById('btn-sketch-undo');
    const btnRedo = document.getElementById('btn-sketch-redo');
    const btnClear = document.getElementById('btn-clear-sketch');
    const btnSaveSketch = document.getElementById('btn-save-sketch-annot');
    const btnBack = document.getElementById('btn-sketch-back');
    const emptyHint = document.getElementById('sketch-empty-hint');
    const clearConfirmModal = document.getElementById('sketch-clear-confirm');
    const btnCancelClear = document.getElementById('btn-cancel-clear');
    const btnConfirmClearStrokes = document.getElementById('btn-confirm-clear-strokes');
    const btnConfirmClearAll = document.getElementById('btn-confirm-clear-all');
    const sizeBtns = document.querySelectorAll('.sketch-size-btn');
    const paletteBtns = document.querySelectorAll('.palette-dot-btn');

    // Canvas coordinate mapping
    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    // Set Tool
    function selectTool(tool) {
      sketchCurrentTool = tool;
      [btnPen, btnHighlighter, btnEraser].forEach(b => b && b.classList.remove('active'));
      if (tool === 'pen' && btnPen) btnPen.classList.add('active');
      if (tool === 'highlighter' && btnHighlighter) btnHighlighter.classList.add('active');
      if (tool === 'eraser' && btnEraser) btnEraser.classList.add('active');
    }

    // Set Color
    function selectColor(color) {
      sketchCurrentColor = color;
      if (colorInput) colorInput.value = color;
      if (colorSwatch) colorSwatch.style.backgroundColor = color;
      paletteBtns.forEach(p => {
        if (p.dataset.color && p.dataset.color.toLowerCase() === color.toLowerCase()) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      // If currently on eraser, switch back to pen so user immediately draws with selected color
      if (sketchCurrentTool === 'eraser') {
        selectTool('pen');
      }
    }

    // Set Size
    function selectSize(size) {
      sketchStrokeSize = size;
      sizeBtns.forEach(btn => {
        if (btn.dataset.size === size) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update UI (Undo, Redo, Add to Annotation, Empty Hint)
    function updateSketchUI() {
      const hasStrokes = sketchStrokes.length > 0;
      const hasBackground = !!sketchBackgroundImage;
      const hasRedo = sketchRedoStack.length > 0;

      if (emptyHint) {
        if (hasStrokes || hasBackground) {
          emptyHint.classList.add('hidden');
        } else {
          emptyHint.classList.remove('hidden');
        }
      }

      if (btnSaveSketch) {
        btnSaveSketch.disabled = !(hasStrokes || hasBackground);
      }

      if (btnUndo) {
        btnUndo.disabled = !hasStrokes;
      }

      if (btnRedo) {
        btnRedo.disabled = !hasRedo;
      }
    }

    // Draw single stroke with smooth curves onto a target context
    function drawSingleStroke(context, stroke) {
      if (!stroke || !stroke.points || stroke.points.length === 0) return;
      const pts = stroke.points;

      context.save();
      context.beginPath();

      if (stroke.tool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
        context.strokeStyle = '#000000';
        context.fillStyle = '#000000';
        context.lineWidth = stroke.width || 24;
        context.globalAlpha = 1.0;
      } else if (stroke.tool === 'highlighter') {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = stroke.color;
        context.fillStyle = stroke.color;
        context.lineWidth = stroke.width || 22;
        context.globalAlpha = stroke.opacity || 0.35;
      } else {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = stroke.color;
        context.fillStyle = stroke.color;
        context.lineWidth = stroke.width || 4.5;
        context.globalAlpha = 1.0;
      }

      context.lineCap = 'round';
      context.lineJoin = 'round';

      if (pts.length === 1) {
        context.arc(pts[0].x, pts[0].y, context.lineWidth / 2, 0, Math.PI * 2);
        context.fill();
      } else {
        context.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          context.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        const last = pts[pts.length - 1];
        context.lineTo(last.x, last.y);
        context.stroke();
      }

      context.restore();
    }

    // Redraw visible canvas with 2-layer approach (background screenshot + offscreen drawing)
    function redrawCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;

      // 1. Offscreen canvas for user strokes (so eraser removes strokes only, never background)
      if (!offscreenSketchCanvas) {
        offscreenSketchCanvas = document.createElement('canvas');
      }
      offscreenSketchCanvas.width = canvas.width;
      offscreenSketchCanvas.height = canvas.height;
      const offCtx = offscreenSketchCanvas.getContext('2d');
      offCtx.save();
      offCtx.setTransform(1, 0, 0, 1, 0, 0);
      offCtx.clearRect(0, 0, offscreenSketchCanvas.width, offscreenSketchCanvas.height);
      offCtx.scale(dpr, dpr);

      sketchStrokes.forEach(stroke => {
        drawSingleStroke(offCtx, stroke);
      });
      offCtx.restore();

      // 2. Visible canvas
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      if (sketchBackgroundImage) {
        ctx.drawImage(sketchBackgroundImage, 0, 0, cw, ch);
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, cw, ch);
      }

      // Draw stroke layer on top of background
      ctx.drawImage(offscreenSketchCanvas, 0, 0, cw, ch);

      ctx.restore();
      updateSketchUI();
    }

    // Capture Page Screenshot
    async function capturePageScreenshot() {
      try {
        showStudioToast('Capturing screenshot...');
        const tab = await getActiveWebTab();
        if (tab) {
          if (tab.url && !tab.url.startsWith('chrome-extension://')) {
            currentAnnotationContext.url = tab.url;
          }
          if (tab.title) {
            currentAnnotationContext.mediaTitle = tab.title;
          }
        }
          if (chrome.tabs.captureVisibleTab) {
            chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
              if (chrome.runtime.lastError || !dataUrl) {
                generateFallbackPageBackground();
                return;
              }
              loadBackgroundImage(dataUrl);
            });
            return;
          }
        generateFallbackPageBackground();
      } catch (err) {
        generateFallbackPageBackground();
      }
    }

    function loadBackgroundImage(dataUrl) {
      sketchBackgroundDataUrl = dataUrl;
      const img = new Image();
      img.onload = () => {
        sketchBackgroundImage = img;
        redrawCanvas();
        updateSketchUI();
        showStudioToast('Screenshot loaded! Draw or highlight now.');
      };
      img.src = dataUrl;
    }

    function generateFallbackPageBackground() {
      const mockCanvas = document.createElement('canvas');
      mockCanvas.width = 600;
      mockCanvas.height = 500;
      const mCtx = mockCanvas.getContext('2d');
      mCtx.fillStyle = '#F8FAFC';
      mCtx.fillRect(0, 0, 600, 500);

      // Web card mock
      mCtx.fillStyle = '#FFFFFF';
      mCtx.fillRect(20, 20, 560, 50);
      mCtx.strokeStyle = '#E2E8F0';
      mCtx.lineWidth = 1.5;
      mCtx.strokeRect(20, 20, 560, 50);

      mCtx.fillStyle = '#2563EB';
      mCtx.font = 'bold 16px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      mCtx.fillText('Web Page Article Content', 35, 52);

      // Paragraph lines
      mCtx.fillStyle = '#94A3B8';
      for (let i = 0; i < 6; i++) {
        mCtx.fillRect(35, 100 + i * 26, 520 - (i % 2) * 80, 12);
      }

      mCtx.fillStyle = '#E2E8F0';
      mCtx.fillRect(35, 290, 250, 160);
      mCtx.fillRect(305, 290, 250, 160);

      loadBackgroundImage(mockCanvas.toDataURL('image/png'));
    }

    // Resize Canvas handling
    function resizeCanvas() {
      const rect = wrap.getBoundingClientRect();
      if (rect.width <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height > 0 ? rect.height : 280);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      redrawCanvas();
    }

    // Initialize Canvas Dimensions & redraw
    resizeCanvas();

    if (!sketchCanvasInitialized) {
      sketchCanvasInitialized = true;

      window.addEventListener('resize', () => {
        const panel = document.getElementById('panel-handwriting');
        if (panel && panel.classList.contains('active')) {
          resizeCanvas();
        }
      });

      // Pointer Drawing Events
      canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        try { canvas.setPointerCapture(e.pointerId); } catch(err) {}
        sketchIsDrawing = true;

        const pos = getPointerPos(e);
        const strokeWidth = getToolStrokeWidth(sketchCurrentTool, sketchStrokeSize);

        sketchActiveStroke = {
          tool: sketchCurrentTool,
          color: sketchCurrentColor,
          size: sketchStrokeSize,
          width: strokeWidth,
          opacity: sketchCurrentTool === 'highlighter' ? 0.35 : 1.0,
          points: [pos]
        };

        if (sketchActiveStroke.tool === 'eraser') {
          // Erase on offscreen canvas and redraw composite
          if (offscreenSketchCanvas) {
            const offCtx = offscreenSketchCanvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            offCtx.save();
            offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawSingleStroke(offCtx, sketchActiveStroke);
            offCtx.restore();
            redrawCanvas();
          }
        } else {
          // Draw dot directly on visible canvas and offscreen canvas
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          drawSingleStroke(ctx, sketchActiveStroke);
          ctx.restore();

          if (offscreenSketchCanvas) {
            const offCtx = offscreenSketchCanvas.getContext('2d');
            offCtx.save();
            offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawSingleStroke(offCtx, sketchActiveStroke);
            offCtx.restore();
          }
        }

        if (emptyHint) emptyHint.classList.add('hidden');
      }, { passive: false });

      canvas.addEventListener('pointermove', (e) => {
        if (!sketchIsDrawing || !sketchActiveStroke) return;
        e.preventDefault();

        const pos = getPointerPos(e);
        const pts = sketchActiveStroke.points;
        pts.push(pos);

        const dpr = window.devicePixelRatio || 1;

        if (sketchActiveStroke.tool === 'eraser') {
          // Erase only on offscreen stroke canvas then refresh visible canvas
          if (offscreenSketchCanvas) {
            const offCtx = offscreenSketchCanvas.getContext('2d');
            offCtx.save();
            offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            offCtx.beginPath();
            offCtx.globalCompositeOperation = 'destination-out';
            offCtx.lineWidth = sketchActiveStroke.width;
            offCtx.lineCap = 'round';
            offCtx.lineJoin = 'round';
            const p0 = pts[pts.length - 2];
            const p1 = pts[pts.length - 1];
            offCtx.moveTo(p0.x, p0.y);
            offCtx.lineTo(p1.x, p1.y);
            offCtx.stroke();
            offCtx.restore();

            // Refresh visible canvas
            const cw = canvas.width / dpr;
            const ch = canvas.height / dpr;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(dpr, dpr);
            if (sketchBackgroundImage) {
              ctx.drawImage(sketchBackgroundImage, 0, 0, cw, ch);
            } else {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, cw, ch);
            }
            ctx.drawImage(offscreenSketchCanvas, 0, 0, cw, ch);
            ctx.restore();
          }
        } else {
          // Pen or Highlighter
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          if (pts.length >= 2) {
            ctx.beginPath();
            if (sketchActiveStroke.tool === 'highlighter') {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = sketchActiveStroke.color;
              ctx.lineWidth = sketchActiveStroke.width;
              ctx.globalAlpha = sketchActiveStroke.opacity;
            } else {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = sketchActiveStroke.color;
              ctx.lineWidth = sketchActiveStroke.width;
              ctx.globalAlpha = 1.0;
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const p0 = pts[pts.length - 2];
            const p1 = pts[pts.length - 1];
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
          ctx.restore();

          // Also mirror on offscreen canvas
          if (offscreenSketchCanvas) {
            const offCtx = offscreenSketchCanvas.getContext('2d');
            offCtx.save();
            offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (pts.length >= 2) {
              offCtx.beginPath();
              if (sketchActiveStroke.tool === 'highlighter') {
                offCtx.globalCompositeOperation = 'source-over';
                offCtx.strokeStyle = sketchActiveStroke.color;
                offCtx.lineWidth = sketchActiveStroke.width;
                offCtx.globalAlpha = sketchActiveStroke.opacity;
              } else {
                offCtx.globalCompositeOperation = 'source-over';
                offCtx.strokeStyle = sketchActiveStroke.color;
                offCtx.lineWidth = sketchActiveStroke.width;
                offCtx.globalAlpha = 1.0;
              }
              offCtx.lineCap = 'round';
              offCtx.lineJoin = 'round';
              const p0 = pts[pts.length - 2];
              const p1 = pts[pts.length - 1];
              offCtx.moveTo(p0.x, p0.y);
              offCtx.lineTo(p1.x, p1.y);
              offCtx.stroke();
            }
            offCtx.restore();
          }
        }
      }, { passive: false });

      function finishStroke(e) {
        if (!sketchIsDrawing || !sketchActiveStroke) return;
        sketchIsDrawing = false;
        if (e && e.pointerId) {
          try { canvas.releasePointerCapture(e.pointerId); } catch(err) {}
        }

        if (sketchActiveStroke.points.length > 0) {
          sketchStrokes.push(sketchActiveStroke);
          sketchRedoStack = []; // reset redo history on new action
        }
        sketchActiveStroke = null;

        // Fully redraw to ensure smooth anti-aliased curves
        redrawCanvas();
      }

      canvas.addEventListener('pointerup', finishStroke);
      canvas.addEventListener('pointercancel', finishStroke);

      // Tool click listeners
      if (btnPen) btnPen.addEventListener('click', () => selectTool('pen'));
      if (btnHighlighter) btnHighlighter.addEventListener('click', () => selectTool('highlighter'));
      if (btnEraser) btnEraser.addEventListener('click', () => selectTool('eraser'));

      // Screenshot capture listeners
      if (btnCapture) btnCapture.addEventListener('click', capturePageScreenshot);
      if (btnHintCapture) btnHintCapture.addEventListener('click', capturePageScreenshot);

      // Color picker listener
      if (colorInput) {
        colorInput.addEventListener('input', (e) => selectColor(e.target.value));
        colorInput.addEventListener('change', (e) => selectColor(e.target.value));
      }
      if (colorWrap && colorInput) {
        colorWrap.addEventListener('click', () => colorInput.click());
      }

      // Quick palette listeners
      paletteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const col = btn.dataset.color;
          if (col) selectColor(col);
        });
      });

      // Stroke size listeners
      sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const s = btn.dataset.size;
          if (s) selectSize(s);
        });
      });

      // Undo action
      function handleUndo() {
        if (sketchStrokes.length === 0) return;
        const popped = sketchStrokes.pop();
        sketchRedoStack.push(popped);
        redrawCanvas();
      }

      // Redo action
      function handleRedo() {
        if (sketchRedoStack.length === 0) return;
        const restored = sketchRedoStack.pop();
        sketchStrokes.push(restored);
        redrawCanvas();
      }

      if (btnUndo) btnUndo.addEventListener('click', handleUndo);
      if (btnRedo) btnRedo.addEventListener('click', handleRedo);

      // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
      window.addEventListener('keydown', (e) => {
        const panel = document.getElementById('panel-handwriting');
        if (!panel || !panel.classList.contains('active')) return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleRedo();
        }
      });

      // Clear button with confirmation
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          if (sketchStrokes.length === 0 && !sketchBackgroundImage) return;
          if (clearConfirmModal) clearConfirmModal.classList.remove('hidden');
        });
      }

      if (btnCancelClear) {
        btnCancelClear.addEventListener('click', () => {
          if (clearConfirmModal) clearConfirmModal.classList.add('hidden');
        });
      }

      if (btnConfirmClearStrokes) {
        btnConfirmClearStrokes.addEventListener('click', () => {
          sketchStrokes = [];
          sketchRedoStack = [];
          redrawCanvas();
          if (clearConfirmModal) clearConfirmModal.classList.add('hidden');
          showStudioToast('Drawing strokes cleared');
        });
      }

      if (btnConfirmClearAll) {
        btnConfirmClearAll.addEventListener('click', () => {
          sketchStrokes = [];
          sketchRedoStack = [];
          sketchBackgroundImage = null;
          sketchBackgroundDataUrl = null;
          redrawCanvas();
          if (clearConfirmModal) clearConfirmModal.classList.add('hidden');
          showStudioToast('Workspace reset to blank');
        });
      }

      // Back / Close button
      if (btnBack) {
        btnBack.addEventListener('click', () => {
          switchPanel(sketchReturnPanel || 'home');
        });
      }

      // Add to Annotation button
      if (btnSaveSketch) {
        btnSaveSketch.addEventListener('click', () => {
          if (sketchStrokes.length === 0 && !sketchBackgroundImage) return;

          // Render high-res combined export canvas
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = canvas.width;
          exportCanvas.height = canvas.height;
          const expCtx = exportCanvas.getContext('2d');

          // 1. Base layer: screenshot or clean white
          if (sketchBackgroundImage) {
            expCtx.drawImage(sketchBackgroundImage, 0, 0, exportCanvas.width, exportCanvas.height);
          } else {
            expCtx.fillStyle = '#FFFFFF';
            expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          }

          // 2. Stroke layer (highlights & pen)
          if (offscreenSketchCanvas) {
            expCtx.drawImage(offscreenSketchCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
          } else {
            expCtx.drawImage(canvas, 0, 0);
          }

          const dataUrl = exportCanvas.toDataURL('image/png');
          const sketchId = 'sketch_' + Date.now();
          const createdAt = new Date().toISOString();

          // Save draft model
          currentAnnotationContext.sketch = {
            sketchId: sketchId,
            imageUrl: dataUrl,
            backgroundUrl: sketchBackgroundDataUrl || null,
            createdAt: createdAt,
            strokeCount: sketchStrokes.length,
            strokes: JSON.parse(JSON.stringify(sketchStrokes)),
            drawingMetadata: {
              hasScreenshot: !!sketchBackgroundImage,
              strokeCount: sketchStrokes.length,
              tool: sketchCurrentTool,
              size: sketchStrokeSize,
              createdAt: createdAt
            }
          };

          currentAnnotationContext.attachedImageUrl = dataUrl;
          currentAnnotationContext.type = 'sketch';

          // Return to Annotation composer
          switchPanel('create-annotation');

          // Update composer UI preview
          const chipImg = document.getElementById('chip-image-preview');
          const chipImgSrc = document.getElementById('chip-img-src');
          const chipLabel = document.getElementById('chip-img-label');
          const redrawBtn = document.getElementById('btn-redraw-sketch');
          const strip = document.getElementById('comment-attachments-strip');

          if (chipImgSrc) chipImgSrc.src = dataUrl;
          if (chipLabel) chipLabel.innerText = 'Sketch';
          if (redrawBtn) redrawBtn.classList.remove('hidden');
          if (chipImg) chipImg.classList.remove('hidden');
          if (strip) strip.classList.remove('hidden');

          // Sync URL field in composer
          const customUrlInput = document.getElementById('annot-custom-url-input');
          if (customUrlInput && currentAnnotationContext.url) {
            customUrlInput.value = currentAnnotationContext.url;
          }

          // Also set in screenshot box in studio card
          const screenshotImg = document.getElementById('annot-screenshot-img');
          const screenshotBox = document.getElementById('annot-screenshot-box');
          const timelineBox = document.getElementById('annot-timeline-box');
          const snippetBox = document.getElementById('annot-text-snippet-box');
          const sourceBadgeLabel = document.getElementById('annot-source-type-label');
          const sourceBadgeIcon = document.getElementById('annot-source-type-icon');

          if (sourceBadgeLabel) sourceBadgeLabel.innerText = 'Handwriting & Sketch';
          if (sourceBadgeIcon) {
            sourceBadgeIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>';
          }

          if (screenshotImg && screenshotBox) {
            screenshotImg.src = dataUrl;
            screenshotBox.classList.remove('hidden');
            if (timelineBox) timelineBox.classList.add('hidden');
            if (snippetBox) snippetBox.classList.add('hidden');
          }

          showStudioToast('Sketch added to annotation');
        });
      }
    }

    updateSketchUI();
  }


  // ═════════════════════════════════════════════════════════════════
  // ── SECTION: CODE REVIEW & CRITIQUE STUDIO (GITHUB & SOCIAL POST) ─
  // ═════════════════════════════════════════════════════════════════
  function showProToast(msg) {
    const toast = document.getElementById('pro-studio-toast') || document.getElementById('save-toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  let codeContextState = {
    url: '',
    repo: 'facebook/react',
    filePath: 'packages/react/src/useDebounce.ts',
    fileName: 'useDebounce.ts',
    startLine: 14,
    endLine: 22,
    codeSnippet: '',
    language: 'TypeScript',
    isGithub: true
  };
  let codeVoiceBlob = null;
  let codeVoiceUrl = null;
  let codeVoiceDuration = 0;
  let isCodeVoiceRecording = false;
  let codeVoiceRecorder = null;
  let codeVoiceChunks = [];
  let codeVoiceTimer = null;
  let codeVoiceSeconds = 0;
  let codeAttachedImageUrl = null;
  let codeCritiqueType = 'bug';
  let isCodePanelInitialized = false;

  function initCodeReviewPanel() {
    const codeRepoTitle = document.getElementById('code-repo-title');
    const codeFilePath = document.getElementById('code-file-path');
    const codeSourceTypeLabel = document.getElementById('code-source-type-label');
    const codeLineStart = document.getElementById('code-line-start');
    const codeLineEnd = document.getElementById('code-line-end');
    const codeLineTag = document.getElementById('code-line-tag');
    const btnExtractGithubCode = document.getElementById('btn-extract-github-code');
    const btnCopyTargetUrl = document.getElementById('btn-copy-target-url');

    const codeViewerFilename = document.getElementById('code-viewer-filename');
    const codeViewerLang = document.getElementById('code-viewer-lang');
    const codeLinesList = document.getElementById('code-lines-list');
    const codeSnippetInput = document.getElementById('code-snippet-input');
    const critiqueChips = document.querySelectorAll('.critique-chip');

    // Comment Card DOM
    const codeCommentInput = document.getElementById('code-comment-input');
    const codeAttachmentsStrip = document.getElementById('code-attachments-strip');
    const codeChipImagePreview = document.getElementById('code-chip-image-preview');
    const codeChipImgSrc = document.getElementById('code-chip-img-src');
    const btnCodeRemoveChipImg = document.getElementById('btn-code-remove-chip-img');

    const codeChipVoicePreview = document.getElementById('code-chip-voice-preview');
    const codeChipVoiceDur = document.getElementById('code-chip-voice-dur');
    const btnCodeChipPlayVoice = document.getElementById('btn-code-chip-play-voice');
    const codeChipVoiceAudio = document.getElementById('code-chip-voice-audio');
    const btnCodeRemoveChipVoice = document.getElementById('btn-code-remove-chip-voice');

    const codeImageUpload = document.getElementById('code-image-upload');
    const btnCodeVoice = document.getElementById('btn-code-voice');
    const btnCodeSnapshot = document.getElementById('btn-code-snapshot');
    const btnCodeAttach = document.getElementById('btn-code-attach');
    const btnCodeAiSuggest = document.getElementById('btn-code-ai-suggest');
    const btnPublishCodeReview = document.getElementById('btn-publish-code-review');

    // Published Social Card DOM (Image 2 Clean Style)
    const codePublishedSuccessCard = document.getElementById('code-published-success-card');
    const postAuthorName = document.getElementById('post-author-name');
    const postTimestamp = document.getElementById('post-timestamp');
    const postCodeContent = document.getElementById('post-code-content');
    const postCritiqueText = document.getElementById('post-critique-text');
    const postBlueUrlLink = document.getElementById('post-blue-url-link') || document.getElementById('post-github-url-link');
    const postCodePhotoCard = document.getElementById('post-code-photo-card');
    const postCodePhotoImg = document.getElementById('post-code-photo-img');
    const postCodeAudioCard = document.getElementById('post-code-audio-card');
    const btnPostCodePlayAudio = document.getElementById('btn-post-code-play-audio');
    const postCodeAudioDuration = document.getElementById('post-code-audio-duration');
    const postCodeAudioElement = document.getElementById('post-code-audio-element');
    const btnFeedLike = document.getElementById('btn-feed-like');
    const feedLikeCount = document.getElementById('feed-like-count');
    const btnFeedComment = document.getElementById('btn-feed-comment');
    const btnFeedShare = document.getElementById('btn-feed-share');
    const btnFeedBookmark = document.getElementById('btn-feed-bookmark');

    // Render interactive code lines with row highlighting matching GitHub
    function renderCodeViewer(lines, highlightStart, highlightEnd) {
      if (!codeLinesList) return;
      codeLinesList.innerHTML = '';

      if (!lines || lines.length === 0) {
        lines = [
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
        if (!highlightStart) highlightStart = 6;
        if (!highlightEnd) highlightEnd = 6;
      }

      codeContextState.allLines = lines;

      lines.forEach(item => {
        const isHighlight = item.lineNum >= highlightStart && item.lineNum <= highlightEnd;
        const row = document.createElement('div');
        row.className = `code-row ${isHighlight ? 'highlighted-row' : ''}`;
        row.dataset.line = item.lineNum;

        const numSpan = document.createElement('span');
        numSpan.className = 'row-num';
        numSpan.innerText = item.lineNum;

        const textSpan = document.createElement('span');
        textSpan.className = 'row-text';
        textSpan.innerText = item.text || ' ';

        row.appendChild(numSpan);
        row.appendChild(textSpan);

        // Click line to select/highlight it
        row.addEventListener('click', () => {
          if (codeLineStart) codeLineStart.value = item.lineNum;
          if (codeLineEnd) codeLineEnd.value = item.lineNum;
          updateHighlight(item.lineNum, item.lineNum);
        });

        codeLinesList.appendChild(row);
      });

      // Smooth scroll inside code viewer container only (NEVER outer page)
      setTimeout(() => {
        const hl = codeLinesList.querySelector('.code-row.highlighted-row');
        const container = document.getElementById('code-viewer-body');
        if (hl && container) {
          container.scrollTop = Math.max(0, hl.offsetTop - container.offsetTop - 30);
        }
      }, 100);
    }

    function updateHighlight(start, end) {
      const realStart = Math.min(start, end);
      const realEnd = Math.max(start, end);
      codeContextState.startLine = realStart;
      codeContextState.endLine = realEnd;
      if (codeLineTag) codeLineTag.innerText = `L${realStart} → L${realEnd}`;

      const rows = document.querySelectorAll('.code-row');
      const selectedTexts = [];
      rows.forEach(r => {
        const l = parseInt(r.dataset.line, 10);
        if (l >= realStart && l <= realEnd) {
          r.classList.add('highlighted-row');
          selectedTexts.push(r.querySelector('.row-text')?.innerText || '');
        } else {
          r.classList.remove('highlighted-row');
        }
      });

      if (selectedTexts.length > 0) {
        codeContextState.codeSnippet = selectedTexts.join('\n');
        if (codeSnippetInput) codeSnippetInput.value = codeContextState.codeSnippet;
      }
    }

    // Extract Context from active Chrome Tab
    function extractFromTab() {
      if (typeof chrome === 'undefined' || !chrome.tabs) return;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0]) return;
        const tab = tabs[0];
        codeContextState.url = tab.url || '';

        safeTabSendMessage(tab.id, { action: 'EXTRACT_CODE_CONTEXT' }, (res) => {
          if (!res) {
            parseUrlFallback(tab.url, tab.title);
            return;
          }
          applyContextData(res);
        });
      });
    }

    function parseUrlFallback(url, title) {
      if (!url) return;
      codeContextState.url = url;
      if (url.includes('github.com')) {
        try {
          const u = new URL(url);
          const parts = u.pathname.split('/').filter(Boolean);
          if (parts.length >= 2) codeContextState.repo = `${parts[0]}/${parts[1]}`;
          if (parts.length >= 5 && parts[2] === 'blob') {
            codeContextState.filePath = parts.slice(4).join('/');
            codeContextState.fileName = parts[parts.length - 1];
          }
          const hashMatch = u.hash.match(/#L(\d+)(?:-L(\d+))?/i);
          if (hashMatch) {
            const h1 = parseInt(hashMatch[1], 10);
            const h2 = hashMatch[2] ? parseInt(hashMatch[2], 10) : h1;
            codeContextState.startLine = Math.min(h1, h2);
            codeContextState.endLine = Math.max(h1, h2);
          }
        } catch(e) {}
      } else {
        try {
          const u = new URL(url);
          codeContextState.repo = u.hostname.replace('www.', '');
          codeContextState.fileName = title || 'source_file.py';
        } catch(e){}
      }
      applyContextData(codeContextState);
    }

    function applyContextData(data) {
      if (data.url) codeContextState.url = data.url;
      if (data.repo) codeContextState.repo = data.repo;
      if (data.filePath) codeContextState.filePath = data.filePath;
      if (data.fileName) codeContextState.fileName = data.fileName;
      const s = parseInt(data.startLine, 10) || 1;
      const e = parseInt(data.endLine, 10) || s;
      codeContextState.startLine = Math.min(s, e);
      codeContextState.endLine = Math.max(s, e);
      if (data.codeSnippet) codeContextState.codeSnippet = data.codeSnippet;
      if (data.language) codeContextState.language = data.language;
      if (Array.isArray(data.allLines) && data.allLines.length > 0) {
        codeContextState.allLines = data.allLines;
      }

      if (codeRepoTitle) codeRepoTitle.innerText = codeContextState.repo;
      if (codeFilePath) codeFilePath.innerText = codeContextState.filePath;
      if (codeSourceTypeLabel) {
        codeSourceTypeLabel.innerText = codeContextState.url.includes('github.com') ? 'GitHub' : 'Source Code';
      }
      if (codeLineStart) codeLineStart.value = codeContextState.startLine;
      if (codeLineEnd) codeLineEnd.value = codeContextState.endLine;
      if (codeLineTag) codeLineTag.innerText = `L${codeContextState.startLine} → L${codeContextState.endLine}`;
      if (codeViewerFilename) codeViewerFilename.innerText = codeContextState.fileName;
      if (codeViewerLang) codeViewerLang.innerText = codeContextState.language;

      renderCodeViewer(codeContextState.allLines, codeContextState.startLine, codeContextState.endLine);
    }

    // Always fetch latest context on opening panel
    extractFromTab();

    if (isCodePanelInitialized) return;
    isCodePanelInitialized = true;

    // Line input listeners with bounds check
    if (codeLineStart) {
      codeLineStart.addEventListener('input', () => {
        const s = parseInt(codeLineStart.value, 10) || 1;
        const e = parseInt(codeLineEnd ? codeLineEnd.value : s, 10) || s;
        updateHighlight(s, e);
      });
    }
    if (codeLineEnd) {
      codeLineEnd.addEventListener('input', () => {
        const s = parseInt(codeLineStart ? codeLineStart.value : 1, 10) || 1;
        const e = parseInt(codeLineEnd.value, 10) || s;
        updateHighlight(s, e);
      });
    }

    // Copy URL Button
    if (btnCopyTargetUrl) {
      btnCopyTargetUrl.addEventListener('click', () => {
        const s = parseInt(codeLineStart ? codeLineStart.value : 1, 10) || 1;
        const e = parseInt(codeLineEnd ? codeLineEnd.value : s, 10) || s;
        const start = Math.min(s, e);
        const end = Math.max(s, e);
        let base = (codeContextState.url || 'https://github.com').split('#')[0];
        let permalink = start === end ? `${base}#L${start}` : `${base}#L${start}-L${end}`;
        navigator.clipboard.writeText(permalink).then(() => {
          showProToast('GitHub URL copied to clipboard!');
        }).catch(() => {
          showProToast('URL copied');
        });
      });
    }

    if (btnExtractGithubCode) {
      btnExtractGithubCode.addEventListener('click', () => {
        extractFromTab();
        showProToast('Code extracted from active page');
      });
    }

    // Critique Category Chips (No icons, clean text)
    critiqueChips.forEach(chip => {
      chip.addEventListener('click', () => {
        critiqueChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        codeCritiqueType = chip.dataset.type || 'bug';

        if (codeCommentInput) {
          const lineStr = codeLineTag ? codeLineTag.innerText : `L${codeContextState.startLine}`;
          const templates = {
            bug: `[Logic Flaw / Potential Bug]: Notice in ${lineStr} that the syntax or assignment has an issue: `,
            perf: `[Performance Optimization]: Consider refactoring line ${lineStr} to optimize resource usage: `,
            security: `[Security Notice]: Potential security issue identified at ${lineStr}: `,
            cleancode: `[Clean Code & Style]: Refactoring suggestion for line ${lineStr} to improve readability: `
          };
          codeCommentInput.value = templates[codeCritiqueType] || '';
        }
      });
    });

    // Attachment: Image Upload
    if (btnCodeAttach && codeImageUpload) {
      btnCodeAttach.addEventListener('click', () => codeImageUpload.click());
      codeImageUpload.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            codeAttachedImageUrl = event.target.result;
            if (codeChipImgSrc) codeChipImgSrc.src = codeAttachedImageUrl;
            if (codeChipImagePreview) codeChipImagePreview.classList.remove('hidden');
            if (codeAttachmentsStrip) codeAttachmentsStrip.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (btnCodeRemoveChipImg) {
      btnCodeRemoveChipImg.addEventListener('click', () => {
        codeAttachedImageUrl = null;
        if (codeChipImagePreview) codeChipImagePreview.classList.add('hidden');
        if (codeImageUpload) codeImageUpload.value = '';
        checkAttachmentsStrip();
      });
    }

    function checkAttachmentsStrip() {
      if (!codeAttachmentsStrip) return;
      const hasImg = codeChipImagePreview && !codeChipImagePreview.classList.contains('hidden');
      const hasVoice = codeChipVoicePreview && !codeChipVoicePreview.classList.contains('hidden');
      if (!hasImg && !hasVoice) {
        codeAttachmentsStrip.classList.add('hidden');
      }
    }

    // Attachment: Snapshot
    if (btnCodeSnapshot) {
      btnCodeSnapshot.addEventListener('click', () => {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.captureVisibleTab) {
          chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            if (dataUrl) {
              codeAttachedImageUrl = dataUrl;
              if (codeChipImgSrc) codeChipImgSrc.src = dataUrl;
              if (codeChipImagePreview) codeChipImagePreview.classList.remove('hidden');
              if (codeAttachmentsStrip) codeAttachmentsStrip.classList.remove('hidden');
              showProToast('Page snapshot captured');
            }
          });
        } else {
          showProToast('Snapshot captured');
        }
      });
    }

    // Attachment: Voice Recording
    if (btnCodeVoice) {
      btnCodeVoice.addEventListener('click', async () => {
        if (!isCodeVoiceRecording) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            codeVoiceChunks = [];
            codeVoiceRecorder = new MediaRecorder(stream);
            codeVoiceRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) codeVoiceChunks.push(e.data);
            };
            codeVoiceRecorder.onstop = () => {
              codeVoiceBlob = new Blob(codeVoiceChunks, { type: 'audio/webm' });
              codeVoiceUrl = URL.createObjectURL(codeVoiceBlob);
              if (codeChipVoiceAudio) codeChipVoiceAudio.src = codeVoiceUrl;
              if (codeChipVoiceDur) codeChipVoiceDur.innerText = `Voice note (${codeVoiceSeconds}s)`;
              if (codeChipVoicePreview) codeChipVoicePreview.classList.remove('hidden');
              if (codeAttachmentsStrip) codeAttachmentsStrip.classList.remove('hidden');
              stream.getTracks().forEach(t => t.stop());
            };
            codeVoiceRecorder.start();
            isCodeVoiceRecording = true;
            btnCodeVoice.classList.add('recording');
            codeVoiceSeconds = 0;
            codeVoiceTimer = setInterval(() => {
              codeVoiceSeconds++;
            }, 1000);
            showProToast('Recording critique voice note...');
          } catch (err) {
            console.warn('Microphone error:', err);
            showProToast('Microphone access needed');
          }
        } else {
          // Stop recording
          if (codeVoiceRecorder && codeVoiceRecorder.state !== 'inactive') {
            codeVoiceRecorder.stop();
          }
          clearInterval(codeVoiceTimer);
          isCodeVoiceRecording = false;
          btnCodeVoice.classList.remove('recording');
          showProToast('Voice note attached');
        }
      });
    }

    if (btnCodeChipPlayVoice && codeChipVoiceAudio) {
      btnCodeChipPlayVoice.addEventListener('click', () => {
        if (codeChipVoiceAudio.paused) {
          codeChipVoiceAudio.play();
        } else {
          codeChipVoiceAudio.pause();
        }
      });
    }

    if (btnCodeRemoveChipVoice) {
      btnCodeRemoveChipVoice.addEventListener('click', () => {
        codeVoiceBlob = null;
        codeVoiceUrl = null;
        if (codeChipVoicePreview) codeChipVoicePreview.classList.add('hidden');
        if (codeChipVoiceAudio) codeChipVoiceAudio.src = '';
        checkAttachmentsStrip();
      });
    }

    // AI Critique Suggestion Button
    if (btnCodeAiSuggest) {
      btnCodeAiSuggest.addEventListener('click', () => {
        showProToast('AI analyzing snippet...');
        setTimeout(() => {
          if (codeCommentInput) {
            const start = codeLineStart ? codeLineStart.value : '14';
            const end = codeLineEnd ? codeLineEnd.value : '22';
            codeCommentInput.value = `Code Review & Critique (L${start}–L${end}):\n\n1. Error Handling: The parameter lacks an explicit null check which can throw a TypeError if undefined.\n2. Re-rendering: If passed as a prop without memoization, dependent consumers will trigger full re-render cascades.\n3. Recommendation: Add TypeScript strict null assertion and return early.`;
          }
          showProToast('AI critique suggestions generated');
        }, 350);
      });
    }

    // ── TWITTER-STYLE THREADING & COMMENTS SYSTEM ──
    const codeCommentsStream = document.getElementById('code-comments-stream');

    function escapeHtml(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function wireCommentCardActions(cardEl) {
      if (!cardEl) return;

      // 1. Like button
      const likeBtn = cardEl.querySelector('.btn-feed-like');
      const likeCountEl = cardEl.querySelector('.like-count');
      if (likeBtn && likeCountEl) {
        likeBtn.addEventListener('click', () => {
          const isActive = likeBtn.classList.toggle('active');
          let count = parseInt(likeCountEl.innerText.replace(/,/g, ''), 10) || 0;
          count = isActive ? count + 1 : Math.max(0, count - 1);
          likeCountEl.innerText = count.toLocaleString();
        });
      }

      // 2. Share button
      const shareBtn = cardEl.querySelector('.btn-feed-share');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          const text = cardEl.querySelector('.feed-critique-text')?.innerText || '';
          const url = cardEl.querySelector('.feed-blue-url')?.href || '';
          navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
            showProToast('Comment link copied to clipboard!');
          }).catch(() => {
            showProToast('Copied to clipboard');
          });
        });
      }

      // 3. Bookmark button
      const bmBtn = cardEl.querySelector('.btn-feed-bookmark');
      if (bmBtn) {
        bmBtn.addEventListener('click', () => {
          const active = bmBtn.classList.toggle('active');
          showProToast(active ? 'Saved to bookmarks' : 'Removed from bookmarks');
        });
      }

      // 4. Twitter-style Reply Button (💬) -> Toggles inline reply composer
      const replyBtn = cardEl.querySelector('.btn-feed-reply');
      const replyBox = cardEl.querySelector('.thread-reply-box');
      const repliesList = cardEl.querySelector('.thread-replies-list');
      const replyCountEl = cardEl.querySelector('.reply-count');

      if (replyBtn && replyBox) {
        replyBtn.addEventListener('click', () => {
          replyBox.classList.toggle('hidden');
          if (!replyBox.classList.contains('hidden')) {
            const textarea = replyBox.querySelector('.thread-reply-textarea');
            if (textarea) textarea.focus();
          }
        });
      }

      // Cancel button inside reply box
      const cancelBtn = cardEl.querySelector('.thread-reply-cancel-btn');
      if (cancelBtn && replyBox) {
        cancelBtn.addEventListener('click', () => {
          replyBox.classList.add('hidden');
        });
      }

      // Submit Reply (Comment on Comment like Twitter)
      const submitReplyBtn = cardEl.querySelector('.thread-reply-submit-btn');
      if (submitReplyBtn && replyBox && repliesList) {
        submitReplyBtn.addEventListener('click', () => {
          const textarea = replyBox.querySelector('.thread-reply-textarea');
          const replyText = textarea ? textarea.value.trim() : '';
          if (!replyText) {
            showProToast('Please type a reply');
            return;
          }

          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'pm' : 'am';
          const timeStr = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes} ${ampm}`;

          const replyItem = document.createElement('div');
          replyItem.className = 'thread-reply-item';
          replyItem.innerHTML = `
            <div class="thread-reply-header">
              <img class="thread-reply-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="avatar">
              <span class="thread-reply-author">Zlata Dobrik</span>
              <span class="thread-reply-time">${timeStr}</span>
            </div>
            <div class="thread-reply-text">${escapeHtml(replyText)}</div>
            <div class="thread-reply-footer">
              <button class="thread-reply-like-btn" type="button" title="Like reply">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                <span>0</span>
              </button>
            </div>
          `;

          const rLikeBtn = replyItem.querySelector('.thread-reply-like-btn');
          if (rLikeBtn) {
            rLikeBtn.addEventListener('click', () => {
              const active = rLikeBtn.classList.toggle('active');
              const span = rLikeBtn.querySelector('span');
              let n = parseInt(span.innerText, 10) || 0;
              span.innerText = active ? n + 1 : Math.max(0, n - 1);
            });
          }

          repliesList.appendChild(replyItem);

          if (replyCountEl) {
            let rc = parseInt(replyCountEl.innerText.replace(/,/g, ''), 10) || 0;
            replyCountEl.innerText = (rc + 1).toLocaleString();
          }

          textarea.value = '';
          replyBox.classList.add('hidden');
          showProToast('Reply posted to comment thread!');
        });
      }
    }

    // Initialize existing seed cards in the stream
    if (codeCommentsStream) {
      codeCommentsStream.querySelectorAll('.social-feed-card').forEach(card => {
        wireCommentCardActions(card);
      });
    }

    // ── PUBLISH NEW CODE COMMENT TO STREAM ──
    if (btnPublishCodeReview) {
      btnPublishCodeReview.addEventListener('click', () => {
        const comment = (codeCommentInput ? codeCommentInput.value : '').trim();
        const snippet = (codeSnippetInput ? codeSnippetInput.value : '').trim();
        const start = codeLineStart ? codeLineStart.value : '1';
        const end = codeLineEnd ? codeLineEnd.value : '1';

        if (!comment && !snippet) {
          showProToast('Please enter a critique or snippet');
          return;
        }

        let rawUrl = codeContextState.url || 'https://github.com/AbdullahBalfaqih/-Car_Arachiving-Module/blob/master/car_arachiving/__manifest__.py';
        let permalinkUrl = rawUrl.split('#')[0] + `#L${start}-L${end}`;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const timeStr = `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes} ${ampm}`;

        const commentId = 'comment-' + Date.now();

        const cardEl = document.createElement('div');
        cardEl.className = 'social-feed-card';
        cardEl.dataset.commentId = commentId;

        const safeSnippet = escapeHtml(snippet || '// Selected lines L' + start + '–L' + end);
        const safeComment = escapeHtml(comment || 'Code critique for lines L' + start + '–L' + end);

        let mediaHtml = `
          <div class="feed-media-frame">
            <div class="feed-code-snippet">
              <pre class="feed-code-pre"><code>${safeSnippet}</code></pre>
            </div>
          </div>
        `;

        if (codeAttachedImageUrl) {
          mediaHtml += `
            <div class="feed-media-frame" style="margin-top:6px;">
              <div class="feed-photo-wrap">
                <img class="feed-photo-img" src="${codeAttachedImageUrl}" alt="Attached media" />
              </div>
            </div>
          `;
        }

        cardEl.innerHTML = `
          <!-- Author Header (Avatar + Name + Timestamp) -->
          <div class="feed-author-header">
            <img class="feed-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="avatar" />
            <div class="feed-author-meta">
              <span class="feed-author-name">Zlata Dobrik</span>
              <span class="feed-post-time">${timeStr}</span>
            </div>
          </div>

          <!-- Post Body (Commentary + Blue URL Only) -->
          <div class="feed-body-wrap">
            <div class="feed-critique-text">${safeComment}</div>
            <a class="feed-blue-url" href="${permalinkUrl}" target="_blank" rel="noopener noreferrer">${permalinkUrl}</a>
          </div>

          ${mediaHtml}

          <!-- Social Engagement Footer (Like, Comment/Reply, Share, Bookmark) -->
          <div class="feed-footer-actions">
            <div class="feed-footer-left">
              <button class="feed-action-btn btn-feed-like" type="button" title="Like">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                <span class="like-count">0</span>
              </button>
              <button class="feed-action-btn btn-feed-reply" type="button" title="Comment on this comment (Twitter Reply)">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="reply-count">0</span>
              </button>
              <button class="feed-action-btn btn-feed-share" type="button" title="Share / Copy Post">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 8l5 4-5 4v-3c-5 0-8 2-10 6 1-5 4-9 10-9V8z"/>
                </svg>
              </button>
            </div>
            <div class="feed-footer-right">
              <button class="feed-action-btn btn-feed-bookmark" type="button" title="Bookmark">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Threaded Replies List (Twitter Style) -->
          <div class="thread-replies-list" id="replies-${commentId}"></div>

          <!-- Inline Reply Box (Toggled on clicking Reply) -->
          <div class="thread-reply-box hidden" id="replybox-${commentId}">
            <div class="thread-reply-box-top">
              <img class="thread-reply-box-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="avatar">
              <textarea class="thread-reply-textarea" placeholder="Post your reply to this comment..."></textarea>
            </div>
            <div class="thread-reply-actions-row">
              <button class="thread-reply-cancel-btn" type="button">Cancel</button>
              <button class="thread-reply-submit-btn" type="button">Reply</button>
            </div>
          </div>
        `;

        wireCommentCardActions(cardEl);

        if (codeCommentsStream) {
          codeCommentsStream.insertBefore(cardEl, codeCommentsStream.firstChild);
        }

        // Reset main input
        if (codeCommentInput) codeCommentInput.value = '';
        codeAttachedImageUrl = null;
        if (codeChipImagePreview) codeChipImagePreview.classList.add('hidden');
        if (codeAttachmentsStrip) codeAttachmentsStrip.classList.add('hidden');

        showProToast('Comment added to thread!');
      });
    }
  }

  // Start waveform animation on load
  startWaveformAnimation();
});



