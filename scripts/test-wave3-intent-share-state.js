#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function getInlineScript(html) {
  const start = html.lastIndexOf('<script>');
  const end = html.lastIndexOf('</script>');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not locate inline calculator script in index.html');
  }
  return html.slice(start + '<script>'.length, end);
}

function extractBetween(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  if (start === -1) throw new Error(`Start token not found: ${startToken}`);

  const end = source.indexOf(endToken, start);
  if (end === -1) throw new Error(`End token not found after ${startToken}: ${endToken}`);

  return source.slice(start, end);
}

function makeCard(labelText, valueText) {
  return {
    querySelector(selector) {
      if (selector === '.calc-out-label') return { textContent: labelText };
      if (selector === '.calc-out-val') return { textContent: valueText };
      return null;
    }
  };
}

function run() {
  const indexPath = path.join(__dirname, '..', 'index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');
  const script = getInlineScript(html);

  const cardMap = new Map();
  let healthScoreValue = '—';
  let recommendationCardCount = 0;

  const context = {
    console,
    URL,
    TextEncoder,
    TextDecoder,
    btoa: input => Buffer.from(input, 'binary').toString('base64'),
    atob: input => Buffer.from(input, 'base64').toString('binary'),
    window: {
      location: {
        href: 'https://example.test/index.html',
        origin: 'https://example.test',
        pathname: '/index.html'
      },
      FiceCalFeatureRuntime: {
        getDefaultMode: () => 'quick'
      }
    },
    document: {
      getElementById(id) {
        if (id === 'health-score-value') return { textContent: healthScoreValue };
        if (cardMap.has(id)) return cardMap.get(id);
        return null;
      },
      querySelectorAll(selector) {
        if (selector === '#rec-list .rec-card') return Array.from({ length: recommendationCardCount }, () => ({}));
        return [];
      }
    },
    selectedProviders: new Set(),
    selectedRecommendationCategory: 'all',
    qbvDashboardRows: [],
    DEFAULT_TECH_DOMAINS: ['cloud'],
    activeUiIntent: 'viability',
    getCurrentUiMode: () => 'operator',
    getSelectedTechDomains: () => ['cloud']
  };

  vm.createContext(context);

  const snippets = [
    extractBetween(script, 'const UI_MODE_OPTIONS =', 'const SHAREABLE_INPUT_KEYS ='),
    extractBetween(script, 'function encodeShareState', 'function writeShareFeedback'),
    extractBetween(script, 'function normalizeUiIntent', 'function getStoredUiIntent'),
    extractBetween(script, 'function getUiIntentProfile', 'function recommendationIntentWeight'),
    extractBetween(script, 'function buildIntentSignalState', 'function renderIntentGuidedPath'),
    extractBetween(script, 'function csvEscape', 'function exportIntentPreset'),
    extractBetween(script, 'function buildShareStateUrl', 'function copyShareStateLink')
  ];

  snippets.forEach((snippet, i) => {
    vm.runInContext(snippet, context, { filename: `wave3-snippet-${i + 1}.js` });
  });

  // --- Share-state codec and URL regression checks ---
  const sampleState = {
    v: 1,
    ui: 'operations',
    um: 'operator',
    i: { nRef: '120', infraTotal: '2500' },
    td: ['cloud', 'saas'],
    p: ['aws'],
    h: []
  };

  const encoded = context.encodeShareState(sampleState);
  assert.ok(encoded && typeof encoded === 'string', 'encodeShareState should return a compact token');
  assert.strictEqual(encoded.includes('+'), false, 'Encoded token must be URL-safe (+ removed)');
  assert.strictEqual(encoded.includes('/'), false, 'Encoded token must be URL-safe (/ replaced)');

  const decoded = context.decodeShareState(encoded);
  assert.strictEqual(
    JSON.stringify(decoded),
    JSON.stringify(sampleState),
    'decodeShareState must preserve payload fields exactly'
  );
  assert.strictEqual(context.decodeShareState('not-base64###'), null, 'Invalid state token must decode to null');

  context.collectShareState = () => ({
    v: 1,
    ui: 'viability',
    um: 'quick',
    i: {},
    td: ['cloud'],
    p: [],
    h: []
  });
  assert.strictEqual(context.buildShareStateUrl(), null, 'Default empty state should not generate a share URL');

  context.collectShareState = () => sampleState;
  const urlObj = context.buildShareStateUrl();
  assert.ok(urlObj instanceof URL, 'Custom state should generate a share URL');
  assert.strictEqual(urlObj.hash, '#group-health', 'Share URL should anchor to health section');
  const urlStateToken = urlObj.searchParams.get('state');
  assert.ok(urlStateToken, 'Share URL must include encoded state parameter');
  assert.strictEqual(
    JSON.stringify(context.decodeShareState(urlStateToken)),
    JSON.stringify(sampleState),
    'Share URL state should round-trip through codec'
  );

  // --- Intent normalization and profile checks ---
  assert.strictEqual(context.normalizeUiIntent('operations'), 'operations');
  assert.strictEqual(context.normalizeUiIntent('unknown-intent'), 'viability');
  assert.strictEqual(context.getUiIntentProfile('architecture').mode, 'architect');

  // --- Guided step regression checks ---
  recommendationCardCount = 0;
  healthScoreValue = '—';
  const viabilityPartial = context.evaluateIntentSteps('viability', {
    infraTotal: 1800,
    ARPU: null,
    effectiveARPU: null
  });
  assert.strictEqual(
    JSON.stringify(viabilityPartial.map(step => step.status)),
    JSON.stringify(['active', 'todo', 'todo']),
    'Viability path should mark first step active when only cost input is present'
  );

  recommendationCardCount = 2;
  healthScoreValue = '78';
  const viabilityDone = context.evaluateIntentSteps('viability', {
    infraTotal: 1800,
    ARPU: 45,
    effectiveARPU: 45
  });
  assert.strictEqual(
    JSON.stringify(viabilityDone.map(step => step.status)),
    JSON.stringify(['done', 'done', 'done']),
    'Viability path should complete once health score and recommendations are available'
  );

  // --- Intent export preset regression checks ---
  context.selectedProviders = new Set(['aws']);
  context.selectedRecommendationCategory = 'infrastructure';
  context.getSelectedTechDomains = () => ['cloud', 'saas'];
  context.qbvDashboardRows = [
    {
      month: 1,
      clients: 120,
      modeledCost: 2100,
      budgetVariance: -150,
      baseMargin: 800,
      cumulativeGap: 320
    }
  ];

  cardMap.set('out-budgetVariance', makeCard('Budget Variance', '−€150'));
  cardMap.set('out-forecastBand', makeCard('Forecast Margin Band', '€5.2K / mo'));
  cardMap.set('out-forecastSpread', makeCard('Forecast Confidence Band', '18.0%'));
  cardMap.set('out-realizedValue', makeCard('Total Realized Value', '€2.1K / mo'));
  cardMap.set('out-realizationGap', makeCard('Residual Value Gap', '€0.4K'));
  cardMap.set('out-techNorm', makeCard('Normalized Tech Cost / Client', '€28.40 / client'));

  const operationsRows = context.collectIntentExportRows('operations', {
    infraTotal: 2100,
    ARPU: 55,
    effectiveARPU: 55,
    budgetMonthly: 1950,
    forecastGrowthPct: 8
  });

  const operationsIntentMeta = operationsRows.find(row => row[0] === 'meta' && row[1] === 'intent');
  assert.strictEqual(
    JSON.stringify(operationsIntentMeta),
    JSON.stringify(['meta', 'intent', 'operations'])
  );
  assert.ok(
    operationsRows.some(row => row[0] === 'cfo' && row[1] === 'M1'),
    'Operations export should include CFO projection rows when dashboard data exists'
  );
  assert.ok(
    operationsRows.some(row => row[0] === 'kpi' && row[1] === 'Budget Variance'),
    'Operations export should include configured KPI rows'
  );

  cardMap.set('out-aiAllocatedCost', makeCard('AI Total Allocated Cost', '€1.3K / mo'));
  cardMap.set('out-aiCostPerClient', makeCard('AI Cost / Client', '€10.20 / client'));
  cardMap.set('out-aiTokenCost', makeCard('AI Token Cost', '€320 / mo'));
  cardMap.set('out-aiRetryInflation', makeCard('AI Retry Inflation', '14.0%'));
  cardMap.set('out-aiPremiumMix', makeCard('AI Premium Mix', '28.0%'));
  cardMap.set('out-focusMaturity', makeCard('Normalization Confidence', '0.71'));

  const architectureRows = context.collectIntentExportRows('architecture', {
    aiEnabled: true,
    aiMetrics: {
      enabled: true,
      allocationPolicy: 'token-weighted',
      allocationConfidence: 'high',
      tokenGovernanceRisk: 'medium',
      tokenVolumeM: 4.2
    }
  });

  assert.ok(
    architectureRows.some(row => row[0] === 'ai' && row[1] === 'allocation_policy' && row[2] === 'token-weighted'),
    'Architecture export should include AI allocation policy telemetry'
  );
  assert.ok(
    architectureRows.some(row => row[0] === 'ai' && row[1] === 'governance_risk' && row[2] === 'medium'),
    'Architecture export should include AI governance risk telemetry'
  );

  console.log('[PASS] Wave 3 intent/share-state regression checks passed');
}

run();
