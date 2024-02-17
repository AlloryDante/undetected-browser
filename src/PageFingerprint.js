const fs = require("fs");

class CheckFingerprint {
  constructor() {}

  async runFingerprintChecker(page, screenshot) {
    await page.navigate("https://pixelscan.net/");
    await page.waitForSelector(".consistency-status-text");
    const report = await page.evaluate(() => {
      const reportObject = new Object();
      reportObject.general = document.querySelector(".consistency-status-text").innerText.includes("inconsistent") ? "bad" : "ok";
      const reportElements = document.querySelectorAll(".pxlscn-img-status");
      for (const element of reportElements) {
        const reportText = element.parentNode.innerText;
        if (reportText.includes("using")) {
          reportObject.userAgent = { status: element.alt, message: reportText };
        }
        if (reportText.includes("location")) {
          reportObject.location = { status: element.alt, message: reportText };
        }
        if (reportText.includes("IP")) {
          reportObject.proxy = { status: element.alt, message: reportText };
        }
        if (reportText.includes("fingerprint")) {
          reportObject.fingerprint = { status: element.alt, message: reportText };
        }
        if (reportText.includes("automation")) {
          reportObject.automation = { status: element.alt, message: reportText };
        }
      }
      return reportObject;
    });

    if (screenshot) {
      if (report.general == "bad") {
        fs.mkdirSync("./fingerprint_reports/");
        await await page.screenshot({
          path: `./fingerprint_reports/screenshot_full.jpg`,
          fullPage: true,
        });
        console.log(`A screenshot has been generated in fingerprint_reports folder`);
      }
    }
    return report;
  }
}

module.exports = CheckFingerprint;
