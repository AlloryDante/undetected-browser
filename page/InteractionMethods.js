const { createCursor } = require("ghost-cursor");
const { typeInto } = require("@forad/puppeteer-humanize");

module.exports = function hookInteractionMethods(page) {
  page.cursor = createCursor(page);
  page.typeInto = typeInto;

  page.enableMouseDebugWindow = async function enableMouseDebugWindow() {
    await debugWindowForMouse(page);
  };

  page.simulateMouseClick = async function simulateMouseClick(selector) {
    if (!selector) {
      throw new Error(`Selector was not defined for simulating mouse click.`);
    }
    await page.cursor.click(selector, { hesitate: page.getRandomInt(200, 800), waitForClick: 0, moveDelay: 0 });
  };

  page.toggleRandomMove = async function toggleRandomMove(enabled = true) {
    await page.cursor.toggleRandomMove(enabled);
  };

  page.simulateTyping = async function simulateTyping(selector, text) {
    if (!selector) {
      throw new Error(`Selector was not defined for simulating Typing.`);
    }
    let element;
    if (typeof selector == "object") {
      element = selector;
    } else {
      element = await page.$(selector);
    }
    if (!element) {
      throw new Error(`Element with selector ${selector} not found for typing....`);
    }

    const config = {
      mistakes: {
        chance: 8,
        delay: {
          min: 10,
          max: 100,
        },
      },
      delays: {
        space: {
          chance: 70,
          min: 10,
          max: 30,
        },
      },
    };
    await typeInto(element, text, config);
  };

  page.clickElementWithInnerText = async function clickElementWithInnerText(selectorElement, innerText) {
    const element = await page.getElementWithInnerText(selectorElement, innerText);
    if (element) await page.simulateMouseClick(element);
  };
  page.clickElementWithInnerHTML = async function clickElementWithInnerHTML(selectorElement, innerHTML) {
    const element = await page.getElementWithInnerHTML(selectorElement, innerHTML);
    if (element) await page.simulateMouseClick(element);
  };
  page.ensureType = async function ensureType(selector, text) {
    let element;
    if (typeof selector == "object") {
      element = selector;
    } else {
      element = await page.$(selector);
    }
    if (element) {
      let existingValue = await page.evaluate((el) => el.value, element);
      console.log(`Existing value: ${existingValue}`);
      if (existingValue.length > 0) {
        await element.focus();
        await element.type("End");
        for (let i = 0; i < existingValue.length; i++) {
          await page.keyboard.press("Backspace");
        }
      }
      await page.simulateTyping(element, text);

    }
  }
  page.ensureTypeSafe = async function ensureTypeSafe(selector, text) {
    let element;
    console.log(`Ensuring type safe for selector: ${selector}`);
    console.log(`Type of selector: ${typeof selector}`);
    if (typeof selector === "object") {
      element = selector;
    } else {
      element = await page.$(`${selector}`);
    }
  
    if (element) {
      const existingValue = await page.evaluate(el => el.value || '', element);
      console.log(`Existing value: ${existingValue}`);
  
      if (existingValue.length > 0) {
        await element.click();
        await page.keyboard.press("End");
        for (let i = 0; i < existingValue.length; i++) {
          await page.keyboard.press("Backspace");
        }
      }
  
      await element.type(text, { delay: 70 }); 
    }
  };
  return page;
};

async function debugWindowForMouse(page) {
  await page.evaluateOnNewDocument(() => {
    window.addEventListener("DOMContentLoaded", () => {
      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.userSelect = "none";
      canvas.style.pointerEvents = "none";
      canvas.style.position = "fixed";
      canvas.style.left = "0px";
      canvas.style.top = "0px";
      canvas.style.width = "" + window.innerWidth + "px";
      canvas.style.height = "" + window.innerHeight + "px";
      canvas.style.zIndex = "999999";
      document.body.appendChild(canvas);

      const cxt = canvas.getContext("2d");

      document.addEventListener("keydown", (e) => {
        console.log("key DOWN alt:" + e.altKey + " shift:" + e.shiftKey + " ctrl:" + e.ctrlKey + " meta:" + e.metaKey + " code:" + e.code);
      });

      document.addEventListener("keyup", (e) => {
        console.log("key UP alt:" + e.altKey + " shift:" + e.shiftKey + " ctrl:" + e.ctrlKey + " meta:" + e.metaKey + " code:" + e.code);
      });

      document.addEventListener("mousemove", (e) => {
        cxt.beginPath();
        cxt.arc(e.clientX, e.clientY, 3, 0, 360, false);
        cxt.fillStyle = "green";
        cxt.fill();
        cxt.closePath();
      });

      document.addEventListener("mousedown", (e) => {
        cxt.beginPath();
        cxt.arc(e.clientX, e.clientY, 15, 0, 360, false);
        cxt.fillStyle = "black";
        cxt.fill();
        cxt.closePath();
      });

      document.addEventListener("mouseup", (e) => {
        cxt.beginPath();
        cxt.arc(e.clientX, e.clientY, 9, 0, 360, false);
        cxt.fillStyle = "blue";
        cxt.fill();
        cxt.closePath();
      });
    });
  });
}
