## v1.5.6
- Make animation a bit more agressive by @johngruen

## v1.5.5
- Update exclusion policy and add localhost domains
- Raise strict_min_version to FF 48
- More CSS fixes

## v1.5.4
- Remove code injection from background.js in favor of message passing
- Add validation of response URL
- Fix ES Lint issue
- Update metrics documentation

## v1.5.3
- Fix issue with 404 pages on Myspace.com
- Remove some unused code.
- Move `version` into Telemetry payload

## v1.5.2
- Version bump to test automatic updating

## v1.5.1
- Add external update URL

## v1.5.0
- Add more resilient CSS
- Add test pilot telemetry

## v1.4.6
- Change the text in the banner.

## v1.4.5
- Update the build tooling to use NPM package.json (@pdehaan)
- Update the icons (@johngruen)
- Autofocus the link in the dropdown for accessibility

## v1.4.4
- Sign the extension

## v1.4.3
- Remove background:true from manifest which broke plugin in new FF version.

## v1.4.2
- Update the API call to use POST

## v1.4.1
- Add another header to api call
- Rename the built xpi file

## v1.4.0
- Add special header for endpoint.
- Rename to Wayback Machine.

## v1.3.2
- Use SVG icon
- Add border-box to button element. Fixes rendering issue on some pages.
- Change font to "14px message-box"

## v1.3.1
- Add missing space between text and link and correct typo.

## v1.3.0
- Add ES Lint file and update code style
- Fix icon image path
- Update styles based on suggestions by @johngruen

## v1.2.0
- Disable extension in incognito mode.

## v1.1.2
- Change client.js to use DOM methods instead of setting innerHTML for security.

## v1.1.1
- Remove custom headers and update User Agent to have plugin version.

## v1.1.0
- Add custom User Agent to requests
- Update requests to use https
