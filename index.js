class UndetectableBrowser {
  constructor(_browser) {
    this.browser = _browser;
    this.verbose = false;
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
    const { goto: originalGoto } = page;
    page.mousePos = { x: 0, y: 0 };

    page.sleep = function sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    page.navigate = async function navigate(url) {
      await Promise.all([page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }), page.goto(url)]);
    };
    page.waitToLoad = async function navigate(url) {
      await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });
    };

    page.simulateTyping = async function simulateTyping(selector, text, options = {}) {
      const { delay = 20, variation = 0.4 } = options;
      await page.focus(selector);
      await page.sleep(20);
      for (const char of text) {
        await page.keyboard.type(char, { delay: delay + Math.random() * delay * variation });
      }
    };

    page.simulateMouseClick = async function simulateMouseClick(selector) {
      if (!selector) {
        throw new Error(`${selector} was not defined.`);
      }
      let element;
      if (typeof selector == "object") {
        element = selector;
      } else {
        element = await page.$(selector);
      }

      if (!element) {
        throw new Error(`Element with selector ${selector} not found in order to click on it.`);
      }

      const box = await element.boundingBox();
      const offsetX = box.width / 2 + box.x;
      const offsetY = box.height / 2 + box.y;
      const randomOffsetX = Math.floor(Math.random() * 5) - 2;
      const randomOffsetY = Math.floor(Math.random() * 5) - 2;
      const finalOffsetX = offsetX + randomOffsetX;
      const finalOffsetY = offsetY + randomOffsetY;
      const pathPoints = generateRandomPath(page.mousePos.x, page.mousePos.y, finalOffsetX, finalOffsetY, 50);
      for (const { x, y } of pathPoints) {
        await page.mouse.move(x, y);
        page.mousePos.x = x;
        page.mousePos.y = y;
        await page.sleep(Math.floor(Math.random() * 20));
      }

      const clickDelay = Math.floor(Math.random() * 100) + 50;
      await page.sleep(clickDelay);
      await page.mouse.down();
      await page.sleep(50);
      await page.mouse.up();
    };

    page.getElementWithInnerText = async function getElementWithInnerText(element, innerText) {
      const elements = await page.$$(`${element}:not(:has(${element}))`);
      for (const element of elements) {
        const innerTextOfElement = await page.evaluate((element) => element.innerText, element);
        if (innerTextOfElement == innerText) {
          return element;
        }
      }
      console.log(`${element} with ${innerText} was not found`);
    };

    page.getElementWithInnerHTML = async function getElementWithInnerHTML(element, innerHTML) {
      const elements = await page.$$(`${element}:not(:has(${element}))`);
      for (const element of elements) {
        const innerHtmlOfElement = await page.evaluate((element) => element.innerHTML, element);
        if (innerHtmlOfElement.includes(innerHTML)) {
          return element;
        }
      }
      console.log(`${element} with ${innerHTML} was not found`);
    };
    page.clickElementWithInnerText = async function clickElementWithInnerText(selectorElement, innerText) {
      const element = await page.getElementWithInnerText(selectorElement, innerText);
      if (element) await page.simulateMouseClick(element);
    };
    page.clickElementWithInnerHTML = async function clickElementWithInnerHTML(selectorElement, innerHTML) {
      const element = await page.getElementWithInnerHTML(selectorElement, innerHTML);
      if (element) await page.simulateMouseClick(element);
    };

    page.closeOtherPages = async function closeOtherPages() {
      let pages = await this.browser.pages();
      let pagesToClose = [];
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].mainFrame()._id != page.mainFrame()._id) {
          pagesToClose.push(pages[i]);
        }
      }
      for (var i = 0; i < pagesToClose.length; i++) {
        await pagesToClose[i].close();
      }
    };

    page.repeatFunctionByAmount = async function repeatFunctionByAmount(functionCallback, numberOfTries, errorMessage) {
      if (numberOfTries < 1) throw new Error("Number of tries cannot be less than 1");
      let errorRep;
      while (numberOfTries >= 1) {
        try {
          if (functionCallback.constructor.name === "AsyncFunction") {
            return await functionCallback();
          } else {
            return functionCallback();
          }
        } catch (error) {
          if (errorMessage) {
            console.error(`${errorMessage} Tries left: ${numberOfTries}`);
          } else {
            console.error(`Repeat function failed tries: ${numberOfTries}`);
          }
          numberOfTries -= 1;
          errorRep = error;
        }
      }
      throw new Error(errorRep);
    };

    page.executeFunctionWithTimeout = function executeFunctionWithTimeout(functionCallback, timeout, customMessage) {
      let timer;
      let timeoutPromise = new Promise((resolve) => {
        timer = setTimeout(report, timeout);
        function report() {
          console.log(`Execution Timeout reached ${timeout}`);
          if (customMessage) console.log(customMessage);
          resolve("timeout");
        }
      });
      return Promise.race([functionCallback(), timeoutPromise]).finally(() => clearTimeout(timer));
    };

    page.makeid = function makeid(length) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    };

    page.getRandomInt = function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return page;
  }

  async getBrowser() {
    const browser = await this.browser;
    return await this.extendBrowser(browser);
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
