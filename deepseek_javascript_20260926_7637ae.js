const fs = require('fs');
const path = require('path');

// ============================================================
// HTML 模板
// ============================================================
function buildIndexHtml(forceLang, htmlLang, canonicalPath) {
  const forceLine = forceLang
    ? `<script>window.__FORCE_LANG__ = '${forceLang}';<\/script>\n`
    : '';
  const canonical = `https://toolara.dev${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Etsy Fee Calculator — Calculate Your Etsy Profit After Fees (2026)</title>
<meta name="description" content="Free Etsy fee calculator. Enter your listing price, shipping, and item cost to see exactly how much you keep after Etsy's listing fee, transaction fee, and payment processing fee.">
<meta name="keywords" content="etsy fee calculator, etsy profit calculator, etsy fees 2026, how much does etsy take, etsy seller fees">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#F1641E">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="https://toolara.dev/etsy-fee-calculator/">
<link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/etsy-fee-calculator/zh/">
<link rel="alternate" hreflang="x-default" href="https://toolara.dev/etsy-fee-calculator/">

<meta property="og:type" content="website">
<meta property="og:title" content="Etsy Fee Calculator — Calculate Your Etsy Profit After Fees">
<meta property="og:description" content="See exactly how much you keep after Etsy's listing, transaction, and payment processing fees.">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Etsy Fee Calculator",
  "url": "${canonical}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "description": "Free calculator that shows exactly how much an Etsy seller keeps after all fees.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
<\/script>

${forceLine}<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="hero">
  <div class="lang-switch">
    <select id="langSelect" onchange="setLang(this.value)" aria-label="Language">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
    </select>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">🛍️ Etsy Seller Tool</div>
    <h1 data-i18n="title">Etsy Fee Calculator</h1>
    <p data-i18n="subtitle">See exactly how much you keep after Etsy's listing, transaction, and payment processing fees.</p>
  </div>
</header>

<main class="wrap">
  <section class="card">
    <h2 class="visually-hidden" data-i18n="calcHeading">Calculator</h2>

    <div class="row">
      <div>
        <label for="price" data-i18n="priceLabel">Listing price ($)</label>
        <input type="number" id="price" min="0" step="0.01" placeholder="25.00" value="25" inputmode="decimal">
      </div>
      <div>
        <label for="shipping" data-i18n="shippingLabel">Shipping charged ($)</label>
        <input type="number" id="shipping" min="0" step="0.01" placeholder="5.00" value="5" inputmode="decimal">
      </div>
    </div>

    <div class="row">
      <div>
        <label for="itemCost" data-i18n="itemCostLabel">Item cost ($)</label>
        <input type="number" id="itemCost" min="0" step="0.01" placeholder="8.00" value="8" inputmode="decimal">
      </div>
      <div>
        <label for="shipCost" data-i18n="shipCostLabel">Your shipping cost ($)</label>
        <input type="number" id="shipCost" min="0" step="0.01" placeholder="4.50" value="4.5" inputmode="decimal">
      </div>
    </div>

    <details class="advanced">
      <summary data-i18n="advancedLabel">Advanced fee settings</summary>
      <div class="row">
        <div>
          <label for="listingFee" data-i18n="listingFeeLabel">Listing fee ($)</label>
          <input type="number" id="listingFee" min="0" step="0.01" value="0.20" inputmode="decimal">
        </div>
        <div>
          <label for="txnPct" data-i18n="txnLabel">Transaction fee (%)</label>
          <input type="number" id="txnPct" min="0" step="0.1" value="6.5" inputmode="decimal">
        </div>
      </div>
      <div class="row">
        <div>
          <label for="payPct" data-i18n="payPctLabel">Payment processing (%)</label>
          <input type="number" id="payPct" min="0" step="0.1" value="3" inputmode="decimal">
        </div>
        <div>
          <label for="payFixed" data-i18n="payFixedLabel">Payment fixed ($)</label>
          <input type="number" id="payFixed" min="0" step="0.01" value="0.25" inputmode="decimal">
        </div>
      </div>
    </details>

    <button class="calc" type="button" onclick="calculate()" data-i18n="calcBtn">Calculate profit</button>

    <div id="result" role="region" aria-live="polite">
      <div class="result-label" data-i18n="resultLabel">Net profit</div>
      <div class="net-profit" id="netProfit">—</div>
      <div class="margin-note" id="marginNote"></div>

      <div class="breakdown">
        <div class="bd-row"><span data-i18n="bdRevenue">Total revenue</span><strong id="bdRevenue">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdListing">Listing fee</span><strong id="bdListing">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdTxn">Transaction fee</span><strong id="bdTxn">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdPay">Payment processing</span><strong id="bdPay">—</strong></div>
        <div class="bd-row bd-sub"><span data-i18n="bdTotalFees">Total Etsy fees</span><strong id="bdTotalFees">—</strong></div>
        <div class="bd-divider"></div>
        <div class="bd-row"><span data-i18n="bdItemCost">Item cost</span><strong id="bdItemCost">—</strong></div>
        <div class="bd-row"><span data-i18n="bdShipCost">Your shipping cost</span><strong id="bdShipCost">—</strong></div>
        <div class="bd-divider"></div>
        <div class="bd-row bd-total"><span data-i18n="bdNet">Net profit</span><strong id="bdNet">—</strong></div>
      </div>

      <div class="share-row">
        <button class="share-btn" type="button" onclick="copyShareLink()" data-i18n="shareBtn">Copy shareable link</button>
        <span class="share-copied" id="shareCopied" data-i18n="shareCopied">Copied!</span>
      </div>

      <div class="result-disclaimer" data-i18n="resultDisclaimer">Estimate only. Etsy fees may vary by region and account type. Verify current fees on Etsy's official Seller Handbook.</div>
    </div>
  </section>

  <section>
    <h2 data-i18n="whatIsTitle">How Etsy fees work</h2>
    <p data-i18n="whatIsText">Etsy charges sellers three main fees: a listing fee each time you publish or renew an item, a transaction fee on every sale, and a payment processing fee. This calculator subtracts all three from your revenue, then subtracts your item and shipping costs, to show your true profit.</p>
  </section>

  <section>
    <h2 data-i18n="feesTitle">Current Etsy fees (2026)</h2>
    <table>
      <thead>
        <tr><th data-i18n="thFee">Fee</th><th data-i18n="thAmount">Amount</th></tr>
      </thead>
      <tbody>
        <tr><td data-i18n="feeListing">Listing fee</td><td data-i18n="feeListingAmt">$0.20 per item (renews every 4 months)</td></tr>
        <tr><td data-i18n="feeTxn">Transaction fee</td><td data-i18n="feeTxnAmt">6.5% of total sale price (including shipping)</td></tr>
        <tr><td data-i18n="feePay">Payment processing</td><td data-i18n="feePayAmt">3% + $0.25 per transaction (US)</td></tr>
      </tbody>
    </table>
    <p data-i18n="feesNote">Additional fees may apply: offsite ads (15% if you make a sale through an Etsy ad), currency conversion (2.5%), and regulatory operating fees in some regions.</p>
  </section>

  <section>
    <h2 data-i18n="howToTitle">How to use this calculator</h2>
    <ol>
      <li data-i18n="howTo1">Enter your listing price — the amount the buyer pays for the item.</li>
      <li data-i18n="howTo2">Enter shipping charged — what the buyer pays you for shipping (enter 0 if free shipping).</li>
      <li data-i18n="howTo3">Enter your item cost — materials, labor, packaging.</li>
      <li data-i18n="howTo4">Enter your shipping cost — what you actually pay the carrier.</li>
      <li data-i18n="howTo5">Click "Calculate profit" to see your true take-home amount.</li>
    </ol>
  </section>

  <section>
    <h2 data-i18n="faqTitle">Frequently asked questions</h2>

    <h3 data-i18n="faq1q">How much does Etsy take per sale?</h3>
    <p data-i18n="faq1a">On a typical $25 sale with $5 shipping (US), Etsy takes approximately: $0.20 listing fee + $1.95 transaction fee (6.5% of $30) + $1.15 payment processing (3% + $0.25) = <strong>$3.30 total</strong>. You keep $26.70 before your own costs.</p>

    <h3 data-i18n="faq2q">Is Etsy worth it for small sellers?</h3>
    <p data-i18n="faq2a">It depends on your margins. Etsy's total fees typically run 9-12% of the sale price. If your item cost plus shipping cost is less than 40% of your revenue, you can usually maintain a healthy 40-50% profit margin. Anything under 20% margin is hard to sustain.</p>

    <h3 data-i18n="faq3q">Does Etsy charge fees on shipping?</h3>
    <p data-i18n="faq3a">Yes. Etsy's 6.5% transaction fee applies to the total sale amount, including shipping charges. This surprises many new sellers. If you charge $5 for shipping, Etsy takes 6.5% of that $5 too.</p>

    <h3 data-i18n="faq4q">What are offsite ads and do they cost extra?</h3>
    <p data-i18n="faq4a">Offsite ads are Etsy ads shown on Google, Facebook, and Instagram. If a buyer clicks one of those ads and purchases from you within 30 days, Etsy charges an additional 15% fee. Sellers making over $10,000/year are automatically enrolled and cannot opt out.</p>

    <h3 data-i18n="faq5q">How do I price my Etsy items to make a profit?</h3>
    <p data-i18n="faq5a">A common formula: (Item cost + Shipping cost) ÷ (1 - 0.10) × 2. This assumes Etsy takes about 10% in fees and you want a 50% profit margin. For a $8 item with $4.50 shipping: ($12.50 ÷ 0.90) × 2 = <strong>$27.78 minimum listing price</strong>.</p>

    <div class="disclaimer" data-i18n="disclaimer"><strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Etsy's fee structure may change. Always verify current fees in Etsy's official Seller Handbook before making pricing decisions.</div>
  </section>

  <section>
    <h2 data-i18n="moreToolsTitle">More seller fee calculators</h2>
    <p data-i18n="moreToolsText">Coming soon: eBay fee calculator, Amazon FBA fee calculator, Depop fee calculator.</p>
  </section>
</main>

<footer class="footer" data-i18n="footer">Runs entirely in your browser. No data is collected or stored.</footer>

<script src="js/i18n.js"><\/script>
<script src="js/calculator.js"><\/script>
</body>
</html>`;
}

