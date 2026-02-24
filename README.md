# FiceCal

![FiceCal logo](./FiceCal-Logo-L-trsprt.png)

Short for FinOps and Cloud Economics Calculator, FiceCal assist you in modeling break-even, pricing floor, cloud efficiency, and optimization actions.

This project is built as a landing-page style tool that guides users through:

1. What the tool does and who it is for
2. Author credibility and context
3. A direct call-to-action into the calculator
4. Live calculator inputs/outputs and chart analysis

---

## What this tool helps you answer

- How many clients are needed to break even?
- What is the minimum viable price per client at current scale?
- Is cloud spend efficient relative to revenue (CCER)?
- How much can committed use discounts improve cloud economics?
- Which FinOps actions should be prioritized for the current health zone?

---

## Key features

- Static-first implementation centered on `index.html` with runtime modules under `src/`
- Dedicated glossary page (`glossary.html`) with anchored definitions for formula/KPI terminology
- D3.js interactive chart (show/hide curve controls, hover readouts, zones)
- Real-time recalculation as users type
- Automatic in-page term linking from key calculator/formula sections to glossary anchors
- Modular runtime contracts with feature catalog + manifests (`src/features/feature-catalog.json`, `src/features/*/feature.json`)
- Runtime module loading for core economics, AI token economics, and feature gates
- Modularization guardrail CI workflow (`.github/workflows/modularization-guardrails.yml`)
- Model Assurance section documenting model hardening decisions and validation checks
- Recommendation category filters (All / Infrastructure / Pricing / Marketing / CRM / Governance)
- Output-card "How to address this?" guidance panel with indicator-specific levers and prerequisites
- Quick scenario actions in calculator header (Demo healthy / Demo unhealthy)
- Structured calculator groups:
  - Group A: Business snapshot inputs
  - Group B: Model tuning inputs
  - Group C: Auto-calculated KPIs
  - Group D: Cloud provider selection (with provider badges)
  - Group E: Health zone scoring and recommendation engine
- Formula cards with explanatory tooltips
- Academic and practitioner references section
- Landing-page navigation links to jump to Calculator, Health, Chart, Formulas, and Glossary
- Mobile-friendly responsive behavior

---

## Current release snapshot

Current release line consolidates product and model-quality improvements delivered across Release 2 and Wave 3:

- Product naming standardization to **FiceCal**
- Multi-technology glossary and automatic contextual linking across core sections
- Model Assurance section for CFO/FinOps validation workflow
- Health recommendation filtering by operating domain
- Output indicator action guidance panel ("How to address this?")
- Deterministic economic scanning improvements aligned with MCP parity validations
- Public GitHub Pages runtime compatibility updates (module scripts + feature manifests mirrored to `duksh.github.io/src/`)
- Added `docs/model-risk-and-validation.md` and Read the Docs build config (`.readthedocs.yaml`)

Wave 3 foundation updates:

- Added `docs/ai-token-economics.md` (AI token economics proposal)
- Added `docs/modularization-playbook.md` (modular architecture + GitOps approach)
- Added `docs/roadmap/wave-3-modularization-backlog.md` (execution backlog)
- Added `docs/roadmap/wave-3-execution-plan.md` (current execution plan + Intent-based UI/UX rehauling blueprint)
- Added `docs/releases/release-note-template.md` (module-aware release note template)
- Added `scripts/validate-feature-catalog.py` and `scripts/sync-public-pages.sh`
- Added `scripts/validate-doc-links.py` (canonical docs-link CI guardrail)

Release 3 closeout and next-phase setup:

- Added Wave 3 closeout acceptance checklist (`docs/roadmap/wave-3-acceptance-checklist.md`)
- Added Wave 3 runtime regression scripts (`scripts/test-wave3-intent-share-state.js`, `scripts/test-wave3-ui-contracts.js`)
- Added browser smoke automation scaffold (`scripts/test-wave3-playwright-smoke.js` + `.github/workflows/wave3-playwright-smoke.yml`)
- Added Wave 4 execution planning document (`docs/roadmap/wave-4-execution-plan.md`)

