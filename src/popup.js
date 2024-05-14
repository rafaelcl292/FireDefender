function scan() {
  browser.runtime.sendMessage("scan").then((response) => {
    document.getElementById("content").innerHTML = `
      <p>URL: ${response.url}</p>
      <p>Local Storage: ${response.localStorage}</p>
      <p>Third Party: ${response.thirdParty.join(", ")}</p>
      <p>Third Party Count: ${response.thirdParty.length}</p>
      <p>Cookies: ${response.cookies.length}</p>
    `;
  });
}

function clear() {
  browser.runtime.sendMessage("clear");
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("scanButton").addEventListener("click", scan);
  document.getElementById("clearButton").addEventListener("click", clear);
});