// ============================================================
// CSS — Etsy 品牌橙 + 暖米色
// ============================================================
const STYLE_CSS = `:root {
  --bg: #fdf9f3; --card: #ffffff; --text: #2a1f1a; --muted: #7a6a5e;
  --accent: #F1641E; --accent-dark: #d4520f; --warm: #f4a261; --cream: #fef6e7;
  --border: #f0e0ce; --radius: 14px;
  --shadow: 0 1px 3px rgba(42,31,26,0.05), 0 8px 24px rgba(241,100,30,0.08);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  padding: 64px 20px 96px;
  background:
    radial-gradient(circle at 20% 20%, rgba(244,162,97,0.40) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(241,100,30,0.35) 0%, transparent 55%),
    linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #F1641E 100%);
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(255,255,255,0.10) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  opacity: 0.6;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(120,40,0,0.30) 100%);
  pointer-events: none;
}
.hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; text-align: center; }
.hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.40);
  color: #fff;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
}
.hero h1 { font-size: 2.1rem; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.02em; }
.hero p { margin: 0 auto; opacity: 0.95; font-size: 1rem; max-width: 560px; }

/* ---------- Lang switcher ---------- */
.lang-switch { position: absolute; top: 16px; right: 16px; z-index: 3; }
.lang-switch select {
  appearance: none; -webkit-appearance: none;
  background-color: rgba(255,255,255,0.18);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff; padding: 7px 32px 7px 12px; border-radius: 8px;
  font-size: 0.85rem; font-family: inherit; cursor: pointer;
}
.lang-switch select:hover { background-color: rgba(255,255,255,0.30); }
.lang-switch select option { color: #2a1f1a; background: #fff; }

/* ---------- Layout ---------- */
.wrap { max-width: 720px; margin: -56px auto 0; padding: 0 20px 64px; position: relative; z-index: 2; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 22px; box-shadow: var(--shadow); }

label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
input, select { width: 100%; padding: 11px 13px; border: 1px solid #e0d0bc; border-radius: 9px; font-size: 1rem; margin-bottom: 18px; background: #fff; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(241,100,30,0.15); }
.row { display: flex; gap: 14px; }
.row > div { flex: 1; }
button.calc { width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit; }
button.calc:hover { background: var(--accent-dark); }
button.calc:active { transform: scale(0.99); }

/* ---------- Advanced ---------- */
.advanced { margin-bottom: 18px; }
.advanced summary {
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  padding: 8px 0;
  user-select: none;
}
.advanced summary:hover { color: var(--accent-dark); }
.advanced[open] summary { margin-bottom: 8px; }

/* ---------- Result ---------- */
#result { margin-top: 24px; padding: 24px; border-radius: 14px; background: linear-gradient(135deg, #fef6e7 0%, #fdf9f3 100%); border: 2px solid var(--accent); display: none; animation: fadeIn 0.35s ease; }
#result.show { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.result-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
.net-profit { font-size: 3rem; font-weight: 800; color: #2a1f1a; line-height: 1; letter-spacing: -0.02em; }
.net-profit.negative { color: #dc2626; }
.margin-note { font-size: 0.9rem; color: var(--accent-dark); margin-top: 8px; font-weight: 600; }
.breakdown { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(241,100,30,0.20); }
.bd-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 0.9rem; color: #2a1f1a; }
.bd-row strong { color: #2a1f1a; font-weight: 600; }
.bd-sub { padding-left: 14px; font-size: 0.85rem; color: var(--muted); }
.bd-sub strong { color: var(--muted); font-weight: 500; }
.bd-divider { height: 1px; background: rgba(241,100,30,0.18); margin: 10px 0; }
.bd-total { font-size: 1rem; padding-top: 10px; }
.bd-total strong { color: var(--accent); font-size: 1.15rem; }

/* ---------- Share ---------- */
.share-row { margin-top: 18px; display: flex; align-items: center; gap: 12px; }
.share-btn { padding: 9px 16px; background: #fff; border: 1px solid var(--accent); color: var(--accent); border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; }
.share-btn:hover { background: var(--cream); }
.share-copied { font-size: 0.85rem; color: #059669; font-weight: 600; opacity: 0; transition: opacity 0.25s; }
.share-copied.show { opacity: 1; }

.result-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(241,100,30,0.15); font-size: 0.78rem; color: var(--muted); }

/* ---------- Content ---------- */
h2 { font-size: 1.25rem; margin: 36px 0 12px; letter-spacing: -0.01em; }
h3 { font-size: 1rem; margin: 22px 0 6px; }
p { margin: 0 0 14px; }
ul, ol { margin: 0 0 16px; padding-left: 22px; }
li { margin-bottom: 8px; line-height: 1.65; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 14px 0; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #f0e0ce; }
th { background: #fef6e7; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent-dark); }
tr:last-child td { border-bottom: none; }
.disclaimer { font-size: 0.85rem; color: var(--muted); border-left: 3px solid var(--accent); padding: 4px 0 4px 14px; margin-top: 18px; }
.footer { text-align: center; font-size: 0.8rem; color: var(--muted); padding: 24px 20px 48px; }

@media (max-width: 560px) {
  .hero { padding: 48px 16px 80px; }
  .hero h1 { font-size: 1.5rem; }
  .lang-switch { position: static; display: flex; justify-content: center; margin-bottom: 16px; }
  .wrap { padding: 0 14px 48px; }
  .card { padding: 20px; }
  .row { flex-direction: column; gap: 0; }
  .net-profit { font-size: 2.3rem; }
}`;

