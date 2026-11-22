import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, 'public');

const EMBEDDED_ASSETS = {
  'logo-256.svg': {
    mime: 'image/svg+xml; charset=utf-8',
    data: Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"256\" height=\"256\" viewBox=\"0 0 256 256\" fill=\"none\">\n  <defs>\n    <linearGradient id=\"bgGrad\" x1=\"0\" y1=\"0\" x2=\"256\" y2=\"256\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0%\" stop-color=\"#14161B\"/>\n      <stop offset=\"100%\" stop-color=\"#090A0D\"/>\n    </linearGradient>\n    <linearGradient id=\"crimsonPrism\" x1=\"64\" y1=\"48\" x2=\"204\" y2=\"208\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0%\" stop-color=\"#FF1F2D\"/>\n      <stop offset=\"55%\" stop-color=\"#E50914\"/>\n      <stop offset=\"100%\" stop-color=\"#99040B\"/>\n    </linearGradient>\n    <linearGradient id=\"titaniumEdge\" x1=\"64\" y1=\"48\" x2=\"192\" y2=\"192\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0%\" stop-color=\"#FFFFFF\" stop-opacity=\"0.32\"/>\n      <stop offset=\"100%\" stop-color=\"#FFFFFF\" stop-opacity=\"0.04\"/>\n    </linearGradient>\n  </defs>\n  <rect width=\"256\" height=\"256\" rx=\"52\" fill=\"url(#bgGrad)\"/>\n  <rect x=\"2\" y=\"2\" width=\"252\" height=\"252\" rx=\"50\" stroke=\"url(#titaniumEdge)\" stroke-width=\"2\"/>\n  <path d=\"M84 62C84 54.1597 92.6115 49.3665 99.2782 53.4935L195.899 113.308C202.212 117.216 202.212 126.784 195.899 130.692L99.2782 190.506C92.6115 194.633 84 189.84 84 182V62Z\" fill=\"url(#crimsonPrism)\"/>\n  <path d=\"M84 62L144 122L84 182V62Z\" fill=\"#FFFFFF\" fill-opacity=\"0.14\"/>\n  <rect x=\"56\" y=\"198\" width=\"144\" height=\"26\" rx=\"6\" fill=\"#181B22\" stroke=\"#2B303C\" stroke-width=\"1.5\"/>\n  <text x=\"128\" y=\"215\" text-anchor=\"middle\" fill=\"#F3F4F6\" font-family=\"monospace\" font-weight=\"700\" font-size=\"12\" letter-spacing=\"2\">4K HDR · EL</text>\n</svg>\n", 'utf8'),
  },
  'background-1920.svg': {
    mime: 'image/svg+xml; charset=utf-8',
    data: Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1920\" height=\"1080\" viewBox=\"0 0 1920 1080\" fill=\"none\">\n  <defs>\n    <radialGradient id=\"crimsonAura\" cx=\"75%\" cy=\"28%\" r=\"55%\" fx=\"75%\" fy=\"28%\">\n      <stop offset=\"0%\" stop-color=\"#E50914\" stop-opacity=\"0.22\"/>\n      <stop offset=\"45%\" stop-color=\"#7F050B\" stop-opacity=\"0.08\"/>\n      <stop offset=\"100%\" stop-color=\"#0B0C0E\" stop-opacity=\"0\"/>\n    </radialGradient>\n    <radialGradient id=\"anamorphicFlare\" cx=\"25%\" cy=\"72%\" r=\"50%\">\n      <stop offset=\"0%\" stop-color=\"#1E293B\" stop-opacity=\"0.35\"/>\n      <stop offset=\"100%\" stop-color=\"#0B0C0E\" stop-opacity=\"0\"/>\n    </radialGradient>\n    <linearGradient id=\"gridLine\" x1=\"0\" y1=\"0\" x2=\"1920\" y2=\"0\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0%\" stop-color=\"#FFFFFF\" stop-opacity=\"0\"/>\n      <stop offset=\"50%\" stop-color=\"#FFFFFF\" stop-opacity=\"0.04\"/>\n      <stop offset=\"100%\" stop-color=\"#FFFFFF\" stop-opacity=\"0\"/>\n    </linearGradient>\n  </defs>\n  <rect width=\"1920\" height=\"1080\" fill=\"#0B0C0E\"/>\n  <rect width=\"1920\" height=\"1080\" fill=\"url(#crimsonAura)\"/>\n  <rect width=\"1920\" height=\"1080\" fill=\"url(#anamorphicFlare)\"/>\n  <g opacity=\"0.55\">\n    <line x1=\"0\" y1=\"180\" x2=\"1920\" y2=\"180\" stroke=\"url(#gridLine)\" stroke-width=\"1\"/>\n    <line x1=\"0\" y1=\"360\" x2=\"1920\" y2=\"360\" stroke=\"url(#gridLine)\" stroke-width=\"1\"/>\n    <line x1=\"0\" y1=\"540\" x2=\"1920\" y2=\"540\" stroke=\"url(#gridLine)\" stroke-width=\"1\"/>\n    <line x1=\"0\" y1=\"720\" x2=\"1920\" y2=\"720\" stroke=\"url(#gridLine)\" stroke-width=\"1\"/>\n    <line x1=\"0\" y1=\"900\" x2=\"1920\" y2=\"900\" stroke=\"url(#gridLine)\" stroke-width=\"1\"/>\n    <line x1=\"320\" y1=\"0\" x2=\"320\" y2=\"1080\" stroke=\"#FFFFFF\" stroke-opacity=\"0.02\" stroke-width=\"1\"/>\n    <line x1=\"640\" y1=\"0\" x2=\"640\" y2=\"1080\" stroke=\"#FFFFFF\" stroke-opacity=\"0.02\" stroke-width=\"1\"/>\n    <line x1=\"960\" y1=\"0\" x2=\"960\" y2=\"1080\" stroke=\"#FFFFFF\" stroke-opacity=\"0.03\" stroke-width=\"1\"/>\n    <line x1=\"1280\" y1=\"0\" x2=\"1280\" y2=\"1080\" stroke=\"#FFFFFF\" stroke-opacity=\"0.02\" stroke-width=\"1\"/>\n    <line x1=\"1600\" y1=\"0\" x2=\"1600\" y2=\"1080\" stroke=\"#FFFFFF\" stroke-opacity=\"0.02\" stroke-width=\"1\"/>\n  </g>\n  <rect x=\"120\" y=\"110\" width=\"1680\" height=\"860\" rx=\"24\" stroke=\"#FFFFFF\" stroke-opacity=\"0.05\" stroke-width=\"1.5\"/>\n</svg>\n", 'utf8'),
  },
  'bestplay-config_Version10.html': {
    mime: 'text/html; charset=utf-8',
    data: Buffer.from("<!DOCTYPE html>\n<html lang=\"el\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>BestPlay Config — Version 10 (Όλα με RD+ & 1-Stream Auto-Play)</title>\n  <style>\n    :root {\n      --bg: #0b0c10;\n      --surface: #14161f;\n      --card: #1a1d28;\n      --card-hover: #222635;\n      --border: #292d3e;\n      --accent: #e50914;\n      --accent-hover: #f40612;\n      --accent-glow: rgba(229, 9, 20, 0.3);\n      --text: #f8fafc;\n      --muted: #94a3b8;\n      --green: #10b981;\n      --green-bg: rgba(16, 185, 129, 0.14);\n      --blue: #38bdf8;\n      --amber: #f59e0b;\n      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n    }\n\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n\n    body {\n      background-color: var(--bg);\n      background-image: \n        radial-gradient(circle at 90% 10%, rgba(229, 9, 20, 0.12), transparent 40%),\n        radial-gradient(circle at 10% 90%, rgba(56, 189, 248, 0.08), transparent 40%);\n      color: var(--text);\n      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      min-height: 100vh;\n      padding: 32px 16px;\n      line-height: 1.5;\n    }\n\n    .container { max-width: 1020px; margin: 0 auto; }\n\n    header {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 24px 28px;\n      margin-bottom: 24px;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 16px;\n      box-shadow: 0 10px 30px rgba(0,0,0,0.4);\n    }\n\n    .header-info h1 {\n      font-size: 1.7rem;\n      font-weight: 800;\n      color: #ffffff;\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      letter-spacing: -0.02em;\n    }\n\n    .header-info p {\n      color: var(--muted);\n      font-size: 0.9rem;\n      margin-top: 4px;\n    }\n\n    .badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      padding: 6px 14px;\n      border-radius: 9999px;\n      font-size: 0.8rem;\n      font-weight: 700;\n      letter-spacing: 0.03em;\n      text-transform: uppercase;\n      background: var(--accent-glow);\n      color: #ff4d58;\n      border: 1px solid rgba(229, 9, 20, 0.4);\n    }\n\n    .card {\n      background: var(--surface);\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 24px;\n      margin-bottom: 24px;\n      box-shadow: 0 4px 20px rgba(0,0,0,0.3);\n    }\n\n    .card-title {\n      font-size: 1.2rem;\n      font-weight: 700;\n      color: #ffffff;\n      margin-bottom: 16px;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n\n    label {\n      display: block;\n      font-size: 0.85rem;\n      font-weight: 600;\n      color: var(--muted);\n      margin-bottom: 6px;\n    }\n\n    .input-group {\n      margin-bottom: 20px;\n    }\n\n    input[type=\"text\"] {\n      width: 100%;\n      padding: 14px 16px;\n      background: #090a0e;\n      border: 2px solid var(--border);\n      border-radius: 12px;\n      color: #ffffff;\n      font-family: var(--font-mono);\n      font-size: 1rem;\n      outline: none;\n      transition: border-color 0.2s, box-shadow 0.2s;\n    }\n\n    input[type=\"text\"]:focus {\n      border-color: var(--accent);\n      box-shadow: 0 0 0 3px var(--accent-glow);\n    }\n\n    .token-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-top: 8px;\n      font-size: 0.82rem;\n    }\n\n    .token-row a {\n      color: var(--blue);\n      text-decoration: none;\n      font-weight: 600;\n    }\n\n    .token-row a:hover {\n      text-decoration: underline;\n    }\n\n    .saved-badge {\n      color: var(--green);\n      font-size: 0.8rem;\n      font-weight: 700;\n    }\n\n    /* Provider Selector Tabs */\n    .provider-tabs {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n      gap: 12px;\n      margin-bottom: 20px;\n    }\n\n    .tab-btn {\n      background: var(--card);\n      border: 2px solid var(--border);\n      border-radius: 12px;\n      padding: 14px;\n      cursor: pointer;\n      text-align: left;\n      transition: all 0.2s;\n    }\n\n    .tab-btn:hover {\n      background: var(--card-hover);\n      border-color: #3b4256;\n    }\n\n    .tab-btn.active {\n      border-color: var(--accent);\n      background: linear-gradient(180deg, rgba(229, 9, 20, 0.14) 0%, var(--card) 100%);\n      box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);\n    }\n\n    .tab-btn .tab-name {\n      font-weight: 700;\n      color: #fff;\n      font-size: 0.95rem;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      gap: 4px;\n    }\n\n    .tab-btn .tab-sub {\n      font-size: 0.74rem;\n      color: var(--muted);\n      margin-top: 5px;\n      line-height: 1.35;\n    }\n\n    .pill-rd {\n      background: var(--green-bg);\n      border: 1px solid rgba(16, 185, 129, 0.4);\n      color: var(--green);\n      padding: 2px 7px;\n      border-radius: 9999px;\n      font-size: 0.68rem;\n      font-weight: 800;\n      white-space: nowrap;\n    }\n\n    /* Output Box */\n    .output-section {\n      background: #090a0f;\n      border: 1px solid #1c202d;\n      border-radius: 14px;\n      padding: 20px;\n      margin-bottom: 20px;\n    }\n\n    .output-label {\n      font-size: 0.82rem;\n      font-weight: 700;\n      color: var(--muted);\n      margin-bottom: 8px;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 6px;\n    }\n\n    .url-display {\n      background: #050608;\n      border: 1px solid #232838;\n      border-radius: 8px;\n      padding: 14px;\n      font-family: var(--font-mono);\n      font-size: 0.8rem;\n      color: #93c5fd;\n      word-break: break-all;\n      margin-bottom: 16px;\n      user-select: all;\n    }\n\n    .btn-group {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 10px;\n    }\n\n    .btn {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      gap: 8px;\n      padding: 12px 20px;\n      border-radius: 10px;\n      font-size: 0.9rem;\n      font-weight: 700;\n      cursor: pointer;\n      border: none;\n      text-decoration: none;\n      transition: all 0.15s;\n    }\n\n    .btn:active { transform: scale(0.98); }\n\n    .btn-install {\n      background: var(--accent);\n      color: #ffffff;\n      box-shadow: 0 4px 16px var(--accent-glow);\n    }\n    .btn-install:hover { background: var(--accent-hover); }\n\n    .btn-app {\n      background: #0284c7;\n      color: #ffffff;\n    }\n    .btn-app:hover { background: #0369a1; }\n\n    .btn-copy {\n      background: #1e2230;\n      color: #e2e8f0;\n      border: 1px solid var(--border);\n    }\n    .btn-copy:hover { background: #2b3145; color: #ffffff; }\n\n    .btn-download {\n      background: #12151d;\n      color: #f59e0b;\n      border: 1px solid rgba(245, 158, 11, 0.4);\n    }\n    .btn-download:hover { background: rgba(245, 158, 11, 0.15); }\n\n    /* All Streams RD List */\n    .stream-row {\n      background: var(--card);\n      border: 1px solid var(--border);\n      border-radius: 12px;\n      padding: 16px;\n      margin-bottom: 12px;\n      display: flex;\n      flex-direction: column;\n      gap: 10px;\n    }\n\n    .stream-row.primary {\n      border-color: rgba(229, 9, 20, 0.55);\n      background: linear-gradient(90deg, rgba(229, 9, 20, 0.08) 0%, var(--card) 100%);\n    }\n\n    .stream-row-top {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n\n    .stream-row-title {\n      font-weight: 700;\n      color: #fff;\n      font-size: 0.98rem;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n    .info-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 16px;\n      margin-top: 24px;\n    }\n    @media (min-width: 768px) {\n      .info-grid { grid-template-columns: 1fr 1fr; }\n    }\n\n    .info-card {\n      background: #11141e;\n      border: 1px solid #1e2433;\n      border-radius: 12px;\n      padding: 16px 20px;\n      font-size: 0.85rem;\n    }\n    .info-card h4 { color: #fff; font-size: 0.95rem; margin-bottom: 8px; }\n    .info-card p, .info-card li { color: #94a3b8; line-height: 1.5; }\n    .info-card ul { margin-left: 18px; margin-top: 6px; }\n\n    .toast {\n      position: fixed;\n      bottom: 24px;\n      right: 24px;\n      background: #10b981;\n      color: #fff;\n      padding: 14px 22px;\n      border-radius: 10px;\n      font-weight: 700;\n      box-shadow: 0 10px 30px rgba(0,0,0,0.5);\n      transform: translateY(100px);\n      opacity: 0;\n      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n      z-index: 9999;\n    }\n    .toast.show { transform: translateY(0); opacity: 1; }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <header>\n      <div class=\"header-info\">\n        <h1><span>🎬</span> BestPlay Config — Version 10</h1>\n        <p>Όλα τα Streams με Real-Debrid [RD+] & Ακριβώς 1 Stream (Άμεσο Auto-Play)</p>\n      </div>\n      <div><span class=\"badge\">ALL STREAMS RD+ · 1 STREAM TOTAL</span></div>\n    </header>\n\n    <!-- STEP 1: REAL-DEBRID KEY -->\n    <div class=\"card\">\n      <div class=\"card-title\">\n        <span>🔑 1. Real-Debrid API Key (Ενεργοποιεί το RD+ σε ΟΛΑ τα Streams)</span>\n        <span class=\"saved-badge\" id=\"storageStatus\">💾 Αποθηκεύεται αυτόματα (localStorage)</span>\n      </div>\n      <div class=\"input-group\">\n        <label for=\"rdKey\">Επικολλήστε το API Token σας μία φορά εδώ:</label>\n        <input \n          type=\"text\" \n          id=\"rdKey\" \n          placeholder=\"π.χ. ABCDEFGHIJKLMNOPQRSTUVWXYZ123456\" \n          autocomplete=\"off\" \n          spellcheck=\"false\" \n        />\n        <div class=\"token-row\">\n          <span style=\"color:#cbd5e1;\">Μόλις βάλετε το κλειδί, <strong>όλα τα παρακάτω Addons</strong> αποκτούν αυτόματα Real-Debrid [RD+] και όριο <strong>1 μοναδικό stream</strong>!</span>\n          <a href=\"https://real-debrid.com/apitoken\" target=\"_blank\" rel=\"noopener noreferrer\">\n            Βρείτε το κλειδί σας στο real-debrid.com ↗\n          </a>\n        </div>\n      </div>\n\n      <!-- STEP 2: SELECT PROVIDER OR VIEW ALL -->\n      <div class=\"card-title\" style=\"margin-top: 28px;\">\n        <span>⚡ 2. Επιλογή Addon (Όλα με Real-Debrid & 1 Stream)</span>\n      </div>\n\n      <div style=\"background:#141d19; border:1px solid rgba(16, 185, 129, 0.4); border-radius:12px; padding:14px 18px; margin-bottom:18px; font-size:0.86rem; color:#d1fae5;\">\n        <strong>🎯 Πώς θα βγαίνει ΜΟΝΟ 1 STREAM και θα παίζει απευθείας:</strong><br/>\n        Το <strong>#1 (BestPlay Torrentio RD)</strong> χρησιμοποιεί την ειδική φόρμουλα <code>sort=size|limit=1|qualityfilter=threed,720p,480p,other,scr,cam,unknown|debridoptions=nodownloadlinks,nocatalog</code>. Σε αντίθεση με το απλό <code>sort=qualitysize</code> (που βγάζει 1 ανά ανάλυση, άρα 4-7 αρχεία), εδώ το Stremio επιστρέφει <strong>ΑΚΡΙΒΩΣ 1 ΑΡΧΕΙΟ ΣΥΝΟΛΙΚΑ</strong> (το κορυφαίο 4K/1080p [RD+]), χωρίς ρωσικές/γαλλικές μεταγλωττίσεις, ώστε να μπαίνει και να παίζει αμέσως!\n      </div>\n\n      <div class=\"provider-tabs\">\n        <button type=\"button\" class=\"tab-btn active\" onclick=\"selectProvider('torrentio')\" id=\"tab-torrentio\">\n          <div class=\"tab-name\">\n            <span>👑 1. Torrentio RD</span>\n            <span class=\"pill-rd\">1 STREAM [RD+]</span>\n          </div>\n          <div class=\"tab-sub\">Ακριβώς 1 αρχείο συνολικά (Κορυφαίο 4K/1080p Remux, No Dubs, Instant Play)</div>\n        </button>\n\n        <button type=\"button\" class=\"tab-btn\" onclick=\"selectProvider('comet')\" id=\"tab-comet\">\n          <div class=\"tab-name\">\n            <span>🌠 2. Comet RD</span>\n            <span class=\"pill-rd\">RD+ CACHED</span>\n          </div>\n          <div class=\"tab-sub\">Max 1 stream, μόνο Cached RD+, αποκλεισμός ξένων dubs & 720p/480p</div>\n        </button>\n\n        <button type=\"button\" class=\"tab-btn\" onclick=\"selectProvider('meteor')\" id=\"tab-meteor\">\n          <div class=\"tab-name\">\n            <span>☄️ 3. Meteor RD</span>\n            <span class=\"pill-rd\">MAX=1 RD+</span>\n          </div>\n          <div class=\"tab-sub\">maxResults=1, cachedOnly=true, allowP2P=false, Real-Debrid ενεργό</div>\n        </button>\n\n        <button type=\"button\" class=\"tab-btn\" onclick=\"selectProvider('torz')\" id=\"tab-torz\">\n          <div class=\"tab-name\">\n            <span>⚡ 4. StremThru Torz</span>\n            <span class=\"pill-rd\">TORZ RD+</span>\n          </div>\n          <div class=\"tab-sub\">Crowdsourced Torznab συνδεδεμένο απευθείας με το Real-Debrid σας</div>\n        </button>\n\n        <button type=\"button\" class=\"tab-btn\" onclick=\"selectProvider('sootio')\" id=\"tab-sootio\">\n          <div class=\"tab-name\">\n            <span>🔍 5. Sootio [RD+]</span>\n            <span class=\"pill-rd\">[RD+] ACTIVE</span>\n          </div>\n          <div class=\"tab-sub\">Tiered Debrid Search με προτεραιότητα στο #1 υψηλότερης ποιότητας αρχείο</div>\n        </button>\n      </div>\n\n      <!-- ACTIVE SELECTED PROVIDER BOX -->\n      <div class=\"output-section\">\n        <div class=\"output-label\">\n          <span>Επιλεγμένο Addon: <strong id=\"activeProviderName\" style=\"color:#fff;\">👑 1. BestPlay Torrentio RD (1 Μοναδικό Stream)</strong></span>\n          <span id=\"rdStatusDisplay\" style=\"color:var(--green); font-weight:800;\"></span>\n        </div>\n        <div class=\"url-display\" id=\"generatedUrl\">https://torrentio.strem.fun/manifest.json</div>\n\n        <div class=\"btn-group\">\n          <a href=\"#\" id=\"webInstallBtn\" target=\"_blank\" class=\"btn btn-install\">\n            🌐 1-Click Εγκατάσταση στο Stremio Web\n          </a>\n          <a href=\"#\" id=\"appInstallBtn\" class=\"btn btn-app\">\n            💻 Άνοιγμα σε Stremio App\n          </a>\n          <button type=\"button\" class=\"btn btn-copy\" onclick=\"copyCurrentUrl()\">\n            📋 Αντιγραφή URL\n          </button>\n          <button type=\"button\" class=\"btn btn-download\" onclick=\"downloadCurrentHtml()\">\n            📥 Αποθήκευση Αρχείου (Με το Key μου)\n          </button>\n        </div>\n      </div>\n\n      <!-- ALL 5 RD+ STREAMS AT A GLANCE -->\n      <div style=\"margin-top: 28px;\">\n        <h3 style=\"font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:12px;\">\n          📋 Όλα τα 5 Streams με ενσωματωμένο Real-Debrid [RD+] (Έτοιμα Links):\n        </h3>\n\n        <!-- 1. Torrentio RD -->\n        <div class=\"stream-row primary\">\n          <div class=\"stream-row-top\">\n            <div class=\"stream-row-title\">\n              <span>👑 1. Torrentio RD (BestPlay 1-Stream Formula)</span>\n              <span class=\"pill-rd\">ΑΚΡΙΒΩΣ 1 STREAM · RD+</span>\n            </div>\n            <div class=\"btn-group\">\n              <a href=\"#\" id=\"row-web-torrentio\" target=\"_blank\" class=\"btn btn-install\" style=\"padding:8px 14px; font-size:0.8rem;\">🌐 Εγκατάσταση Web</a>\n              <button type=\"button\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\" onclick=\"copyById('row-url-torrentio')\">📋 Αντιγραφή</button>\n            </div>\n          </div>\n          <div class=\"url-display\" id=\"row-url-torrentio\" style=\"margin-bottom:0; padding:10px; font-size:0.75rem;\"></div>\n        </div>\n\n        <!-- 2. Comet RD -->\n        <div class=\"stream-row\">\n          <div class=\"stream-row-top\">\n            <div class=\"stream-row-title\">\n              <span>🌠 2. Comet | ElfHosted | RD (1-Stream Cached)</span>\n              <span class=\"pill-rd\">RD+ ENABLED</span>\n            </div>\n            <div class=\"btn-group\">\n              <a href=\"#\" id=\"row-web-comet\" target=\"_blank\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\">🌐 Εγκατάσταση Web</a>\n              <button type=\"button\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\" onclick=\"copyById('row-url-comet')\">📋 Αντιγραφή</button>\n            </div>\n          </div>\n          <div class=\"url-display\" id=\"row-url-comet\" style=\"margin-bottom:0; padding:10px; font-size:0.75rem;\"></div>\n        </div>\n\n        <!-- 3. Meteor RD -->\n        <div class=\"stream-row\">\n          <div class=\"stream-row-top\">\n            <div class=\"stream-row-title\">\n              <span>☄️ 3. Meteor RD (maxResults=1 · Cached RD Only)</span>\n              <span class=\"pill-rd\">RD+ ENABLED</span>\n            </div>\n            <div class=\"btn-group\">\n              <a href=\"#\" id=\"row-web-meteor\" target=\"_blank\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\">🌐 Εγκατάσταση Web</a>\n              <button type=\"button\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\" onclick=\"copyById('row-url-meteor')\">📋 Αντιγραφή</button>\n            </div>\n          </div>\n          <div class=\"url-display\" id=\"row-url-meteor\" style=\"margin-bottom:0; padding:10px; font-size:0.75rem;\"></div>\n        </div>\n\n        <!-- 4. StremThru Torz RD -->\n        <div class=\"stream-row\">\n          <div class=\"stream-row-top\">\n            <div class=\"stream-row-title\">\n              <span>⚡ 4. StremThru Torz — RD (Cached Debrid Store)</span>\n              <span class=\"pill-rd\">RD+ ENABLED</span>\n            </div>\n            <div class=\"btn-group\">\n              <a href=\"#\" id=\"row-web-torz\" target=\"_blank\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\">🌐 Εγκατάσταση Web</a>\n              <button type=\"button\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\" onclick=\"copyById('row-url-torz')\">📋 Αντιγραφή</button>\n            </div>\n          </div>\n          <div class=\"url-display\" id=\"row-url-torz\" style=\"margin-bottom:0; padding:10px; font-size:0.75rem;\"></div>\n        </div>\n\n        <!-- 5. Sootio [RD+] -->\n        <div class=\"stream-row\">\n          <div class=\"stream-row-top\">\n            <div class=\"stream-row-title\">\n              <span>🔍 5. [RD+] Sootio (Smart Debrid Companion)</span>\n              <span class=\"pill-rd\">RD+ ENABLED</span>\n            </div>\n            <div class=\"btn-group\">\n              <a href=\"#\" id=\"row-web-sootio\" target=\"_blank\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\">🌐 Εγκατάσταση Web</a>\n              <button type=\"button\" class=\"btn btn-copy\" style=\"padding:8px 14px; font-size:0.8rem;\" onclick=\"copyById('row-url-sootio')\">📋 Αντιγραφή</button>\n            </div>\n          </div>\n          <div class=\"url-display\" id=\"row-url-sootio\" style=\"margin-bottom:0; padding:10px; font-size:0.75rem;\"></div>\n        </div>\n      </div>\n\n      <div style=\"background:#131826; border:1px solid #1e3a8a; border-radius:12px; padding:14px 18px; margin-top:18px; font-size:0.86rem; color:#bfdbfe;\">\n        <strong>💡 Σημαντική Συμβουλή για να βγαίνει ΜΟΝΟ 1 STREAM στην οθόνη σας:</strong><br/>\n        Στο Stremio, <strong>απεγκαταστήστε (Uninstall)</strong> τυχόν παλιά addons που είχατε χωρίς φίλτρα και εγκαταστήστε το <strong>#1 (Torrentio RD - 1 Stream)</strong>. Έτσι, όταν πατάτε σε μια ταινία ή επεισόδιο, θα υπάρχει <strong>μόνο 1 κορυφαίο αρχείο [RD+]</strong> και θα ξεκινάει αμέσως!\n      </div>\n    </div>\n\n    <div class=\"info-grid\">\n      <div class=\"info-card\">\n        <h4>🔊 Επίλυση Σιγής Ήχου σε 4K (EON Box)</h4>\n        <p>Αν σε 4K Remux ταινίες δεν ακούγεται ήχος:</p>\n        <ul>\n          <li><strong>Στο Player:</strong> Επιλέξτε το 2ο κανάλι ήχου <em>[EAC3 5.1]</em> ή <em>[AC3 5.1]</em> αντί για TrueHD 7.1.</li>\n          <li><strong>Στο Stremio:</strong> Settings → Player → Απενεργοποιήστε το <em>«Tunneled Playback»</em> και ενεργοποιήστε το <em>«Auto-play next episode»</em>.</li>\n        </ul>\n      </div>\n\n      <div class=\"info-card\">\n        <h4>📝 Καθαροί Ελληνικοί Υπότιτλοι</h4>\n        <p>Για άψογους υπότιτλους χωρίς παρενθέσεις:</p>\n        <ul>\n          <li>Ρυθμίστε στο Stremio: <strong>Default Language: Greek</strong>.</li>\n          <li>Εγκαταστήστε τα addons <strong>OpenSubtitles v3</strong> και <strong>SubDL</strong>.</li>\n          <li>Επιλέξτε υπότιτλο χωρίς την ένδειξη [CC] (Closed Captions).</li>\n        </ul>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"toast\" id=\"toast\">Αντιγράφηκε στο πρόχειρο!</div>\n\n  <script>\n    function safeBtoa(str) {\n      try {\n        return btoa(unescape(encodeURIComponent(str)));\n      } catch (e) {\n        return btoa(str);\n      }\n    }\n\n    function safeBtoaUrl(str) {\n      return safeBtoa(str).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/g, '');\n    }\n\n    let currentProvider = 'torrentio';\n\n    function showToast(msg) {\n      const t = document.getElementById('toast');\n      t.textContent = msg;\n      t.classList.add('show');\n      setTimeout(() => t.classList.remove('show'), 2500);\n    }\n\n    function buildAllProviderUrls(key) {\n      const engProviders = 'yts,eztv,rarbg,1337x,ext,thepiratebay,kickasstorrents,torrentgalaxy,magnetdl,horriblesubs,nyaasi,tokyotosho,anidex,nekobt';\n      const torrentioUrl = key\n        ? 'https://torrentio.strem.fun/providers=' + engProviders + '|sort=size|qualityfilter=threed,720p,480p,other,scr,cam,unknown|limit=1|debridoptions=nodownloadlinks,nocatalog|realdebrid=' + key + '/manifest.json'\n        : 'https://torrentio.strem.fun/providers=' + engProviders + '|sort=size|qualityfilter=threed,720p,480p,other,scr,cam,unknown|limit=1/manifest.json';\n\n      let cometUrl = 'https://comet.elfhosted.com/manifest.json';\n      if (key) {\n        const cometCfg = {\n          maxResultsPerResolution: 1,\n          maxSize: 0,\n          cachedOnly: true,\n          sortCachedUncachedTogether: false,\n          removeTrash: true,\n          resultFormat: ['all'],\n          debridServices: [{ service: 'realdebrid', apiKey: key }],\n          enableTorrent: false,\n          deduplicateStreams: true,\n          scrapeDebridAccountTorrents: false,\n          debridStreamProxyPassword: '',\n          languages: {\n            required: [],\n            allowed: [],\n            exclude: ['ru', 'fr', 'es', 'de', 'it', 'pt', 'pl', 'hi', 'tr', 'ar'],\n            preferred: ['el', 'en']\n          },\n          resolutions: {\n            r1440p: false,\n            r720p: false,\n            r576p: false,\n            r480p: false,\n            r360p: false,\n            r240p: false,\n            unknown: false\n          },\n          options: {\n            remove_ranks_under: -10000000000,\n            allow_english_in_languages: true,\n            remove_unknown_languages: false\n          }\n        };\n        cometUrl = 'https://comet.elfhosted.com/' + safeBtoa(JSON.stringify(cometCfg)) + '/manifest.json';\n      }\n\n      let meteorUrl = 'https://meteorfortheweebs.midnightignite.me/manifest.json';\n      if (key) {\n        const meteorCfg = {\n          services: [{ name: 'realdebrid', apiKey: key }],\n          cachedOnly: true,\n          removeTrash: true,\n          removeSamples: true,\n          exclude3D: true,\n          maxResults: 1,\n          maxPerResolution: 1,\n          allowP2P: false\n        };\n        meteorUrl = 'https://meteorfortheweebs.midnightignite.me/' + safeBtoaUrl(JSON.stringify(meteorCfg)) + '/manifest.json';\n      }\n\n      let torzUrl = 'https://stremthru.13377001.xyz/stremio/torz/manifest.json';\n      if (key) {\n        const torzCfg = {\n          stores: [{ c: 'rd', t: key }],\n          cached: true\n        };\n        torzUrl = 'https://stremthru.13377001.xyz/stremio/torz/' + safeBtoa(JSON.stringify(torzCfg)) + '/manifest.json';\n      }\n\n      let sootioUrl = 'https://sooti.info/manifest.json';\n      if (key) {\n        const sootioCfg = {\n          DebridServices: [{ provider: 'RealDebrid', apiKey: key }],\n          DebridProvider: 'RealDebrid',\n          DebridApiKey: key,\n          ScrapersConfigured: true,\n          minSize: 0,\n          maxSize: 200,\n          ShowCatalog: false\n        };\n        sootioUrl = 'https://sooti.info/' + encodeURIComponent(JSON.stringify(sootioCfg)) + '/manifest.json';\n      }\n\n      return {\n        torrentio: torrentioUrl,\n        comet: cometUrl,\n        meteor: meteorUrl,\n        torz: torzUrl,\n        sootio: sootioUrl\n      };\n    }\n\n    function selectProvider(providerId) {\n      currentProvider = providerId;\n      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));\n      const activeBtn = document.getElementById('tab-' + providerId);\n      if (activeBtn) activeBtn.classList.add('active');\n\n      const names = {\n        torrentio: '👑 1. BestPlay Torrentio RD (Ακριβώς 1 Stream Συνολικά)',\n        comet: '🌠 2. Comet | ElfHosted | RD (1-Stream Cached)',\n        meteor: '☄️ 3. Meteor RD (maxResults=1 · Cached RD+)',\n        torz: '⚡ 4. StremThru Torz — RD (Real-Debrid Store)',\n        sootio: '🔍 5. [RD+] Sootio (Smart Tiered Debrid)'\n      };\n      document.getElementById('activeProviderName').textContent = names[providerId] || providerId;\n      updateUrls();\n    }\n\n    function updateUrls() {\n      const keyInput = document.getElementById('rdKey');\n      const key = keyInput.value.trim();\n\n      if (key) {\n        localStorage.setItem('bestplay_rd_key', key);\n        document.getElementById('storageStatus').textContent = '💾 Το Real-Debrid Key αποθηκεύτηκε (Ενεργό σε όλα)!';\n      } else {\n        document.getElementById('storageStatus').textContent = '⚠️ Εισάγετε το Real-Debrid Key σας για ενεργοποίηση RD+';\n      }\n\n      const urls = buildAllProviderUrls(key);\n      const activeUrl = urls[currentProvider];\n\n      const statusEl = document.getElementById('rdStatusDisplay');\n      if (statusEl) {\n        statusEl.textContent = key\n          ? '🟢 REAL-DEBRID [RD+] ΕΝΕΡΓΟ · 1 MONO STREAM'\n          : '⚠️ Συμπληρώστε το Real-Debrid Key παραπάνω';\n        statusEl.style.color = key ? 'var(--green)' : 'var(--amber)';\n      }\n\n      document.getElementById('generatedUrl').textContent = activeUrl;\n      document.getElementById('webInstallBtn').href = 'https://web.stremio.com/#/addons?addon=' + encodeURIComponent(activeUrl);\n      document.getElementById('appInstallBtn').href = activeUrl.replace(/^https?:\\/\\//i, 'stremio://');\n\n      ['torrentio', 'comet', 'meteor', 'torz', 'sootio'].forEach(id => {\n        const u = urls[id];\n        const urlEl = document.getElementById('row-url-' + id);\n        const webEl = document.getElementById('row-web-' + id);\n        if (urlEl) urlEl.textContent = u;\n        if (webEl) webEl.href = 'https://web.stremio.com/#/addons?addon=' + encodeURIComponent(u);\n      });\n    }\n\n    function copyCurrentUrl() {\n      const text = document.getElementById('generatedUrl').textContent;\n      navigator.clipboard.writeText(text).then(() => {\n        showToast('✅ Το URL αντιγράφηκε επιτυχώς!');\n      });\n    }\n\n    function copyById(elId) {\n      const text = document.getElementById(elId).textContent;\n      navigator.clipboard.writeText(text).then(() => {\n        showToast('✅ Το RD+ URL αντιγράφηκε!');\n      });\n    }\n\n    function downloadCurrentHtml() {\n      const key = document.getElementById('rdKey').value.trim();\n      let html = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;\n      html = html.replace(/id=\"rdKey\"([^>]*)value=\"[^\"]*\"/, 'id=\"rdKey\"$1value=\"' + key + '\"');\n      if (!html.includes('value=\"' + key + '\"')) {\n        html = html.replace('id=\"rdKey\"', 'id=\"rdKey\" value=\"' + key + '\"');\n      }\n\n      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });\n      const a = document.createElement('a');\n      a.href = URL.createObjectURL(blob);\n      a.download = 'bestplay-config_Version10.html';\n      document.body.appendChild(a);\n      a.click();\n      document.body.removeChild(a);\n      showToast('📥 Το bestplay-config_Version10.html κατέβηκε με το κλειδί σας!');\n    }\n\n    window.addEventListener('DOMContentLoaded', () => {\n      const savedKey = localStorage.getItem('bestplay_rd_key');\n      if (savedKey) {\n        document.getElementById('rdKey').value = savedKey;\n      }\n      document.getElementById('rdKey').addEventListener('input', updateUrls);\n      updateUrls();\n    });\n  </script>\n</body>\n</html>\n", 'utf8'),
  },
};