---

## Core model concepts

The calculator uses a practical cloud economics model based on:

- Development cost decay with scale
- Super-linear infrastructure growth
- Committed use discount effect
- Break-even thresholding
- Contribution margin and CCER health scoring
- Minimum price floor based on target margin

Representative equations include:

- `DC(n) = K * n^-a`
- `IC(n) = c * n^b`
- `IC_cud(n) = g * c * n^(b*0.96)`
- `MP(n) = TC(n) * (1 + m)`

---

## Project structure

- `index.html` - main application page (UI shell, calculator orchestration, chart rendering)
- `document.html` - reference and documentation companion page
- `glossary.html` - glossary of complex terms used across calculator outputs and formulas
- `perfect-finops-calculator-prompt.md` - implementation requirements and specification
- `docs/model-risk-and-validation.md` - model risk log, remediation history, and validation checklist
- `docs/ai-token-economics.md` - Wave 3 AI token economics scope, formulas, and MVP criteria
- `docs/modularization-playbook.md` - modularization strategy and GitOps operating model
- `docs/roadmap/wave-3-execution-plan.md` - current Wave 3 status and intent-based UI/UX next phases
- `docs/roadmap/wave-4-execution-plan.md` - Wave 4 post-release execution plan (E2E hardening + runtime extraction)
- `docs/releases/release-note-template.md` - standard template with module change metadata and mirror verification checklist
- `src/core/economics.js` - shared core economics runtime module
- `src/features/runtime-gates.js` - feature activation/runtime gate module
- `src/features/ai-token-economics/engine.js` - AI token economics runtime engine
- `src/features/feature-catalog.json` - feature registry for module lifecycle management
- `src/features/*/feature.json` - module contracts (core economics, normalization, AI token economics)
- `scripts/validate-feature-catalog.py` - manifest and catalog validation guardrail
- `scripts/validate-doc-links.py` - canonical docs-link validator for markdown docs
- `scripts/sync-public-pages.sh` - repeatable source -> public mirror sync helper
- `scripts/test-wave3-playwright-smoke.js` - browser-level smoke checks for intent flows (Playwright)

---

## Run locally

No build step is required.

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Serve with a local static server

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

## Deploy

FiceCal is static-host friendly (GitHub Pages, Netlify, Vercel, or any static web server), but current runtime requires both top-level pages and `src/` assets.

### Public mirror (source repo -> `duksh.github.io`)

1. Sync primary pages:

```bash
./scripts/sync-public-pages.sh
```

2. Sync runtime assets required by `index.html`:

```bash
PUB_REPO="/absolute/path/to/duksh.github.io"
rsync -a src/ "$PUB_REPO/src/"
```

3. Commit/push in public mirror repo:

```bash
git -C "$PUB_REPO" add index.html document.html glossary.html src/
git -C "$PUB_REPO" commit -m "sync public pages and runtime assets"
git -C "$PUB_REPO" push
```

4. Verify live site (hard refresh):

- `https://duksh.github.io/#calculator-section`
- Ensure `/src/features/feature-catalog.json` and `/src/features/*/feature.json` return HTTP 200

---

## Usage flow

1. Read the landing intro and click **Get Started**
2. Fill Group A with known business metrics
3. Optionally tune Group B assumptions
4. Review Group C KPI outputs
5. Select cloud providers in Group D
6. Use Group E health score and recommendations
7. Explore the chart section for curve behavior and zone transitions
8. Review formulas for model interpretation

---

## Author

Duksh Koonjoobeeharry

- FinOps and AWS/GCP cloud solution developer
- DBA researcher
- LinkedIn: https://www.linkedin.com/in/duksh/

---

## Notes

- This calculator is intended for decision support and scenario modeling.
- Inputs and outputs should be validated against your actual billing, unit economics, and pricing data before operational decisions.

---

## License

Apache-2.0. See `LICENSE`.