// ============================================================
// i18n.js
// ============================================================
const I18N_JS = `const SUPPORTED_LANGS = ['en','zh'];
const DEFAULT_LANG = 'en';
const MARKER = '/etsy-fee-calculator';

const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/' };
const SEG_TO_LANG = { 'zh':'zh' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function getBase() {
  const p = window.location.pathname;
  const idx = p.indexOf(MARKER);
  if (idx !== -1) return p.slice(0, idx + MARKER.length);
  return '';
}

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const p = window.location.pathname;
  const base = getBase();
  const rest = base ? p.slice(base.length) : p;
  const segs = rest.split('/').filter(Boolean);
  if (segs.length > 0) {
    const first = segs[0].toLowerCase();
    if (SEG_TO_LANG[first]) return SEG_TO_LANG[first];
  }
  return DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const base = getBase();
  const res = await fetch(base + '/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed to load locale: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (key === 'disclaimer') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

async function initPage() {
  const lang = detectPageLang();
  try { translations = await loadLocale(lang); }
  catch (err) { console.error(err); return; }
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
  applyTranslations(translations);
  const select = document.getElementById('langSelect');
  if (select) select.value = lang;
  window.__i18n = { t: translations, lang: currentLang };
  if (typeof readUrlParams === 'function') readUrlParams();
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const base = getBase();
  window.location.href = base + (LANG_TO_PATH[lang] || '/');
}

document.addEventListener('DOMContentLoaded', initPage);`;

