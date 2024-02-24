module.exports = function hookGeneralMethods(page) {
  page.messureSpeed = async function messureSpeed(url) {
    if (!url) url = "https://www.google.com";
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);
    const startTime = Date.now();
    await page.navigate(url);
    const loadTime = Date.now() - startTime;
    const [jsCoverage, cssCoverage] = await Promise.all([page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage()]);
    const totalBytes = [...jsCoverage, ...cssCoverage].reduce((acc, entry) => acc + entry.text.length, 0);
    const scriptsCount = jsCoverage.length;
    const stylesCount = cssCoverage.length;

    console.log(`Page Load Time: ${loadTime} ms`);
    console.log(`Number of Scripts: ${scriptsCount}`);
    console.log(`Number of Styles: ${stylesCount}`);
    console.log(`Total Bytes Transferred: ${totalBytes} bytes`);

    return { loadTime, scriptsCount, stylesCount, totalBytes };
  };

  page.setupURLBlocker = async function setupURLBlocker(urls) {
    if (urls.length == 0) {
      console.log("You must pass an array of urls that you want to block");
      return;
    }
    this.adblockURLs = urls;
    const pages = await this.browser().pages();
    for (const pageToProtect of pages) {
      await page.setRequestInterception(true);
      page.on("request", (interceptedRequest) => {
        if (interceptedRequest.isInterceptResolutionHandled()) return;
        const url = interceptedRequest.url();
        for (const urlParam of this.adblockURLs) {
          if (url.includes(urlParam)) {
            interceptedRequest.abort();
            return;
          }
        }
        interceptedRequest.continue();
      });
    }
  };
  page.closeOtherPages = async function closeOtherPages(browser) {
    const pages = await this.browser().pages();
    for (const pageTest of pages) {
      if (pageTest.mainFrame()._id != page.mainFrame()._id) {
        await pageTest.close();
      }
    }
  };

  return page;
};
