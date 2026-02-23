#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const HOST = '127.0.0.1';
const STEP_TIMEOUT_MS = 12000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 350;

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
  const cleanPath = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
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
    server.listen(0, HOST, () => {
      const address = server.address();
      const port = address && typeof address === 'object' ? address.port : null;
      if (!port) {
        reject(new Error('Could not determine static server port'));
        return;
      }
      resolve({ server, port });
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(name, fn, attempts = RETRY_ATTEMPTS) {
  let lastError = null;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts) await sleep(RETRY_DELAY_MS);
    }
  }
  const base = lastError && lastError.message ? lastError.message : String(lastError || 'unknown error');
  throw new Error(`${name} failed after ${attempts} attempt(s): ${base}`);
}

async function waitAndClick(page, selector) {
  await page.waitForSelector(selector, { state: 'visible', timeout: STEP_TIMEOUT_MS });
  await page.click(selector, { timeout: STEP_TIMEOUT_MS });
}

async function waitAndFill(page, selector, value) {
  await page.waitForSelector(selector, { state: 'visible', timeout: STEP_TIMEOUT_MS });
  await page.fill(selector, value, { timeout: STEP_TIMEOUT_MS });
}

async function run() {
  const { server, port } = await startStaticServer();
  const baseUrl = `http://${HOST}:${port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ acceptDownloads: true });

    // 1) Intent switch + mode sync
    const page = await context.newPage();
    page.setDefaultTimeout(STEP_TIMEOUT_MS);
    await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await withRetry('intent switch + mode sync', async () => {
      await waitAndClick(page, '[data-ui-intent-btn="operations"]');
      await page.waitForFunction(
        selector => document.querySelector(selector)?.getAttribute('aria-pressed') === 'true',
        '[data-ui-mode-btn="operator"]',
        { timeout: STEP_TIMEOUT_MS }
      );
    });
    const operatorPressed = await page.getAttribute('[data-ui-mode-btn="operator"]', 'aria-pressed');
    assert.strictEqual(operatorPressed, 'true', 'Operations intent should sync mode to operator');

    // 2) Shared-link restore for intent + mode
    await waitAndFill(page, '#inp-infraTotal', '2500');
    await waitAndFill(page, '#inp-ARPU', '72');
    await waitAndClick(page, '[data-ui-intent-btn="architecture"]');
    await waitAndClick(page, '[data-ui-mode-btn="operator"]');
    await page.waitForFunction(
      () => document.querySelector('[data-ui-intent-btn="architecture"]')?.getAttribute('aria-pressed') === 'true',
      null,
      { timeout: STEP_TIMEOUT_MS }
    );

    const shareUrl = await withRetry('generate share url', async () => page.evaluate(() => {
      const urlObj = window.buildShareStateUrl ? window.buildShareStateUrl() : null;
      return urlObj ? urlObj.toString() : null;
    }));
    assert.ok(shareUrl, 'Expected share URL to be generated after entering inputs');

    const pageRestore = await context.newPage();
    pageRestore.setDefaultTimeout(STEP_TIMEOUT_MS);
    await pageRestore.goto(shareUrl, { waitUntil: 'domcontentloaded' });
    await pageRestore.waitForSelector('[data-ui-intent-btn="architecture"]', { timeout: STEP_TIMEOUT_MS });
    const restoredIntent = await pageRestore.getAttribute('[data-ui-intent-btn="architecture"]', 'aria-pressed');
    const restoredMode = await pageRestore.getAttribute('[data-ui-mode-btn="operator"]', 'aria-pressed');
    assert.strictEqual(restoredIntent, 'true', 'Shared link should restore architecture intent');
    assert.strictEqual(restoredMode, 'true', 'Shared link should preserve explicit mode override');

    // 3) Guided-path transitions (todo -> active -> done)
    const pageFlow = await context.newPage();
    pageFlow.setDefaultTimeout(STEP_TIMEOUT_MS);
    await pageFlow.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
    await pageFlow.waitForSelector('#intent-path-progress', { timeout: STEP_TIMEOUT_MS });

    const initialProgress = (await pageFlow.textContent('#intent-path-progress')) || '';
    assert.ok(
      initialProgress.includes('0/3') || initialProgress.includes('1/3'),
      `Expected initial guided progress to include 0/3 or 1/3, got: ${initialProgress}`
    );

    await waitAndFill(pageFlow, '#inp-infraTotal', '2000');
    await pageFlow.waitForSelector('#intent-path .intent-step:nth-child(1)', { timeout: STEP_TIMEOUT_MS });
    await pageFlow.waitForFunction(() => {
      const el = document.querySelector('#intent-path .intent-step:nth-child(1)');
      return Boolean(el && /active|done/.test(el.className));
    }, null, { timeout: STEP_TIMEOUT_MS });
    const firstStepActiveClass = await pageFlow.getAttribute('#intent-path .intent-step:nth-child(1)', 'class');
    assert.ok(
      firstStepActiveClass && /active|done/.test(firstStepActiveClass),
      'First guided step should transition from todo after partial viability input'
    );

    await waitAndFill(pageFlow, '#inp-ARPU', '80');
    await pageFlow.waitForFunction(() => {
      const score = document.getElementById('health-score-value');
      const cards = document.querySelectorAll('#rec-list .rec-card');
      return Boolean(score && score.textContent.trim() !== '—' && cards.length > 0);
    }, null, { timeout: STEP_TIMEOUT_MS });
    await pageFlow.waitForFunction(() => {
      const text = document.getElementById('intent-path-progress')?.textContent || '';
      return text.includes('3/3');
    }, null, { timeout: STEP_TIMEOUT_MS });

    const doneProgress = (await pageFlow.textContent('#intent-path-progress')) || '';
    assert.ok(doneProgress.includes('3/3'), `Expected guided progress to include 3/3 after complete signal set, got: ${doneProgress}`);

    // 4) Intent export button triggers CSV download
    await pageFlow.waitForSelector('#intent-export-btn', { state: 'visible', timeout: STEP_TIMEOUT_MS });
    const [download] = await Promise.all([
      pageFlow.waitForEvent('download', { timeout: STEP_TIMEOUT_MS }),
      pageFlow.click('#intent-export-btn', { timeout: STEP_TIMEOUT_MS })
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
