(function (global) {
  'use strict';

  function asPositiveClientCount(n) {
    return Math.max(1, Number(n) || 1);
  }

  function totalCostAtClients(n, model) {
    const safeN = asPositiveClientCount(n);
    return model.K * Math.pow(safeN, -model.a) + model.c * Math.pow(safeN, model.b);
  }

  function minPriceAtClients(n, model) {
    const safeN = asPositiveClientCount(n);
    const total = totalCostAtClients(safeN, model);
    return (total / safeN) * (1 + model.m);
  }

  function scanEconomicRange(arpu, maxN, model) {
    const limit = Math.max(1, Math.round(Number(maxN) || 1));
    const hasArpu = arpu !== null && arpu !== undefined && arpu > 0;
    let breakEvenN = null;
    let minUnitCost = Infinity;
    let minUnitCostN = 1;

    for (let n = 1; n <= limit; n++) {
      const total = totalCostAtClients(n, model);
      const unitCost = total / n;

      if (unitCost < minUnitCost) {
        minUnitCost = unitCost;
        minUnitCostN = n;
      }

      if (hasArpu && breakEvenN === null && (arpu * n) >= total) {
        breakEvenN = n;
      }
    }

    return {
      breakEvenN,
      minUnitCostN,
      minUnitCostPerClient: isFinite(minUnitCost) ? minUnitCost : null
    };
  }

  function buildDataFromModel(model, samplePoints) {
    const points = Math.max(1, Math.round(Number(samplePoints) || 300));
    const rows = [];

    for (let i = 0; i <= points; i++) {
      const n = Math.max(1, (i / points) * model.nMax);
      const dev = model.K * Math.pow(n, -model.a);
      const infraRaw = model.c * Math.pow(n, model.b);
      const infraCud = model.g * model.c * Math.pow(n, model.b * 0.96);
      const total = dev + infraRaw;
      const revenue = model.ARPU * n;
      const profit = revenue - total;
      const priceMin = total * (1 + model.m);
      rows.push({ n, dev, infraRaw, infraCud, total, revenue, profit, priceMin });
    }

    return rows;
  }

  global.FiceCalCoreEconomics = {
    totalCostAtClients,
    minPriceAtClients,
    scanEconomicRange,
    buildDataFromModel
  };
})(typeof window !== 'undefined' ? window : globalThis);