const MIME_TYPES = {
  '.svg': 'image/svg+xml; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const STATIC_ALIASES = {
  '/logo-256.svg': 'logo-256.svg',
  '/background-1920.svg': 'background-1920.svg',
  '/bestplay-config_Version10.html': 'bestplay-config_Version10.html',
  '/bestplay-config_Version10': 'bestplay-config_Version10.html',
  '/bestplay-config-v10.html': 'bestplay-config_Version10.html',
  '/bestplay-stremio.html': 'bestplay-config_Version10.html',
  '/bestplay-stremio': 'bestplay-config_Version10.html',
};

// ---------------- Env & Production Defaults ----------------

const DEFAULT_ROOT_DIR = __dirname;

let envLoaded = false;

/**
 * Loads environment variables from `.env` (using dotenv if installed, plus a zero-dependency parser)
 * without overwriting variables already set in `process.env`.
 */
async function loadEnv(rootDir = DEFAULT_ROOT_DIR) {
  if (envLoaded) return;
  envLoaded = true;

  const envPath = path.join(rootDir, '.env');
  try {
    const dotenvModule = await import('dotenv').catch(() => null);
    if (dotenvModule && typeof dotenvModule.config === 'function' && fs.existsSync(envPath)) {
      dotenvModule.config({ path: envPath });
      return;
    }
  } catch {
    // Fall back to lightweight parser when node_modules/dotenv is not installed
  }

  if (!fs.existsSync(envPath)) return;

  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx <= 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore unreadable .env
  }
}

