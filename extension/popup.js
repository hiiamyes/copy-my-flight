document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy');
  const status = document.getElementById('status');

  copyBtn.addEventListener('click', async () => {
    status.textContent = '';
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, 'GET_SELECTION', response => {
      if (chrome.runtime.lastError || !response) {
        status.textContent = 'Failed to get selection';
        return;
      }
      navigator.clipboard.writeText(response.text).then(() => {
        status.textContent = 'Copied!';
      }).catch(() => {
        status.textContent = 'Copy failed';
      });
    });
  });
});
