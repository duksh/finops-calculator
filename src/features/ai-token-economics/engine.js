(function (global) {
  'use strict';

  function numberOrZero(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function clampPercent(value) {
    return Math.max(0, Math.min(100, numberOrZero(value)));
  }

  function resolveBaseTokenCost(inputs) {
    const pricingMode = inputs.pricingMode === 'tiered' ? 'tiered' : 'blended';
    const inputTokensM = Math.max(0, numberOrZero(inputs.inputTokensM));
    const outputTokensM = Math.max(0, numberOrZero(inputs.outputTokensM));
    const totalTokensM = inputTokensM + outputTokensM;

    const ratePer1MInput = Math.max(0, numberOrZero(inputs.ratePer1MInput));
    const ratePer1MOutput = Math.max(0, numberOrZero(inputs.ratePer1MOutput));
    const ratePer1MTotal = Math.max(0, numberOrZero(inputs.ratePer1MTotal));

    if (pricingMode === 'tiered') {
      return {
        pricingMode,
        tokenVolumeM: totalTokensM,
        baseTokenCost: (inputTokensM * ratePer1MInput) + (outputTokensM * ratePer1MOutput)
      };
    }

    const fallbackBlendedRate = totalTokensM > 0
      ? ((inputTokensM * ratePer1MInput) + (outputTokensM * ratePer1MOutput)) / totalTokensM
      : 0;
    const blendedRate = ratePer1MTotal > 0 ? ratePer1MTotal : fallbackBlendedRate;

    return {
      pricingMode,
      tokenVolumeM: totalTokensM,
      baseTokenCost: totalTokensM * blendedRate
    };
  }

  function calculate(inputs) {
    const enabled = Boolean(inputs && inputs.enabled);
    if (!enabled) {
      return {
        enabled: false,
        aiTotalTokenCost: null,
        aiTotalAllocatedCost: null,
        aiCostPerClient: null,
        aiRetryInflationPct: null,
        aiPremiumMixPct: null,
        tokenGovernanceRisk: 'none',
        allocationConfidence: 'low'
      };
    }

    const nRef = numberOrZero(inputs.nRef);
    const retryRatePct = clampPercent(inputs.retryRatePct);
    const premiumMixPct = clampPercent(inputs.premiumMixPct);
    const sharedOverheadMonthly = Math.max(0, numberOrZero(inputs.sharedOverheadMonthly));
    const allocationPolicy = String(inputs.allocationPolicy || 'token-weighted');

    const base = resolveBaseTokenCost(inputs);
    const retryMultiplier = 1 + (retryRatePct / 100);
    const premiumMultiplier = 1 + ((premiumMixPct / 100) * 0.6);

    const adjustedTokenCost = base.baseTokenCost * retryMultiplier * premiumMultiplier;
    const aiTotalAllocatedCost = adjustedTokenCost + sharedOverheadMonthly;
    const aiCostPerClient = nRef > 0 ? aiTotalAllocatedCost / nRef : null;

    let tokenGovernanceRisk = 'low';
    if (retryRatePct >= 20 || premiumMixPct >= 55) {
      tokenGovernanceRisk = 'high';
    } else if (retryRatePct >= 10 || premiumMixPct >= 30) {
      tokenGovernanceRisk = 'medium';
    }

    let allocationConfidence = 'low';
    if (base.tokenVolumeM >= 10 && (base.baseTokenCost > 0 || sharedOverheadMonthly > 0)) {
      allocationConfidence = 'high';
    } else if (base.tokenVolumeM > 0) {
      allocationConfidence = 'medium';
    }

    return {
      enabled: true,
      pricingMode: base.pricingMode,
      allocationPolicy,
      tokenVolumeM: base.tokenVolumeM,
      aiTotalTokenCost: adjustedTokenCost,
      aiTotalAllocatedCost,
      aiCostPerClient,
      aiRetryInflationPct: retryRatePct,
      aiPremiumMixPct: premiumMixPct,
      tokenGovernanceRisk,
      allocationConfidence
    };
  }

  global.FiceCalAiTokenEconomics = {
    calculate
  };
})(typeof window !== 'undefined' ? window : globalThis);
