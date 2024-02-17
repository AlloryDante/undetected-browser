const UndetectableBrowser = require("./index");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();

  await page.checkCaptcha();
  // //await page.simulateMouseClick('a[href="/canvas"]');
  // await page.clickElementWithInnerHTML("h4", "WebRTC Leak Test");
}
test();
