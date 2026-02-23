# Wave 3 Proposal: AI Token Economics and Allocation for FiceCal

## Purpose

Define a Wave 3 extension that introduces token-based AI cost allocation as a first-class FinOps capability in FiceCal.

This proposal shifts cost analysis from infrastructure-resource allocation (vCPU/RAM) to behavior-based allocation (token usage patterns, retries, model routing, tool calls).

---

## Why this matters

In shared LLM environments, costs are primarily driven by usage behavior:

- Input token volume
- Output token volume
- Model tier selection
- Retry frequency
- Tool-call amplification
- Routing to premium models

As a result, token accounting becomes:

1. A behavioral signal
2. A margin sensitivity driver
3. A governance lever

---

## Wave 3 scope

### 1) New domain in normalization model

Add `ai_inference` to technology domains.

Expected impact:

- NTC/client includes inference economics where selected
- Coverage/confidence reflect availability of token telemetry
- Financial Truth mode and Priority Index mode can explicitly include AI inference

### 2) Token economics engine

Support two pricing modes:

- **Blended mode**
  - Single rate: `ratePer1MTotal`
- **Tiered mode**
  - `ratePer1MInput`
  - `ratePer1MOutput`

### 3) Allocation policy layer

Support multiple policy modes:

- `showback` (visibility only)
- `chargeback_proportional` (pure proportional by token cost)
- `chargeback_weighted` (policy multipliers for premium usage/retries)
- `internal_rate_card` (transfer-pricing profile)

### 4) KPI and recommendation extensions

Add AI-specific metrics and recommendation logic that feed directly into health and margin planning.

---

## Core formulas

Let:

- `InTok_t` = input tokens for team `t`
- `OutTok_t` = output tokens for team `t`
- `R_in` = input token price per 1M
- `R_out` = output token price per 1M
- `RetryFactor_t` = retry inflation multiplier for team `t`
- `ToolFactor_t` = tool-call amplification multiplier for team `t`
- `PremiumFactor_t` = premium routing multiplier for team `t`
- `OverheadPool` = shared platform overhead to allocate

### A) Blended price mode

`Cost_t_base = ((InTok_t + OutTok_t) / 1_000_000) * R_blended`

### B) Tiered price mode

`Cost_t_base = (InTok_t / 1_000_000) * R_in + (OutTok_t / 1_000_000) * R_out`

### C) Behavioral adjustments

`Cost_t_adj = Cost_t_base * RetryFactor_t * ToolFactor_t * PremiumFactor_t`

### D) Team allocation weight

`Weight_t = Cost_t_adj / SUM(Cost_all_teams_adj)`

### E) Overhead allocation

`Overhead_t = Weight_t * OverheadPool`

### F) Total allocated team AI cost

`AllocatedCost_t = Cost_t_adj + Overhead_t`

Constraint:

`SUM(AllocatedCost_t) = InvoiceTokenCosts + OverheadPool`

---

## Worked example (baseline)

Given:

- Team A = 20M tokens
- Team B = 10M tokens
- Team C = 30M tokens
- Total = 60M tokens
- Blended rate = $6 / 1M tokens

Total cost:

`60 * 6 = $360`

Allocation:

- Team A: `(20/60) * 360 = $120`
- Team B: `(10/60) * 360 = $60`
- Team C: `(30/60) * 360 = $180`

Balances to invoice total.

---

## Data model proposal

### Input payload extension (conceptual)

```json
{
  "aiInference": {
    "enabled": true,
    "pricingMode": "tiered",
    "ratePer1MInput": 3,
    "ratePer1MOutput": 9,
    "ratePer1MTotal": null,
    "sharedOverheadMonthly": 1200,
    "allocationPolicy": "chargeback_weighted",
    "teams": [
      {
        "teamId": "team-a",
        "inputTokens": 12000000,
        "outputTokens": 8000000,
        "retryRate": 0.08,
        "toolCallRate": 0.25,
        "premiumModelShare": 0.15
      }
    ],
    "policy": {
      "retryPenalty": 0.5,
      "toolCallWeight": 0.3,
      "premiumModelWeight": 0.8,
      "maxPenaltyMultiplier": 2.0
    }
  }
}
```

### Derived team outputs

- `teamBaseCost`
- `teamAdjustedCost`
- `teamWeightPct`
- `teamOverheadAllocated`
- `teamTotalAllocatedCost`
- `teamCostPerRequest`
- `teamRetryInflationPct`

### Aggregate outputs

