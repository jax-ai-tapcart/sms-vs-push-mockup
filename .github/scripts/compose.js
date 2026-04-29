import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { join } from "path";
import { BRANDS } from "./brands.js";

const OUT_DIR = "mockup-output";
mkdirSync(OUT_DIR, { recursive: true });

const brand = process.argv[2] || "lola";
const c = BRANDS[brand];

const smsB64 = readFileSync(join(OUT_DIR, "sms-panel.png")).toString("base64");
const pushB64 = readFileSync(join(OUT_DIR, "push-panel.png")).toString("base64");

const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #ffffff; display: inline-block; }
.wrap { background: #ffffff; padding: 40px 80px; display: inline-block; }
.row { display: flex; align-items: flex-start; gap: 48px; }
.panel { width: 360px; height: 640px; overflow: hidden; border-radius: 52px 52px 0 0; flex-shrink: 0; }
.panel img { display: block; width: 360px; height: auto; }
.arrow-wrap { display: flex; align-items: center; justify-content: center; width: 60px; margin-top: 320px; flex-shrink: 0; }
</style>
</head>
<body>
<div class="wrap">
<div class="row">
  <div class="panel">
    <img src="data:image/png;base64,${smsB64}" alt="sms"/>
  </div>
  <div class="arrow-wrap">
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="12" x2="44" y2="12" stroke="#111111" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="44,4 56,12 44,20" fill="#111111"/>
    </svg>
  </div>
  <div class="panel">
    <img src="data:image/png;base64,${pushB64}" alt="push"/>
  </div>
</div>
</div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 2
});
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const plenary = await page.$(".wrap");
const outName = `${c.outName}.png`;
const outPath = join(OUT_DIR, outName);
await plenary.screenshot({ path: outPath, omitBackground: false });
await browser.close();
console.log("Saved:" + outPath);
