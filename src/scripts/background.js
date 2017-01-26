/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */
var VERSION = "1.8.0";

var excluded_urls = [
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504,
                         509, 520, 521, 523, 524, 525, 526];
    if (isIncognito === false &&
        details.frameId === 0 &&
        httpFailCodes.indexOf(details.statusCode) >= 0 &&
        isValidUrl(details.url)) {
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        }, function() {
          chrome.tabs.sendMessage(details.tabId, {
            type: "SHOW_BANNER",
            wayback_url: wayback_url
          });
        });
      }, function() {
        telemetry.none();
      });
    }
  }
  chrome.tabs.get(details.tabId, function(tab) {
    tabIsReady(tab.incognito);
  });
}, {urls: ["<all_urls>"], types: ["main_frame"]});

/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
  var xhr = new XMLHttpRequest();
  var requestUrl = "https://archive.org/wayback/available";
  var requestParams = "url=" + encodeURI(url);
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("User-Agent", navigator.userAgent + " Wayback_Machine_Firefox/" + VERSION);
  xhr.setRequestHeader("Wayback-Api-Version", 2);
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    var wayback_url = getWaybackUrlFromResponse(response);
    if (wayback_url !== null) {
      onsuccess(wayback_url, url);
    } else if (onfail) {
      onfail();
    }
  };
  xhr.send(requestParams);
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
  if (response.results &&
      response.results[0] &&
      response.results[0].archived_snapshots &&
      response.results[0].archived_snapshots.closest &&
      response.results[0].archived_snapshots.closest.available &&
      response.results[0].archived_snapshots.closest.available === true &&
      response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
      isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) {
    return makeHttps(response.results[0].archived_snapshots.closest.url);
  } else {
    return null;
  }
}

function makeHttps(url) {
  return url.replace(/^http:/, "https:");
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
  return ((typeof url) === "string" &&
    (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}

/**
 * Helper generaters a telemetry function. Each action can only be sent once.
 * @param action {string}
 * @return {function}
 */
function telemetryGenerator(action) {
  var TESTPILOT_TELEMETRY_CHANNEL = "testpilot-telemetry";
  var testpilotPingChannel = new BroadcastChannel(TESTPILOT_TELEMETRY_CHANNEL);
  var actionAlreadySent = false;
  return function() {
    if (actionAlreadySent === false) {
      testpilotPingChannel.postMessage({
        "test": "No More 404s",
        "agent": navigator.userAgent,
        "payload": {
          "action": action,
          "version": VERSION
        }
      });
    } else {
      actionAlreadySent = true;
    }
  }
}


var telemetry = {
  // 'viewed': the user clicked through to the archived version
  viewed: telemetryGenerator("viewed"),
  // 'dismissed': the user dismissed the prompt
  dismissed: telemetryGenerator("dismissed"),
  // 'ignored': the user ignored the prompt
  ignored: telemetryGenerator("ignored"),
  // 'none': will be 'none' if there isn't an archive available
  none: telemetryGenerator("none"),
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action in telemetry) {
    telemetry[request.action]();
    sendResponse(true);
  } else {
    sendResponse(false);
  }
});


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  console.log(message);
  if(message.message=='openurl'){
    chrome.tabs.create({ url: message.url });
  }
});
