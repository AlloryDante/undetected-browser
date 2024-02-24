module.exports = function hookInteractionMethods(page) {
  page.clickElementWithInnerText = async function clickElementWithInnerText(selectorElement, innerText) {
    const element = await page.getElementWithInnerText(selectorElement, innerText);
    //if (element) await page.simulateMouseClick(element);
  };
  page.clickElementWithInnerHTML = async function clickElementWithInnerHTML(selectorElement, innerHTML) {
    const element = await page.getElementWithInnerHTML(selectorElement, innerHTML);
    // if (element) await page.simulateMouseClick(element);
  };

  return page;
};
