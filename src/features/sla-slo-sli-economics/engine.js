(function (global) {
  'use strict';

  const DEFAULT_MINUTES_IN_MONTH = 30 * 24 * 60;

  function numberOrZero(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function clampPercent(value) {
    return Math.max(0, Math.min(100, numberOrZero(value)));
  }

  function countProvided(values) {
    return values.reduce((count, value) => {
      if (value === null || value === undefined || value === '') return count;
      const n = Number(value);
      return Number.isFinite(n) ? count + 1 : count;
    }, 0);
  }

  function calculate(inputs) {
    const enabled = Boolean(inputs && inputs.enabled);
    if (!enabled) {
      return {
        enabled: false,
        expectedDowntimeMinutes: null,
        expectedSlaPenaltyMonthly: null,
        expectedIncidentLaborMonthly: null,
        expectedRevenueAtRiskMonthly: null,
        expectedChurnRiskMonthly: null,
        expectedReliabilityFailureCostMonthly: null,
        reliabilityInvestmentMonthly: null,
        reliabilityAdjustedCostMonthly: null,
        reliabilityRiskBand: 'none',
        reliabilityDataConfidence: 'low'
      };
    }

    const minutesInMonth = Math.max(1, numberOrZero(inputs.minutesInMonth) || DEFAULT_MINUTES_IN_MONTH);
    const sloTargetAvailabilityPct = clampPercent(inputs.sloTargetAvailabilityPct || 99.9);
    const sliObservedAvailabilityPct = clampPercent(inputs.sliObservedAvailabilityPct || 99.9);
    const incidentCountMonthly = Math.max(0, numberOrZero(inputs.incidentCountMonthly));
    const mttrHours = Math.max(0, numberOrZero(inputs.mttrHours));
    const incidentFteCount = Math.max(0, numberOrZero(inputs.incidentFteCount || 1));
    const incidentBlendedHourlyRate = Math.max(0, numberOrZero(inputs.incidentBlendedHourlyRate));
    const criticalRevenuePerMinute = Math.max(0, numberOrZero(inputs.criticalRevenuePerMinute));
    const criticalTrafficSharePct = clampPercent(inputs.criticalTrafficSharePct || 100);
    const arrExposedMonthly = Math.max(0, numberOrZero(inputs.arrExposedMonthly));
    const churnSensitivityPct = clampPercent(inputs.churnSensitivityPct);
    const breachProbabilityPct = clampPercent(inputs.breachProbabilityPct);
    const reliabilityInvestmentMonthly = Math.max(0, numberOrZero(inputs.reliabilityInvestmentMonthly));
    const existingModeledCostMonthly = Math.max(0, numberOrZero(inputs.existingModeledCostMonthly));

    const observedAvailability = sliObservedAvailabilityPct / 100;
    const criticalTrafficShare = criticalTrafficSharePct / 100;
    const expectedDowntimeMinutes = Math.max(0, (1 - observedAvailability) * minutesInMonth);

    const breachGapPct = Math.max(0, sloTargetAvailabilityPct - sliObservedAvailabilityPct);
    const penaltyOverride = numberOrZero(inputs.slaPenaltyMonthly);
    const penaltyRatePerBreachPointMonthly = Math.max(0, numberOrZero(inputs.slaPenaltyRatePerBreachPointMonthly));
    const expectedSlaPenaltyMonthly = penaltyOverride > 0
      ? penaltyOverride
      : (breachGapPct * penaltyRatePerBreachPointMonthly);

    const expectedIncidentLaborMonthly = incidentCountMonthly * mttrHours * incidentFteCount * incidentBlendedHourlyRate;
    const expectedRevenueAtRiskMonthly = expectedDowntimeMinutes * criticalRevenuePerMinute * criticalTrafficShare;
    const expectedChurnRiskMonthly = arrExposedMonthly * (churnSensitivityPct / 100) * (breachProbabilityPct / 100);

    const expectedReliabilityFailureCostMonthly =
      expectedSlaPenaltyMonthly +
      expectedIncidentLaborMonthly +
      expectedRevenueAtRiskMonthly +
      expectedChurnRiskMonthly;

    const reliabilityAdjustedCostMonthly =
      existingModeledCostMonthly + reliabilityInvestmentMonthly + expectedReliabilityFailureCostMonthly;

    const failureCostShare = reliabilityAdjustedCostMonthly > 0
      ? expectedReliabilityFailureCostMonthly / reliabilityAdjustedCostMonthly
      : 0;

    let reliabilityRiskBand = 'low';
    if (failureCostShare >= 0.2 || breachGapPct >= 0.5 || sliObservedAvailabilityPct < 99.0) {
      reliabilityRiskBand = 'high';
    } else if (failureCostShare >= 0.1 || breachGapPct >= 0.1 || sliObservedAvailabilityPct < 99.5) {
      reliabilityRiskBand = 'medium';
    }

    const confidenceInputs = [
      inputs.sloTargetAvailabilityPct,
      inputs.sliObservedAvailabilityPct,
      inputs.incidentCountMonthly,
      inputs.mttrHours,
      inputs.incidentBlendedHourlyRate,
      inputs.criticalRevenuePerMinute,
      inputs.arrExposedMonthly,
      inputs.churnSensitivityPct,
      inputs.breachProbabilityPct,
      inputs.reliabilityInvestmentMonthly
    ];
    const providedCount = countProvided(confidenceInputs);
    let reliabilityDataConfidence = 'low';
    if (providedCount >= 8) {
      reliabilityDataConfidence = 'high';
    } else if (providedCount >= 5) {
      reliabilityDataConfidence = 'medium';
    }

    return {
      enabled: true,
      sloTargetAvailabilityPct,
      sliObservedAvailabilityPct,
      expectedDowntimeMinutes,
      expectedSlaPenaltyMonthly,
      expectedIncidentLaborMonthly,
      expectedRevenueAtRiskMonthly,
      expectedChurnRiskMonthly,
      expectedReliabilityFailureCostMonthly,
      reliabilityInvestmentMonthly,
      reliabilityAdjustedCostMonthly,
      reliabilityRiskBand,
      reliabilityDataConfidence
    };
  }

  global.FiceCalReliabilityEconomics = {
    calculate
  };
})(typeof window !== 'undefined' ? window : globalThis);