// ============================================================
// calculator.js
// ============================================================
const CALCULATOR_JS = `function t() { return (window.__i18n && window.__i18n.t) || {}; }

function fmt(n) {
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toFixed(2);
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const map = { price:'price', shipping:'shipping', itemCost:'itemCost', shipCost:'shipCost' };
  for (const [key, id] of Object.entries(map)) {
    if (params.has(key)) {
      const el = document.getElementById(id);
      if (el) el.value = params.get(key);
    }
  }
  if (params.has('price') || params.has('shipping') || params.has('itemCost')) {
    calculate();
  }
}

function buildShareUrl() {
  const params = new URLSearchParams();
  const fields = ['price','shipping','itemCost','shipCost'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value) params.set(id, el.value);
  });
  const base = window.location.origin + window.location.pathname;
  return base + '?' + params.toString();
}

function copyShareLink() {
  const url = buildShareUrl();
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareCopied');
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1800);
  }).catch(() => {
    prompt('Copy this link:', url);
  });
}

function calculate() {
  const tr = t();
  const price = parseFloat(document.getElementById('price').value) || 0;
  const shipping = parseFloat(document.getElementById('shipping').value) || 0;
  const itemCost = parseFloat(document.getElementById('itemCost').value) || 0;
  const shipCost = parseFloat(document.getElementById('shipCost').value) || 0;
  const listingFee = parseFloat(document.getElementById('listingFee').value) || 0;
  const txnPct = parseFloat(document.getElementById('txnPct').value) || 0;
  const payPct = parseFloat(document.getElementById('payPct').value) || 0;
  const payFixed = parseFloat(document.getElementById('payFixed').value) || 0;

  const revenue = price + shipping;
  const txnFee = revenue * (txnPct / 100);
  const payFee = revenue * (payPct / 100) + payFixed;
  const totalFees = listingFee + txnFee + payFee;
  const net = revenue - totalFees - itemCost - shipCost;
  const margin = revenue > 0 ? (net / revenue * 100) : 0;

  const netEl = document.getElementById('netProfit');
  netEl.textContent = fmt(net);
  netEl.classList.toggle('negative', net < 0);

  const marginNote = document.getElementById('marginNote');
  if (net < 0) {
    marginNote.textContent = (tr.marginLoss || 'You are losing money on this sale.') + ' (' + margin.toFixed(1) + '%)';
    marginNote.style.color = '#dc2626';
  } else {
    marginNote.textContent = (tr.marginProfit || 'Profit margin:') + ' ' + margin.toFixed(1) + '%';
    marginNote.style.color = '';
  }

  document.getElementById('bdRevenue').textContent = fmt(revenue);
  document.getElementById('bdListing').textContent = '-' + fmt(listingFee);
  document.getElementById('bdTxn').textContent = '-' + fmt(txnFee);
  document.getElementById('bdPay').textContent = '-' + fmt(payFee);
  document.getElementById('bdTotalFees').textContent = '-' + fmt(totalFees);
  document.getElementById('bdItemCost').textContent = '-' + fmt(itemCost);
  document.getElementById('bdShipCost').textContent = '-' + fmt(shipCost);
  document.getElementById('bdNet').textContent = fmt(net);

  document.getElementById('result').classList.add('show');
}

window.calculate = calculate;
window.copyShareLink = copyShareLink;
window.readUrlParams = readUrlParams;`;

