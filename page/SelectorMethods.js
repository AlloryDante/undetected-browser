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

  page.$$$ = async function querySelectorInShadowRoot(selector, mode = 0) {
    if (!selector) throw new Error("No selector has been defined for page.$$$");
    if (mode === 0 || mode === 1) {
      const iframes = await page.$$("iframe");
      for (const iframe of iframes) {
        const potentialElement = await searchSelectorOrNextIframe(iframe, selector);
        if (potentialElement) return potentialElement;
      }
    }
    if (mode === 0 || mode === 2) {
      return await searchSelectorOrNextShadow(page, page, selector);
    }

    return null;
  };

  page.$$$$ = async function querySelectorsInShadowRoot(selector, mode = 0) {
    if (!selector) throw new Error("No selector has been defined for page.$$$$");

    let elements = [];

    // Mode 0 or 1: Search through all iframes
    if (mode === 0 || mode === 1) {
      const iframes = await page.$$("iframe");
      for (const iframe of iframes) {
        const frame = await iframe.contentFrame();
        // if (frame) {
        //   const foundElements = await frame.$$(selector);
        //   elements.push(...foundElements);
        // }

        // Recursively search in nested iframes
        const nestedElements = await searchSelectorsInNestedIframes(iframe, selector);
        elements.push(...nestedElements);
      }
    }

    // Mode 0 or 2: Search through all shadow roots
    if (mode === 0 || mode === 2) {
      const shadowElements = await searchSelectorsInShadowRoots(page, page, selector);
      elements.push(...shadowElements);
    }

    return elements;
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
    let selectorPromises = selectors.map(async (selector) => {
      await page.smartWaitForSelector(selector, options);
      return selector;
    });
    let result = await Promise.race(selectorPromises);
    return result;
  };

  page.slowType = async function slowType(selector, text) {
    for (const char of text) {
      await page.type(selector, char);
      await new Promise((r) => setTimeout(r, 100)); // adjust delay as needed
    }
  };

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

async function searchSelectorOrNextShadow(rootHandle, page, selector) {
  // Try to find the element directly in the current root
  if (rootHandle !== page) {
    //We ignore searches on page. For that use the normal page.$
    const potentialElement = await rootHandle.$(selector);
    if (potentialElement) return potentialElement;
  }
  // Get all elements in the current root
  const childElements = await rootHandle.$$("*");
  for (const child of childElements) {
    // Check if this element has a shadow root
    const hasShadowRoot = await child.evaluate((el) => !!el.shadowRoot);
    if (hasShadowRoot) {
      const shadowRootHandle = await child.evaluateHandle((el) => el.shadowRoot);
      // Search recursively inside the shadow root
      const result = await searchSelectorOrNextShadow(shadowRootHandle, page, selector);
      if (result) return result;
      await shadowRootHandle.dispose(); // Clean up handle
    }
  }
  return undefined; // Not found in this tree
}

async function searchSelectorsInNestedIframes(iframe, selector) {
  const frame = await iframe.contentFrame();
  if (!frame) return [];

  let elements = await frame.$$(selector);
  const nestedIframes = await frame.$$("iframe");

  for (const nestedIframe of nestedIframes) {
    const nestedElements = await searchSelectorsInNestedIframes(nestedIframe, selector);
    elements.push(...nestedElements);
  }

  return elements;
}

async function searchSelectorsInShadowRoots(rootHandle, page, selector) {
  let elements = [];

  // Try to find elements directly in the current root
  if (rootHandle !== page) {
    const directMatches = await rootHandle.$$(selector);
    elements.push(...directMatches);
  }
  // Get all elements in the current root
  const childElements = await rootHandle.$$("*");
  for (const child of childElements) {
    // Check if this element has a shadow root
    const hasShadowRoot = await child.evaluate((el) => !!el.shadowRoot);
    if (hasShadowRoot) {
      const shadowRootHandle = await child.evaluateHandle((el) => el.shadowRoot);
      // Search recursively inside the shadow root
      const shadowMatches = await searchSelectorsInShadowRoots(shadowRootHandle, page, selector);
      elements.push(...shadowMatches);
      await shadowRootHandle.dispose(); // Clean up handle
    }
  }

  return elements;
}
