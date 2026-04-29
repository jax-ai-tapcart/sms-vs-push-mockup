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
.phone { width: 360px; height: 780px; background: #101010; border-radius: 52px; position: relative; overflow: hidden; box-shadow: 0 0 0 2px #3a3a3c, 0 0 0 4px #242426, 0 20px 60px rgba(0,0,0,0.7); }
.screen { position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; background: #000; border-radius: 46px; overflow: hidden; display: flex; flex-direction: column; }
.dynamic-island { position: absolute; top: 13px; left: 50%; transform: translateX(-50%); width: 120px; height: 34px; background: #000; border-radius: 18px; z-index: 10; }
.status-bar { display: flex; justify-content: space-between; padding: 14px 22px 6px; height: 50px; }
.status-time { color: #fff; font-size: 16px; font-weight: 600; }
.status-icons { display: flex; align-items: center; gap: 5px; }
.nav { display: flex; align-items: center; padding: 6px 16px; gap: 10px; }
.back { color: #007AFF; font-size: 23px; font-weight: 300; }
.contact { flex: 1; display: flex; flex-direction: column; align-items: center; }
.avatar { width: 42px; height: 42px; background: #444446; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.contact-name { color: #fff; font-size: 12px; margin-top: 3px; }
.content { flex: 1; overflow: hidden; padding: 8px 8px; display: flex; flex-direction: column; gap: 6px; }
.meta { color: #8E8493; font-size: 11px; text-align: center; }
.bubble { background: #262629; border-radius: 18px 18px 18px 4px; padding: 10px 13px; max-width: 88%; }
.bubble p { color: #fff; font-size: 13px; line-height: 1.45em; }
a { color: #007AFF; text-decoration: underline; }
.footer { padding: 8px 12px; display: flex; flex-direction: column; align-items: center; gap: 7px; }
.spam { color: #8E8493; font-size: 10px; text-align: center; line-height: 1.3em; }
.spam-btn { background: #1C1C1E; border: none; border-radius: 20px; padding: 8px 20px; color: #007AFF; font-size: 13px; font-family: Inter; }
</style>
</head>
<body>
<div class="phone">
  <div class="screen">
    <div class="dynamic-island"></div>
    <div class="status-bar">
      <span class="status-time">1:34</span>
      <div class="status-icons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><rect y="6" width="3" height="6" rx="1"/><rect x="4" y="4" width="3" height="8" rx="1"/><rect x="8" y="2" width="3" height="10" rx="1"/><rect x="12" y="0" width="3" height="12" rx="1"/></svg>
        <span style="color:#fff;font-size:11px;font-weight:600">5G</span>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="white" stroke-opacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M24 4.5v3c.8-.36 1.3-1.08 1.3-1.5s-.5-1.14-1.3-1.5z" fill="white" opacity="0.4"/></svg>
      </div>
    </div>
    <div class="nav">
      <span class="back"></span>
      <div class="contact">
        <div class="avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#8E8E93"><path d="M12 12c2.71 0 4-1.79 4-4s-1.29-4-4-4-4 1.79-4 4 1.29 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <span class="contact-name">82127 &gt;</span>
      </div>
    </div>
    <div class="content">
      <p class="meta">Text Message &middot; SMS<br/>Friday 8:01 AM</p>
      <div class="bubble">
        <p>${c.name}: We&#8217;re glad you joined! Stay tuned for more news, &amp; if you have any questions, email us at <a href="#">help@${c.url}</a>. Msg frequency varies. Reply STOP to end.</p>
      </div>
      <p class="meta">Sunday 2:12 PM</p>
      <div class="bubble">
        <p>${c.sms2Line1}</p>
        <p><a href="#">${c.sms2Link}</a></p>
        <p>${c.sms2Line3}</p>
      </div>
    </div>
    <div class="footer">
      <p class="spam">If you did not expect this message from an unknown sender, it may be spam</p>
      <button class="spam-btn">Report Spam</button>
    </div>
  </div>
</div>
</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 500, height: 900 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(1000);
const el = await page.$(".phone");
const outPath = join(OUT_DIR, "sms-panel.png");
await el.screenshot({ path: outPath });
await browser.close();
console.log("Saved:" + outPath);