function parseIntSetting(rawValue, fallback) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return fallback;
  }
  const parsed = Number.parseInt(String(rawValue).trim(), 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/**
 * Returns sanitized server and addon configuration derived from environment variables.
 */
function getConfig() {
  const port = parseIntSetting(process.env.PORT, 3000) || 3000;
  const isProdEnv = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
  const secondaryPort = parseIntSetting(process.env.SECONDARY_PORT, isProdEnv ? 0 : 7000);
  const rawAppUrl = (process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || '').trim();
  const appUrl = rawAppUrl && !rawAppUrl.includes('MY_APP_URL') ? rawAppUrl.replace(/\/+$/, '') : '';
  const tunnelUrl = (process.env.TUNNEL_URL || '').trim().replace(/\/+$/, '');
  const debridProvider = (process.env.DEBRID_PROVIDER || 'realdebrid').trim().toLowerCase() || 'realdebrid';
  const debridApiKey = (process.env.DEBRID_API_KEY || '').trim();
  const cacheTtlSeconds = Math.max(10, parseIntSetting(process.env.CACHE_TTL_SECONDS, 300));
  const httpTimeoutMs = Math.max(500, Math.min(6000, parseIntSetting(process.env.HTTP_TIMEOUT_MS, 4500)));
  const parsedMaxSize = Number.parseFloat(String(process.env.MAX_STREAM_SIZE_GB || '').trim());
  const maxStreamSizeGb = Number.isFinite(parsedMaxSize) && parsedMaxSize > 0 ? parsedMaxSize : 22;
  const maxStreamResults = Math.max(1, parseIntSetting(process.env.MAX_STREAM_RESULTS, 1) || 1);

  return {
    port,
    secondaryPort,
    appUrl,
    tunnelUrl,
    debridProvider,
    debridApiKey,
    cacheTtlSeconds,
    httpTimeoutMs,
    maxStreamSizeGb,
    maxStreamResults,
  };
}


// ---------------- Cache & HTTP Client ----------------
/**
 * In-memory LRU + TTL cache for Stremio Addon resource responses.
 */
class AddonCache {
  constructor({ maxEntries = 500, defaultTtlMs = 300_000 } = {}) {
    this.maxEntries = maxEntries;
    this.defaultTtlMs = defaultTtlMs;
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return undefined;
    }

    // Refresh insertion order for true LRU eviction
    this.store.delete(key);
    this.store.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
      }
    }

    const effectiveTtl = Math.max(1000, Number(ttlMs) || this.defaultTtlMs);
    this.store.set(key, {
      value,
      expiresAt: Date.now() + effectiveTtl,
    });
  }

  del(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  getStats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

function getCacheControlHeader(resource) {
  switch (resource) {
    case 'manifest':
      return 'public, max-age=3600, stale-while-revalidate=86400';
    case 'catalog':
    case 'meta':
      return 'public, max-age=900, stale-while-revalidate=3600';
    case 'stream':
    case 'subtitles':
    default:
      return 'public, max-age=300, stale-while-revalidate=600';
  }
}



const execFileAsync = promisify(execFile);

function requestTextNative(url, { signal, headers = {}, redirectsLeft = 3 }) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;

    const req = transport.request(
      parsed,
      {
        method: 'GET',
        signal,
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'identity',
          'User-Agent': 'BestPlay-Stremio-Addon/10.0',
          ...headers,
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const nextUrl = new URL(res.headers.location, parsed).toString();
          requestTextNative(nextUrl, {
            signal,
            headers,
            redirectsLeft: redirectsLeft - 1,
          }).then(resolve, reject);
          return;
        }

        if (status < 200 || status >= 300) {
          res.resume();
          resolve(null);
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      }
    );

    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetches JSON from an external HTTP/HTTPS URL guarded by a strict AbortController timeout (max 6000ms).
 * Follows redirects cleanly and falls back on Windows stremio-runtime TLS errors to curl.exe within the same budget.
 */
async function fetchJsonWithTimeout(
  url,
  { timeoutMs = 4500, headers = {}, simulateTimeout = false } = {}
) {
  const effectiveTimeout = Math.max(100, Math.min(Number(timeoutMs) || 4500, 6000));
  const controller = new AbortController();
  const abortTimer = setTimeout(
    () => controller.abort(),
    simulateTimeout ? Math.min(effectiveTimeout, 120) : effectiveTimeout
  );

  try {
    if (simulateTimeout) {
      await new Promise((_, reject) => {
        controller.signal.addEventListener(
          'abort',
          () => reject(new Error('Simulated upstream timeout via AbortController')),
          { once: true }
        );
      });
      return null;
    }

    const raw = await requestTextNative(url, {
      signal: controller.signal,
      headers,
    });
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  } catch (err) {
    const msg = String(err?.message || err || '').toLowerCase();
    const isSimulated = simulateTimeout || msg.includes('simulated upstream timeout');
    const isCertOrTls =
      msg.includes('certificate') || msg.includes('unable to verify') || msg.includes('self signed');

    if (!isSimulated && process.platform === 'win32' && isCertOrTls) {
      try {
        const curlMaxSec = String(Math.max(1, Math.min(6, Math.ceil(effectiveTimeout / 1000))));
        const { stdout } = await execFileAsync(
          'curl.exe',
          ['-sS', '-L', '--max-time', curlMaxSec, '-H', 'Accept: application/json', url],
          {
            timeout: effectiveTimeout,
            maxBuffer: 4 * 1024 * 1024,
            windowsHide: true,
          }
        );
        return stdout ? JSON.parse(stdout) : null;
      } catch {
        return null;
      }
    }
    return null;
  } finally {
    clearTimeout(abortTimer);
  }
}

function probeVideoNative(url, { signal, redirectsLeft = 5 }) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;

    const req = transport.request(
      parsed,
      {
        method: 'GET',
        signal,
        headers: {
          Range: 'bytes=0-1023',
          'User-Agent': 'BestPlay-Stremio-Addon/10.0',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const nextUrl = new URL(res.headers.location, parsed).toString();
          probeVideoNative(nextUrl, { signal, redirectsLeft: redirectsLeft - 1 }).then(
            resolve,
            reject
          );
          return;
        }

        const contentType = String(res.headers['content-type'] || '');
        const contentRange = String(res.headers['content-range'] || '');
        const crMatch = contentRange.match(/bytes\s+\d+-\d+\/(\d+)/i);
        const contentLength = Number.parseInt(String(res.headers['content-length'] || '0'), 10) || 0;
        const totalBytes = crMatch ? Number.parseInt(crMatch[1], 10) : contentLength;

        let received = 0;
        res.on('data', (chunk) => {
          received += chunk.length;
          if (received >= 16) {
            res.destroy();
          }
        });
        const finish = () =>
          resolve({
            status,
            effectiveUrl: url,
            contentType,
            contentRange,
            totalBytes,
            bytes: received,
          });
        res.once('end', finish);
        res.once('close', finish);
      }
    );

    req.on('error', reject);
    req.end();
  });
}

