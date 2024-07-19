# Undetected Browser

Undetected Browser is a framework that extends Puppeteer capabilities with even more usefull functions. It can run any puppeteer browser instance and its modular system will allow you to build plugins on top of it. Special thanks to @TheGP and @wiz64 for support on codebase ideeas.

## Features

- Works with Bablosoft, Puppeteer, Puppeteer Stealth
- Implement more complicated functions for better selectors, better navigation waiting etc.
- Mimic human like interaction on the page through special functions
- Uses @forad/puppeteer-humanize and ghost-cursor to deliver results

## Installation

```bash
  npm install undetected-browser
```

or for bun users

```bash
  bun install undetected-browser
```

## Usage/Examples

NOTE: You can use any driver powered by puppeteer like pupeteer-extra or puppeteer-with-fingerprints (bablosoft)

```javascript
const UndetectableBrowser = require("undetected-browser");
const puppeteer = require("puppeteer");

async function init() {
  const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();

  //you can use any page.methods here
  //please look at example.js
}
init();
```

## Methods

page.navigate - better navigation waiting for load detector

```javascript
await page.navigate(url);
```

page.waitToLoad - better waiting after click handling

```javascript
page.click("#someid");
await page.waitToLoad();
```

page.simulateMouseClick - human-like smart click with benzier mouse movements by [ghost-cursor](https://github.com/Xetera/ghost-cursor)

```javascript
await page.simulateMouseClick(selector | element);
ex: await page.simulateMouseClick('button[type="submit"]');
```

page.simulateTyping - human-like smart typing with random delays and mistakes by [puppeteer-humanize](https://github.com/force-adverse/puppeteer-humanize/tree/main)

```javascript
await page.simulateTyping(selector | element, text);
ex: await page.simulateTyping('input[id="username"]', "MrBeast");
```

page.smartWaitForSelector - it tries to find the selector. If it cannot find it it will use page.waitForSelector to wait for it. If waitForSelector timeouts it will await the amount of seconds you specify. This method does not throw errors.

```javascript
await page.smartWaitForSelector(selector, delay);
ex: await page.smartWaitForSelector('button[type="submit"]', 4000); //will wait 4 seconds after it attempts to use page.waitForSelector(no error will be thrown)
await page.smartWaitForSelector('button[type="submit"]'); // Will throw an error if its unable to wait for the selector
```

page.$$$ - it tries to find an element in hidden document like iframes or shadow based to your selector.ALERT! It only works with iframes at the moment(no shadowroot)

```javascript
await page.$$$(selector);
ex: await page.$$$('button[type="submit"]');
```

page.setupURLBlocker - will help you block resources urls.

```javascript
await page.setupURLBlocker(urls);
ex: await page.setupURLBlocker(["test.js", ".svg", "google.com"]);
```

### CHECKERS

page.checkFingerprint - will generate a report via pixelscan.net about the browser fingeprint. You can pass it a bool to save a screenshot of the image if the fingeprint is bad

```javascript
await page.checkFingerprint(screenshot);
ex: await page.checkFingerprint(true);
```

page.checkCaptcha - will check your fingerprint on both Cloudflare and Arkose Captcha. Both providers are the best at detecting bots and their report will indicate how good is your scraper.

```javascript
const result = await page.checkCaptcha();
```

page.messureSpeed - will check page latecy. You can specify an url for speedtest. If not google.com will be used

```javascript
await page.messureSpeed(url);
ex: await page.messureSpeed("https://github.com/");
```

### SCANNERS

page.scanFingerprintAttempts - Will setup a fingerprint scanner that will output every fingerprint scan attempt from a page

```javascript
await page.scanFingerprintAttempts();
await page.navigate("https://browserleaks.com/canvas");
```

### BETA METHODS

page.getElementWithInnerText - search an element based to the type of html object and the inner text Returns CDPElementHandle. The innerText must be EXACT!

```javascript
await page.getElementWithInnerText(HTMLelementName, innerText);
ex: await page.getElementWithInnerText("button", "Log in");
```

page.getElementWithInnerHTML - search an element based to the type of html object and the innerHTML Returns CDPElementHandle. The innerHTML can be just a word as this method searches elements that contain the innerHTML you specify.

```javascript
await page.getElementWithInnerHTML(HTMLelementName, innerHTML);
ex: await page.getElementWithInnerText("div", "Shop with cred");
```

page.clickElementWithInnerText - Will use smart mouse movement to click on element with same innerText

```javascript
await page.clickElementWithInnerText(HTMLelementName, innerHTML);
ex: await page.clickElementWithInnerText("button", "Log in");
```

page.clickElementWithInnerHTML - Will use smart mouse movement to click on element that contain innerHTML

```javascript
await page.clickElementWithInnerHTML(HTMLelementName, innerHTML);
ex: await page.clickElementWithInnerHTML("div", "<span>I love sna");
```

### OTHER METHODS

page.enableMouseDebugWindow - used for debugging mouse movement path in a graphical way

```javascript
await page.enableMouseDebugWindow();
```

page.sleep - used for script delays

```javascript
await page.sleep(3000);
```

page.randomSleep - used for random script delays

```javascript
await page.randomSleep(1000, 3000);
```

page.closeOtherPages - closes other opened pages in the browser EXCEPT the current one (usefull for cleanup)

```javascript
await page.closeOtherPages();
```

page.repeatFunctionByAmount - will try to re-execute a function if it errors out. It also works with async functions. Its usefull when you want to repeat a function in case it errors out.

```javascript
await page.repeatFunctionByAmount(functionCallback, numberOfTries, errorMessage);
ex: page.repeatFunctionByAmount(() => {
  throw new Error("error");
}, 3);
```

page.executeFunctionWithTimeout - this is usefull if you want to make sure your async function doesnt run forever. It will return either your async function result or "timeout"

```javascript
await page.executeFunctionWithTimeout(functionCallback, timeout, customMessage);
ex: page.executeFunctionWithTimeout(() => {
  while (true) {}
}, 3000);
```

page.makeid - will generate a random id

```javascript
await page.makeid(length);
```

page.getRandomInt - will generate a random int

```javascript
await page.getRandomInt(min, max);
```

### NOTES:

- If you wish to use ghost cursor on the page object, you already have it defined it as page.cursor so you can do the following:

```javascript
await page.cursor.click(selector?: string | ElementHandle, options?: ClickOptions);
await page.cursor.move(selector: string | ElementHandle, options?: MoveOptions)
await page.cursor.moveTo(destination: Vector)
```

- If you wish to use @forad/puppeteer-humanize you have the typeInto function defined in page.typeInto so you can do the following:

```javascript
await page.typeInto(input, text, config);
```

- If you need a good proxy checker please use [advanced-proxy-checker](https://www.npmjs.com/package/advanced-proxy-checker). I wont implement one in this lib

Please search those libraries for further reference.

## TODO LIST

- Shadowroot for page.$$$
- Implement page.$$$$ (get all elements matching selector)
- Implement smart page wait internally
- Check fp uniqueness
- Add support for multiple selectors in certain functions.
