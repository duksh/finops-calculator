# FiceCal Release 2

## Summary

Release 2 bundles product UX, documentation, and model-quality improvements for FiceCal.

## Included updates

### Product and UX

- Official product naming standardized to **FiceCal**.
- Added dedicated glossary page (`glossary.html`) with anchored term definitions.
- Added automatic glossary term linking in key calculator and recommendation contexts.
- Added **Model Assurance** section to document model hardening and quick validation flow.
- Added recommendation category filters:
  - All
  - Infrastructure
  - Pricing
  - Marketing
  - CRM
  - Governance
- Added output-card action panel via **"How to address this?"** with indicator-specific guidance.
- Added quick scenario actions in calculator header:
  - Demo healthy
  - Demo unhealthy

### Model-quality and documentation

- Added model risk and validation log: `docs/model-risk-and-validation.md`.
- Added Read the Docs build config: `.readthedocs.yaml`.
- Expanded README to include Release 2 features and naming updates.

## Validation

- MCP parity validation run against calculator source:
  - `npm run test:parity` (in `finops-calculator-mcp/server`)

## Notes

- This release is coordinated with the MCP Release 2 companion update (`ficecal-mcp-v0.2.0`).
- Repository boundaries remain enforced:
  - Product source in `duksh/finops-calculator`
  - MCP runtime source in `duksh/finops-calculator-mcp`
  - Public mirror in `duksh/duksh.github.io`