function probeRedirectNative(url, { signal }) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;
    const req = transport.request(
      parsed,
      {
        method: 'HEAD',
        signal,
        headers: { 'User-Agent': 'BestPlay-Stremio-Addon/10.0' },
      },
      (res) => {
        const status = res.statusCode || 0;
        const location = res.headers.location ? new URL(res.headers.location, parsed).toString() : '';
        res.resume();
        resolve({ status, location });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

/**
 * Checks only the initial HTTP redirect Location without downloading bytes from a debrid CDN
 * (safe for cloud hosts like Render so the user's home IP streams from Real-Debrid).
 */
async function probeRedirectLocation(url, { timeoutMs = 4500 } = {}) {
  const effectiveTimeout = Math.max(500, Math.min(Number(timeoutMs) || 4500, 6000));
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), effectiveTimeout);
  try {
    return await probeRedirectNative(url, { signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(abortTimer);
  }
}

/**
 * Probes a candidate direct video URL (following up to 5 redirects) with a 1 KB byte-range request.
 * Returns { status, effectiveUrl, contentType, contentRange, totalBytes, bytes } or null on failure.
 */
async function probeVideoUrl(url, { timeoutMs = 4500 } = {}) {
  const effectiveTimeout = Math.max(500, Math.min(Number(timeoutMs) || 4500, 6000));
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), effectiveTimeout);

  try {
    return await probeVideoNative(url, { signal: controller.signal });
  } catch (err) {
    const msg = String(err?.message || err || '').toLowerCase();
    const isCertOrTls =
      msg.includes('certificate') || msg.includes('unable to verify') || msg.includes('self signed');

    if (process.platform === 'win32' && isCertOrTls) {
      try {
        const curlMaxSec = String(Math.max(1, Math.min(6, Math.ceil(effectiveTimeout / 1000))));
        const { stdout } = await execFileAsync(
          'curl.exe',
          [
            '-sS',
            '-L',
            '--max-time',
            curlMaxSec,
            '-r',
            '0-1023',
            '-D',
            '-',
            '-o',
            'NUL',
            '-w',
            '\n__DL__:%{size_download}\n__EFF__:%{url_effective}\n',
            url,
          ],
          { timeout: effectiveTimeout, encoding: 'utf8', windowsHide: true }
        );
        const statuses = stdout.match(/HTTP\/[\d.]+\s+(\d+)/g) || [];
        const status = statuses.length
          ? Number.parseInt(statuses[statuses.length - 1].split(/\s+/)[1], 10)
          : 0;
        const ctMatches = [...stdout.matchAll(/content-type:\s*([^\r\n]+)/gi)];
        const contentType = ctMatches.length ? ctMatches[ctMatches.length - 1][1].trim() : '';
        const crMatches = [...stdout.matchAll(/content-range:\s*([^\r\n]+)/gi)];
        const contentRange = crMatches.length ? crMatches[crMatches.length - 1][1].trim() : '';
        const crTotal = contentRange.match(/bytes\s+\d+-\d+\/(\d+)/i);
        const clMatches = [...stdout.matchAll(/content-length:\s*(\d+)/gi)];
        const contentLength = clMatches.length
          ? Number.parseInt(clMatches[clMatches.length - 1][1], 10)
          : 0;
        const totalBytes = crTotal ? Number.parseInt(crTotal[1], 10) : contentLength;
        const dlMatch = stdout.match(/__DL__:(\d+)/);
        const bytes = dlMatch ? Number.parseInt(dlMatch[1], 10) : 0;
        const effMatch = stdout.match(/__EFF__:([^\r\n]+)/);
        const effectiveUrl = effMatch ? effMatch[1].trim() : url;
        return { status, effectiveUrl, contentType, contentRange, totalBytes, bytes };
      } catch {
        return null;
      }
    }
    return null;
  } finally {
    clearTimeout(abortTimer);
  }
}


// ---------------- Manifest ----------------
/**
 * Generates an official Stremio Addon Protocol v3 manifest for a dynamic request origin.
 */
function buildManifest(originUrl = 'http://localhost:3000') {
  const cleanOrigin = String(originUrl || 'http://localhost:3000').replace(/\/+$/, '');

  return {
    id: 'community.bestplay.universal.el',
    version: '10.0.0',
    name: 'BestPlay Universal · All Streams Optimizer (EL)',
    description:
      'Universal Aggregator & Stream Filter για ΟΛΑ τα Stremio Addons (Torrentio, Comet, Meteor, Sootio, StremThru, Torz). 100% H.264/AVC Playable Streams, αυθεντικός ήχος & συγχρονισμένοι Ελληνικοί Υπότιτλοι.',
    logo: `${cleanOrigin}/logo-256.svg`,
    background: `${cleanOrigin}/background-1920.svg`,
    types: ['movie', 'series'],
    resources: ['catalog', 'meta', 'stream', 'subtitles'],
    idPrefixes: ['tt'],
    catalogs: [
      {
        type: 'movie',
        id: 'bestplay_movies',
        name: 'BestPlay · 1080p AVC Instant Movies',
        extra: [
          { name: 'search', isRequired: false },
          {
            name: 'genre',
            isRequired: false,
            options: ['Sci-Fi', 'Action', 'Drama', 'History'],
          },
          { name: 'skip', isRequired: false },
        ],
      },
      {
        type: 'series',
        id: 'bestplay_series',
        name: 'BestPlay · 1080p AVC Instant Series',
        extra: [
          { name: 'search', isRequired: false },
          {
            name: 'genre',
            isRequired: false,
            options: ['Drama', 'History', 'Action'],
          },
          { name: 'skip', isRequired: false },
        ],
      },
    ],
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}

/**
 * Validates that all required Stremio manifest fields are present and non-null.
 */
function validateManifest(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be an object'] };
  }

  for (const field of ['id', 'version', 'name', 'description']) {
    if (typeof manifest[field] !== 'string' || manifest[field].trim().length === 0) {
      errors.push(`Missing or invalid string field: ${field}`);
    }
  }

  for (const arrField of ['types', 'resources', 'catalogs']) {
    if (!Array.isArray(manifest[arrField]) || manifest[arrField].length === 0) {
      errors.push(`Missing or empty array field: ${arrField}`);
    }
  }

  if (!Array.isArray(manifest.idPrefixes) || !manifest.idPrefixes.includes('tt')) {
    errors.push('Manifest idPrefixes must include "tt"');
  }

  return { valid: errors.length === 0, errors };
}


// ---------------- Live Handlers ----------------
const { parseExtraParams, handleCatalogRequest } = (() => {

const VALID_CATALOGS = {
  movie: new Set(['bestplay_movies', 'top']),
  series: new Set(['bestplay_series', 'top']),
};

function parseExtraParams(extraStr) {
  const result = {};
  if (!extraStr || typeof extraStr !== 'string') return result;

  try {
    const params = new URLSearchParams(extraStr);
    for (const [k, v] of params.entries()) {
      result[k.toLowerCase()] = v;
    }
  } catch {
    for (const segment of extraStr.split('&')) {
      const idx = segment.indexOf('=');
      if (idx > 0) {
        result[decodeURIComponent(segment.slice(0, idx)).toLowerCase()] = decodeURIComponent(
          segment.slice(idx + 1)
        );
      }
    }
  }
  return result;
}

/**
 * Handles Stremio catalog requests dynamically from Cinemeta (`/catalog/:type/:id.json` and `/:extra.json`).
 * Returns empty valid `{ metas: [] }` on invalid catalog IDs or upstream timeouts.
 */
async function handleCatalogRequest({
  type,
  id,
  extra = '',
  cache = null,
  cacheTtlMs = 300_000,
  httpTimeoutMs = 4500,
}) {
  const allowedIds = VALID_CATALOGS[type];
  if (!allowedIds || !allowedIds.has(id)) {
    return {
      payload: { metas: [] },
      cacheHit: false,
      cacheControl: getCacheControlHeader('catalog'),
    };
  }

  const parsedExtra = typeof extra === 'string' ? parseExtraParams(extra) : extra || {};
  const cacheKey = `catalog:${type}:${id}:${JSON.stringify(parsedExtra)}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return {
        payload: cached,
        cacheHit: true,
        cacheControl: getCacheControlHeader('catalog'),
      };
    }
  }

  const extraSegments = [];
  if (parsedExtra.search) extraSegments.push(`search=${encodeURIComponent(parsedExtra.search)}`);
  if (parsedExtra.genre) extraSegments.push(`genre=${encodeURIComponent(parsedExtra.genre)}`);
  if (parsedExtra.skip) extraSegments.push(`skip=${encodeURIComponent(parsedExtra.skip)}`);

  const upstreamUrl =
    extraSegments.length > 0
      ? `https://v3-cinemeta.strem.io/catalog/${encodeURIComponent(type)}/top/${extraSegments.join('&')}.json`
      : `https://cinemeta-catalogs.strem.io/top/catalog/${encodeURIComponent(type)}/top.json`;

  const remote = await fetchJsonWithTimeout(upstreamUrl, {
    timeoutMs: Math.min(Number(httpTimeoutMs) || 4500, 4500),
  });

  const metas = Array.isArray(remote?.metas)
    ? remote.metas
        .filter((m) => m && typeof m === 'object' && m.id && m.name)
        .map((m) => {
          const imdbId = String(m.imdb_id || m.id);
          return {
            id: String(m.id),
            type: String(m.type || type),
            name: String(m.name),
            poster: String(m.poster || `https://images.metahub.space/poster/small/${imdbId}/img`),
            posterShape: String(m.posterShape || 'poster'),
            background: String(
              m.background || `https://images.metahub.space/background/medium/${imdbId}/img`
            ),
            description: String(m.description || `${m.name} (${m.releaseInfo || ''})`).trim(),
            releaseInfo: String(m.releaseInfo || ''),
            imdbRating: String(m.imdbRating || ''),
            genres: Array.isArray(m.genres) ? m.genres.map(String) : [],
          };
        })
    : [];

  const payload = { metas };
  if (cache && metas.length > 0) {
    cache.set(cacheKey, payload, cacheTtlMs);
  }

  return {
    payload,
    cacheHit: false,
    cacheControl: getCacheControlHeader('catalog'),
  };
}

  return { parseExtraParams, handleCatalogRequest };
})();

