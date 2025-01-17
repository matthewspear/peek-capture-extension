// Listen for request starts
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    chrome.storage.session.get(["networkLog"], function (result) {
      const networkLog = result.networkLog || [];
      networkLog.push({
        id: details.requestId,
        url: details.url,
        method: details.method,
        timestamp: new Date().toISOString(),
        type: details.type,
        requestBody: details.requestBody,
      });
      chrome.storage.session.set({ networkLog });
    });
  },
  {
    urls: ["*://api.openai.com/*"],
  },
  ["requestBody"]
);

// Listen for headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    chrome.storage.session.get(["networkLog"], function (result) {
      const networkLog = result.networkLog || [];
      const request = networkLog.find((r) => r.id === details.requestId);
      if (request) {
        request.requestHeaders = details.requestHeaders;
        chrome.storage.session.set({ networkLog });
      }

      // Single auth header check
      const authHeader = details.requestHeaders.find(
        (header) => header.name.toLowerCase() === "authorization"
      );
      if (authHeader && authHeader.value.includes("sess-")) {
        const token = authHeader.value.split(" ")[1];
        chrome.storage.session.set({ latestToken: token });
      }
    });
  },
  {
    urls: ["*://api.openai.com/*"],
  },
  ["requestHeaders"]
);

// Listen for responses
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    chrome.storage.session.get(["networkLog"], function (result) {
      const networkLog = result.networkLog || [];
      const request = networkLog.find((r) => r.id === details.requestId);
      if (request) {
        request.responseHeaders = details.responseHeaders;
        request.statusCode = details.statusCode;
        chrome.storage.session.set({ networkLog });
      }
    });
  },
  {
    urls: ["*://api.openai.com/*"],
  },
  ["responseHeaders"]
);

// Listen for completed requests
chrome.webRequest.onCompleted.addListener(
  function (details) {
    chrome.storage.session.get(["networkLog"], function (result) {
      const networkLog = result.networkLog || [];
      const request = networkLog.find((r) => r.id === details.requestId);
      if (request) {
        request.completed = true;
        request.timeCompleted = new Date().toISOString();
        chrome.storage.session.set({ networkLog });
      }
    });
  },
  {
    urls: ["*://api.openai.com/*"],
  }
);

// Add message listener to get recorded network log
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getNetworkLog") {
    chrome.storage.session.get(["networkLog"], function (result) {
      sendResponse({ networkLog: result.networkLog || [] });
    });
    return true; // Required for async response
  }
  if (request.action === "getLatestToken") {
    chrome.storage.session.get(["latestToken"], function (result) {
      const token = result.latestToken;
      chrome.storage.session.remove(["networkLog"]);
      sendResponse({ token });
    });
    return true; // Required for async response
  }
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "https://platform.openai.com/usage" });
});
