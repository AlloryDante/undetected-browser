const UndetectableBrowser = require("./index");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();
  await page.scanFingerprintAttempts(true);
  await page.navigate("https://reviewer.eugenebos.com/automation-test");
  await page.messureSpeed("https://reviewer.eugenebos.com/automation-test");
  await page.closeOtherPages();

  // await page.evaluateOnNewDocument(() => {
  //   function myFunction() {
  //     console.log("Hello from myFunction!");
  //     const mainFunction = HTMLCanvasElement.prototype.toDataURL;

  //     HTMLCanvasElement.prototype.toDataURL = function (type) {
  //       console.log("Hook Works!");
  //       return mainFunction.apply(this, arguments);
  //     };
  //     // Object.defineProperty(HTMLCanvasElement.prototype.toDataURL, "toString", {
  //     //   value: function () {
  //     //     return `function toDataURL() { [native code] }`;
  //     //   },
  //     // });
  //     // HTMLCanvasElement.prototype.toDataURL.toString = `function toDataURL() { [native code] }`;
  //     // HTMLCanvasElement.prototype.toDataURL.toString.toString = `function toString() { [native code] }`;
  //     console.log(mainFunction.toString());

  //     return HTMLCanvasElement.prototype.toDataURL;
  //   }

  //   // Assign a self-executing function expression to the variable
  //   HTMLCanvasElement.prototype.toDataURL = (function () {
  //     return myFunction();
  //   })();
  // });
  // page.goto("https://abrahamjuliot.github.io/creepjs/");
  // //await page.simulateMouseClick('a[href="/canvas"]');
  // await page.clickElementWithInnerHTML("h4", "WebRTC Leak Test");
}
test();