const { handleMetaRequest } = (() => {

const VALID_TYPES = new Set(['movie', 'series']);
const IMDB_ID_RE = /^tt\d+(?::\d+:\d+)?$/i;

/**
 * Handles Stremio meta requests (`/meta/:type/:id.json`) dynamically via Cinemeta.
 * Zero mock fallbacks: invalid or missing titles return `{ meta: null }`.
 */
async function handleMetaRequest({
  type,
  id,
  cache = null,
  cacheTtlMs = 300_000,
  httpTimeoutMs = 4500,
}) {
  const cleanId = String(id || '').trim();

  if (!VALID_TYPES.has(type) || !IMDB_ID_RE.test(cleanId)) {
    return {
      payload: { meta: null },
      cacheHit: false,
      cacheControl: getCacheControlHeader('meta'),
    };
  }

  const baseImdbId = cleanId.split(':')[0];
  const cacheKey = `meta:${type}:${baseImdbId}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return {
        payload: cached,
        cacheHit: true,
        cacheControl: getCacheControlHeader('meta'),
      };
    }
  }

  const cinemetaUrl = `https://v3-cinemeta.strem.io/meta/${encodeURIComponent(type)}/${encodeURIComponent(baseImdbId)}.json`;
  const remote = await fetchJsonWithTimeout(cinemetaUrl, {
    timeoutMs: Math.min(Number(httpTimeoutMs) || 4500, 4500),
  });
  const remoteMeta = remote && typeof remote.meta === 'object' ? remote.meta : null;

  let meta = null;
  if (remoteMeta && remoteMeta.name) {
    meta = {
      id: String(remoteMeta.id || baseImdbId),
      type: String(remoteMeta.type || type),
      name: String(remoteMeta.name),
      poster: String(remoteMeta.poster || `https://images.metahub.space/poster/medium/${baseImdbId}/img`),
      background: String(
        remoteMeta.background || `https://images.metahub.space/background/medium/${baseImdbId}/img`
      ),
      description: String(remoteMeta.description || remoteMeta.name),
      releaseInfo: String(remoteMeta.releaseInfo || ''),
      imdbRating: String(remoteMeta.imdbRating || ''),
      runtime: String(remoteMeta.runtime || ''),
      genres: Array.isArray(remoteMeta.genres) ? remoteMeta.genres.map(String) : [],
    };

    if (Array.isArray(remoteMeta.videos) && remoteMeta.videos.length > 0) {
      meta.videos = remoteMeta.videos;
    }
  }

  const payload = { meta };
  if (cache && meta !== null) {
    cache.set(cacheKey, payload, cacheTtlMs);
  }

  return {
    payload,
    cacheHit: false,
    cacheControl: getCacheControlHeader('meta'),
  };
}

  return { handleMetaRequest };
})();

const { parseAddonConfigSegment, extractSizeGb, filterAndRankStreams, handleStreamRequest } = (() => {

const VALID_TYPES = new Set(['movie', 'series']);
const IMDB_ID_RE = /^tt\d+(?::\d+:\d+)?$/i;

const PREBUILT_BESTPLAY_SAFE_P2P_BASE =
  'https://aiostreamsfortheweebs.midnightignite.me/stremio/82916bd8-8215-48bd-a66c-41d487150d51/eyJpIjoiWXdicWYrcDFvRDBWbkFBTE1Cc0MzQT09IiwiZSI6Ii9XVk1RYnVBMFBmWVFCVEoxaENPNFZodFRpWmNLK3pKT1d1eUhIenc2VTRvKzFQV2tHa0ZPYVk1OTlHVFl2cHQiLCJ0IjoiYSJ9';

const PUBLIC_TRACKER_SOURCES = [
  'tracker:udp://tracker.opentrackr.org:1337/announce',
  'tracker:udp://open.stealth.si:80/announce',
  'tracker:udp://tracker.torrent.eu.org:451/announce',
  'tracker:udp://open.demonii.com:1337/announce',
  'tracker:udp://exodus.desync.com:6969/announce',
];

// Always hard-blocked in every mode: foreign dubs, dub studios, Cyrillic/regional dubbed packs.
const FOREIGN_DUB_PATTERN =
  /(?<![a-z0-9])(dubbed|dub|multi[\s._-]*audio|multi[\s._-]*language|ita\.eng|ita\.ac3|sub\.ita|episodio|questione|pir8|odyssey|coldfilm|rusfilm|sunshinestudio|newstudio|lostfilm|baibako|kubik|hdrezka|alexfilm|rutor|rus\.dub|castellano|mejortorrent|descargas\d*|temporada|latino|lektor|dublado|vff|vfq|truefrench|german\.dl|czech|czdub|skdub|d[ií]l|bgaudio|4play)(?![a-z0-9])|[\u0400-\u04FF]|🇷🇺|🇪🇸|🇲🇽|🇮🇹|🇧🇬|🇵🇱|🇹🇷|🇮🇳|🇨🇿|🇸🇰|🇩🇪|🇵🇹|🇧🇷/i;

// Always hard-blocked in every mode: unplayable containers, amateur captures, AV1, lossless audio.
const HARD_UNPLAYABLE_PATTERN =
  /(?<![a-z0-9])(h\.?266|vvc|av1|10bit|10-bit|hi10|dv|dolby[\s._-]*vision|dovi|hdr|hdr10|hdr10plus|4320p|8k|3d|divx|xvid|truehd|dts|dts-hd|dtshd|dts-ma|dts-x|dtsx|cam|hdcam|camrip|ts|hdts|telesync|pdvd|telecine|tc|scr|screener|dvdscr|workprint|exyusubs|chs\.eng)(?![a-z0-9])|\.(avi|wmv|flv|m2ts|iso|ts|vob|rmvb)(?=$|[\s\]\)])/i;

// Blocked in Tier-1 & Tier-2; allowed ONLY in Tier-3 last-resort when zero clean-sub original-audio cached streams exist on Real-Debrid.
const HARDCODED_SUBS_PATTERN = /(?<![a-z0-9])(hardcoded|hardsub|hardsubs|hc-?sub|hc-?subs|korsub|korsubs|burned)(?![a-z0-9])/i;

// Blocked in Tier-1 (Strict H.264/AVC Safe Mode); allowed ONLY in Tier-2 Original-Audio fallback when zero H.264 original-language streams exist.
const HEVC_OR_4K_PATTERN = /(?<![a-z0-9])(x265|hevc|h\.?265|2160p|4k)(?![a-z0-9])/i;

const UNCACHED_DEBRID_PATTERN =
  /(\[[A-Z]{2}\s*download\]|\[RD\s*⏳\]|⏳|\buncached\b|downloading\s+to\s+debrid|not\s+cached)/i;

const SAFE_HD_SIGNAL_PATTERN =
  /(?<![a-z0-9])(x264|h\.?264|avc|1080p|720p|web-?dl|webrip|bluray|brrip|web)(?![a-z0-9])/i;

const FORBIDDEN_LOCAL_URL_PATTERN = /(localhost|127\.0\.0\.1|0\.0\.0\.0|trycloudflare\.com|sample-stream)/i;
const PLACEHOLDER_VIDEO_URL_PATTERN =
  /(\/status\/video\/|\/videos\/downloading|\/videos\/failed|downloading\.mp4|slate\.elfhosted\.com|infringement|rate_?limit|uncached)/i;
const REGIONAL_DUB_PENALTY_PATTERN =
  /(?<![a-z0-9])(multi|dual|ita|italian|french|german|spanish|rus|hindi|hin)(?![a-z0-9])|🇫🇷/i;
const MIN_REAL_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB floor blocks 100KB-15MB debrid status/error videos

function encodeJsonBase64(obj) {
  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64');
}

