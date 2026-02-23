#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const HOST = '127.0.0.1';
const PORT = 4173;

function contentTypeFor(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}

function safeResolve(urlPath) {
  const cleanPath = urlPath.split('?')[0].split('#')[0];
  const mapped = cleanPath === '/' ? '/index.html' : cleanPath;
  const resolved = path.resolve(ROOT, `.${mapped}`);
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const resolved = safeResolve(req.url || '/');
    if (!resolved || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    try {
      const body = fs.readFileSync(resolved);
      res.writeHead(200, { 'Content-Type': contentTypeFor(resolved) });
      res.end(body);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, HOST, () => resolve(server));
  });
}

async function run() {
  const server = await startStaticServer();
  const baseUrl = `http://${HOST}:${PORT}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ acceptDownloads: true });

    // 1) Intent switch + mode sync
    const page = await context.newPage();
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.click('[data-ui-intent-btn="operations"]');
    const operatorPressed = await page.getAttribute('[data-ui-mode-btn="operator"]', 'aria-pressed');
    assert.strictEqual(operatorPressed, 'true', 'Operations intent should sync mode to operator');

    // 2) Shared-link restore for intent + mode
    await page.fill('#inp-infraTotal', '2500');
    await page.fill('#inp-ARPU', '72');
    await page.click('[data-ui-intent-btn="architecture"]');
    await page.click('[data-ui-mode-btn="operator"]');

    const shareUrl = await page.evaluate(() => {
      const urlObj = window.buildShareStateUrl ? window.buildShareStateUrl() : null;
      return urlObj ? urlObj.toString() : null;
    });
    assert.ok(shareUrl, 'Expected share URL to be generated after entering inputs');

    const pageRestore = await context.newPage();
    await pageRestore.goto(shareUrl, { waitUntil: 'domcontentloaded' });
    const restoredIntent = await pageRestore.getAttribute('[data-ui-intent-btn="architecture"]', 'aria-pressed');
    const restoredMode = await pageRestore.getAttribute('[data-ui-mode-btn="operator"]', 'aria-pressed');
    assert.strictEqual(restoredIntent, 'true', 'Shared link should restore architecture intent');
    assert.strictEqual(restoredMode, 'true', 'Shared link should preserve explicit mode override');

    // 3) Guided-path transitions (todo -> active -> done)
    const pageFlow = await context.newPage();
    await pageFlow.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });

    const initialProgress = (await pageFlow.textContent('#intent-path-progress')) || '';
    assert.ok(initialProgress.includes('0/3'), `Expected initial guided progress to include 0/3, got: ${initialProgress}`);

    await pageFlow.fill('#inp-infraTotal', '2000');
    const firstStepActiveClass = await pageFlow.getAttribute('#intent-path .intent-step:nth-child(1)', 'class');
    assert.ok(firstStepActiveClass && firstStepActiveClass.includes('active'), 'First guided step should become active after partial viability input');

    await pageFlow.fill('#inp-ARPU', '80');
    await pageFlow.waitForFunction(() => {
      const score = document.getElementById('health-score-value');
      const cards = document.querySelectorAll('#rec-list .rec-card');
      return Boolean(score && score.textContent.trim() !== '—' && cards.length > 0);
    });

    const doneProgress = (await pageFlow.textContent('#intent-path-progress')) || '';
    assert.ok(doneProgress.includes('3/3'), `Expected guided progress to include 3/3 after complete signal set, got: ${doneProgress}`);

    // 4) Intent export button triggers CSV download
    const [download] = await Promise.all([
      pageFlow.waitForEvent('download'),
      pageFlow.click('#intent-export-btn')
    ]);
    const filename = download.suggestedFilename();
    assert.ok(
      /^ficecal-viability-preset-\d{4}-\d{2}-\d{2}\.csv$/.test(filename),
      `Unexpected export filename: ${filename}`
    );

    console.log('[PASS] Wave 3 Playwright smoke checks passed');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(err => {
  console.error('[FAIL] Wave 3 Playwright smoke checks failed');
  console.error(err);
  process.exit(1);
});
