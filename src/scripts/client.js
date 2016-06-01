/* global chrome */

(function() {
  var enforceBannerInterval;

  function convertFromTimestamp(timestamp) {
    var timestampRE = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
    var matches = matches = timestamp.match(timestampRE);
    if (!matches) {
      console.error("Invalid timestamp"); // eslint-disable-line no-console
      return timestamp;
    }
    var utcDate = new Date(Date.UTC(
      matches[1],
      matches[2] - 1 /* zero indexed */,
      matches[3],
      matches[4],
      matches[5],
      matches[6]
    ));
    return utcDate.toLocaleString();
  }

  var createBanner = function(url, response) {
    if (document.getElementById("no-more-404s-message") !== null) {
      return;
    }
    var messageEl = document.createElement("div");
    messageEl.id = "no-more-404s-message";
    var messageElStyles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      padding: "10px",
      background: "linear-gradient(rgb(236, 236, 236), rgb(225, 225, 225))",
      borderBottom: "1px solid rgb(122, 122, 122)",
      color: "#333",
      font: "15px arial, sans-serif",
      display: "flex",
      alignItems: "center",
      transition: "transform 1.0s linear",
      transform: "translate(0, -100%)",
      boxSizing: "border-box"
    };
    for(var prop in messageElStyles) {
      messageEl.style[prop] = messageElStyles[prop];
    }

    var imageEl = document.createElement("img");
    imageEl.src = chrome.extension.getURL("images/insetIcon.png");
    imageEl.style.margin = "0 8px 0 0";
    messageEl.appendChild(imageEl);

    var wayback_url = response.archived_snapshots.closest.url;
    var timestamp = response.archived_snapshots.closest.timestamp;
    var date = convertFromTimestamp(timestamp);

    var linkEl = document.createElement("a");
    linkEl.href = wayback_url;
    linkEl.style.color = "blue";
    linkEl.appendChild(document.createTextNode("Visit the site as it was captured on " + date));

    var textEl = document.createElement("div");
    textEl.appendChild(document.createTextNode("This page is available via the Wayback Machine - "));
    textEl.appendChild(linkEl);
    textEl.style.flex = "1";
    textEl.style.margin = "0 0 0 8px";
    messageEl.appendChild(textEl);

    var closeEl = document.createElement("button");
    closeEl.appendChild(document.createTextNode("Close"));
    closeEl.onclick = function() {
      clearInterval(enforceBannerInterval);
      document.getElementById("no-more-404s-message").style.display = "none";
    };
    messageEl.appendChild(closeEl);
    document.body.appendChild(messageEl);

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById("no-more-404s-message").style.transform = "translate(0, 0%)";
    }, 100);
  };

  var checkIt = function() {
    var wayback_page_url = window.__WAYBACK_PAGE_URL;
    var wayback_response = window.__WAYBACK_RESPONSE;
    // console.log(window.__DEBUG_MESSAGE === undefined ? 'debug is undefined' : window.__DEBUG_MESSAGE);
    // console.log(wayback_page_url);
    // console.log(wayback_response);
    if (wayback_page_url && wayback_response) {
      // Some pages use javascript to update the dom so poll to ensure
      // the banner gets recreated if it is deleted.
      enforceBannerInterval = setInterval(function() {
        createBanner(wayback_page_url, wayback_response);
      }, 500);
    }
  };

  checkIt();
})();
