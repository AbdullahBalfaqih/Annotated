// src/background.js
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "annot-video-clip",
      title: "\u{1F3AC} Trim Video Clip (90s Max) & Annotate",
      contexts: ["video", "page", "frame"]
    }, () => {
      if (chrome.runtime.lastError) {
      }
    });
    chrome.contextMenus.create({
      id: "annotated-root",
      title: "Annotate",
      contexts: ["selection", "page"]
    }, () => {
      if (chrome.runtime.lastError) {
      }
    });
    const services = [
      { id: "text", title: "\u{1F4DD} Text Annotation" },
      { id: "voice", title: "\u{1F399}\uFE0F Voice Commentary" },
      { id: "conversation", title: "\u{1F4AC} Discussion & Comments" },
      { id: "camera", title: "\u{1F4F8} Screenshot Capture" },
      { id: "handwriting", title: "\u270F\uFE0F Handwriting & Sketch" },
      { id: "import", title: "\u{1F517} Import Content" },
      { id: "translate", title: "\u{1F310} Translate Selection" },
      { id: "code", title: "\u{1F4BB} Code Review" },
      { id: "listen", title: "\u{1F50A} Listen (Text-to-Speech)" }
    ];
    services.forEach((srv) => {
      chrome.contextMenus.create({
        id: `annot-${srv.id}`,
        parentId: "annotated-root",
        title: srv.title,
        contexts: ["selection", "page"]
      }, () => {
        if (chrome.runtime.lastError) {
        }
      });
    });
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;
  const actionKey = info.menuItemId.replace(/^annot-/, "");
  const selText = info.selectionText || "";
  if (actionKey === "video-clip") {
    chrome.tabs.sendMessage(tab.id, { action: "GET_VIDEO_INFO" }, (resp) => {
      if (chrome.runtime.lastError) {
      }
      const cur = Math.max(0, Math.floor(resp?.currentTime || 0));
      const dur = Math.max(cur + 10, Math.floor(resp?.duration || 300));
      const startTime = cur;
      const endTime = Math.min(dur, startTime + 90);
      const payload = {
        pending_mode: "video",
        pending_text: selText,
        pending_url: tab.url,
        pending_title: resp?.title || tab.title,
        startTime,
        endTime,
        duration: dur,
        timestamp: Date.now()
      };
      chrome.storage.local.set({ active_page_annotation: payload });
      chrome.runtime.sendMessage({ action: "APPLY_PAGE_ACTION", ...payload }).catch(() => {
      });
      if (chrome.sidePanel && chrome.sidePanel.open) {
        chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
        });
      }
    });
    return;
  }
  chrome.storage.local.set({
    active_page_annotation: {
      pending_mode: actionKey,
      pending_text: selText,
      pending_url: tab.url,
      pending_title: tab.title,
      timestamp: Date.now()
    }
  });
  chrome.tabs.sendMessage(tab.id, {
    action: "CONTEXT_MENU_ANNOTATE",
    mode: actionKey,
    text: selText
  }, () => {
    if (chrome.runtime.lastError) {
    }
  });
  if (chrome.sidePanel && chrome.sidePanel.open) {
    chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
    });
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPEN_SIDE_PANEL_NOW") {
    const tabId = sender.tab?.id;
    const windowId = sender.tab?.windowId;
    if (chrome.sidePanel && chrome.sidePanel.open) {
      if (tabId) {
        chrome.sidePanel.open({ tabId }).catch(() => {
          if (windowId) chrome.sidePanel.open({ windowId }).catch(() => {
          });
        });
      } else if (windowId) {
        chrome.sidePanel.open({ windowId }).catch(() => {
        });
      }
    }
    chrome.runtime.sendMessage({
      action: "APPLY_PAGE_ACTION",
      mode: request.mode,
      text: request.text,
      url: request.url,
      title: request.title
    }).catch(() => {
    });
    sendResponse({ status: "ok" });
    return true;
  }
  if (request.action === "PUBLISH_ANNOTATION_POST") {
    (async () => {
      try {
        const authData = await chrome.storage.local.get(["annotated_token", "annotated_user"]) || {};
        const token = authData.annotated_token;
        const user = authData.annotated_user;
        const reqHeaders = { "Content-Type": "application/json" };
        if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
        if (user?.id) reqHeaders["X-User-Id"] = user.id;
        if (request.payload?.user_id) reqHeaders["X-User-Id"] = request.payload.user_id;
        const res = await fetch("http://localhost:5000/api/annotations", {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify(request.payload)
        });
        const data = await res.json();
        if (data && data.success) {
          try {
            const tabs = await chrome.tabs.query({});
            tabs.forEach((t) => {
              if (t.url && (t.url.includes("localhost:3000") || t.url.includes("127.0.0.1:3000") || t.url.includes("annotated"))) {
                chrome.tabs.sendMessage(t.id, {
                  action: "ANNOTATION_PUBLISHED_BY_EXTENSION",
                  annotation: data.annotation,
                  post: data.post
                }, () => {
                  if (chrome.runtime.lastError) {
                  }
                });
              }
            });
          } catch (_) {
          }
        }
        sendResponse(data);
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
  if (request.action === "PROCESS_TEXT_ACTION") {
    callAiEngine(request.type.toUpperCase(), request.text, request.title || "", request.options || {}).then((result) => {
      sendResponse({ result });
    }).catch((err) => {
      sendResponse({ error: err.message || "An unexpected error occurred" });
    });
    return true;
  }
  if (request.action === "RUN_PAGE_SUMMARY") {
    callAiEngine("SUMMARIZE_PAGE", request.text, request.title, request.options).then((summary) => {
      saveToHistory(request.title, request.url, summary, "page");
      sendResponse({ summary });
    }).catch((err) => {
      sendResponse({ error: err.message });
    });
    return true;
  }
  if (request.action === "GET_TAB_STREAM_ID") {
    if (chrome.tabCapture && chrome.tabCapture.getMediaStreamId) {
      chrome.tabCapture.getMediaStreamId({ targetTabId: request.tabId }, (streamId) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ streamId });
        }
      });
      return true;
    } else {
      sendResponse({ error: "tabCapture not supported" });
      return true;
    }
  }
  if (request.action === "TRANSCRIBE_AUDIO") {
    transcribeAudioWithGemini(request.audioData, request.mimeType || "audio/webm", request.lang || "en").then((text) => sendResponse({ text })).catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});
