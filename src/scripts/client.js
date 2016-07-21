(function() {
  var enforceBannerInterval;

  function convertFromTimestamp(timestamp) {
    var timestampRE = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
    var matches = timestamp.match(timestampRE);
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
    var options = { year: "numeric", month: "long", day: "numeric" };
    return utcDate.toLocaleString("en-us", options);
  }

  /**
   * @param {string} type
   * @param {function} handler(el)
   * @param remaining args are children
   * @returns {object} DOM element
   */
  function createEl(type, handler) {
    var el = document.createElement(type);
    if (handler !== undefined) {
      handler(el);
    }
    // Append *args to created el
    for (var i = 2; i < arguments.length; i++) {
      el.appendChild(arguments[i]);
    }
    return el;
  }

  function createBanner(url, response) {
    if (document.getElementById("no-more-404s-message") !== null) {
      return;
    }

    var wayback_url = response.archived_snapshots.closest.url;
    var timestamp = response.archived_snapshots.closest.timestamp;
    var date = convertFromTimestamp(timestamp);

    document.body.appendChild(
      createEl("div",
        function(el) {
          el.id = "no-more-404s-message";
          var messageElStyles = {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            minHeight: "50px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 14px 5px 12px",
            background: "linear-gradient(#FBFBFB, #E6E6E6)",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(0, 0, 0, 0.3);",
            color: "#333",
            font: "14px message-box, sans-serif",
            transition: "transform 500ms ease-out",
            transform: "translate(0, -100%)"
          };
          for (var prop in messageElStyles) {
            el.style[prop] = messageElStyles[prop];
          }
        },
        createEl("img", function(el) {
          el.src = chrome.extension.getURL("images/insetIcon.svg");
          el.style.margin = "0 2px 0 0";
          el.width = "30";
          el.height = "30";
        }),
        createEl("div",
          function(el) {
            el.style.flex = "1";
            el.style.margin = "0 0 0 8px";
          },
          document.createTextNode("Not to worry! This page is available via the Internet Archive Wayback Machine. "),
          createEl("a", function(el) {
            el.id = "no-more-404s-message-link";
            el.href = wayback_url;
            el.style.color = "#0996F8";
            el.style.textDecoration = "none";
            el.appendChild(document.createTextNode("Visit the site as it looked on " + date + "."));
          })
        ),
        createEl("button",
          function(el) {
            el.style.width = "20px";
            el.style.height = "20px";
            el.style.borderRadius = "3px";
            el.style.boxSizing = "border-box";
            el.style.padding = "3px 0 0 0";
            el.style.border = "none";
            el.onclick = function() {
              clearInterval(enforceBannerInterval);
              document.getElementById("no-more-404s-message").style.display = "none";
            };
            el.onmouseenter = function() {
              el.style.backgroundColor = "#E6E6E6";
              el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
            };
            el.onmousedown = function() {
              el.style.backgroundColor = "#CACACA";
              el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.15) inset";
            };
            el.onmouseup = function() {
              el.style.backgroundColor = "#E6E6E6";
              el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
            };
            el.onmouseleave = function() {
              el.style.backgroundColor = "";
              el.style.boxShadow = "";
            };
          },
          createEl("img", function(el) {
            el.src = chrome.extension.getURL("images/close.svg");
            el.alt = "close";
            el.style.borderRadius = "3px";
            el.style.height = "14px";
            el.style.width = "14px";
            el.style.transition = "color 100ms";
          })
        )
      )
    );
    // Focus the link for accessibility
    document.getElementById("no-more-404s-message-link").focus();

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById("no-more-404s-message").style.transform = "translate(0, 0%)";
    }, 100);
  }

  function checkIt() {
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
  }

  checkIt();
})();
