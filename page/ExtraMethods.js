const CheckFingerprint = require("../classes/FingerprintCheck");
const ScanFingerprint = require("../classes/FingerprintScan");
const CaptchaTester = require("../classes/CaptchaTester");

module.exports = function hookExtraMethods(page) {
  page.checkFingerprint = async function checkFingerprint(screenshot) {
    const fingerprintChecker = new CheckFingerprint();
    return await fingerprintChecker.runFingerprintChecker(page, screenshot);
  };
  page.checkCaptcha = async function checkCaptcha() {
    const captchaTester = new CaptchaTester();
    return await captchaTester.checkCaptcha(page);
  };

  page.scanFingerprintAttempts = async function scanFingerprintAttempts() {
    let fptScanner;
    if (!page.fptScanner) {
      fptScanner = new ScanFingerprint();
      page.fptScanner = fptScanner;
    } else {
      fptScanner = page.fptScanner;
    }
    return await fptScanner.setupFingerprintScanner(page);
  };

  return page;
};