function encodeJsonBase64Url(obj) {
  return encodeJsonBase64(obj).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

const MICRO_COMPRESS_PATTERN = /(?<![a-z0-9])(yify|yts|psa|galaxyrg|pahe|megusta|etrg|rarbg[\s._-]*2gb)(?![a-z0-9])/i;
const SOURCE_BLURAY_REMUX_PATTERN = /(?<![a-z0-9])(remux)(?![a-z0-9])/i;
const SOURCE_BLURAY_PATTERN = /(?<![a-z0-9])(bluray|blu-ray|bdrip|bdremux)(?![a-z0-9])/i;
const SOURCE_WEBDL_PATTERN = /(?<![a-z0-9])(web-?dl|nf[\s._-]*web|amzn[\s._-]*web|atvp|dsnp|hmax)(?![a-z0-9])/i;
const SOURCE_WEBRIP_PATTERN = /(?<![a-z0-9])(webrip|brrip)(?![a-z0-9])/i;
const SOURCE_HDTV_PATTERN = /(?<![a-z0-9])(hdtv|pdtv)(?![a-z0-9])/i;

function detectSourceQuality(text) {
  if (SOURCE_BLURAY_REMUX_PATTERN.test(text)) return { label: 'BluRay REMUX', score: 1050 };
  if (SOURCE_BLURAY_PATTERN.test(text)) return { label: 'BluRay', score: 900 };
  if (SOURCE_WEBDL_PATTERN.test(text)) return { label: 'WEB-DL', score: 650 };
  if (SOURCE_WEBRIP_PATTERN.test(text)) return { label: 'WEBRip', score: 300 };
  if (SOURCE_HDTV_PATTERN.test(text)) return { label: 'HDTV', score: 120 };
  return { label: 'HD', score: 180 };
}

function scoreBitrateQuality(sizeGb, mediaType, isMicroCompressed) {
  let score = 0;
  if (mediaType === 'series') {
    if (sizeGb >= 1.5 && sizeGb <= 6) {
      score += 1200 + Math.round(sizeGb * 130);
    } else if (sizeGb > 6 && sizeGb <= 12) {
      score += 1100 + Math.round(Math.min(sizeGb, 12) * 65);
    } else if (sizeGb >= 0.8 && sizeGb < 1.5) {
      score += 400 + Math.round(sizeGb * 100);
    } else if (sizeGb > 0 && sizeGb < 0.8) {
      score -= 800;
    }
  } else {
    // Movies: prefer crisp high-bitrate 4 GB - 22 GB BluRay/WEB-DL releases over tiny rips
    if (sizeGb >= 4 && sizeGb <= 22) {
      score += 1400 + Math.round(sizeGb * 60);
    } else if (sizeGb >= 2.5 && sizeGb < 4) {
      score += 450 + Math.round(sizeGb * 50);
    } else if (sizeGb > 0 && sizeGb < 2.5) {
      score -= 1000;
    }
  }
  if (isMicroCompressed) {
    score -= 900;
  }
  return score;
}

function parseAddonConfigSegment(configStr, envConfig = {}) {
  const defaults = {
    debridProvider: envConfig.debridProvider || 'realdebrid',
    apiKey: envConfig.debridApiKey || '',
    maxSizeGb: envConfig.maxStreamSizeGb || 22,
    maxResults: envConfig.maxStreamResults || 1,
  };

  if (!configStr || typeof configStr !== 'string') return defaults;

  let decoded = configStr;
  try {
    decoded = decodeURIComponent(configStr);
  } catch {
    // keep raw config segment
  }

  if (!decoded.includes('=') || !decoded.includes('|')) {
    try {
      const fromB64 = Buffer.from(decoded, 'base64').toString('utf8');
      if (fromB64.includes('=') || fromB64.includes('|')) {
        decoded = fromB64;
      }
    } catch {
      // ignore invalid base64
    }
  }

  const parsed = { ...defaults };
  for (const part of decoded.split('|')) {
    const eqIndex = part.indexOf('=');
    if (eqIndex <= 0) continue;
    const cleanKey = part.slice(0, eqIndex).trim().toLowerCase();
    const cleanVal = part.slice(eqIndex + 1).trim();
    if (!cleanKey || !cleanVal) continue;
    if (
      cleanKey === 'realdebrid' ||
      cleanKey === 'alldebrid' ||
      cleanKey === 'premiumize' ||
      cleanKey === 'torbox'
    ) {
      parsed.debridProvider = cleanKey;
      parsed.apiKey = cleanVal;
    } else if (cleanKey === 'maxsize') {
      const gb = Number.parseFloat(cleanVal);
      if (Number.isFinite(gb) && gb > 0) parsed.maxSizeGb = gb;
    } else if (cleanKey === 'limit' || cleanKey === 'maxresults') {
      const lim = Number.parseInt(cleanVal, 10);
      if (Number.isFinite(lim) && lim >= 1 && lim <= 10) parsed.maxResults = lim;
    }
  }
  return parsed;
}

function extractSizeGb(text, videoSizeBytes) {
  if (typeof videoSizeBytes === 'number' && videoSizeBytes > 0) {
    return +(videoSizeBytes / 1024 ** 3).toFixed(2);
  }
  const match =
    text.match(/💾\s*([\d.]+)\s*(TiB|GiB|MiB|TB|GB|MB)/i) ||
    text.match(/(?<![a-z0-9])([\d.]+)\s*(TiB|GiB|MiB|TB|GB|MB)(?![a-z0-9])/i);
  if (!match) return 0;

  const val = Number.parseFloat(match[1]);
  if (!Number.isFinite(val)) return 0;
  const unit = match[2].toUpperCase();
  if (unit === 'TB' || unit === 'TIB') return +(val * 1024).toFixed(2);
  if (unit === 'MB' || unit === 'MIB') return +(val / 1024).toFixed(2);
  return +val.toFixed(2);
}

function formatSizeLabel(sizeGb) {
  if (!sizeGb || sizeGb <= 0) return 'Unknown Size';
  if (sizeGb < 1) return `${Math.round(sizeGb * 1024)} MB`;
  return `${sizeGb.toFixed(2)} GB`;
}

function detectResolution(text) {
  if (/(?<![a-z0-9])(2160p|4k)(?![a-z0-9])/i.test(text)) return '4K';
  if (/(?<![a-z0-9])1080p(?![a-z0-9])/i.test(text)) return '1080p';
  if (/(?<![a-z0-9])720p(?![a-z0-9])/i.test(text)) return '720p';
  return 'HD';
}

function detectVideoCodec(text) {
  if (/(?<![a-z0-9])(x265|hevc|h\.?265)(?![a-z0-9])/i.test(text)) return 'H.265/HEVC';
  return 'H.264/AVC';
}

function detectAudioCodec(text) {
  if (/(?<![a-z0-9])aac(?![a-z0-9])/i.test(text)) return 'AAC';
  if (/(?<![a-z0-9])opus(?![a-z0-9])/i.test(text)) return 'OPUS';
  if (/(?<![a-z0-9])(ddp|dd\+|eac3)(?![a-z0-9])/i.test(text)) return 'DD+';
  if (/(?<![a-z0-9])(ac3|dd5\.?1)(?![a-z0-9])/i.test(text)) return 'DD 5.1';
  return 'AAC/Stereo';
}

function extractSeeders(text, streamObj) {
  if (typeof streamObj?.behaviorHints?.seeders === 'number') {
    return streamObj.behaviorHints.seeders;
  }
  const m = text.match(/(?:👤|👥)\s*(\d+)/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

function detectSourceLabel(text, providerTag) {
  const engineMatch = text.match(/⚙️\s*([^\n|]+)/);
  if (engineMatch) return engineMatch[1].trim();
  if (/torrentio/i.test(text)) return 'Torrentio RD+';
  if (/comet/i.test(text)) return 'Comet RD+';
  if (/meteor/i.test(text)) return 'Meteor RD+';
  if (/sootio/i.test(text)) return 'Sootio RD+';
  if (/mediafusion/i.test(text)) return 'MediaFusion RD+';
  return providerTag || 'Torrentio RD+';
}

function extractDisplayFilename(streamObj) {
  if (streamObj?.behaviorHints?.filename) {
    return String(streamObj.behaviorHints.filename).trim();
  }
  const raw = String(streamObj?.title || streamObj?.description || '');
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/^[📄📁🎬⭐\s]+/, '').trim())
    .filter(Boolean);
  for (const line of lines) {
    if (/\.(mp4|mkv|m4v|webm)(?:\b|$)/i.test(line)) return line;
  }
  return lines[0] || 'Verified.1080p.H264.RD.Stream';
}

/**
 * Strictly filters raw upstream Stremio streams and ranks H.264/AVC safe playable releases.
 * Defaults to 1 single top stream (`maxResults = 1`) for BestPlay 1-Stream Auto-Play.
 */
function filterAndRankStreams(
  rawStreams,
  {
    type = 'movie',
    hasDebrid = false,
    maxSizeGb = 22,
    maxResults = 1,
    allowOriginalHevcFallback = false,
    allowHardcodedSubFallback = false,
  } = {}
) {
  if (!Array.isArray(rawStreams)) {
    return {
      streams: [],
      selectedMeta: [],
      stats: { totalRaw: 0, totalRejected: 0, totalAccepted: 0, totalSafePool: 0, rejectedReasons: {} },
    };
  }

  const seenKeys = new Set();
  const candidates = [];
  const rejectedReasons = {};
  const recordReject = (reason) => {
    rejectedReasons[reason] = (rejectedReasons[reason] || 0) + 1;
  };

  for (const s of rawStreams) {
    if (!s || typeof s !== 'object') {
      recordReject('invalid_entry');
      continue;
    }
    if (s.externalUrl || s.streamData?.type === 'statistic') {
      recordReject('non_video_card');
      continue;
    }
    if (hasDebrid) {
      if (!s.url || !/^https?:\/\//i.test(String(s.url))) {
        recordReject('missing_direct_url');
        continue;
      }
      if (FORBIDDEN_LOCAL_URL_PATTERN.test(String(s.url))) {
        recordReject('forbidden_local_url');
        continue;
      }
    } else if (!(s.url || s.infoHash)) {
      recordReject('missing_source');
      continue;
    }

    const filename = s.behaviorHints?.filename ? String(s.behaviorHints.filename) : '';
    const folderName = s.behaviorHints?.folderName ? String(s.behaviorHints.folderName) : '';
    const bingeGroup = s.behaviorHints?.bingeGroup ? String(s.behaviorHints.bingeGroup) : '';
    const inspectText = `${s.name || ''} ${s.title || ''} ${s.description || ''} ${filename} ${folderName} ${bingeGroup}`;

    if (hasDebrid && UNCACHED_DEBRID_PATTERN.test(inspectText)) {
      recordReject('uncached_debrid');
      continue;
    }

    if (/\[cloud\]|personal/i.test(inspectText) && !/1080p|x264|h\.?264|avc/i.test(inspectText)) {
      recordReject('personal_cloud_unverified');
      continue;
    }

    const dubMatch = inspectText.match(FOREIGN_DUB_PATTERN);
    if (dubMatch) {
      recordReject(`blocked_dub_${dubMatch[0].toLowerCase()}`);
      continue;
    }

    const hardMatch = inspectText.match(HARD_UNPLAYABLE_PATTERN);
    if (hardMatch) {
      recordReject(`blocked_${hardMatch[0].toLowerCase()}`);
      continue;
    }

    const hcMatch = inspectText.match(HARDCODED_SUBS_PATTERN);
    if (hcMatch && !allowHardcodedSubFallback) {
      recordReject(`blocked_${hcMatch[0].toLowerCase()}`);
      continue;
    }

    const hevcOr4kMatch = inspectText.match(HEVC_OR_4K_PATTERN);
    if (hevcOr4kMatch && !allowOriginalHevcFallback) {
      recordReject(`blocked_${hevcOr4kMatch[0].toLowerCase()}`);
      continue;
    }

    if (!SAFE_HD_SIGNAL_PATTERN.test(inspectText) && !allowOriginalHevcFallback && !allowHardcodedSubFallback) {
      recordReject('missing_hd_avc_signal');
      continue;
    }

    const sizeGb = extractSizeGb(inspectText, s.behaviorHints?.videoSize);
    if (sizeGb > maxSizeGb) {
      recordReject('exceeds_max_size');
      continue;
    }

    const displayFile = extractDisplayFilename(s);
    const dedupKey = s.url
      ? `url:${s.url}`
      : s.infoHash
        ? `hash:${String(s.infoHash).toLowerCase()}:${s.fileIdx ?? 0}`
        : `file:${displayFile.toLowerCase()}`;
    if (seenKeys.has(dedupKey)) {
      recordReject('duplicate');
      continue;
    }
    seenKeys.add(dedupKey);

    const resolution = detectResolution(inspectText);
    const videoCodec = detectVideoCodec(inspectText);
    const shortCodec = videoCodec === 'H.265/HEVC' ? 'HEVC' : 'H.264';
    const sourceQuality = detectSourceQuality(inspectText);
    const hasExplicitAvc = /(?<![a-z0-9])(x264|h\.?264|avc)(?![a-z0-9])/i.test(inspectText);
    const audioCodec = detectAudioCodec(inspectText);
    const isMp4 = /\.mp4(?=$|[\s\]\)])/i.test(displayFile) || /\.mp4(?=$|[\s\]\)])/i.test(inspectText);
    const isMicroCompressed = MICRO_COMPRESS_PATTERN.test(inspectText);
    const seeders = extractSeeders(inspectText, s);
    const sourceLabel = detectSourceLabel(inspectText, s._sourceProvider);

    const isTorrentioDirect = /torrentio\.strem\.fun/i.test(String(s.url || ''));
    const isCometDirect = /comet/i.test(String(s.url || ''));
    const isMeteorDirect = /meteor/i.test(String(s.url || ''));

    const hasExplicitSeedCount = /(?:👤|👥)\s*\d+/.test(inspectText) || typeof s?.behaviorHints?.seeders === 'number';
    const isDeadP2p = !s.url && hasExplicitSeedCount && seeders === 0;
    const hasRegionalDubPenalty = REGIONAL_DUB_PENALTY_PATTERN.test(inspectText);
    const isPureOriginalFlag = /🇮🇱|🇬🇧|🇺🇸|original|hebrew/i.test(inspectText) && !/🇫🇷|multi/i.test(inspectText);

    const bitrateScore = scoreBitrateQuality(sizeGb, type, isMicroCompressed);
    const audioScore =
      audioCodec === 'DD+' || audioCodec === 'DD 5.1'
        ? 180
        : audioCodec === 'AAC'
          ? 150
          : audioCodec === 'OPUS'
            ? 120
            : 80;

    // Maximum Safe Quality ranking: Resolution (1080p) > High-Bitrate Sweet Spot (4-22GB Movie / 1.5-6GB Series)
    // > Source Quality (BluRay/REMUX > WEB-DL > WEBRip > HDTV) > Explicit H.264 > Audio > MP4 tie-breaker.
    const score =
      (s.url ? 10000 : 0) +
      (resolution === '1080p' ? 1500 : resolution === '4K' ? 900 : resolution === '720p' ? 400 : 0) +
      bitrateScore +
      sourceQuality.score +
      (hasExplicitAvc ? 300 : 0) +
      audioScore +
      (isMp4 ? 60 : 0) +
      (isPureOriginalFlag ? 500 : 0) +
      (hasRegionalDubPenalty ? -700 : 0) +
      (isTorrentioDirect ? 140 : isCometDirect ? 110 : isMeteorDirect ? 80 : 0) +
      (isDeadP2p ? -3000 : 0) +
      Math.min(seeders, 120);

    const statusTag = s.url ? `Instant [RD+] HTTPS · ${sourceQuality.label} · Original Audio` : 'P2P Swarm H.264';
    const streamName = s.url
      ? `BestPlay [RD+] ⚡\n${resolution} · ${shortCodec}`
      : `BestPlay ⚡\n${resolution} · ${shortCodec}`;

    const metaLineParts = [`🎬 ${videoCodec}`, `🔊 ${audioCodec}`, `💾 ${formatSizeLabel(sizeGb)}`];
    if (seeders > 0) metaLineParts.push(`👤 ${seeders}`);

    const formattedTitle = [
      displayFile,
      metaLineParts.join(' · '),
      `⚙️ ${sourceLabel} · ${statusTag}`,
    ].join('\n');

    const normalized = {
      name: streamName,
      title: formattedTitle,
      behaviorHints: {
        ...(s.behaviorHints && typeof s.behaviorHints === 'object' ? s.behaviorHints : {}),
        ...(s.url ? { notWebReady: true } : {}),
        filename: filename || displayFile,
      },
    };

    if (s.url) normalized.url = String(s.url);
    if (!hasDebrid && s.infoHash) {
      normalized.infoHash = String(s.infoHash).toLowerCase();
      const existingSources = Array.isArray(s.sources) ? s.sources : [];
      normalized.sources = Array.from(
        new Set([`dht:${normalized.infoHash}`, ...existingSources, ...PUBLIC_TRACKER_SOURCES])
      );
      if (typeof s.fileIdx === 'number') normalized.fileIdx = s.fileIdx;
    }

    candidates.push({
      score,
      meta: {
        resolution,
        videoCodec,
        audioCodec,
        sourceQuality: sourceQuality.label,
        sizeGb,
        sizeLabel: formatSizeLabel(sizeGb),
        seeders,
        sourceLabel,
        isMp4,
        hasDirectUrl: Boolean(s.url),
      },
      stream: normalized,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const selected = candidates.slice(0, Math.max(1, maxResults));

  return {
    streams: selected.map((c) => c.stream),
    selectedMeta: selected.map((c) => c.meta),
    stats: {
      totalRaw: rawStreams.length,
      totalRejected: rawStreams.length - candidates.length,
      totalAccepted: selected.length,
      totalSafePool: candidates.length,
      rejectedReasons,
    },
  };
}

function buildTorrentioUrl(type, id, config, hasDebrid) {
  const parts = [
    'providers=yts,eztv,1337x,torrentgalaxy,thepiratebay,rarbg,kickasstorrents,magnetdl',
    hasDebrid ? 'sort=qualitysize' : 'sort=qualityseeders',
  ];
  if (hasDebrid) {
    parts.push('qualityfilter=4k,hdrall,dolbyvision,dolbyvisionwithhdr,threed,480p,other,scr,cam,unknown');
    parts.push('debridoptions=nodownloadlinks,nocatalog');
    parts.push(`${config.debridProvider}=${config.apiKey}`);
  }
  return `https://torrentio.strem.fun/${parts.join('|')}/stream/${encodeURIComponent(type)}/${encodeURIComponent(id)}.json`;
}

function buildCometConfigBase64(config) {
  return encodeJsonBase64({
    maxResultsPerResolution: 10,
    maxSize: 0,
    cachedOnly: true,
    sortCachedUncachedTogether: false,
    removeTrash: true,
    resultFormat: ['all'],
    debridServices: [{ service: config.debridProvider, apiKey: config.apiKey }],
    enableTorrent: false,
    deduplicateStreams: true,
    scrapeDebridAccountTorrents: false,
    debridStreamProxyPassword: '',
    languages: {
      required: [],
      allowed: [],
      exclude: ['ru', 'fr', 'es', 'de', 'it', 'pt', 'pl', 'hi', 'tr', 'ar'],
      preferred: ['el', 'en'],
    },
    resolutions: {
      r2160p: false,
      r1440p: false,
      r1080p: true,
      r720p: true,
      r576p: false,
      r480p: false,
      r360p: false,
      r240p: false,
      unknown: false,
    },
  });
}

function buildMeteorUrl(type, id, config) {
  const cfg = encodeJsonBase64Url({
    services: [{ name: config.debridProvider, apiKey: config.apiKey }],
    cachedOnly: true,
    removeTrash: true,
    removeSamples: true,
    exclude3D: true,
    maxResults: 25,
    maxPerResolution: 15,
    allowP2P: false,
  });
  return `https://meteorfortheweebs.midnightignite.me/${cfg}/stream/${encodeURIComponent(type)}/${encodeURIComponent(id)}.json`;
}

function buildSootioUrl(type, id, config) {
  const providerName =
    config.debridProvider === 'alldebrid'
      ? 'AllDebrid'
      : config.debridProvider === 'premiumize'
        ? 'Premiumize'
        : config.debridProvider === 'torbox'
          ? 'TorBox'
          : 'RealDebrid';
  const cfg = encodeURIComponent(
    JSON.stringify({
      DebridServices: [{ provider: providerName, apiKey: config.apiKey }],
      DebridProvider: providerName,
      DebridApiKey: config.apiKey,
      ScrapersConfigured: true,
      minSize: 0,
      maxSize: Math.round(config.maxSizeGb || 20),
      ShowCatalog: false,
    })
  );
  return `https://sooti.info/${cfg}/stream/${encodeURIComponent(type)}/${encodeURIComponent(id)}.json`;
}

/**
 * Handles live Stremio stream requests (`/stream/:type/:id.json`, `/:extra.json`, `/:config/stream/...`).
 * Zero mock fallbacks: always resolves from live upstream sources or returns `{ streams: [] }`.
 */
async function handleStreamRequest({
  type,
  id,
  configStr = '',
  envConfig = {},
  cache = null,
  cacheTtlMs = 300_000,
  httpTimeoutMs = 4500,
  simulateTimeout = false,
}) {
  const cleanId = String(id || '').trim();

  if (!VALID_TYPES.has(type) || !IMDB_ID_RE.test(cleanId)) {
    return {
      payload: { streams: [] },
      stats: { totalRaw: 0, totalRejected: 0, totalAccepted: 0, totalSafePool: 0 },
      selectedMeta: [],
      cacheHit: false,
      cacheControl: getCacheControlHeader('stream'),
    };
  }

  const parsedConfig = parseAddonConfigSegment(configStr, envConfig);
  const hasDebrid = Boolean(
    parsedConfig.apiKey &&
      parsedConfig.apiKey.length > 0 &&
      !parsedConfig.apiKey.includes('YOUR_')
  );

  const cacheKey = `stream:${hasDebrid ? parsedConfig.debridProvider : 'p2p'}:${parsedConfig.maxSizeGb}:${parsedConfig.maxResults}:${type}:${cleanId}`;
  if (!simulateTimeout && cache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return {
        payload: cached.payload,
        stats: cached.stats,
        selectedMeta: cached.selectedMeta,
        cacheHit: true,
        cacheControl: getCacheControlHeader('stream'),
      };
    }
  }

  const timeoutBudget = Math.min(Number(httpTimeoutMs) || 4500, 5500);
  const encodedType = encodeURIComponent(type);
  const encodedId = encodeURIComponent(cleanId);

  const upstreamRequests = [
    fetchJsonWithTimeout(buildTorrentioUrl(type, cleanId, parsedConfig, hasDebrid), {
      timeoutMs: timeoutBudget,
      simulateTimeout,
    }).then((d) => ({
      provider: hasDebrid ? 'Torrentio RD+' : 'Torrentio',
      data: d,
    })),
  ];

  if (hasDebrid) {
    const cometCfg = buildCometConfigBase64(parsedConfig);
    upstreamRequests.push(
      fetchJsonWithTimeout(
        `https://comet.elfhosted.com/${cometCfg}/stream/${encodedType}/${encodedId}.json`,
        { timeoutMs: timeoutBudget, simulateTimeout }
      ).then((d) => ({ provider: 'Comet ElfHosted RD+', data: d })),
      fetchJsonWithTimeout(
        `https://cometfortheweebs.midnightignite.me/${cometCfg}/stream/${encodedType}/${encodedId}.json`,
        { timeoutMs: timeoutBudget, simulateTimeout }
      ).then((d) => ({ provider: 'Comet Midnight RD+', data: d })),
      fetchJsonWithTimeout(buildMeteorUrl(type, cleanId, parsedConfig), {
        timeoutMs: timeoutBudget,
        simulateTimeout,
      }).then((d) => ({ provider: 'Meteor RD+', data: d })),
      fetchJsonWithTimeout(buildSootioUrl(type, cleanId, parsedConfig), {
        timeoutMs: Math.min(timeoutBudget, 4000),
        simulateTimeout,
      }).then((d) => ({ provider: 'Sootio RD+', data: d }))
    );
  } else {
    const aioUrl = `${PREBUILT_BESTPLAY_SAFE_P2P_BASE}/stream/${encodedType}/${encodedId}.json`;
    upstreamRequests.push(
      fetchJsonWithTimeout(aioUrl, { timeoutMs: timeoutBudget, simulateTimeout }).then((d) => ({
        provider: 'AIOStreams Safe',
        data: d,
      }))
    );
  }

  const responses = await Promise.all(upstreamRequests);
  const mergedRawStreams = [];
  for (const resp of responses) {
    const arr = Array.isArray(resp.data?.streams) ? resp.data.streams : [];
    for (const s of arr) {
      if (s && typeof s === 'object') {
        mergedRawStreams.push({ ...s, _sourceProvider: resp.provider });
      }
    }
  }

  const desiredCount = Math.max(1, parsedConfig.maxResults || 1);
  const poolLimit = hasDebrid ? Math.max(desiredCount * 6, 8) : desiredCount;
  let filtered = filterAndRankStreams(mergedRawStreams, {
    type,
    hasDebrid,
    maxSizeGb: parsedConfig.maxSizeGb,
    maxResults: poolLimit,
    allowOriginalHevcFallback: false,
  });

  const alreadyProbedUrls = new Set();

  const verifySingleCandidate = async (candidate, meta, isCloudRender, probeTimeoutMs) => {
    if (isCloudRender) {
      const redir = await probeRedirectLocation(candidate.url, { timeoutMs: probeTimeoutMs });
      const loc = redir?.location || '';
      const redirectsToRealDebridCdn =
        redir &&
        redir.status >= 300 &&
        redir.status < 400 &&
        /real-debrid\.com|alldebrid\.com|premiumize\.me|torbox\.app/i.test(loc) &&
        !PLACEHOLDER_VIDEO_URL_PATTERN.test(loc);

      if (!redirectsToRealDebridCdn) return null;
      return {
        stream: {
          ...candidate,
          behaviorHints: {
            ...(candidate.behaviorHints || {}),
            notWebReady: true,
          },
        },
        meta: { ...meta, verifiedRedirect: true },
      };
    }

    const probe = await probeVideoUrl(candidate.url, { timeoutMs: probeTimeoutMs });
    const isOkStatus = probe && (probe.status === 200 || probe.status === 206);
    const isCleanUrl =
      probe &&
      /^https?:\/\//i.test(probe.effectiveUrl) &&
      !FORBIDDEN_LOCAL_URL_PATTERN.test(probe.effectiveUrl) &&
      !PLACEHOLDER_VIDEO_URL_PATTERN.test(probe.effectiveUrl);
    const isRealFileSize = probe && probe.totalBytes >= MIN_REAL_VIDEO_BYTES;
    const withinMaxSize =
      probe && probe.totalBytes <= (parsedConfig.maxSizeGb || 22) * 1024 ** 3 * 1.02;

    if (!isOkStatus || !isCleanUrl || !isRealFileSize || !withinMaxSize) return null;

    const verifiedSizeGb = +(probe.totalBytes / 1024 ** 3).toFixed(2);
    const verifiedSizeLabel = formatSizeLabel(verifiedSizeGb);
    const updatedTitle = candidate.title.replace(/💾\s*[^·\n]+/, `💾 ${verifiedSizeLabel} `);
    return {
      stream: {
        ...candidate,
        url: probe.effectiveUrl,
        title: updatedTitle.replace(/\s+·/g, ' ·'),
        behaviorHints: {
          ...(candidate.behaviorHints || {}),
          notWebReady: true,
          videoSize: probe.totalBytes,
        },
      },
      meta: {
        ...meta,
        sizeGb: verifiedSizeGb,
        sizeLabel: verifiedSizeLabel,
        verifiedHttpStatus: probe.status,
        verifiedTotalBytes: probe.totalBytes,
        verifiedContentType: probe.contentType,
      },
    };
  };

  const verifyDebridPool = async (poolResult) => {
    const isCloudRender = Boolean(process.env.RENDER);
    const probeTimeoutMs = Math.min(timeoutBudget, 3500);
    const verifiedStreams = [];
    const verifiedMeta = [];
    let rejectedCount = 0;

    const freshItems = [];
    for (let i = 0; i < poolResult.streams.length; i++) {
      const url = poolResult.streams[i].url;
      if (alreadyProbedUrls.has(url)) continue;
      alreadyProbedUrls.add(url);
      freshItems.push({ candidate: poolResult.streams[i], meta: poolResult.selectedMeta[i] || {} });
    }

    // Probe in parallel batches of 4 while strictly preserving ranked quality order
    const BATCH_SIZE = 4;
    for (let start = 0; start < freshItems.length && verifiedStreams.length < desiredCount; start += BATCH_SIZE) {
      const batch = freshItems.slice(start, start + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((item) => verifySingleCandidate(item.candidate, item.meta, isCloudRender, probeTimeoutMs))
      );
      for (const res of results) {
        if (res && verifiedStreams.length < desiredCount) {
          verifiedStreams.push(res.stream);
          verifiedMeta.push(res.meta);
        } else if (!res) {
          rejectedCount += 1;
        }
      }
    }
    return { verifiedStreams, verifiedMeta, rejectedCount };
  };

  let finalStreams = filtered.streams;
  let finalMeta = filtered.selectedMeta;
  let rejectedUnverifiedDebrid = 0;

  if (hasDebrid && !simulateTimeout) {
    let pass1 =
      filtered.streams.length > 0
        ? await verifyDebridPool(filtered)
        : { verifiedStreams: [], verifiedMeta: [], rejectedCount: 0 };
    rejectedUnverifiedDebrid += pass1.rejectedCount;

    // Tier-2 Original-Audio Fallback: if Tier-1 strict H.264 found zero cached original-language streams
    // (e.g., niche non-English series episodes where RD only caches original-audio HEVC), NEVER serve a foreign dub.
    if (pass1.verifiedStreams.length === 0 && mergedRawStreams.length > 0) {
      const tier2Filtered = filterAndRankStreams(mergedRawStreams, {
        type,
        hasDebrid,
        maxSizeGb: parsedConfig.maxSizeGb,
        maxResults: poolLimit,
        allowOriginalHevcFallback: true,
        allowHardcodedSubFallback: false,
      });
      if (tier2Filtered.streams.length > 0) {
        const pass2 = await verifyDebridPool(tier2Filtered);
        rejectedUnverifiedDebrid += pass2.rejectedCount;
        if (pass2.verifiedStreams.length > 0) {
          filtered = tier2Filtered;
          pass1 = pass2;
        }
      }
    }

    // Tier-3 Last-Resort Original-Audio Fallback: ONLY when zero clean-sub original-language RD streams exist
    // (e.g. Fauda S01E10), still 100% blocking all foreign dubs, AVI, CAM, AV1, TrueHD/DTS, >22GB.
    if (pass1.verifiedStreams.length === 0 && mergedRawStreams.length > 0) {
      const tier3Filtered = filterAndRankStreams(mergedRawStreams, {
        type,
        hasDebrid,
        maxSizeGb: parsedConfig.maxSizeGb,
        maxResults: poolLimit,
        allowOriginalHevcFallback: true,
        allowHardcodedSubFallback: true,
      });
      if (tier3Filtered.streams.length > 0) {
        const pass3 = await verifyDebridPool(tier3Filtered);
        rejectedUnverifiedDebrid += pass3.rejectedCount;
        if (pass3.verifiedStreams.length > 0) {
          filtered = tier3Filtered;
          pass1 = pass3;
        }
      }
    }

    finalStreams = pass1.verifiedStreams;
    finalMeta = pass1.verifiedMeta;
  }

  const finalStats = {
    ...filtered.stats,
    totalRejected: filtered.stats.totalRejected + rejectedUnverifiedDebrid,
    totalAccepted: finalStreams.length,
    rejectedUnverifiedDebrid,
  };

  const payload = { streams: finalStreams };
  if (!simulateTimeout && cache && finalStreams.length > 0) {
    cache.set(
      cacheKey,
      { payload, stats: finalStats, selectedMeta: finalMeta },
      cacheTtlMs
    );
  }

  return {
    payload,
    stats: finalStats,
    selectedMeta: finalMeta,
    cacheHit: false,
    cacheControl: getCacheControlHeader('stream'),
  };
}

  return { parseAddonConfigSegment, extractSizeGb, filterAndRankStreams, handleStreamRequest };
})();

