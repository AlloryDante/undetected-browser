const UndetectableBrowser = require("./index");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

describe("UndetectableBrowser", () => {
  let browser = null;
  let page = null;
  beforeAll(async () => {
    const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: true }));
    browser = await UndetectableBMS.getBrowser();
    page = await browser.newPage();
    await page.goto(`https://reviewer.eugenebos.com/automation-test`);
  });
  afterAll(async () => {
    await browser.close();
  });
  describe("Testing Basic Methods", () => {
    test("Page.sleep - should sleep 1 second", async () => {
      expect(page.sleep(1000)).resolves.not.toThrow();
    });

    test("page.repeatFunctionByAmount - should throw if tries < 1", async () => {
      expect(
        page.repeatFunctionByAmount(() => {
          throw new Error("test");
        })
      ).rejects.toThrow();
    });

    test("page.repeatFunctionByAmount - should throw corect error", async () => {
      expect(
        page.repeatFunctionByAmount(() => {
          throw new Error("test");
        }, 3)
      ).rejects.toThrowError("test");
    });
    test("page.repeatFunctionByAmount - should not throw", async () => {
      expect(page.repeatFunctionByAmount(() => {}, 3)).resolves.not.toThrow();
    });
  });
});
