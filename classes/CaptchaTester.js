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
    await page.navigate("https://account.microsoft.com/account");
    const signInButton = await page.$('a[aria-label="Sign in to your account"]');
    signInButton.click();
    await page.waitToLoad();
    await page.click("#signup");
    await page.smartWaitForSelector('input[aria-label="New email"]');
    await page.smartWaitForSelector("#liveSwitch");
    await page.click("#liveSwitch");
    await page.sleep(100);
    await page.type('input[aria-label="New email"]', page.makeid(10));
    await page.sleep(20);
    await page.click("#iSignupAction");
    await page.smartWaitForSelector("#PasswordInput");
    await page.type("#PasswordInput", page.makeid(10));
    await page.click("#iSignupAction");
    await page.smartWaitForSelector("#BirthMonth");
    await page.select("#BirthMonth", page.getRandomInt(1, 12).toString());
    await page.select("#BirthDay", page.getRandomInt(1, 31).toString());
    await page.type("#BirthYear", page.getRandomInt(1970, 2000).toString());
    await page.click("#iSignupAction");
    await page.smartWaitForSelector("#enforcementFrame");
    await page.sleep(2000);
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
      if (report.arkose.steps <= 5) {
        report.arkose.status = "pass";
      } else {
        report.arkose.status = "fail";
      }
    }
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
