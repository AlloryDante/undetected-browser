const fs = require("fs");

class CaptchaTester {
  constructor() {}

  async checkCaptcha(page) {
    const report = {
      cloudflare: null,
      arkose: {
        steps: 0,
        objects: 0,
        status: "error",
      },
    };
    await page.navigate("https://nopecha.com/demo/turnstile");
    await page.evaluate(() => {
      var iframe = document.createElement("iframe");
      iframe.src = "https://iframe.arkoselabs.com/A5A70501-FCDE-4065-AF18-D9FAF06EF479/index.html?mkt=en";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    });
    await page.sleep(1000);
    const checkBox = await page.$$$('input[type="checkbox"]');
    await page.simulateMouseClick(checkBox);
    let cloudflareResult = null;
    while (cloudflareResult == null) {
      await page.sleep(500);
      const failElementHandle = await page.$$$('div[id="fail"]');
      if (await failElementHandle.isVisible()) {
        cloudflareResult = "fail";
      }
      const successElementHandle = await page.$$$('div[id="success"]');
      if (await successElementHandle.isVisible()) {
        cloudflareResult = "pass";
      }
      const errorElementHandle = await page.$$$('div[id="challenge-error"]');
      if (await errorElementHandle.isVisible()) {
        cloudflareResult = "error";
      }
    }
    report.cloudflare = cloudflareResult;

    const startArkose = await page.$$$('button[data-theme="home.verifyButton"]');
    if (startArkose) await page.simulateMouseClick(startArkose);
    await page.sleep(3000);
    const pipContainer = await page.$$$(".pip-container");
    if (pipContainer) {
      const steps = await pipContainer.$$("div");
      report.arkose.objects = steps.length;
    }
    const textParrent = await page.$$$('span[role="text"]');
    if (textParrent) {
      const text = await textParrent.$eval("*", (node) => node.parentElement.innerText);
      report.arkose.steps = extractSteps(text);
      if (report.arkose.steps <= 3) {
        report.arkose.status = "pass";
      } else {
        report.arkose.status = "fail";
      }
    }

    console.log(report);
    return report;
  }
}
function extractSteps(text) {
  // Use a regular expression to match all numbers in the text
  const matches = text.match(/\b(\d+)\b/g);

  // Check if matches are found
  if (matches && matches.length >= 2) {
    // Convert the second matched string to a number and return it
    return parseInt(matches[1], 10);
  } else {
    // Return an error value or handle it as per your requirement
    return "error"; // for example
  }
}
module.exports = CaptchaTester;
