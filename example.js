const UndetectableBrowser = require("./index");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  const UndetectableBMS = new UndetectableBrowser(await puppeteer.launch({ headless: false }));
  const browser = await UndetectableBMS.getBrowser();
  const page = await browser.newPage();
  await page.setupURLBlocker(["favicon"]);
  await page.scanFingerprintAttempts(true);
  await page.navigate("https://reviewer.eugenebos.com/automation-test");
  await page.messureSpeed("https://reviewer.eugenebos.com/automation-test");
  await page.smartWaitForSelector("#submitButton");
  console.log("\n");
  const iframeButton = await page.$$$("#inputIframe2");
  iframeButton ? console.log("Iframe button found") : console.log("Iframe button not found!");
  const linkWithText = await page.getElementWithInnerText("a", "Visit Example.com");
  linkWithText ? console.log("Link found based to inner Text") : console.log("Link not found based to inner Text");
  const selectBox = await page.getElementWithInnerHTML("select", `value="volvo"`);
  selectBox ? console.log("SelectBox found based to inner HTML") : console.log("SelectBox not found based to inner HTML");

  // await page.simulateTyping("#textInput", "I am a super cool mousepad.");
  // await page.simulateMouseClick("#submitButton");

  await page.scanFingerprintAttempts();
  const fingerprint = await page.checkFingerprint();
  console.log(`Fingerprint result:`, fingerprint);
  console.log(`\n`);
  console.log(`Check capcha`, await page.checkCaptcha());

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
