module.exports = function hookNavigationMethods(page) {
  page.navigate = async function navigate(url, delay = 0) {
    await Promise.all([page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }), page.goto(url)]);
    if (delay) {
      await page.sleep(delay);
    }
  };
  page.waitToLoad = async function navigate(url) {
    await page.waitForNavigation({ waitUntil: ["load", "networkidle2"] });
  };

  return page;
};
