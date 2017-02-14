/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */
var VERSION = "1.8.1";

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


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var page_url = tab.url;
      wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      url = page_url.replace(pattern, "");
      open_url = wayback_url+encodeURI(url);
      if (message.method!='save') {
        wmAvailabilityCheck(url,function(){
          chrome.tabs.create({ url:  open_url});
        },function(){
          chrome.runtime.sendMessage({message:'urlnotfound'},function(response){
          });
        })
      } else {
        chrome.tabs.create({ url:  open_url});
      }
    });
  }
});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
  function tabIsReady(isIncognito) {
    if(details.error == 'NS_ERROR_NET_ON_CONNECTING_TO'  || details.error == 'NS_ERROR_NET_ON_RESOLVED'){
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?url="+wayback_url});
      }, function() {
        
      });
    }
  }
  if(details.tabId >0 ){
    chrome.tabs.get(details.tabId, function(tab) {
      tabIsReady(tab.incognito);
    });  
  }

  
}, {urls: ["<all_urls>"], types: ["main_frame"]});