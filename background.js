const response = {
  url: "",
  thirdParty: [],
  localStorage: "No",
  cookies: [],
};

browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg === "scan") {
    sendResponse(response);
  }
  if (msg === "clear") {
    response.url = "";
    response.thirdParty = [];
    response.localStorage = "No";
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
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    response.localStorage = JSON.stringify(changes);
  }
});
