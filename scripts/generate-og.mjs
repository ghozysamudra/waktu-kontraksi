import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const staticDir = join(rootDir, 'static');
mkdirSync(staticDir, { recursive: true });

function toDataUri(filePath, mimeType) {
  return `data:${mimeType};base64,${readFileSync(filePath).toString('base64')}`;
}

const loraFont = toDataUri(
  join(rootDir, 'node_modules/@fontsource-variable/lora/files/lora-latin-wght-normal.woff2'),
  'font/woff2'
);
const dmSansFont = toDataUri(
  join(rootDir, 'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'),
  'font/woff2'
);
const logoUri = toDataUri(join(rootDir, 'assets/logo.png'), 'image/png');
const sprigUri = toDataUri(join(rootDir, 'src/lib/sprig.webp'), 'image/webp');

const timerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`;
const smallTimerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`;
const bookSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/></svg>`;
const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`;
const stopSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`;

const variants = [
  {
    output: join(staticDir, 'og-image.png'),
    lang: 'id',
    headingLine1: 'Timer Kontraksi',
    headingLine2: 'Persalinan',
    subtitle: 'Catat durasi, jarak antar kontraksi, dan pahami pola <span class="nowrap">5–1–1</span> dengan tenang di browser Anda.',
    pills: [
      { icon: smallTimerSvg, label: 'Durasi & Jarak', tone: 'rose' },
      { icon: bookSvg, label: 'Pola 5–1–1', tone: 'sage' },
      { icon: lockSvg, label: 'Privat di Browser', tone: 'cream' }
    ],
    cardTitle: 'Pencatat waktu',
    status: 'Mencatat',
    clock: '01:02',
    clockUnits: 'Menit · Detik',
    action: 'Selesai Kontraksi',
    avgLabel: 'Rata-rata durasi',
    avgValue: '1 mnt 2 dtk',
    intervalLabel: 'Jarak terakhir',
    intervalValue: '5 mnt 4 dtk'
  },
  {
    output: join(staticDir, 'og-image-en.png'),
    lang: 'en',
    headingLine1: 'Labor Contraction',
    headingLine2: 'Timer',
    subtitle: 'Track contraction duration, intervals, and the <span class="nowrap">5–1–1</span> pattern calmly in your browser.',
    pills: [
      { icon: smallTimerSvg, label: 'Duration & Interval', tone: 'rose' },
      { icon: bookSvg, label: '5–1–1 Pattern', tone: 'sage' },
      { icon: lockSvg, label: 'Private & Local', tone: 'cream' }
    ],
    cardTitle: 'Timer',
    status: 'Recording',
    clock: '01:02',
    clockUnits: 'Minutes · Seconds',
    action: 'End Contraction',
    avgLabel: 'Average duration',
    avgValue: '1 min 2 sec',
    intervalLabel: 'Latest interval',
    intervalValue: '5 min 4 sec'
  }
];

function renderOgHtml(variant) {
  const pillsHtml = variant.pills
    .map(
      (pill) =>
        `<span class="pill ${pill.tone}">${pill.icon}<span>${pill.label}</span></span>`
    )
    .join('');

  return `<!doctype html>
