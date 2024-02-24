const fs = require("fs");

class ScanFingerprint {
  constructor() {
    this.hadFirstRun = false;
  }

  async setupFingerprintScanner(page) {
    if (this.hadFirstRun) return;
    this.hadFirstRun = true;

    await page.exposeFunction("log", (text) => {
      console.log(text);
    });
    await page.exposeFunction("shouldLog", () => {
      return this.scanEnabled;
    });
    await page.evaluateOnNewDocument(async () => {
      console.log("Fpt Active");

      hook(() => AnalyserNode, {
        target: ["getByteFrequencyData", "getByteTimeDomainData", "getFloatFrequencyData", "getFloatTimeDomainData"],
        type: "Audio",
      });
      hook(() => OfflineAudioContext, {
        target: ["startRendering"],
        type: "Audio",
      });
      hook(() => AudioBuffer, {
        target: ["copyFromChannel", "getChannelData"],
        type: "Audio",
      });
      hook(() => BiquadFilterNode, {
        target: ["getFrequencyResponse"],
        type: "Audio",
      });

      hook(() => BiquadFilterNode, {
        target: ["getFrequencyResponse"],
        type: "Audio",
      });
      hook(() => HTMLCanvasElement, {
        target: ["toBlob", "toDataURL"],
        type: "Canvas",
      });
      hook(() => CanvasRenderingContext2D, {
        target: ["getImageData", "getLineDash", "isPointInPath", "isPointInStroke", "measureText", "quadraticCurveTo", "fillText", "strokeText"],
        type: "Canvas",
      });
      hook(() => SVGRectElement, {
        target: ["getBBox"],
        type: "SVG",
      });
      hook(() => SVGTextContentElement, {
        target: ["getExtentOfChar", "getSubStringLength", "getComputedTextLength"],
        type: "SVG",
      });
      hook(() => OffscreenCanvas, {
        target: ["convertToBlob", "getContext"],
        type: "Canvas",
      });
      hook(() => WebGLRenderingContext, {
        target: ["bufferData", "getParameter", "readPixels"],
        type: "WebGL",
      });
      hook(() => WebGL2RenderingContext, {
        target: ["bufferData", "getParameter", "readPixels"],
        type: "WebGL",
      });
      if (GPU)
        hook(() => GPU, {
          target: ["requestAdapter"],
          type: "GPU",
        });

      function hook(func, opt) {
        if (!opt.target) return;
        const name = func().name;
        for (const target of opt.target) {
          try {
            const mainFunction = func().prototype[target];
            if (typeof mainFunction != "function") continue;
            func().prototype[target] = function (type) {
              log(`[FPT DETECTOR] [${opt.type}] ${name}.${target} detected on ${window.location.href}.`);
              return mainFunction.apply(this, arguments);
            };
          } catch (error) {
            console.log(`Cannot hook into ${name}.${target}`);
          }
        }
      }
    });
  }
}
module.exports = ScanFingerprint;
