# No More 404s [![Build Status](https://travis-ci.org/internetarchive/FirefoxNoMore404s.svg?branch=master)](https://travis-ci.org/internetarchive/FirefoxNoMore404s) [![devDependencies Status](https://david-dm.org/internetarchive/FirefoxNoMore404s/dev-status.svg)](https://david-dm.org/internetarchive/FirefoxNoMore404s?type=dev)

## Developing

This is a "WebExtension". See https://developer.mozilla.org/Add-ons/WebExtensions/Your_first_WebExtension

Develop through the web-ext run command.
```
npm run dev
```


## How to load a zip or xpi file directly into Firefox

- Upgrade to Firefox 45 or newer
- Visit `about:debugging`
- Click "Load Temporary Add-on"
- Click "manifest.json"

If something is wrong, it will silently fail. Try removing the add-on, waiting a few seconds, then re-adding.

More info:
https://developer.mozilla.org/docs/Tools/about%3Adebugging#Enabling_add-on_debugging

Also:

1. Open new tab.
2. Type "about:config".
3. Enter "xpinstall.signatures.required" in search bar.
4. Modify value to "false" (just click on it).
5. Restart Firefox and try install extension again.


## Publishing & Signing

The "web-ext" has a command that publishes and signs the extension at the same time. As far as I can tell, there is no way to do these separately. Once a version is published, it cannot be undone, so use with caution.

First update the version (see Places to Update the version).

```
# This will sign, publish, and update the ./build directory
npm install
npm run sign
```

## Building an unsigned extension

Only use this if you need to produce an unsigned xpi. Use "run" for development
```
npm run build_unsigned
```

## Places to update the version

- Changelog.md - update change log
- src/manifest.json - update version
- src/scripts/background.js - update header
- package.json - update header

## License

Copyright Internet Archive, 2016
AGPL-3


## Credits

  - Richard Caceres, @rchrd2
  - Greg Lindahl, @wumpus
  - Blake Winton, @bwinton, author of https://github.com/bwinton/404archive
  - Adam Miller, @adam-miller, author of https://github.com/adam-miller/ChromeNoMore404s