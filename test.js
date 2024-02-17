const puppeteer = require("puppeteer-extra");
const UndetectableBrowser = require("./index");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  const UndetectableBMS = new UndetectableBrowser(puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();
  await page.checkFingerprint(true);
  // await page.navigate("https://browserleaks.com/");
  // //await page.simulateMouseClick('a[href="/canvas"]');
  // await page.clickElementWithInnerHTML("h4", "WebRTC Leak Test");
}
test();
