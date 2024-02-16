# Undetected Browser

Undetected Browser is a framework that extends Puppeteer capabilities with even more usefull functions. It can run any puppeteer browser instance and its modular system will allow you to build plugins on top of it.

## Features

- Works with Bablosoft, Puppeteer, Puppeteer Stealth
- Implement more complicated functions for better selectors, better navigation waiting etc.
- Mimic human like interaction on the page through special functions

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
const pupeteer = require("puppeteer");

async function init() {
  const UndetectableBMS = new UndetectableBrowser(pupeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();

  //you can use any page.methods here
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
await page.waitToLoad();
```

page.simulateTyping - human-like smart typing with random delays

```javascript
await page.simulateTyping(selector, text);
ex: await page.simulateTyping('input[id="username"]', "MrBeast");
```

page.simulateMouseClick - human-like smart click with random mouse movements. This method clicks on x,y coords so its much more reliable than element.click() NOTE: You can also pass an CDPElementHandle type element that you can return with page.$(selector) or getElementWithInnerText or similar

```javascript
await page.simulateMouseClick(selector);
ex: await page.simulateMouseClick('button[type="submit"]');
```

### BETA METHODS

page.getElementWithInnerText - search an element based to the type of html object and the inner text Returns CDPElementHandle. The innerText must be EXACT!

```javascript
await page.getElementWithInnerText(element, innerText);
ex: await page.getElementWithInnerText("button", "Log in");
```

page.getElementWithInnerHTML - search an element based to the type of html object and the innerHTML Returns CDPElementHandle. The innerHTML can be just a word as this method searches elements that contain the innerHTML you specify.

```javascript
await page.getElementWithInnerHTML(element, innerHTML);
ex: await page.getElementWithInnerText("div", "Shop with cred");
```

page.clickElementWithInnerText - Will use smart mouse movement to click on element with same innerText

```javascript
await page.clickElementWithInnerText(element, innerHTML);
ex: await page.clickElementWithInnerText("button", "Log in");
```

page.clickElementWithInnerHTML - Will use smart mouse movement to click on element that contain innerHTML

```javascript
await page.clickElementWithInnerHTML(element, innerHTML);
ex: await page.clickElementWithInnerHTML("div", "<span>I love sna");
```

### OTHER METHODS

page.sleep - used for script delays

```javascript
await page.sleep(3000);
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

## TODO LIST

- Implement url ad blocking

- Fingerprint checker

- Proxy checker

- Latency checker