const { handleSubtitlesRequest } = (() => {

const VALID_TYPES = new Set(['movie', 'series']);
const IMDB_ID_RE = /^tt\d+(?::\d+:\d+)?$/i;
const GREEK_LANGS = new Set(['ell', 'gre', 'el', 'greek']);

const OPENSUBTITLES_PRO_GREEK_BASE =
  'https://opensubtitlesv3-pro.dexter21767.com/eyJsYW5ncyI6WyJncmVlayJdLCJzb3VyY2UiOiJhbGwiLCJhaVRyYW5zbGF0ZWQiOnRydWUsImF1dG9BZGp1c3RtZW50Ijp0cnVlfQ==';

function cleanLabel(text) {
  if (!text) return 'OpenSubtitles v3';
  return String(text)
    .replace(/[\[\]\(\)]/g, ' ')
    .replace(/\.(srt|vtt|ass|sub)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeFilename(filename) {
  return String(filename || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !/^(mkv|mp4|srt|1080p|720p|2160p|x264|h264|x265|hevc|aac|ac3|dd5|ddp|eng)$/.test(t));
}

function detectReleaseCut(text) {
  const s = String(text || '').toLowerCase();
  if (/(?<![a-z0-9])(bluray|blu-ray|bdrip|brrip|remux)(?![a-z0-9])/.test(s)) return 'bluray';
  if (/(?<![a-z0-9])(web-?dl|nf[\s._-]*web|amzn|atvp|dsnp|hmax)(?![a-z0-9])/.test(s)) return 'webdl';
  if (/(?<![a-z0-9])(webrip)(?![a-z0-9])/.test(s)) return 'webrip';
  if (/(?<![a-z0-9])(hdtv|pdtv)(?![a-z0-9])/.test(s)) return 'hdtv';
  return '';
}

function extractReleaseGroup(filename) {
  const cleaned = String(filename || '')
    .trim()
    .replace(/\.(mkv|mp4|avi|m4v|srt|vtt)$/i, '');
  const m = cleaned.match(/-([a-z0-9]{2,16})$/i);
  if (!m) return '';
  const grp = m[1].toLowerCase();
  if (/^(dl|rip|1080p|720p|x264|x265|hevc|aac|ac3|eng|heb|vo)$/.test(grp)) return '';
  return grp;
}

/**
 * Handles live Stremio subtitle requests (`/subtitles/:type/:id.json` & `/:extra.json`).
 * Forwards exact videoHash / videoSize / filename to OpenSubtitles v3 & OpenSubtitles PRO
 * and scores Greek (`ell`) subtitles by release group, source cut (BluRay vs WEB-DL fps timing),
 * and filename tokens for exact Netflix-grade auto-sync.
 */
async function handleSubtitlesRequest({
  type,
  id,
  extra = '',
  cache = null,
  cacheTtlMs = 300_000,
  httpTimeoutMs = 4500,
}) {
  const cleanId = String(id || '').trim();
  if (!VALID_TYPES.has(type) || !IMDB_ID_RE.test(cleanId)) {
    return {
      payload: { subtitles: [] },
      cacheHit: false,
      cacheControl: getCacheControlHeader('subtitles'),
    };
  }

  const parsedExtra = typeof extra === 'string' ? parseExtraParams(extra) : extra || {};
  const videoFilename = String(parsedExtra.filename || '');
  const videoHash = String(parsedExtra.videoHash || '');
  const releaseTokens = tokenizeFilename(videoFilename);
  const videoCut = detectReleaseCut(videoFilename);
  const videoGroup = extractReleaseGroup(videoFilename);

  const cacheKey = `subtitles:${type}:${cleanId}:${videoHash || ''}:${videoFilename || 'default'}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return {
        payload: cached,
        cacheHit: true,
        cacheControl: getCacheControlHeader('subtitles'),
      };
    }
  }

  const timeoutBudget = Math.min(Number(httpTimeoutMs) || 4500, 5000);
  const encodedType = encodeURIComponent(type);
  const encodedId = encodeURIComponent(cleanId);
  const cleanExtraSegment = typeof extra === 'string' ? extra.replace(/^\/+|\/+$/g, '') : '';
  const extraPath = cleanExtraSegment ? `/${cleanExtraSegment}` : '';

  const osV3Url = `https://opensubtitles-v3.strem.io/subtitles/${encodedType}/${encodedId}${extraPath}.json`;
  const osProUrl = `${OPENSUBTITLES_PRO_GREEK_BASE}/subtitles/${encodedType}/${encodedId}${extraPath}.json`;

  const [v3Resp, proResp] = await Promise.all([
    fetchJsonWithTimeout(osV3Url, { timeoutMs: timeoutBudget }),
    fetchJsonWithTimeout(osProUrl, { timeoutMs: timeoutBudget }),
  ]);

  const seenUrls = new Set();
  const candidates = [];

  const collect = (rawList, sourceName, priorityBoost) => {
    if (!Array.isArray(rawList)) return;
    for (const sub of rawList) {
      if (!sub || typeof sub !== 'object' || !sub.url) continue;
      const lang = String(sub.lang || '').toLowerCase().trim();
      if (!GREEK_LANGS.has(lang)) continue;

      const subUrl = String(sub.url).trim();
      if (!subUrl.startsWith('http://') && !subUrl.startsWith('https://')) continue;
      if (seenUrls.has(subUrl)) continue;
      seenUrls.add(subUrl);

      const rawMeta = sub.subtitleFileName || sub.movieReleaseName || sub.label || sourceName;
      const fileMeta = cleanLabel(rawMeta);
      const lowerMeta = `${fileMeta} ${sub.id || ''}`.toLowerCase();

      let tokenMatches = 0;
      for (const tok of releaseTokens) {
        if (lowerMeta.includes(tok)) tokenMatches++;
      }

      const subCut = detectReleaseCut(lowerMeta);
      const subGroup = extractReleaseGroup(rawMeta);
      const isGroupMatch = Boolean(videoGroup && (subGroup === videoGroup || lowerMeta.includes(videoGroup)));
      const isCutMatch = Boolean(videoCut && subCut && videoCut === subCut);
      const isCutMismatch = Boolean(videoCut && subCut && videoCut !== subCut);
      const isHashMatch = Boolean(
        videoHash && (sub.m === 'hash' || sub.matchedBy === 'hash' || lowerMeta.includes(videoHash.toLowerCase()))
      );
      const isUtf8Srt = subUrl.includes('subencoding-stremio-utf8') || /\.srt(?:\?|$)/i.test(subUrl);
      const isHearingImpaired = /\b(sdh|cc|hi|hearing[\s._-]*impaired)\b/i.test(lowerMeta);

      const score =
        priorityBoost +
        (isHashMatch ? 260 : 0) +
        (isGroupMatch ? 220 : 0) +
        (isCutMatch ? 160 : isCutMismatch ? -80 : 0) +
        tokenMatches * 45 +
        (isUtf8Srt ? 30 : 0) -
        (isHearingImpaired ? 60 : 0);

      const isExactSync = isHashMatch || isGroupMatch || isCutMatch || tokenMatches >= 2;
      const syncPrefix = isExactSync
        ? '🇬🇷 Ελληνικά (Exact Sync · BestPlay)'
        : '🇬🇷 Ελληνικά (BestPlay)';

      candidates.push({
        score,
        entry: {
          id: String(sub.id || `el-${candidates.length + 1}`),
          url: subUrl,
          lang: 'ell',
          label: `${syncPrefix} · ${fileMeta}`,
        },
      });
    }
  };

  collect(v3Resp?.subtitles, 'OpenSubtitles v3', 100);
  collect(proResp?.subtitles, 'OpenSubtitles PRO Auto-Sync', 55);

  candidates.sort((a, b) => b.score - a.score);
  const payload = { subtitles: candidates.slice(0, 5).map((c) => c.entry) };

  if (cache && payload.subtitles.length > 0) {
    cache.set(cacheKey, payload, cacheTtlMs);
  }

  return {
    payload,
    cacheHit: false,
    cacheControl: getCacheControlHeader('subtitles'),
  };
}

  return { handleSubtitlesRequest };
})();

export { filterAndRankStreams, handleStreamRequest, handleSubtitlesRequest, handleCatalogRequest, handleMetaRequest, buildManifest, validateManifest };

// ---------------- HTTP Server ----------------
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, X-Cache');
}

function sendJson(res, statusCode, payload, { cacheControl = '', cacheStatus = '' } = {}) {
  const body = JSON.stringify(payload);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));
  if (cacheControl) res.setHeader('Cache-Control', cacheControl);
  if (cacheStatus) res.setHeader('X-Cache', cacheStatus);
  res.end(body);
}

