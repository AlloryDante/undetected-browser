const UndetectableBrowser = require("../index");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();

  await page.navigate("file:///D:/Desktop/undetected-browser/demo/shadow.html");
  await page.sleep(1000);

  console.log("Getting first element from iframes & shadow");
  const element = await page.$$$("button", 2);
  console.log(await element.evaluate((el) => el.innerText));

  console.log("Getting all button elements from iframes & shadow");
  const elements = await page.$$$$("button");

  for (const element of elements) {
    console.log(await element.evaluate((el) => el.innerText));
  }
}
test();
