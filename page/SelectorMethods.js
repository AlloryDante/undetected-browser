module.exports = function hookSelectorMethods(page) {
  page.smartWaitForSelector = async function smartWaitForSelector(selector = null, delay = 0) {
    if (!selector) throw new Error("No selector supplied to page.smartWaitForSelector");
    try {
      if (await page.$(selector)) return;
    } catch (error) {}
    try {
      await page.waitForSelector(selector);
    } catch (error) {
      if (delay) {
        await page.sleep(delay);
      } else {
        throw new Error(`page.smartWaitForSelector - Timeout for selector ${selector}`);
      }
    }
  };

  page.$$$ = async function querySelectorInFrame(selector) {
    const iframes = await page.$$("iframe");
    for (const iframe of iframes) {
      const potentialElement = await searchSelectorOrNextIframe(iframe, selector);
      if (potentialElement) return potentialElement;
    }
    return undefined;
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

  page.getAnySelector = async function getAnySelector(selectors) {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) return element;
    }
    // console.log(`None of the selectors were found`);
  };

  page.getAnySelectorName = async function getAnySelectorName(selectors) {
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) return selector;
    }
    // console.log(`None of the selectors were found`);
  };

  page.smartWaitForAnySelector = async function smartWaitForAnySelector(selectors, options = {}) {
    let selectorPromises = selectors.map(async(selector) => { 
      await page.smartWaitForSelector(selector, options)
      return selector;
  });
    let result = await Promise.race(selectorPromises)
    return result;
    console.log(`None of the selectors were found`);
  };

  page.slowType = async function slowType(selector, text) {
    for (const char of text) {
        await page.type(selector, char);
        await new Promise((r)=>setTimeout(r,100)); // adjust delay as needed
    }
  }


  return page;
};

async function searchSelectorOrNextIframe(iframe, selector) {
  if (!selector) return false;
  const frame = await iframe.contentFrame();
  const potentialElement = await frame.$(selector);
  if (potentialElement) return potentialElement;
  const iframes = await frame.$$("iframe");
  for (const iframe of iframes) {
    return await searchSelectorOrNextIframe(iframe, selector);
  }
  return false;
}
