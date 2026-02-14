# FinOps Calculator

An interactive, single-file FinOps and cloud economics calculator for modeling break-even, pricing floor, cloud efficiency, and optimization actions.

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

- Single-file implementation (`index.html`) with inline CSS and JavaScript
- D3.js interactive chart (show/hide curve controls, hover readouts, zones)
- Real-time recalculation as users type
- Structured calculator groups:
  - Group A: Business snapshot inputs
  - Group B: Model tuning inputs
  - Group C: Auto-calculated KPIs
  - Group D: Cloud provider selection (with provider badges)
  - Group E: Health zone scoring and recommendation engine
- Formula cards with explanatory tooltips
- Academic and practitioner references section
- Landing-page navigation links to jump to Calculator, Chart, and Formulas
- Mobile-friendly responsive behavior

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

- `index.html` - complete application (UI, styles, model logic, chart rendering)
- `perfect-finops-calculator-prompt.md` - implementation requirements and specification

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

Because this is a static single-page file, deployment is straightforward:

- GitHub Pages
- Netlify
- Vercel static hosting
- Any static web server

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