- `aiTotalTokenCost`
- `aiTotalAllocatedCost`
- `aiOutputInputRatio`
- `aiPremiumMixPct`
- `aiRetryInflationPct`
- `aiCostPer1KRequests`
- `aiCostPerClient`
- `aiCCER`

---

## New KPI definitions for FiceCal

1. **AI Cost / Client**
   - AI allocated monthly cost divided by active clients
2. **AI Cost / Request**
   - Allocated team AI cost divided by successful requests
3. **Output/Input Ratio**
   - `outputTokens / inputTokens`
4. **Retry Inflation %**
   - Extra cost due to retries vs first-pass baseline
5. **Premium Mix %**
   - Share of cost or volume routed to premium models
6. **AI CCER**
   - AI-attributed revenue / AI inference cost

---

## Recommendation logic extension

Add recommendation categories under existing architecture:

- `governance`
  - Add internal rate card
  - Add showback/chargeback controls by team
- `infrastructure`
  - Introduce response caching and semantic dedupe
  - Reduce context windows with retrieval quality checks
- `pricing`
  - Reprice AI-heavy SKUs based on token intensity
- `product`
  - Route low-complexity tasks to lower-cost models
- `operations`
  - Retry reduction and timeout hygiene
  - Tool-call budget limits per workflow

Example triggers:

- `retryInflationPct > threshold`
- `premiumMixPct > policyTarget`
- `outputInputRatio > controlBand`
- `aiCostPerClient rising faster than ARPU`

---

## UI/UX extension proposal

### New panel: "AI Token Economics"

Include:

- Pricing mode selector (blended vs tiered)
- Rate inputs
- Team telemetry table
- Policy sliders (retry/tool/premium weighting)
- Allocation preview by team
- Margin sensitivity chart for token behavior scenarios

### Scenario quick actions

- "Healthy AI mix"
- "Premium routing spike"
- "Retry storm"

### Intent-based FiceCal UI/UX rehauling (Wave 3+)

Use intent-first routing so AI controls appear only when users need them.

Initial intent map:

1. **Validate viability quickly**
   - mode: `quick`
   - hides AI controls by default
2. **Operate monthly FinOps**
   - mode: `operator`
   - keeps budgeting/forecasting/normalization surfaces
3. **Architect scenario and policy**
   - mode: `architect`
   - enables AI token economics panel and policy controls
4. **Prepare executive readout**
   - mode: `operator` dashboard-first
   - prioritizes summarized KPIs and recommendation confidence

Design outcomes:

- Less UI overwhelm while preserving the same underlying model logic
- Faster path to relevant controls/KPIs by decision intent
- Better recommendation framing without changing numeric results

Execution details are tracked in:

- `docs/roadmap/wave-3-execution-plan.md`

---

## MCP extension proposal

### Candidate tools

- `finops.ai.allocate`
  - Computes team allocation from token telemetry + policy
- `finops.ai.sensitivity`
  - Runs scenario stress tests on token behavior and pricing
- `finops.ai.ratecard`
  - Generates internal transfer pricing summary

### Schema updates

- Extend `finops.calculate` request/response schema with optional `aiInference`
- Keep backward compatibility by making AI block optional

---

## Validation and controls

### Accounting controls

- Allocation total must reconcile to invoice + declared overhead
- Zero-usage teams receive zero token base allocation unless policy says fixed overhead split

### Data quality controls

- Flag missing output token telemetry
- Flag unknown model tier mappings
- Flag anomalous retry rates

### Model risk controls

- Track policy coefficients and changes over time
- Record assumptions used in chargeback decisions
- Include confidence labels for allocation quality

---

## Release framing

This initiative is proposed as:

- **FiceCal Release Wave 3**
- Theme: **AI FinOps: Token Telemetry to Economic Allocation**

Suggested rollout sequence:

1. Data model + formulas + docs
2. UI panel + KPIs (showback mode)
3. Chargeback policies + recommendations
4. MCP tooling and parity coverage

---

## Acceptance criteria (Wave 3 MVP)

1. Team-level allocation balances to monthly AI invoice total (+ overhead pool where configured)
2. Supports both blended and tiered token pricing
3. Exposes at least 5 AI-specific KPIs in outputs
4. Includes at least 5 recommendation rules tied to token behavior
5. Scenario analysis demonstrates margin sensitivity to retry/output/premium shifts
6. MCP and browser outputs match for identical AI inputs

---

## Notes for roadmap alignment

- This proposal complements existing FiceCal multi-technology normalization and Model Assurance patterns.
- It should be tracked as a dedicated Wave 3 workstream under `/docs/roadmap` and future release notes.
