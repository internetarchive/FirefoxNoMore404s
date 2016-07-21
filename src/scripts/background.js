/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    // chrome.tabs.executeScript(details.tabId, {
    //   code: 'window.__DEBUG_MESSAGE = ' + JSON.stringify(isIncognito),
    // });
    if (isIncognito === false &&
        details.statusCode === 404 &&
        details.frameId === 0 &&
        !details.url.startsWith("http://web.archive.org/web/") &&
        !details.url.startsWith("https://web.archive.org/web/")) {
      wmAvailabilityCheck(details.url, function(response, url) {
        // inject response into page
        chrome.tabs.executeScript(details.tabId, {
          code: "window.__WAYBACK_PAGE_URL = " + JSON.stringify(url)
        });
        chrome.tabs.executeScript(details.tabId, {
          code: "window.__WAYBACK_RESPONSE = " + JSON.stringify(response)
        });
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        });
      });
    }
  }
  chrome.tabs.get(details.tabId, function(tab) {
    tabIsReady(tab.incognito);
  });
}, {urls: ["<all_urls>"], types: ["main_frame"]});


function wmAvailabilityCheck(url, onsuccess, onfail) {
  var xhr = new XMLHttpRequest();
  var requestUrl = "https://archive.org/wayback/available";
  var requestParams = "url=" + encodeURI(url);
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("User-Agent", navigator.userAgent + " Wayback_Machine_Firefox/1.4.3");
  xhr.setRequestHeader("Wayback-Api-Version", 2);
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    if (response.results &&
        response.results[0] &&
        response.results[0].archived_snapshots &&
        response.results[0].archived_snapshots.closest &&
        response.results[0].archived_snapshots.closest.available &&
        response.results[0].archived_snapshots.closest.available === true &&
        response.results[0].archived_snapshots.closest.status.indexOf("2") === 0) {
      onsuccess(response.results[0], url);
    } else if (onfail && response.archived_snapshots &&
        !response.archived_snapshots.hasOwnProperty("closest")) {
      onfail(response.results[0], url);
    }
  };
  xhr.send(requestParams);
}
