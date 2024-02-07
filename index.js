class UndetectableBrowser {
  constructor(_browser) {
    this.browser = _browser;
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

    page.speak = function speak() {
      console.log("it works");
    };

    page.goto = function goto(url, options) {
      console.log("Goto:", url);
      // do your things
      return originalGoto.apply(page, arguments);
    };

    return page;
  }

  async getBrowser() {
    const browser = await this.browser;
    return await this.extendBrowser(browser);
  }
}

module.exports = UndetectableBrowser;
