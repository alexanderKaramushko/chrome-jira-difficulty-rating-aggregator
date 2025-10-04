chrome.runtime.onInstalled.addListener(() => {
  chrome.scripting
    .registerContentScripts([{
      id: "content-script",
      js: ["dist/content.js"],
      persistAcrossSessions: false,
      matches: ["<all_urls>"],
      runAt: 'document_end',
    }])
    .then(() => console.log("content.js: регистрация скрипта звершена"))
    .catch((err) => console.warn("content.js: ошибка регистрации скрипта", err))
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'aggregated') {
    chrome.storage.sync.set({
      levels: message.payload.levels,
      prevailingLevels: message.payload.prevailingLevels,
    });
  }
});
