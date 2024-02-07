const pupeteer = require("puppeteer");
const UndetectableBrowser = require("./index");

async function test() {
  const UndetectableBMS = new UndetectableBrowser(
    pupeteer.launch({ headless: false })
  );
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();
  page.speak();
}
test();
