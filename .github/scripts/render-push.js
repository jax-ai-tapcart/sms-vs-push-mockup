import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";
import { BRANDS } from "./brands.js";

const OUT_DIR = "mockup-output";
mkdirSync(OUT_DIR, { recursive: true });

const brand = process.argv[2] || "lola";
const c = BRANDS[brand];

const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block" rel="stylesheet"/>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: transparent; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: Inter, sans-serif; }
.phone-wrap { position: relative; width: 380px; }
.glow {
  position: absolute;
  inset: -40px;
  border-radius: 80px;
  background: radial-gradient(ellipse at 50% 0%, #ff9e67 0%, #a155b9 40%, alotofastras 60%, #7b61ff 80%, transparent 100%);
  filter: blur(30px);
  opacity: 0.8;
  z-index: 0;
}
.phone { width: 360px; height: 780px; background: #101010; border-radius: 52px; position: relative; overflow: hidden; box-shadow: 0 0 0 2px #3a3a3c, 0 0 0 4px #242426; z-index: 1; margin: 40px; }
.screen { position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; border-radius: 46px; overflow: hidden; }
.wallpaper { position: absolute; inset: 0; background: linear-gradient(180deg, #0a0a20 0%, #121240 100%); }
.wallpaper-streaks { position: absolute; inset: 0; background: repeating-linear-gradient(92deg, transparent 0px, rgba(80, 80, 160, 0.08) 2px, transparent 4px); }
.dynamic-island { position: absolute; top: 13px; left: 50%; transform: translateX(-50%); width: 120px; height: 34px; background: #000; border-radius: 18px; z-index: 20; }
.status-bar { position: absolute; top: 0; left: 0; right: 0; height: 50px; display: flex; justify-content: space-between; padding: 14px 22px 6px; z-index: 5; filter: blur(3px); opacity: 0.4; }
.status-time { color: #fff; font-size: 16px; font-weight: 600; }
.status-icons { display: flex; align-items: center; gap: 5px; }
.notif-wrap { position: absolute; top: 70px; left: 12px; right: 12px; z-index: 10; }
.notif { background: rgba(30, 30, 40, 0.92); backdrop-filter: blur(14px); border-radius: 20px; overflow: hidden; }
.notif-header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 8px; }
.notif-icon { width: 32px; height: 32px; border-radius: 8px; background: ${c.logoBg}; flex-shrink: 0; overflow: hidden; border: 1px solid #D1D1D6; }
.notif-icon img { width: 100%; height: 100%; object-fit: contain; }
.notif-text { flex: 1; min-width: 0; }
.notif-title { color: #fff; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-body { color: rgba(255,255,255,0.75); font-size: 12px; line-height: 1.35em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.notif-time { color: rgba(255,255,255,0.5); font-size: 11px; align-self: flex-start; white-space: nowrap; }
.notif-img { width: 100%; height: 160px; object-fit: cover; display: block; }
</style>
</head>
<body>
<div class="phone-wrap">
  <div class="glow"></div>
  <div class="phone">
    <div class="screen">
      <div class="wallpaper"></div>
      <div class="wallpaper-streaks"></div>
      <div class="dynamic-island"></div>
      <div class="status-bar">
        <span class="status-time">1:34</span>
        <div class="status-icons">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><rect y="6" width="3" height="6" rx="1"/><rect x="4" y="4" width="3" height="8" rx="1"/><rect x="8" y="2" width="3" height="10" rx="1"/><rect x="12" y="0" width="3" height="12" rx="1"/></svg>
          <span style="color:#fff;font-size:11px;font-weight:600">5G</span>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="white" stroke-opacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M24 4.5v3c.8-.36 1.3-1.08 1.3-1.5s-.5-1.14-1.3-1.5z" fill="white" opacity="0.4"/></svg>
        </div>
      </div>
      <div class="notif-wrap">
        <div class="notif">
          <div class="notif-header">
            <div class="notif-icon">
              <img src="${c.logo}" alt="logo" crossorigin="anonymous"/>
            </div>
            <div class="notif-text">
              <p class="notif-title">${c.pushTitle}</p>
              <p class="notif-body">${c.pushBody}</p>
            </div>
            <span class="notif-time">NOW</span>
          </div>
          <img class="notif-img" src="${c.hero}" alt="" crossorigin="anonymous"/>
        </div>
      </div>
    </div>
  </div>
</div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 500, height: 900 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(1200);
const el = await page.$(".phone-wrap");
const outPath = join(OUT_DIR, "push-panel.png");
await el.screenshot({ path: outPath });
await browser.close();
console.log("Saved:" + outPath);
