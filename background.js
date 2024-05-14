const response = {
  url: "",
  thirdParty: [],
  localStorage: 0,
  cookies: [],
};

browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg === "scan") {
    sendResponse(response);
  }
  if (msg === "clear") {
    response.url = "";
    response.thirdParty = [];
    response.localStorage = 0;
    response.cookies = [];
  }
});

browser.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated: ", activeInfo.tabId);
  browser.tabs.get(activeInfo.tabId).then((tab) => {
    response.url = tab.url.split("/")[2];
  });
});

// cookies
browser.cookies.onChanged.addListener((changeInfo) => {
  if (changeInfo.removed) return;
  response.cookies.push(changeInfo.cookie);
});

// third party
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const domain = url.hostname;
    if (
      !response.thirdParty.includes(domain) &&
      !domain.includes(response.url)
    ) {
      response.thirdParty.push(domain);
    }
  },
  { urls: ["<all_urls>"] },
);

// local storage
browser.runtime.onMessage.addListener(function (message) {
  if (message.localStorageData) {
    response.localStorage = message.localStorageData
  }
});
