/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */

var VERSION = "1.8.6";
badURL="";
badId=-1;
var excluded_urls = [
  
  "www.google.co",
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];
RTurl="";
Globalstatuscode="";
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
  var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504,
                         509, 520, 521, 523, 524, 525, 526];
  function tabIsReady(isIncognito) {
    
    if (isIncognito === false &&
        details.frameId === 0 &&
        isValidUrl(badURL)) {
      wmAvailabilityCheck(badURL, function(wayback_url, url) {
        chrome.tabs.executeScript(badId, {
              file: "scripts/client.js"
            }, function() {
              if (chrome.runtime.lastError) {
                var errorMsg = chrome.runtime.lastError.message
                if (errorMsg.startsWith("Cannot access contents of url")) {
                  chrome.tabs.update(badId, {url: chrome.extension.getURL('dnserror.html')+"?url="+wayback_url});
                }
              }else{
                chrome.tabs.sendMessage(badId, {
                  type: "SHOW_BANNER",
                  wayback_url: wayback_url
                });
              }
            });
      }, function() {
        
      });
    }
  }
  if(httpFailCodes.indexOf(details.statusCode) >= 0){
    badURL=details.url;
    chrome.tabs.query({currentWindow:true},function(tabs){
     for(var i=0;i<tabs.length;i++){
         if(tabs[i].url==badURL){
             badId=tabs[i].id;
         }
     }
      chrome.tabs.get(badId, function(tab) {
    tabIsReady(tab.incognito);
  });
  });
  }
  
  
  

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
  xhr.setRequestHeader("User-Agent", navigator.userAgent + " Wayback_Machine_Firefox/" + VERSION+" Status-code/" + Globalstatuscode);
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

function URLopener(open_url,url){
    chrome.tabs.create({ url:  open_url});
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
    
      
      var page_url = message.page_url;
      var wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      var url = page_url.replace(pattern, "");
      var open_url = wayback_url+encodeURI(url);
      console.log(open_url);
      if (message.method!='save') {
        URLopener(open_url,url);
      } else {
        chrome.tabs.create({ url:  open_url});
      }
    
  }else if(message.message=='makemodal'){
            RTurl=message.rturl;
            console.log(RTurl);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab=tabs[0];
                var url=RTurl;
                if(url.includes('web.archive.org') || url.includes('web-beta.archive.org')){
                    //chrome.tabs.sendMessage(tab.id, {message:'nomodal'});
                    alert("Structure as radial tree not available on archive.org pages");
                }else{
                chrome.tabs.executeScript(tab.id, {
                    file:"scripts/lodash.min.js"
                });
                chrome.tabs.executeScript(tab.id, {
                    file:"scripts/d3.js"
                });
                chrome.tabs.executeScript(tab.id, {
                    file:"scripts/radial-tree.umd.js"
                });
                chrome.tabs.executeScript(tab.id, {
                    file:"scripts/RTcontent.js"
                });
                chrome.tabs.executeScript(tab.id, {
                    file:"scripts/sequences.js"
                });
                }
                
                
                
            });
                
        }else if(message.message=='sendurl'){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var url=tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, {url:url});
            });
        }else if(message.message=='sendurlforrt'){
            console.log(RTurl);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                //var url=tabs[0].url;
                console.log(RTurl);
                chrome.tabs.sendMessage(tabs[0].id, {RTurl:RTurl});
                console.log(RTurl);
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

var contextMenuItemFirst={
    "id":"first",
    "title":"First Version",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};

var contextMenuItemRecent={
    "id":"recent",
    "title":"Recent Version",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};
var contextMenuItemAll={
    "id":"all",
    "title":"All Versions",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};

var contextMenuItemSave={
    "id":"save",
    "title":"Save Page Now",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};
chrome.contextMenus.create(contextMenuItemFirst);
chrome.contextMenus.create(contextMenuItemRecent);
chrome.contextMenus.create(contextMenuItemAll);
chrome.contextMenus.create(contextMenuItemSave);
chrome.contextMenus.onClicked.addListener(function(clickedData){
    if(clickedData.menuItemId=='first'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var page_url = tabs[0].url;
            var wayback_url ="https://web.archive.org/web/0/"
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            var url = page_url.replace(pattern, "");
            var open_url = wayback_url+encodeURI(url);
            URLopener(open_url,url);
        });
    }else if(clickedData.menuItemId=='recent'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var page_url = tabs[0].url;
            var wayback_url ="https://web.archive.org/web/2/"
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            var url = page_url.replace(pattern, "");
            var open_url = wayback_url+encodeURI(url);
            URLopener(open_url,url);
        });
    }else if(clickedData.menuItemId=='save'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var page_url = tabs[0].url;
            var wayback_url ="https://web.archive.org/save/";
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            var url = page_url.replace(pattern, "");
            var open_url = wayback_url+encodeURI(url);
            chrome.tabs.create({ url:  open_url});
        });
    }else if(clickedData.menuItemId=='all'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var page_url = tabs[0].url;
            var wayback_url ="https://web.archive.org/web/*/";
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            var url = page_url.replace(pattern, "");
            var open_url = wayback_url+encodeURI(url);
            chrome.tabs.create({ url:  open_url});
        });
    }
    
});
