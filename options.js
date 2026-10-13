document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyEl = document.getElementById('api-key');
  const modelEl = document.getElementById('model');
  const saveBtn = document.getElementById('save-btn');
  const toastEl = document.getElementById('toast');

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    const settings = await chrome.storage.sync.get(['apiKey', 'model']);
    if (settings.apiKey && apiKeyEl) apiKeyEl.value = settings.apiKey;
    if (settings.model && modelEl) modelEl.value = settings.model;
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({
          apiKey: apiKeyEl ? apiKeyEl.value.trim() : '',
          model: modelEl ? modelEl.value : 'gemini-1.5-flash'
        });
      }
      if (toastEl) {
        toastEl.style.display = 'inline';
        setTimeout(() => toastEl.style.display = 'none', 3000);
      }
    });
  }
});
