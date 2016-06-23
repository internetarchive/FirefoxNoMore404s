## Developing

This is a "WebExtension". See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension

- Upgrade to Firefox 45 or newer
- Visit `about:debugging`
- Click "Load Temporary Add-on"
- Click "manifest.json"

If something is wrong, it will silently fail. Try removing the add-on, waiting a few seconds, then re-adding.

More info:
https://developer.mozilla.org/en-US/docs/Tools/about%3Adebugging#Enabling_add-on_debugging

Also:
```
open new tab
type "about:config"
enter " xpinstall.signatures.required" in search bar.
modify value to "false" (just click on it).
restart firefox and try install extension again.
```


## Building

First run:

- Run `npm install -g web-ext@1.0.1`
- Run `make build`


## Places to update the version

- Changelog.md - update change log
- src/manifest.json - update version
- src/scripts/background.js - update header
- Makefile - update version


## License

Copyright Internet Archive, 2016
AGPL-3


## Credits

  - Richard Caceres, @rchrd2
  - Greg Lindahl, @wumpus
  - Blake Winton, @bwinton, author of https://github.com/bwinton/404archive
  - Adam Miller, @adam-miller, author of https://github.com/adam-miller/ChromeNoMore404s
