# Wave 3 Acceptance Checklist (Intent-based UI/UX)

## Purpose

Provide a single closeout checklist to verify Wave 3 acceptance criteria across intent routing, KPI/recommendation orchestration, guided decision paths, and share-state parity.

---

## Preconditions

- [ ] Pull latest `main`
- [ ] Open `index.html` in desktop viewport
- [ ] Open `index.html` in mobile viewport (<= 680px)
- [ ] Ensure browser localStorage is enabled

---

## A. Acceptance criteria validation

Reference criteria: `docs/roadmap/wave-3-execution-plan.md`.

### A1. Intent choice in < 1 click

- [ ] Verify each header intent button (`Viability`, `Operations`, `Architect`, `Executive`) activates with a single click.
- [ ] Verify selected button updates `aria-pressed="true"` and intent summary text.
- [ ] Verify mode auto-routes to profile default (unless explicit shared mode overrides).

Evidence:
- Intent controls in header section.
- No intermediary modal/step required.

### A2. Quick intent preserves numeric parity while hiding advanced controls

- [ ] Select `Viability` intent.
- [ ] Confirm Quick-focused outputs are surfaced first (break-even/min-price/margin/CCER).
- [ ] Confirm advanced cards are deprioritized (not removed from model math).
- [ ] Enter same values in another intent and confirm output values remain numerically consistent.

### A3. Architect intent exposes AI and policy controls without mode confusion

- [ ] Select `Architect` intent.
- [ ] Confirm architect mode is active.
- [ ] Confirm AI token KPI cards are prioritized and AI helper/risk recommendations appear when AI inputs are populated.
- [ ] Confirm guided path labels are policy/risk/action oriented.

### A4. Shared links preserve intent + mode context

- [ ] Set non-default intent and mode, then click `Copy state link`.
- [ ] Open link in fresh tab.
- [ ] Verify intent, mode, and key inputs are restored.
- [ ] Verify URL contains encoded `state` payload and anchors to `#group-health`.

### A5. Recommendation quality remains numerically consistent across intents

- [ ] Use same numeric input set across all intents.
- [ ] Verify health score and zone are unchanged.
- [ ] Verify recommendation ordering emphasis changes by intent, but recommendation eligibility and numeric triggers remain stable.

---

## B. Guided path and export preset checks

### B1. Guided path ribbons

- [ ] For each intent, verify 3-step ribbon labels reflect profile mapping.
- [ ] Verify states transition across `todo`, `active`, and `done` when required inputs/signals are provided.
- [ ] Verify progress text (`x/3 steps complete`) updates correctly.

### B2. One-click export presets

- [ ] For each intent, click intent export button.
- [ ] Verify filename pattern `ficecal-<intent>-preset-YYYY-MM-DD.csv`.
- [ ] Verify CSV includes metadata rows (`intent`, `mode`, `providers`, `tech_domains`, `recommendation_category`).
- [ ] Verify CSV includes intent KPI rows.
- [ ] Verify operations export includes CFO projection rows when dashboard data exists.
- [ ] Verify architecture export includes AI telemetry rows when AI metrics are active.

---

## C. Automated regression checks

Run from repo root:

- [ ] `node scripts/test-ai-token-economics.js`
- [ ] `node scripts/test-wave3-intent-share-state.js`
- [ ] `node scripts/test-wave3-ui-contracts.js`
- [ ] `node scripts/test-wave3-playwright-smoke.js` *(requires Playwright runtime + Chromium installed)*
- [ ] `python3 scripts/validate-doc-links.py`
- [ ] `python3 scripts/validate-feature-catalog.py`

Record output:

- Date:
- Executor:
- Result summary:

---

## D. Sign-off

- [ ] Product acceptance complete
- [ ] UX acceptance complete
- [ ] Model acceptance complete
- [ ] Release note prepared (`docs/releases/release-3-wave-3-complete.md`)
- [ ] Ready for public mirror verification flow (`scripts/sync-public-pages.sh --check`)
