# Feature Modules

This folder is the modular contract layer for FiceCal features.

## What belongs here

- One folder per feature module
- One `feature.json` manifest per module
- Optional module-local docs and tests as modules are extracted from monolithic runtime

## Current module set

- `core-economics` (required)
- `multi-tech-normalization` (optional, active)
- `ai-token-economics` (optional, experimental, Wave 3)

## Rules

1. Every new feature must add a manifest.
2. Feature IDs must be unique and stable.
3. Optional modules must fail open (core runtime stays healthy when disabled).
4. Any module schema change requires docs update in `/docs` and release notes.
