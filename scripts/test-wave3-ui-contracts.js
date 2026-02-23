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

function collectIds(html, prefix) {
  const regex = new RegExp(`id="(${prefix}[^"]+)"`, 'g');
  const values = new Set();
  let match = regex.exec(html);
  while (match) {
    values.add(match[1]);
    match = regex.exec(html);
  }
  return values;
}

function run() {
  const repoRoot = path.join(__dirname, '..');
  const indexPath = path.join(repoRoot, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf-8');
  const script = getInlineScript(html);

  // --- Static markup contracts ---
  const requiredMarkup = [
    'id="calc-intent-switch"',
    'data-ui-intent-btn="viability"',
    'data-ui-intent-btn="operations"',
    'data-ui-intent-btn="architecture"',
    'data-ui-intent-btn="executive"',
    'id="intent-path"',
    'id="intent-path-progress"',
    'id="intent-export-btn"',
    'id="calc-kpi-output-grid"',
    'id="intent-kpi-helper"',
    'id="intent-rec-helper"'
  ];

  requiredMarkup.forEach(token => {
    assert.ok(html.includes(token), `Expected markup token missing: ${token}`);
  });

  assert.ok(!html.includes('"aria-pressed":"false"'), 'Malformed aria-pressed token detected in HTML');

  // --- Runtime profile contracts ---
  const context = {
    console,
    globalThis: {}
  };
  vm.createContext(context);

  const profileSnippet = extractBetween(script, 'const UI_MODE_OPTIONS =', 'const SHAREABLE_INPUT_KEYS =');
  vm.runInContext(`${profileSnippet}; globalThis.__profiles = UI_INTENT_PROFILES; globalThis.__intentOptions = UI_INTENT_OPTIONS;`, context, {
    filename: 'wave3-ui-contract-profiles.js'
  });

  const intentOptions = context.globalThis.__intentOptions;
  const profiles = context.globalThis.__profiles;

  assert.deepStrictEqual(
    [...intentOptions],
    ['viability', 'operations', 'architecture', 'executive'],
    'Intent options must match the four Wave 3 intent keys'
  );

  const outputCardIds = collectIds(html, 'out-');
  const allowedCategories = new Set(['all', 'infrastructure', 'pricing', 'marketing', 'crm', 'governance']);

  intentOptions.forEach(intent => {
    const profile = profiles[intent];
    assert.ok(profile, `Missing profile for intent: ${intent}`);

    assert.ok(typeof profile.mode === 'string', `${intent}: mode must be defined`);
    assert.ok(typeof profile.summary === 'string' && profile.summary.length > 0, `${intent}: summary must be defined`);
    assert.ok(typeof profile.kpiHelper === 'string' && profile.kpiHelper.length > 0, `${intent}: kpiHelper must be defined`);
    assert.ok(typeof profile.recommendationHelper === 'string' && profile.recommendationHelper.length > 0, `${intent}: recommendationHelper must be defined`);
    assert.ok(typeof profile.exportLabel === 'string' && profile.exportLabel.length > 0, `${intent}: exportLabel must be defined`);

    assert.ok(Array.isArray(profile.kpiOrder) && profile.kpiOrder.length >= 3, `${intent}: kpiOrder must have at least 3 cards`);
    assert.ok(Array.isArray(profile.exportMetrics) && profile.exportMetrics.length >= 3, `${intent}: exportMetrics must have at least 3 cards`);
    assert.ok(Array.isArray(profile.guidedSteps) && profile.guidedSteps.length === 3, `${intent}: guidedSteps must define exactly 3 steps`);

    profile.kpiOrder.forEach(cardId => {
      assert.ok(outputCardIds.has(cardId), `${intent}: kpiOrder references unknown card id ${cardId}`);
    });

    profile.exportMetrics.forEach(cardId => {
      assert.ok(outputCardIds.has(cardId), `${intent}: exportMetrics references unknown card id ${cardId}`);
    });

    profile.guidedSteps.forEach((step, idx) => {
      assert.ok(typeof step.label === 'string' && step.label.length > 0, `${intent}: guidedSteps[${idx}] label missing`);
      assert.ok(Array.isArray(step.requires), `${intent}: guidedSteps[${idx}] requires must be an array`);
    });

    const weights = profile.recommendationWeights || {};
    Object.keys(weights).forEach(categoryKey => {
      assert.ok(allowedCategories.has(categoryKey), `${intent}: unknown recommendation category in weights: ${categoryKey}`);
      assert.ok(Number.isFinite(Number(weights[categoryKey])), `${intent}: recommendation weight for ${categoryKey} must be numeric`);
    });
  });

  // --- Share-state intent persistence contracts ---
  const persistenceTokens = [
    'ui: getCurrentUiIntent()',
    'const hasCustomIntent = state.ui !== defaultIntent;',
    'setUiIntent(state.ui, {',
    'syncMode: typeof state.um !== \'string\''
  ];
  persistenceTokens.forEach(token => {
    assert.ok(script.includes(token), `Missing share-state intent persistence token: ${token}`);
  });

  // --- Demo routing contracts ---
  const demoTokens = [
    "healthy:",
    "unhealthy:",
    "ui: 'operations'",
    "um: 'operator'"
  ];
  demoTokens.forEach(token => {
    assert.ok(script.includes(token), `Expected demo contract token missing: ${token}`);
  });

  console.log('[PASS] Wave 3 UI contract checks passed');
}

run();