// ============================================================
// Locales
// ============================================================
const LOCALES = {
  'en': {
    title: "Etsy Fee Calculator",
    subtitle: "See exactly how much you keep after Etsy's listing, transaction, and payment processing fees.",
    calcHeading: "Calculator",
    priceLabel: "Listing price ($)",
    shippingLabel: "Shipping charged ($)",
    itemCostLabel: "Item cost ($)",
    shipCostLabel: "Your shipping cost ($)",
    advancedLabel: "Advanced fee settings",
    listingFeeLabel: "Listing fee ($)",
    txnLabel: "Transaction fee (%)",
    payPctLabel: "Payment processing (%)",
    payFixedLabel: "Payment fixed ($)",
    calcBtn: "Calculate profit",
    resultLabel: "Net profit",
    marginProfit: "Profit margin:",
    marginLoss: "You are losing money on this sale.",
    bdRevenue: "Total revenue",
    bdListing: "Listing fee",
    bdTxn: "Transaction fee",
    bdPay: "Payment processing",
    bdTotalFees: "Total Etsy fees",
    bdItemCost: "Item cost",
    bdShipCost: "Your shipping cost",
    bdNet: "Net profit",
    shareBtn: "Copy shareable link",
    shareCopied: "Copied!",
    resultDisclaimer: "Estimate only. Etsy fees may vary by region and account type. Verify current fees on Etsy's official Seller Handbook.",
    whatIsTitle: "How Etsy fees work",
    whatIsText: "Etsy charges sellers three main fees: a listing fee each time you publish or renew an item, a transaction fee on every sale, and a payment processing fee. This calculator subtracts all three from your revenue, then subtracts your item and shipping costs, to show your true profit.",
    feesTitle: "Current Etsy fees (2026)",
    thFee: "Fee", thAmount: "Amount",
    feeListing: "Listing fee", feeListingAmt: "$0.20 per item (renews every 4 months)",
    feeTxn: "Transaction fee", feeTxnAmt: "6.5% of total sale price (including shipping)",
    feePay: "Payment processing", feePayAmt: "3% + $0.25 per transaction (US)",
    feesNote: "Additional fees may apply: offsite ads (15% if you make a sale through an Etsy ad), currency conversion (2.5%), and regulatory operating fees in some regions.",
    howToTitle: "How to use this calculator",
    howTo1: "Enter your listing price — the amount the buyer pays for the item.",
    howTo2: "Enter shipping charged — what the buyer pays you for shipping (enter 0 if free shipping).",
    howTo3: "Enter your item cost — materials, labor, packaging.",
    howTo4: "Enter your shipping cost — what you actually pay the carrier.",
    howTo5: "Click \"Calculate profit\" to see your true take-home amount.",
    faqTitle: "Frequently asked questions",
    faq1q: "How much does Etsy take per sale?",
    faq1a: "On a typical $25 sale with $5 shipping (US), Etsy takes approximately: $0.20 listing fee + $1.95 transaction fee (6.5% of $30) + $1.15 payment processing (3% + $0.25) = $3.30 total. You keep $26.70 before your own costs.",
    faq2q: "Is Etsy worth it for small sellers?",
    faq2a: "It depends on your margins. Etsy's total fees typically run 9-12% of the sale price. If your item cost plus shipping cost is less than 40% of your revenue, you can usually maintain a healthy 40-50% profit margin. Anything under 20% margin is hard to sustain.",
    faq3q: "Does Etsy charge fees on shipping?",
    faq3a: "Yes. Etsy's 6.5% transaction fee applies to the total sale amount, including shipping charges. This surprises many new sellers. If you charge $5 for shipping, Etsy takes 6.5% of that $5 too.",
    faq4q: "What are offsite ads and do they cost extra?",
    faq4a: "Offsite ads are Etsy ads shown on Google, Facebook, and Instagram. If a buyer clicks one of those ads and purchases from you within 30 days, Etsy charges an additional 15% fee. Sellers making over $10,000/year are automatically enrolled and cannot opt out.",
    faq5q: "How do I price my Etsy items to make a profit?",
    faq5a: "A common formula: (Item cost + Shipping cost) ÷ (1 - 0.10) × 2. This assumes Etsy takes about 10% in fees and you want a 50% profit margin. For a $8 item with $4.50 shipping: ($12.50 ÷ 0.90) × 2 = $27.78 minimum listing price.",
    disclaimer: "<strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Etsy's fee structure may change. Always verify current fees in Etsy's official Seller Handbook before making pricing decisions.",
    moreToolsTitle: "More seller fee calculators",
    moreToolsText: "Coming soon: eBay fee calculator, Amazon FBA fee calculator, Depop fee calculator.",
    footer: "Runs entirely in your browser. No data is collected or stored."
  },
  'zh': {
    title: "Etsy 费用计算器",
    subtitle: "看看扣除 Etsy 的上架费、交易费和支付处理费之后，你实际到手多少钱。",
    calcHeading: "计算器",
    priceLabel: "商品售价（美元）",
    shippingLabel: "向买家收取的运费（美元）",
    itemCostLabel: "商品成本（美元）",
    shipCostLabel: "你的实际运费成本（美元）",
    advancedLabel: "高级费用设置",
    listingFeeLabel: "上架费（美元）",
    txnLabel: "交易费（%）",
    payPctLabel: "支付处理费（%）",
    payFixedLabel: "支付固定费（美元）",
    calcBtn: "计算利润",
    resultLabel: "净利润",
    marginProfit: "利润率：",
    marginLoss: "这笔交易你正在亏钱。",
    bdRevenue: "总收入",
    bdListing: "上架费",
    bdTxn: "交易费",
    bdPay: "支付处理费",
    bdTotalFees: "Etsy 总费用",
    bdItemCost: "商品成本",
    bdShipCost: "你的运费成本",
    bdNet: "净利润",
    shareBtn: "复制分享链接",
    shareCopied: "已复制！",
    resultDisclaimer: "仅为估算值。Etsy 费用因地区和账户类型而异。请在 Etsy 官方卖家手册中确认当前费用。",
    whatIsTitle: "Etsy 费用如何构成",
    whatIsText: "Etsy 向卖家收取三项主要费用：每次发布或续期商品时的上架费、每笔交易的手续费，以及支付处理费。本计算器从你的收入中扣除这三项费用，再扣除商品成本和运费成本，显示你的真实利润。",
    feesTitle: "当前 Etsy 费用（2026 年）",
    thFee: "费用", thAmount: "金额",
    feeListing: "上架费", feeListingAmt: "每件商品 0.20 美元（每 4 个月续期）",
    feeTxn: "交易费", feeTxnAmt: "总售价（含运费）的 6.5%",
    feePay: "支付处理费", feePayAmt: "每笔交易 3% + 0.25 美元（美国）",
    feesNote: "可能还有其他费用：站外广告费（通过 Etsy 广告成交收取 15%）、货币转换费（2.5%），以及部分地区的监管运营费。",
    howToTitle: "如何使用本计算器",
    howTo1: "输入商品售价——买家为商品支付的价格。",
    howTo2: "输入向买家收取的运费（如果免运费，填 0）。",
    howTo3: "输入商品成本——材料、人工、包装。",
    howTo4: "输入你的实际运费成本——你实际支付给承运商的费用。",
    howTo5: "点击“计算利润”，查看你真正到手的金额。",
    faqTitle: "常见问题",
    faq1q: "Etsy 每笔交易收取多少费用？",
    faq1a: "以一笔 25 美元商品 + 5 美元运费的典型美国交易为例，Etsy 大约收取：0.20 美元上架费 + 1.95 美元交易费（30 美元的 6.5%）+ 1.15 美元支付处理费（3% + 0.25 美元）= 总计 3.30 美元。在扣除你自己的成本前，你到手 26.70 美元。",
    faq2q: "对小卖家来说，Etsy 值得做吗？",
    faq2a: "取决于你的利润率。Etsy 总费用通常占售价的 9-12%。如果你的商品成本加运费成本低于收入的 40%，通常能维持 40-50% 的健康利润率。低于 20% 利润率则很难持续。",
    faq3q: "Etsy 对运费也收费吗？",
    faq3a: "是的。Etsy 的 6.5% 交易费按总销售额计算，包含运费。这一点让很多新卖家感到意外。如果你收取 5 美元运费，Etsy 也会从这 5 美元中抽走 6.5%。",
    faq4q: "什么是站外广告？会额外收费吗？",
    faq4a: "站外广告是 Etsy 在 Google、Facebook 和 Instagram 上投放的广告。如果买家点击这些广告并在 30 天内向你购买，Etsy 会额外收取 15% 的费用。年销售额超过 10,000 美元的卖家会被自动纳入，无法退出。",
    faq5q: "如何定价才能保证 Etsy 有利润？",
    faq5a: "常用公式：（商品成本 + 运费成本）÷ (1 - 0.10) × 2。这假设 Etsy 收取约 10% 的费用，而你想要 50% 的利润率。对于一件成本 8 美元、运费 4.50 美元的商品：（12.50 ÷ 0.90）× 2 = 最低售价 27.78 美元。",
    disclaimer: "<strong>免责声明：</strong>本计算器仅供教育目的提供估算。Etsy 的费用结构可能变化。在做定价决策前，请务必在 Etsy 官方卖家手册中确认当前费用。",
    moreToolsTitle: "更多卖家费用计算器",
    moreToolsText: "即将推出：eBay 费用计算器、Amazon FBA 费用计算器、Depop 费用计算器。",
    footer: "完全在您的浏览器中运行。不收集、不存储任何数据。"
  }
};

