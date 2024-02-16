const pupeteer = require("puppeteer");
const UndetectableBrowser = require("./index");

async function test() {
  const UndetectableBMS = new UndetectableBrowser(pupeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();
  await page.navigate("https://browserleaks.com/");
  //await page.simulateMouseClick('a[href="/canvas"]');
  await page.clickElementWithInnerHTML("h4", "WebRTC Leak Test");
}
test();
