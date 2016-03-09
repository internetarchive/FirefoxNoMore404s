/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  if (details.statusCode === 404 &&
      details.frameId === 0 &&
      !details.url.startsWith('http://web.archive.org/web/') &&
      !details.url.startsWith('https://web.archive.org/web/')) {
    wmAvailabilityCheck(details.url, function(response, url) {
      // inject response into page
      chrome.tabs.executeScript(details.tabId, {
        code: 'window.__WAYBACK_PAGE_URL = ' + JSON.stringify(url),
      });
      chrome.tabs.executeScript(details.tabId, {
        code: 'window.__WAYBACK_RESPONSE = ' + JSON.stringify(response),
      });
      chrome.tabs.executeScript(details.tabId, {
        file: "scripts/client.js",
      });
    });
  }
}, {urls: ['<all_urls>'], types: ['main_frame']});

/**
 * borrowed from Adam's ChromeNoMore404s plugin
 */
function wmAvailabilityCheck(url, onsuccess, onfail, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://archive.org/wayback/available?url=' + url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.archived_snapshots &&
            response.archived_snapshots.closest &&
            response.archived_snapshots.closest.available &&
            response.archived_snapshots.closest.available === true &&
            response.archived_snapshots.closest.status.indexOf('2') === 0) {
          onsuccess(response, url);
        } else if (onfail && response.archived_snapshots &&
            !response.archived_snapshots.hasOwnProperty('closest')) {
          onfail(response, url);
        }
      } else {
        // if (onerror) {
        //   onerror(response, url);
        // }
      }
    }
  };
  xhr.send();
}
