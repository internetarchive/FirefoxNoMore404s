(function() {
  var enforceBannerInterval;

  /**
   * borrowed from Adam's ChromeNoMore404s plugin
   */
  function convertFromTimestamp(timestamp) {
    var year = timestamp.substring(0,4);
    var month = timestamp.substring(4,6);
    var day = timestamp.substring(6,8);
    var hour = timestamp.substring(8,10);
    var min = timestamp.substring(10,12);
    var sec = timestamp.substring(12,14);
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var dateString=day;
    dateString+= " " + monthNames[parseInt(month)-1];
    dateString+= ", " +year;
    dateString+= " " + hour;
    dateString+= ":" + min;
    dateString+= ":" + sec;
    return dateString;
  }

  var createBanner = function(url, response) {
    if (document.getElementById('no-more-404s-message') !== null) {
      return;
    }
    var messageEl = document.createElement("div");
    messageEl.id = "no-more-404s-message";
    var messageElStyles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      padding: "1rem",
      background: "linear-gradient(rgb(236, 236, 236), rgb(225, 225, 225))",
      borderBottom: "1px solid rgb(122, 122, 122)",
      color: "#333",
      font: "15px arial, sans-serif",
      display: "flex",
      alignItems: "center",
      transition: "transform 1.0s linear",
      transform: "translate(0, -100%)",
    };
    for(var prop in messageElStyles) {
      messageEl.style[prop] = messageElStyles[prop];
    }

    var imageEl = document.createElement("img");
    imageEl.src = chrome.extension.getURL("images/insetIcon.png");
    imageEl.style.margin = '0 8px 0 0';
    messageEl.appendChild(imageEl);

    var wayback_url = response.archived_snapshots.closest.url;
    var timestamp = response.archived_snapshots.closest.timestamp;
    var date = convertFromTimestamp(timestamp);

    var linkEl = document.createElement('a');
    linkEl.href = wayback_url;
    linkEl.style.color = 'blue';
    linkEl.appendChild(document.createTextNode("Visit the site as it was captured on " + date));

    var textEl = document.createElement("div");
    textEl.appendChild(document.createTextNode("This page is available via the Wayback Machine - "));
    textEl.appendChild(linkEl);
    textEl.style.flex = "1";
    textEl.style.margin = '0 0 0 8px';
    messageEl.appendChild(textEl);

    var closeEl = document.createElement("button");
    closeEl.appendChild(document.createTextNode("Close"));
    closeEl.onclick = function() {
      clearInterval(enforceBannerInterval);
      document.getElementById('no-more-404s-message').style.display = "none";
    };
    messageEl.appendChild(closeEl);
    document.body.appendChild(messageEl);

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById('no-more-404s-message').style.transform = "translate(0, 0%)";
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
