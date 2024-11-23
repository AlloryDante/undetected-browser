declare module 'undetected-browser' {
  import { Browser, Page } from 'puppeteer';
  import { GhostCursor } from 'ghost-cursor';
  import { typeInto, PerformanceTimer } from '@forad/puppeteer-humanize';

  type CallbackFunction = () => void;

  interface SpeedResults {
    loadTime: number;
    scriptsCount: number;
    stylesCount: number;
    totalBytes: number
  }

  declare module 'puppeteer' {
    interface Page {
      // Basic Methods
      getRandomInt(min: number, max: number): number;
      sleep(time: number): Promise<void>;
      randomSleep(min: number, max: number): Promise<void>;
      repeatFunctionByAmount(functionCallback: () => Promise<CallbackFunction> | CallbackFunction, numberOfTries: number, errorMessage?: string): Promise<any>;
      executeFunctionWithTimeout(functionCallback: () => Promise<CallbackFunction>, timeout: number, customMessage?: string): Promise<any>;
      makeid(length: number): string;

      // Extra Methods
      checkFingerprint: (screenshot: string) => Promise<Report>;
      checkCaptcha: () => Promise<Report>;
      scanFingerprintAttempts: () => Promise<void>;
      fptScanner?: ScanFingerprint;

      // General Methods
      messureSpeed(url?: string): Promise<SpeedResults>;
      setupURLBlocker(urls: string[]): Promise<void>;
      closeOtherPages(browser: Browser): Promise<void>;
      adblockURLs?: string[];

      // Interaction Methods
      cursor: GhostCursor;
      typeInto: typeof typeInto;
      enableMouseDebugWindow: () => Promise<void>;
      simulateMouseClick: (selector: string) => Promise<void>;
      toggleRandomMove: (enabled?: boolean) => void;
      simulateTyping: (selector: string | Element, text: string) => Promise<void>;
      clickElementWithInnerText: (selectorElement: string, innerText: string) => Promise<void>;
      clickElementWithInnerHTML: (selectorElement: string, innerHTML: string) => Promise<void>;
      ensureType: (selector: string | Element, text: string) => Promise<Page>;

      // Navigation Methods
      navigate: (url: string, delay?: number) => Promise<void>;
      waitToLoad: (url: string) => Promise<void>;

      // Selector Methods 
      smartWaitForSelector: (selector: string | null, delay?: number) => Promise<void>;
      $$$: (selector: string) => Promise<Element | undefined>;
      getElementWithInnerText: (element: string, innerText: string) => Promise<Element | undefined>;
      getElementWithInnerHTML: (element: string, innerHTML: string) => Promise<Element | undefined>;
      getAnySelector: (selectors: string[]) => Promise<Element | undefined>;
      getAnySelectorName: (selectors: string[]) => Promise<string | undefined>;
      smartWaitForAnySelector: (selectors: string[], options?: object) => Promise<string | undefined>;
      slowType: (selector: string, text: string) => Promise<void>;
    }
  }
 
  interface Report {
    general: "bad" | "ok";
    cloudflare: string | null;
    arkose: {
      steps: number;
      objects: number;
      status: "pass" | "fail" | "error";
    };
    userAgent?: { status: string; message: string };
    location?: { status: string; message: string };
    proxy?: { status: string; message: string };
    fingerprint?: { status: string; message: string };
    automation?: { status: string; message: string };
  }

  class CaptchaTester {
    async checkCaptcha(page: Page): Promise<Report>;
  }

  class CheckFingerprint {
    async runFingerprintChecker(page: Page, screenshot: boolean): Promise<Report>;
  }

  class ScanFingerprint {
    hadFirstRun: boolean;
    setupFingerprintScanner(page: Page): Promise<void>;
  }

  class UndetectableBrowser {
    private browser: Browser;
    private verbose: boolean;
    private adblockURLs: string[];

    constructor(browser: Browser);

    async extendBrowser(browser: Browser): Promise<Browser>
    async getBrowser(): Promise<Browser>;

    extendPage(page: Page): Page;
  }

  export default UndetectableBrowser;
}
 