function resolveOrigin(req, listenPort, envConfig) {
  const tunnelFile = path.join(__dirname, '.tunnel-url');
  try {
    if (fs.existsSync(tunnelFile)) {
      const urlFromFile = fs.readFileSync(tunnelFile, 'utf8').trim().replace(/\/+$/, '');
      if (urlFromFile.startsWith('https://')) return urlFromFile;
    }
  } catch {}
  if (envConfig.tunnelUrl && envConfig.tunnelUrl.startsWith('http')) return envConfig.tunnelUrl;
  if (envConfig.appUrl && envConfig.appUrl.startsWith('http')) return envConfig.appUrl;

  const rawHost = req.headers['x-forwarded-host'] || req.headers.host;
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
  if (host) {
    return host.includes('localhost') || host.includes('127.0.0.1') ? `http://${host}` : `https://${host}`;
  }
  return `http://localhost:${listenPort}`;
}

function createRequestHandler({ listenPort, envConfig, cache }) {
  const cacheTtlMs = envConfig.cacheTtlSeconds * 1000;
  return async (req, res) => {
    const startTime = Date.now();
    setCorsHeaders(res);
    res.on('finish', () => {
      console.log(
        `[${new Date().toISOString()}] [:${listenPort}] ${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - startTime}ms)`
      );
    });

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || `localhost:${listenPort}`}`);
      const pathname = parsedUrl.pathname;

      if (pathname === '/favicon.ico') {
        res.statusCode = 204;
        res.end();
        return;
      }

      if (pathname === '/health') {
        sendJson(
          res,
          200,
          { ok: true, status: 'healthy', zeroMockMode: true, port: listenPort, uptimeSeconds: Math.round(process.uptime()), cache: cache.getStats() },
          { cacheControl: 'no-store' }
        );
        return;
      }

      const origin = resolveOrigin(req, listenPort, envConfig);

      if (pathname === '/' || pathname === '') {
        res.statusCode = 302;
        res.setHeader('Location', `${origin}/bestplay-config_Version10.html`);
        res.end();
        return;
      }

      if (pathname === '/api/addon-health') {
        const manifest = buildManifest(origin);
        sendJson(
          res,
          200,
          {
            status: 'active',
            version: manifest.version,
            zeroMockMode: true,
            manifestUrl: `${origin}/manifest.json`,
            bestPlayHtmlUrl: `${origin}/bestplay-config_Version10.html`,
            logoUrl: manifest.logo,
            backgroundUrl: manifest.background,
            manifest,
            cache: cache.getStats(),
          },
          { cacheControl: 'no-store' }
        );
        return;
      }

      if (/^(?:\/([^/]+))?\/manifest\.json$/.test(pathname)) {
        const manifestKey = `manifest:${origin}`;
        let manifest = cache.get(manifestKey);
        const cacheHit = Boolean(manifest);
        if (!manifest) {
          manifest = buildManifest(origin);
          cache.set(manifestKey, manifest, 3600_000);
        }
        sendJson(res, 200, manifest, {
          cacheControl: getCacheControlHeader('manifest'),
          cacheStatus: cacheHit ? 'HIT' : 'MISS',
        });
        return;
      }

      if (/^(?:\/([^/]+))?\/configure$/.test(pathname)) {
        res.statusCode = 302;
        res.setHeader('Location', `${origin}/bestplay-config_Version10.html`);
        res.end();
        return;
      }

      const catalogMatch = pathname.match(/^(?:\/([^/]+))?\/catalog\/([^/]+)\/([^/]+?)(?:\/([^/]+))?\.json$/);
      if (catalogMatch) {
        const result = await handleCatalogRequest({
          type: decodeURIComponent(catalogMatch[2] || ''),
          id: decodeURIComponent(catalogMatch[3] || ''),
          extra: catalogMatch[4] || '',
          cache,
          cacheTtlMs,
          httpTimeoutMs: envConfig.httpTimeoutMs,
        });
        sendJson(res, 200, result.payload, { cacheControl: result.cacheControl, cacheStatus: result.cacheHit ? 'HIT' : 'MISS' });
        return;
      }

      const metaMatch = pathname.match(/^(?:\/([^/]+))?\/meta\/([^/]+)\/([^/]+?)\.json$/);
      if (metaMatch) {
        const result = await handleMetaRequest({
          type: decodeURIComponent(metaMatch[2] || ''),
          id: decodeURIComponent(metaMatch[3] || ''),
          cache,
          cacheTtlMs,
          httpTimeoutMs: envConfig.httpTimeoutMs,
        });
        sendJson(res, 200, result.payload, { cacheControl: result.cacheControl, cacheStatus: result.cacheHit ? 'HIT' : 'MISS' });
        return;
      }

      const streamMatch = pathname.match(/^(?:\/([^/]+))?\/stream\/([^/]+)\/([^/]+?)(?:\/([^/]+))?\.json$/);
      if (streamMatch) {
        const result = await handleStreamRequest({
          type: decodeURIComponent(streamMatch[2] || ''),
          id: decodeURIComponent(streamMatch[3] || ''),
          configStr: streamMatch[1] || '',
          envConfig,
          cache,
          cacheTtlMs,
          httpTimeoutMs: envConfig.httpTimeoutMs,
          simulateTimeout: parsedUrl.searchParams.get('simulateTimeout') === '1',
        });
        sendJson(res, 200, result.payload, { cacheControl: result.cacheControl, cacheStatus: result.cacheHit ? 'HIT' : 'MISS' });
        return;
      }

      const subMatch = pathname.match(/^(?:\/([^/]+))?\/subtitles\/([^/]+)\/([^/]+?)(?:\/([^/]+))?\.json$/);
      if (subMatch) {
        const result = await handleSubtitlesRequest({
          type: decodeURIComponent(subMatch[2] || ''),
          id: decodeURIComponent(subMatch[3] || ''),
          extra: subMatch[4] || '',
          cache,
          cacheTtlMs,
          httpTimeoutMs: envConfig.httpTimeoutMs,
        });
        sendJson(res, 200, result.payload, { cacheControl: result.cacheControl, cacheStatus: result.cacheHit ? 'HIT' : 'MISS' });
        return;
      }

      const mappedFile = STATIC_ALIASES[pathname];
      if (mappedFile) {
        const resolved = path.resolve(publicDir, mappedFile);
        if (resolved.startsWith(publicDir + path.sep) && fs.existsSync(resolved)) {
          const ext = path.extname(resolved).toLowerCase();
          const content = fs.readFileSync(resolved);
          res.statusCode = 200;
          res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
          res.setHeader('Content-Length', content.length);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(content);
          return;
        }
        const embedded = EMBEDDED_ASSETS[mappedFile];
        if (embedded) {
          res.statusCode = 200;
          res.setHeader('Content-Type', embedded.mime);
          res.setHeader('Content-Length', embedded.data.length);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(embedded.data);
          return;
        }
      }

      sendJson(res, 404, { error: { message: `Route not found: ${pathname}` } });
    } catch (err) {
      sendJson(res, 500, { error: { message: err instanceof Error ? err.message : 'Internal server error' } });
    }
  };
}

export async function startAddonServer({ ports } = {}) {
  await loadEnv(__dirname);
  const envConfig = getConfig();
  const cache = new AddonCache({ maxEntries: 500, defaultTtlMs: envConfig.cacheTtlSeconds * 1000 });
  const targetPorts = Array.isArray(ports)
    ? ports.filter((p) => Number(p) > 0)
    : Array.from(new Set([envConfig.port, envConfig.secondaryPort].filter((p) => Number.isFinite(p) && p > 0)));

  const servers = [];
  for (const port of targetPorts) {
    const server = http.createServer(createRequestHandler({ listenPort: port, envConfig, cache }));
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, '0.0.0.0', () => {
        server.removeListener('error', reject);
        console.log(`[BestPlay Addon] Zero-mock Stremio server listening on http://localhost:${port}`);
        servers.push(server);
        resolve();
      });
    });
  }

  const closeAll = async () => {
    await Promise.all(servers.map((srv) => new Promise((resolve) => srv.close(() => resolve()))));
  };

  return { servers, cache, envConfig, closeAll };
}

const isDirectRun =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase();

if (isDirectRun) {
  const runtime = await startAddonServer();
  const shutdown = async () => {
    await runtime.closeAll();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
