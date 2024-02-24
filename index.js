const hookBasicMethods = require("./page/BasicMethods");
const hookGeneralMethods = require("./page/GeneralMethods");
const hookNavigationMethods = require("./page/NavigationMethods");
const hookSelectorMethods = require("./page/SelectorMethods");
const hookInteractionMethods = require("./page/InteractionMethods");
const hookExtraMethods = require("./page/ExtraMethods");

class UndetectableBrowser {
  constructor(_browser) {
    this.browser = _browser;
    this.verbose = false;
    this.adblockURLs = [];
  }

  async extendBrowser(browser) {
    if (browser.undetectableBMSHook) return browser;

    browser.undetectableBMSHook = true;
    browser.on("targetcreated", async (target) => {
      if (target.type() === "page") {
        const page = await target.page();
        this.extendPage(page);
      }
    });
    this.browser = browser;
    return browser;
  }

  extendPage(page) {
    page.mousePos = { x: 0, y: 0 };
    page = hookBasicMethods(page);
    page = hookGeneralMethods(page);
    page = hookNavigationMethods(page);
    page = hookSelectorMethods(page);
    page = hookInteractionMethods(page);
    page = hookExtraMethods(page);

    // page.simulateTyping = async function simulateTyping(selector, text, options = {}) {
    //   const { delay = 20, variation = 0.4 } = options;
    //   await page.focus(selector);
    //   await page.sleep(20);
    //   for (const char of text) {
    //     await page.keyboard.type(char, { delay: delay + Math.random() * delay * variation });
    //   }
    // };

    // page.simulateMouseClick = async function simulateMouseClick(selector) {
    //   if (!selector) {
    //     throw new Error(`${selector} was not defined and it cannot be clicked.`);
    //   }
    //   let element;
    //   if (typeof selector == "object") {
    //     element = selector;
    //   } else {
    //     element = await page.$(selector);
    //   }

    //   if (!element) {
    //     throw new Error(`Element with selector ${selector} not found in order to click on it.`);
    //   }
    //   await element.scrollIntoView();
    //   const box = await element.boundingBox();
    //   const offsetX = box.width / 2 + box.x;
    //   const offsetY = box.height / 2 + box.y;
    //   const randomOffsetX = Math.floor(Math.random() * 5) - 2;
    //   const randomOffsetY = Math.floor(Math.random() * 5) - 2;
    //   const finalOffsetX = offsetX + randomOffsetX;
    //   const finalOffsetY = offsetY + randomOffsetY;
    //   const pathPoints = generateRandomPath(page.mousePos.x, page.mousePos.y, finalOffsetX, finalOffsetY, 50);
    //   for (const { x, y } of pathPoints) {
    //     await page.mouse.move(x, y);
    //     page.mousePos.x = x;
    //     page.mousePos.y = y;
    //     await page.sleep(Math.floor(Math.random() * 20));
    //   }

    //   const clickDelay = Math.floor(Math.random() * 100) + 50;
    //   await page.sleep(clickDelay);
    //   await page.mouse.down();
    //   await page.sleep(50);
    //   await page.mouse.up();
    // };

    return page;
  }

  async getBrowser() {
    const browser = await this.browser;
    this.browser = await this.extendBrowser(browser);
    return this.browser;
  }
}

function generateRandomPath(startX, startY, endX, endY, steps) {
  const path = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    // Introduce randomness in both x and y coordinates
    const noiseX = Math.floor(Math.random() * 10) - 5;
    const noiseY = Math.floor(Math.random() * 10) - 5;

    let x = Math.round(startX + (endX - startX) * t + noiseX);
    let y = Math.round(startY + (endY - startY) * t + noiseY);
    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    path.push({ x, y });
  }
  path.push({ x: endX, y: endY });
  return path;
}

module.exports = UndetectableBrowser;
