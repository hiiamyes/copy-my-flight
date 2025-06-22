chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'GET_SELECTION') {
    const text = window.getSelection().toString() || document.title;
    sendResponse({ text });
  }
});