async function transcribeAudioWithGemini(base64Audio, mimeType, lang = "en") {
  const settings = await chrome.storage.sync.get(["apiKey", "model"]);
  const apiKey = settings.apiKey || "";
  if (!apiKey) {
    throw new Error("Please add a Gemini API Key in Settings to enable audio transcription.");
  }
  const modelName = settings.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const langPrompt = "You are an accurate audio transcriber. Transcribe everything spoken in this audio verbatim without any preamble or explanation.";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Audio
            }
          },
          {
            text: langPrompt
          }
        ]
      }]
    })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP status ${response.status}`);
  }
  const data = await response.json();
  const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!transcript || !transcript.trim()) {
    throw new Error("No clear speech was detected in this clip.");
  }
  return transcript.trim();
}
async function fetchGoogleTranslation(text, targetLang = "English") {
  if (!text || !text.trim()) return "";
  const langMap = {
    "arabic": "ar",
    "ar": "ar",
    "english": "en",
    "en": "en",
    "french": "fr",
    "fr": "fr",
    "spanish": "es",
    "es": "es",
    "german": "de",
    "de": "de",
    "turkish": "tr",
    "tr": "tr",
    "japanese": "ja",
    "ja": "ja",
    "chinese": "zh-CN",
    "zh": "zh-CN",
    "russian": "ru",
    "ru": "ru",
    "korean": "ko",
    "ko": "ko",
    "italian": "it",
    "it": "it",
    "portuguese": "pt",
    "pt": "pt",
    "hindi": "hi",
    "hi": "hi",
    "urdu": "ur",
    "ur": "ur"
  };
  const tl = langMap[(targetLang || "English").toLowerCase()] || targetLang || "en";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text.substring(0, 5e3))}`;
    const resp = await fetch(url);
    const data = await resp.json();
    let translated = "";
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translated = data[0].filter(Boolean).map((item) => item[0] || "").join("");
    }
    return translated || text;
  } catch (err) {
    console.error("fetchGoogleTranslation error:", err);
    return text;
  }
}
async function callAiEngine(taskType, text, pageTitle = "", options = {}) {
  const settings = await chrome.storage.sync.get(["apiKey", "model", "summaryLength", "language"]);
  const apiKey = settings.apiKey || "";
  if (taskType === "TRANSLATE") {
    const targetLang = options && options.targetLang || settings.language || "English";
    if (apiKey) {
      try {
        return await callGeminiApi(apiKey, taskType, text, pageTitle, settings, options);
      } catch (err) {
        console.warn("Gemini API Error for translation, falling back to Google Translate:", err);
      }
    }
    const translated = await fetchGoogleTranslation(text, targetLang);
    return `\u{1F310} **Translation (${targetLang}):**
${translated}`;
  }
  if (taskType === "TRANSLATE_DETECT") {
    const targetLang = options && options.targetLang || "English";
    if (apiKey) {
      try {
        return await callGeminiApi(apiKey, taskType, text, pageTitle, settings, options);
      } catch (err) {
        console.warn("Gemini API Error for translate detect, falling back to Google Translate:", err);
      }
    }
    const langMap = {
      "arabic": "ar",
      "ar": "ar",
      "english": "en",
      "en": "en",
      "french": "fr",
      "fr": "fr",
      "spanish": "es",
      "es": "es",
      "german": "de",
      "de": "de",
      "turkish": "tr",
      "tr": "tr",
      "japanese": "ja",
      "ja": "ja",
      "chinese": "zh-CN",
      "zh": "zh-CN"
    };
    const tl = langMap[targetLang.toLowerCase()] || targetLang || "en";
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&dt=ld&q=${encodeURIComponent(text.substring(0, 5e3))}`;
      const resp = await fetch(url);
      const data = await resp.json();
      let translated = "";
      if (Array.isArray(data) && Array.isArray(data[0])) {
        translated = data[0].filter(Boolean).map((item) => item[0] || "").join("");
      }
      const detectedCode = data[2] || "auto";
      const langNames = { en: "English", ar: "Arabic", zh: "Chinese", fr: "French", de: "German", es: "Spanish", ja: "Japanese", tr: "Turkish", ru: "Russian" };
      const detectedLang = langNames[detectedCode] || detectedCode.toUpperCase();
      return JSON.stringify({ detectedLang, translation: translated });
    } catch (e) {
      return JSON.stringify({ detectedLang: "Unknown", translation: text });
    }
  }
  if (apiKey) {
    try {
      return await callGeminiApi(apiKey, taskType, text, pageTitle, settings, options);
    } catch (err) {
      console.warn("Gemini API Error, falling back to smart local engine:", err);
      return `\u26A0\uFE0F (Gemini API Error: ${err.message})

` + generateSmartLocalSummary(taskType, text, pageTitle);
    }
  }
  return generateSmartLocalSummary(taskType, text, pageTitle);
}
async function callGeminiApi(apiKey, taskType, text, pageTitle, settings, options = {}) {
  const modelName = settings.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  let systemPrompt = "You are a professional AI assistant specializing in content analysis, clear structuring, and concise summaries.";
  let userPrompt = "";
  if (taskType === "SUMMARIZE_PAGE") {
    userPrompt = `Summarize this page titled "${pageTitle}":

${text}

Required format:
1. \u{1F4CC} **Executive Summary (TL;DR)**
2. \u{1F4A1} **Key Takeaways**
3. \u{1F3AF} **Conclusion or Action Items**

Keep it structured and clean with bullet points.`;
  } else if (taskType === "SUMMARIZE") {
    userPrompt = `Summarize the following text in concise, clear bullet points:

${text}`;
  } else if (taskType === "EXPLAIN") {
    userPrompt = `Explain and simplify this text clearly:

${text}`;
  } else if (taskType === "TRANSLATE") {
    const targetLang = options && options.targetLang || "English";
    userPrompt = `Translate this text accurately into (${targetLang}) while preserving the original meaning:

${text}`;
  } else if (taskType === "CODE" || taskType === "CODE_EXPLAIN") {
    userPrompt = `Analyze and explain this code in detail with functions and logic overview:

${text}`;
  } else if (taskType === "CODE_DEBUG") {
    userPrompt = `Inspect this code for bugs, errors, or vulnerabilities, and provide corrected code with explanation:

${text}`;
  } else if (taskType === "CODE_OPTIMIZE") {
    userPrompt = `Optimize this code for efficiency, performance, and readability, suggesting best practices:

${text}`;
  } else if (taskType === "REWRITE") {
    userPrompt = `Rewrite this text in an engaging, professional style:

${text}`;
  } else {
    userPrompt = `Analyze the following text and explain key takeaways:

${text}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: systemPrompt },
          { text: userPrompt }
        ]
      }]
    })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `HTTP status ${response.status}`);
  }
  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    throw new Error("Empty response from model.");
  }
  return reply;
}
function generateSmartLocalSummary(taskType, text, pageTitle) {
  if (!text || text.trim().length === 0) {
    return "No sufficient text found on this page for analysis.";
  }
  const paragraphs = text.split("\n").map((p) => p.trim()).filter((p) => p.length > 40);
  const totalWords = text.split(/\s+/).length;
  const estTime = Math.max(1, Math.ceil(totalWords / 200));
  let firstPara = paragraphs[0] || text.substring(0, 200);
  let bulletPoints = paragraphs.slice(0, 4).map((p) => `\u2022 ${p.substring(0, 140)}...`).join("\n");
  if (taskType === "SUMMARIZE_PAGE") {
    return `\u{1F4CC} **Executive Summary (TL;DR):**
${firstPara.substring(0, 250)}...

\u{1F4A1} **Key Takeaways:**
${bulletPoints}

\u23F1\uFE0F **Quick Stats:**
\u2022 **Word count:** ${totalWords} words
\u2022 **Estimated reading time:** ${estTime} mins

---
\u{1F4A1} *Note: To generate in-depth Gemini AI summaries, enter your API key in Settings.*`;
  } else if (taskType === "EXPLAIN") {
    return `\u{1F4A1} **Key Concept & Explanation:**
${firstPara}

**Details:** The content focuses on the core themes highlighted above.`;
  } else if (taskType === "TRANSLATE") {
    return `\u{1F310} **Translation:**
${text}`;
  } else if (taskType === "REWRITE") {
    return `\u270D\uFE0F **Rewritten Version:**
" ${text.substring(0, 300)}... "`;
  }
  return `\u{1F4CC} **Summary:**
${bulletPoints}`;
}
async function saveToHistory(title, url, summaryText, type) {
  try {
    const data = await chrome.storage.local.get(["wm_history", "annotated_token"]);
    const history = data.wm_history || [];
    const newItem = {
      id: Date.now(),
      title: title || "Untitled Page",
      url: url || "",
      summary: summaryText,
      type: type || "page",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
    const updatedHistory = [newItem, ...history].slice(0, 50);
    await chrome.storage.local.set({ wm_history: updatedHistory });
    if (data.annotated_token) {
      try {
        await fetch("http://localhost:5000/api/summaries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.annotated_token}`
          },
          body: JSON.stringify({
            title: newItem.title,
            url: newItem.url,
            summary_text: newItem.summary,
            type: newItem.type
          })
        });
        console.log("[Annotated Extension] Summary synced to backend successfully");
      } catch (apiErr) {
        console.warn("[Annotated Extension] Failed to sync summary to backend:", apiErr);
      }
    }
  } catch (err) {
    console.warn("Could not save summary to history:", err);
  }
}
