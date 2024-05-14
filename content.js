var localStorageData = window.localStorage.length

browser.runtime.sendMessage({localStorageData: localStorageData});
