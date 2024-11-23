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

    return page;
  }

  async getBrowser() {
    const browser = await this.browser;
    this.browser = await this.extendBrowser(browser);
    return this.browser;
  }
}

module.exports = UndetectableBrowser;
