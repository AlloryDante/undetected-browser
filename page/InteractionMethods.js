const { createCursor } = require("ghost-cursor");
const { typeInto } = require("@forad/puppeteer-humanize");

module.exports = function hookInteractionMethods(page) {
  page.cursor = createCursor(page);
  page.typeInto = typeInto;

  page.simulateMouseClick = async function simulateMouseClick(selector) {
    if (!selector) {
      throw new Error(`Selector was not defined for simulating mouse click.`);
    }
    await page.cursor.click(selector, { hesitate: page.getRandomInt(200, 800), waitForClick: 0, moveDelay: 0 });
  };

  page.simulateTyping = async function simulateTyping(selector, text) {
    if (!selector) {
      throw new Error(`Selector was not defined for simulating Typing.`);
    }
    let element;
    if (typeof selector == "object") {
      element = selector;
    } else {
      element = await page.$(selector);
    }
    if (!element) {
      throw new Error(`Element with selector ${selector} not found for typing....`);
    }

    const config = {
      mistakes: {
        chance: 8,
        delay: {
          min: 10,
          max: 100,
        },
      },
      delays: {
        space: {
          chance: 70,
          min: 10,
          max: 30,
        },
      },
    };
    await typeInto(element, text, config);
  };

  page.clickElementWithInnerText = async function clickElementWithInnerText(selectorElement, innerText) {
    const element = await page.getElementWithInnerText(selectorElement, innerText);
    if (element) await page.simulateMouseClick(element);
  };
  page.clickElementWithInnerHTML = async function clickElementWithInnerHTML(selectorElement, innerHTML) {
    const element = await page.getElementWithInnerHTML(selectorElement, innerHTML);
    if (element) await page.simulateMouseClick(element);
  };

  return page;
};