// ============================================================
// 生成文件
// ============================================================
const files = {};

files['index.html'] = buildIndexHtml(null, 'en', '/etsy-fee-calculator/');
files['zh/index.html'] = buildIndexHtml('zh', 'zh-Hans', '/etsy-fee-calculator/zh/');

files['css/style.css'] = STYLE_CSS;
files['js/i18n.js'] = I18N_JS;
files['js/calculator.js'] = CALCULATOR_JS;

for (const [lang, data] of Object.entries(LOCALES)) {
  files[`locales/${lang}.json`] = JSON.stringify(data, null, 2);
}

files['.gitignore'] = `node_modules/
.wrangler/
.dev.vars
.DS_Store
*.log
.vscode/
.idea/
dist/
build/
`;

// ============================================================
// 写入
// ============================================================
const root = '.';
let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created: ' + filePath);
  count++;
}
console.log(`\nDone. ${count} files generated.`);
console.log('\nNext steps:');
console.log('  1. git init && git add . && git commit -m "Initial: Etsy fee calculator"');
console.log('  2. Push to a new GitHub repo "etsy-fee-calculator"');
console.log('  3. Deploy as a new Cloudflare Worker');
console.log('  4. In tool-proxy/src/index.js PROXY_MAP, add:');
console.log('     \'/etsy-fee-calculator\': \'https://etsy-fee-calculator.lvyafei2026.workers.dev\'');
console.log('  5. In tool-proxy/wrangler.toml run_worker_first, add:');
console.log('     "/etsy-fee-calculator/*"');
console.log('  6. In Cloudflare tool-proxy Domains & Routes, add:');
console.log('     toolara.dev/etsy-fee-calculator/*');
console.log('     www.toolara.dev/etsy-fee-calculator/*');
console.log('  7. Update tool-proxy/public/sitemap.xml and index.html');