#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

function approxEqual(actual, expected, epsilon = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${expected}, got ${actual}`);
}

function loadReliabilityEngine() {
  const enginePath = path.join(__dirname, '..', 'src', 'features', 'sla-slo-sli-economics', 'engine.js');
  const code = fs.readFileSync(enginePath, 'utf-8');
  const context = {
    console,
    globalThis: {},
    window: undefined
  };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: enginePath });
  return context.globalThis.FiceCalReliabilityEconomics;
}

function run() {
  const reliabilityEngine = loadReliabilityEngine();
  assert.ok(reliabilityEngine && typeof reliabilityEngine.calculate === 'function', 'Reliability engine must expose calculate()');

  const disabled = reliabilityEngine.calculate({ enabled: false });
  assert.strictEqual(disabled.enabled, false);
  assert.strictEqual(disabled.expectedReliabilityFailureCostMonthly, null);
  assert.strictEqual(disabled.reliabilityAdjustedCostMonthly, null);
  assert.strictEqual(disabled.reliabilityRiskBand, 'none');

  const baseline = reliabilityEngine.calculate({
    enabled: true,
    sloTargetAvailabilityPct: 99.9,
    sliObservedAvailabilityPct: 99.7,
    incidentCountMonthly: 4,
    mttrHours: 1.5,
    incidentFteCount: 2,
    incidentBlendedHourlyRate: 80,
    criticalRevenuePerMinute: 18,
    criticalTrafficSharePct: 75,
    arrExposedMonthly: 80000,
    churnSensitivityPct: 4,
    breachProbabilityPct: 30,
    slaPenaltyRatePerBreachPointMonthly: 4000,
    reliabilityInvestmentMonthly: 2500,
    existingModeledCostMonthly: 12000
  });

  approxEqual(baseline.expectedDowntimeMinutes, 129.6);
  approxEqual(baseline.expectedSlaPenaltyMonthly, 800);
  approxEqual(baseline.expectedIncidentLaborMonthly, 960);
  approxEqual(baseline.expectedRevenueAtRiskMonthly, 1749.6);
  approxEqual(baseline.expectedChurnRiskMonthly, 960);
  approxEqual(baseline.expectedReliabilityFailureCostMonthly, 4469.6);
  approxEqual(baseline.reliabilityAdjustedCostMonthly, 18969.6);
  assert.strictEqual(baseline.reliabilityRiskBand, 'high');
  assert.strictEqual(baseline.reliabilityDataConfidence, 'high');

  const healthy = reliabilityEngine.calculate({
    enabled: true,
    sloTargetAvailabilityPct: 99.9,
    sliObservedAvailabilityPct: 99.95,
    incidentCountMonthly: 0,
    mttrHours: 0,
    incidentBlendedHourlyRate: 0,
    criticalRevenuePerMinute: 10,
    criticalTrafficSharePct: 100,
    arrExposedMonthly: 20000,
    churnSensitivityPct: 1,
    breachProbabilityPct: 1,
    slaPenaltyRatePerBreachPointMonthly: 1000,
    reliabilityInvestmentMonthly: 400,
    existingModeledCostMonthly: 9000
  });
  assert.strictEqual(healthy.reliabilityRiskBand, 'low');

  const clamped = reliabilityEngine.calculate({
    enabled: true,
    sloTargetAvailabilityPct: 130,
    sliObservedAvailabilityPct: -10,
    incidentCountMonthly: -5,
    mttrHours: -1,
    incidentBlendedHourlyRate: -30,
    criticalRevenuePerMinute: -2,
    arrExposedMonthly: -100,
    churnSensitivityPct: 999,
    breachProbabilityPct: 999,
    slaPenaltyRatePerBreachPointMonthly: 2000,
    reliabilityInvestmentMonthly: -10,
    existingModeledCostMonthly: 1000
  });
  assert.strictEqual(clamped.sloTargetAvailabilityPct, 100);
  assert.strictEqual(clamped.sliObservedAvailabilityPct, 0);
  assert.strictEqual(clamped.expectedIncidentLaborMonthly, 0);
  assert.strictEqual(clamped.expectedRevenueAtRiskMonthly, 0);

  console.log('[PASS] SLA/SLO/SLI reliability economics regression checks passed');
}

run();
