#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function approxEqual(actual, expected, epsilon = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${expected}, got ${actual}`);
}

function loadAiEngine() {
  const enginePath = path.join(__dirname, '..', 'src', 'features', 'ai-token-economics', 'engine.js');
  const code = fs.readFileSync(enginePath, 'utf-8');
  const context = {
    console,
    globalThis: {},
    window: undefined
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: enginePath });
  return context.globalThis.FiceCalAiTokenEconomics;
}

function run() {
  const aiEngine = loadAiEngine();
  assert.ok(aiEngine && typeof aiEngine.calculate === 'function', 'AI token engine must expose calculate()');

  const disabled = aiEngine.calculate({ enabled: false });
  assert.strictEqual(disabled.enabled, false);
  assert.strictEqual(disabled.aiTotalTokenCost, null);
  assert.strictEqual(disabled.aiTotalAllocatedCost, null);
  assert.strictEqual(disabled.aiCostPerClient, null);

  const tiered = aiEngine.calculate({
    enabled: true,
    pricingMode: 'tiered',
    ratePer1MInput: 3,
    ratePer1MOutput: 9,
    inputTokensM: 12,
    outputTokensM: 8,
    retryRatePct: 10,
    premiumMixPct: 20,
    sharedOverheadMonthly: 1000,
    allocationPolicy: 'token-weighted',
    nRef: 100
  });
  approxEqual(tiered.aiTotalTokenCost, 133.056);
  approxEqual(tiered.aiTotalAllocatedCost, 1133.056);
  approxEqual(tiered.aiCostPerClient, 11.33056);
  assert.strictEqual(tiered.tokenGovernanceRisk, 'medium');
  assert.strictEqual(tiered.allocationConfidence, 'high');

  const blendedFallback = aiEngine.calculate({
    enabled: true,
    pricingMode: 'blended',
    ratePer1MInput: 2,
    ratePer1MOutput: 6,
    inputTokensM: 10,
    outputTokensM: 10,
    retryRatePct: 0,
    premiumMixPct: 0,
    sharedOverheadMonthly: 0,
    nRef: 50
  });
  approxEqual(blendedFallback.aiTotalTokenCost, 80);
  approxEqual(blendedFallback.aiTotalAllocatedCost, 80);
  approxEqual(blendedFallback.aiCostPerClient, 1.6);

  const clamped = aiEngine.calculate({
    enabled: true,
    pricingMode: 'tiered',
    ratePer1MInput: 3,
    ratePer1MOutput: 9,
    inputTokensM: 1,
    outputTokensM: 1,
    retryRatePct: 999,
    premiumMixPct: -20,
    sharedOverheadMonthly: 0,
    nRef: 10
  });
  assert.strictEqual(clamped.aiRetryInflationPct, 100);
  assert.strictEqual(clamped.aiPremiumMixPct, 0);

  const highRisk = aiEngine.calculate({
    enabled: true,
    pricingMode: 'blended',
    ratePer1MTotal: 6,
    inputTokensM: 4,
    outputTokensM: 2,
    retryRatePct: 34,
    premiumMixPct: 62,
    sharedOverheadMonthly: 0,
    nRef: 10
  });
  assert.strictEqual(highRisk.tokenGovernanceRisk, 'high');

  const lowConfidence = aiEngine.calculate({
    enabled: true,
    pricingMode: 'blended',
    ratePer1MTotal: 0,
    inputTokensM: 0,
    outputTokensM: 0,
    retryRatePct: 0,
    premiumMixPct: 0,
    sharedOverheadMonthly: 0,
    nRef: 100
  });
  assert.strictEqual(lowConfidence.allocationConfidence, 'low');

  console.log('[PASS] AI token economics regression checks passed');
}

run();
