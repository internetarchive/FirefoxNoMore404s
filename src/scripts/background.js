/* globals chrome:false */
//
// 'use strict';
//
// chrome.webRequest.onHeadersReceived.addListener(details => {
//   if (details.statusCode === 404 &&
//       details.frameId === 0 &&
//       !details.url.startsWith('http://web.archive.org/web/') &&
//       !details.url.startsWith('https://web.archive.org/web/')) {
//     console.log(`${details.url} returned 404 at ${details.frameId}!`);
//     console.log('redirecting to ' + `https://web.archive.org/web/*/${details.url}`);
//     chrome.tabs.update(details.tabId, {'url': `https://web.archive.org/web/*/${details.url}`});
//   }
// }, {urls: ['<all_urls>']});


chrome.webRequest.onCompleted.addListener(function(details) {
  // console.log('onCompleted');
  // console.log(details);
  // var detailString = JSON.stringify(details);
  // chrome.tabs.executeScript(details.tabId, {
  //   code: "console.log('onCompleted');console.log('"+detailString+"')"
  // });
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
    // return;
    // console.log(`${details.url} returned 404 at ${details.frameId}!`);
    // console.log('redirecting to ' + `https://web.archive.org/web/*/${details.url}`);
    // chrome.tabs.update(details.tabId, {'url': `https://web.archive.org/web/*/${details.url}`});


  }
}, {urls: ['<all_urls>'], types: ['main_frame']});
//
// chrome.webRequest.onHeadersReceived.addListener(function(details) {
//   console.log('onHeadersReceived');
//
//   // Note, loading css kills the page, for some reason...
//   // seems to only be supported in firfox 47, which isn't out yet...
//   // chrome.tabs.insertCSS(details.tabId, {
//   //   // file: "css/content.css",
//   //   code: "",
//   // });
//   // chrome.tabs.executeScript(details.tabId, {
//   //   file: "scripts/client.js",
//   // });
//   console.log(details);
//   var detailString = JSON.stringify(details);
//   chrome.tabs.executeScript(details.tabId, {
//     code: "console.log('onHeadersReceived');console.log('"+detailString+"')"
//   });
//   if (details.statusCode === 404 &&
//       details.frameId === 0 &&
//       !details.url.startsWith('http://web.archive.org/web/') &&
//       !details.url.startsWith('https://web.archive.org/web/')) {
//     chrome.tabs.executeScript(details.tabId, {
//       file: "scripts/client.js",
//     });
//     // return;
//     // console.log(`${details.url} returned 404 at ${details.frameId}!`);
//     // console.log('redirecting to ' + `https://web.archive.org/web/*/${details.url}`);
//     // chrome.tabs.update(details.tabId, {'url': `https://web.archive.org/web/*/${details.url}`});
//
//
//   }
// }, {urls: ['<all_urls>']});


//
// /* global XMLHttpRequest, chrome, console */
//
/* borrowed from Adam's ChromeNoMore404s plugin */
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
//
// chrome.webRequest.onHeadersReceived.addListener(function(details) {
//   if (details.statusCode === 404 &&
//       details.frameId === 0 &&
//       details.type == 'main_frame' &&
//       !details.url.startsWith('http://web.archive.org/web/') &&
//       !details.url.startsWith('https://web.archive.org/web/')) {
//
//     // console.log(`${details.url} returned 404 at ${details.frameId}!`);
//     wmAvailabilityCheck(details.url, function (response, url) {
//       // console.log('redirecting to https://web.archive.org/web/*/' + url);
//       // console.log('this url is available in the wayback machine');
//       alert('dammnnn daniel');
//       // chrome.tabs.update(details.tabId, { url: 'https://web.archive.org/web/*/' + url });
//     });
//   }
// }, { urls: ['<all_urls>'] });