<html lang="${variant.lang}">
<head>
  <meta charset="utf-8" />
  <style>
    @font-face {
      font-family: 'Lora Variable';
      font-style: normal;
      font-weight: 400 700;
      src: url('${loraFont}') format('woff2-variations');
    }
    @font-face {
      font-family: 'DM Sans Variable';
      font-style: normal;
      font-weight: 100 1000;
      src: url('${dmSansFont}') format('woff2-variations');
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #faf6ef;
      color: #362923;
      font-family: 'DM Sans Variable', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .canvas {
      position: relative;
      width: 1200px;
      height: 630px;
      display: grid;
      grid-template-columns: 1.28fr 0.92fr;
      align-items: center;
      gap: 40px;
      padding: 58px 70px;
      background:
        radial-gradient(640px 520px at 88% 10%, rgba(247, 232, 225, 0.85) 0%, transparent 72%),
        radial-gradient(560px 460px at 78% 96%, rgba(237, 240, 229, 0.95) 0%, transparent 72%),
        radial-gradient(420px 380px at 8% 92%, rgba(247, 232, 225, 0.48) 0%, transparent 70%),
        #faf6ef;
      isolation: isolate;
    }

    .sprig {
      position: absolute;
      right: 6px;
      bottom: -8px;
      width: 248px;
      height: 372px;
      object-fit: contain;
      opacity: 0.82;
      z-index: 0;
    }

    .nowrap {
      white-space: nowrap;
    }

    .copy {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 30px;
    }

    .brand img {
      width: 56px;
      height: 56px;
      display: block;
    }

    .brand span {
      font-family: 'Lora Variable', Georgia, serif;
      font-size: 27px;
      font-weight: 650;
      letter-spacing: -0.04em;
      color: #362923;
    }

    h1 {
      font-family: 'Lora Variable', Georgia, serif;
      font-size: 64px;
      font-weight: 590;
      line-height: 1.08;
      letter-spacing: -0.048em;
      color: #362923;
    }

    .subtitle {
      margin-top: 22px;
      max-width: 545px;
      font-size: 23px;
      line-height: 1.48;
      color: #6c5d54;
      font-weight: 460;
    }

    .pills {
      margin-top: 34px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 640;
      letter-spacing: -0.01em;
    }

    .pill.rose {
      background: #f7e8e1;
      color: #8f4238;
      border: 1px solid #ebd2c8;
    }

    .pill.sage {
      background: #edf0e5;
      color: #3f4c34;
      border: 1px solid #d6deca;
    }

    .pill.cream {
      background: #fffdf9;
      color: #62534b;
      border: 1px solid #e6d9cc;
    }

    .card-wrap {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
    }

    .card {
      width: 100%;
      max-width: 408px;
      background: #fffdf9;
      border: 1.5px solid #e9ded3;
      border-radius: 28px;
      padding: 26px 28px 24px;
      box-shadow:
        0 24px 56px rgba(54, 41, 35, 0.085),
        0 4px 14px rgba(54, 41, 35, 0.04);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .card-head {
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .card-label {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .icon-tile {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #f7e8e1;
      color: #984b40;
      display: grid;
      place-items: center;
    }

    .card-title {
      font-size: 18px;
      font-weight: 720;
      letter-spacing: -0.03em;
      color: #362923;
    }

    .state-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 6px 12px;
      border-radius: 999px;
      background: #f8e5df;
      color: #873c34;
      font-size: 13px;
      font-weight: 700;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    .timer-face {
      width: 212px;
      height: 212px;
      margin: 22px 0 22px;
      padding: 9px;
      border: 1.5px dashed #a24e43;
      border-radius: 50%;
      background: #fffbf7;
      display: grid;
      place-items: center;
    }

    .timer-dial {
      width: 100%;
      height: 100%;
      border: 1px solid #d89c8e;
      border-radius: 50%;
      background: radial-gradient(circle at 48% 47%, #fff7f1 12%, #f6d8cd 100%);
      color: #a24e43;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .clock {
      margin: 4px 0 3px;
      color: #362923;
      font-variant-numeric: tabular-nums;
      font-size: 56px;
      font-weight: 590;
      line-height: 1.08;
      letter-spacing: -0.06em;
    }

    .clock-units {
      color: #8a5447;
      text-transform: uppercase;
      font-size: 10.5px;
      font-weight: 720;
      letter-spacing: 0.14em;
    }

    .cta {
      width: 100%;
      height: 54px;
      border-radius: 14px;
      background: #843d35;
      border: 1px solid #76342d;
      color: #ffffff;
      font-size: 17.5px;
      font-weight: 660;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(132, 61, 53, 0.22);
    }

    .mini-stats {
      align-self: stretch;
      margin-top: 18px;
      padding-top: 15px;
      border-top: 1px solid #efe5da;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .mini-stat {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .mini-stat-label {
      font-size: 12.5px;
      color: #6c5d54;
      font-weight: 520;
    }

    .mini-stat-value {
      font-size: 16.5px;
      color: #362923;
      font-weight: 720;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <img class="sprig" src="${sprigUri}" alt="" />

    <div class="copy">
      <div class="brand">
        <img src="${logoUri}" alt="" />
        <span>Waktu Kontraksi</span>
      </div>
      <h1>${variant.headingLine1}<br />${variant.headingLine2}</h1>
      <p class="subtitle">${variant.subtitle}</p>
      <div class="pills">${pillsHtml}</div>
    </div>

    <div class="card-wrap">
      <div class="card">
        <div class="card-head">
          <div class="card-label">
            <span class="icon-tile">${timerSvg}</span>
            <span class="card-title">${variant.cardTitle}</span>
          </div>
          <span class="state-pill"><span class="dot"></span>${variant.status}</span>
        </div>

        <div class="timer-face">
          <div class="timer-dial">
            ${timerSvg}
            <div class="clock">${variant.clock}</div>
            <span class="clock-units">${variant.clockUnits}</span>
          </div>
        </div>

        <div class="cta">${stopSvg}<span>${variant.action}</span></div>

        <div class="mini-stats">
          <div class="mini-stat">
            <span class="mini-stat-label">${variant.avgLabel}</span>
            <span class="mini-stat-value">${variant.avgValue}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-label">${variant.intervalLabel}</span>
            <span class="mini-stat-value">${variant.intervalValue}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderAppleTouchIconHtml() {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 180px;
      height: 180px;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 48%, #fffdf9 28%, #f5ece2 100%);
      display: grid;
      place-items: center;
    }
    img {
      width: 118px;
      height: 118px;
      display: block;
    }
  </style>
</head>
<body>
  <img src="${logoUri}" alt="" />
</body>
</html>`;
}

function createCdpClient(wsUrl) {
  return new Promise((resolveClient, rejectClient) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Map();

    ws.addEventListener('open', () => {
      resolveClient({
        send(method, params = {}) {
          const id = nextId++;
          return new Promise((resolveCmd, rejectCmd) => {
            pending.set(id, { resolve: resolveCmd, reject: rejectCmd });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        once(eventName) {
          return new Promise((resolveEvent) => {
            const list = listeners.get(eventName) ?? [];
            list.push(resolveEvent);
            listeners.set(eventName, list);
          });
        },
        close() {
          ws.close();
        }
      });
    });

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method && listeners.has(message.method)) {
        const callbacks = listeners.get(message.method);
        listeners.delete(message.method);
        for (const callback of callbacks) callback(message.params);
      }
    });

    ws.addEventListener('error', (error) => rejectClient(error));
  });
}

async function launchBrowser() {
  const executable = process.env.CHROME_PATH || '/snap/bin/chromium';
  const child = spawn(
    executable,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--remote-debugging-port=0',
      'about:blank'
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  const wsUrl = await new Promise((resolveUrl, rejectUrl) => {
    let buffer = '';
    const timeout = setTimeout(() => rejectUrl(new Error('Timed out waiting for Chromium DevTools')), 15000);

    child.stderr.on('data', (chunk) => {
      buffer += chunk.toString();
      const match = buffer.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolveUrl(match[1]);
      }
    });

    child.once('exit', (code) => {
      clearTimeout(timeout);
      rejectUrl(new Error(`Chromium exited early with code ${code}: ${buffer}`));
    });
  });

  const browserUrl = new URL(wsUrl);
  const targets = await (await fetch(`http://${browserUrl.host}/json/list`)).json();
  const pageTarget = targets.find((target) => target.type === 'page');
  if (!pageTarget?.webSocketDebuggerUrl) {
    child.kill();
    throw new Error('Could not find Chromium page target');
  }

  const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  return {
    cdp,
    async close() {
      cdp.close();
      child.kill('SIGTERM');
    }
  };
}

const pages = new Map();
const server = createServer((req, res) => {
  const html = pages.get(req.url);
  if (!html) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();
const browser = await launchBrowser();

async function renderScreenshot(routePath, html, outputPath, width, height) {
  pages.set(routePath, html);
  await browser.cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false
  });
  const loadEvent = browser.cdp.once('Page.loadEventFired');
  await browser.cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}${routePath}` });
  await loadEvent;
  await browser.cdp.send('Runtime.evaluate', {
    expression: 'document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))',
    awaitPromise: true
  });
  const { data } = await browser.cdp.send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(outputPath, Buffer.from(data, 'base64'));
}

try {
  for (const variant of variants) {
    await renderScreenshot(`/og-${variant.lang}`, renderOgHtml(variant), variant.output, 1200, 630);
    const sizeKb = (statSync(variant.output).size / 1024).toFixed(1);
    console.log(`Generated ${variant.output} (${sizeKb} KB)`);
  }

  const touchIconPath = join(staticDir, 'apple-touch-icon.png');
  await renderScreenshot('/touch-icon', renderAppleTouchIconHtml(), touchIconPath, 180, 180);
  console.log(`Generated ${touchIconPath} (${(statSync(touchIconPath).size / 1024).toFixed(1)} KB)`);

  const icon96Path = join(staticDir, 'icon-96.png');
  copyFileSync(join(rootDir, 'assets/logo.png'), icon96Path);
  console.log(`Copied ${icon96Path} (${(statSync(icon96Path).size / 1024).toFixed(1)} KB)`);
} finally {
  await browser.close();
  server.close();
}
