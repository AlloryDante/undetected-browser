module.exports = function hookBasicMethods(page) {
  page.sleep = function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  page.repeatFunctionByAmount = async function repeatFunctionByAmount(functionCallback, numberOfTries, errorMessage) {
    if (numberOfTries < 1) throw new Error("Number of tries cannot be less than 1");
    let errorRep;
    while (numberOfTries >= 1) {
      try {
        if (functionCallback.constructor.name === "AsyncFunction") {
          return await functionCallback();
        } else {
          return functionCallback();
        }
      } catch (error) {
        if (errorMessage) {
          console.error(`${errorMessage} Tries left: ${numberOfTries}`);
        } else {
          console.error(`Repeat function failed tries: ${numberOfTries}`);
        }
        numberOfTries -= 1;
        errorRep = error;
      }
    }
    throw new Error(errorRep);
  };
  page.executeFunctionWithTimeout = function executeFunctionWithTimeout(functionCallback, timeout, customMessage) {
    let timer;
    let timeoutPromise = new Promise((resolve) => {
      timer = setTimeout(report, timeout);
      function report() {
        console.log(`Execution Timeout reached ${timeout}`);
        if (customMessage) console.log(customMessage);
        resolve("timeout");
      }
    });
    return Promise.race([functionCallback(), timeoutPromise]).finally(() => clearTimeout(timer));
  };

  page.makeid = function makeid(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  page.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return page;
};
