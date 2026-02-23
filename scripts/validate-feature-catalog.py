#!/usr/bin/env python3
"""Validate FiceCal feature catalog and feature manifests.

Usage:
  python3 scripts/validate-feature-catalog.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "src" / "features" / "feature-catalog.json"
REQUIRED_MANIFEST_FIELDS = {
    "id",
    "name",
    "version",
    "owner",
    "status",
    "dependsOn",
    "uiModes",
    "inputs",
    "outputs",
}
ALLOWED_MODES = {"quick", "operator", "architect"}
ALLOWED_STATUS = {"active", "experimental", "deprecated", "disabled"}


def fail(msg: str) -> None:
    print(f"[FAIL] {msg}")
    raise SystemExit(1)


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        fail(f"Missing file: {path}")
    except json.JSONDecodeError as exc:
        fail(f"Invalid JSON in {path}: {exc}")


def main() -> int:
    catalog = read_json(CATALOG_PATH)

    features = catalog.get("features")
    if not isinstance(features, list) or not features:
        fail("feature-catalog.json must contain a non-empty 'features' list")

    mode_list = catalog.get("runtime", {}).get("modes", [])
    if not set(mode_list).issubset(ALLOWED_MODES):
        fail(f"Catalog runtime modes must be subset of {sorted(ALLOWED_MODES)}")

    ids: set[str] = set()
    required_seen = False

    for entry in features:
        if not isinstance(entry, dict):
            fail("Each catalog feature entry must be an object")

        feature_id = entry.get("id")
        manifest_rel = entry.get("manifestPath")
        required = bool(entry.get("required", False))

        if not feature_id or not isinstance(feature_id, str):
            fail("Each catalog entry requires string 'id'")
        if feature_id in ids:
            fail(f"Duplicate feature id in catalog: {feature_id}")
        ids.add(feature_id)

        if required:
            required_seen = True

        if not manifest_rel or not isinstance(manifest_rel, str):
            fail(f"Feature '{feature_id}' missing string manifestPath")

        manifest_path = ROOT / manifest_rel
        manifest = read_json(manifest_path)

        missing_fields = REQUIRED_MANIFEST_FIELDS - set(manifest.keys())
        if missing_fields:
            fail(f"Manifest '{manifest_path}' missing fields: {sorted(missing_fields)}")

        if manifest.get("id") != feature_id:
            fail(
                f"Manifest id mismatch for '{feature_id}': "
                f"manifest has '{manifest.get('id')}'"
            )

        status = manifest.get("status")
        if status not in ALLOWED_STATUS:
            fail(
                f"Manifest '{feature_id}' has invalid status '{status}'. "
                f"Allowed: {sorted(ALLOWED_STATUS)}"
            )

        ui_modes = manifest.get("uiModes")
        if not isinstance(ui_modes, list) or not ui_modes:
            fail(f"Manifest '{feature_id}' uiModes must be a non-empty list")
        if not set(ui_modes).issubset(ALLOWED_MODES):
            fail(
                f"Manifest '{feature_id}' uiModes must be subset of "
                f"{sorted(ALLOWED_MODES)}"
            )

        depends_on = manifest.get("dependsOn")
        if not isinstance(depends_on, list):
            fail(f"Manifest '{feature_id}' dependsOn must be a list")

        if not isinstance(manifest.get("inputs"), list):
            fail(f"Manifest '{feature_id}' inputs must be a list")
        if not isinstance(manifest.get("outputs"), list):
            fail(f"Manifest '{feature_id}' outputs must be a list")

    if "core-economics" not in ids:
        fail("Catalog must include required core module 'core-economics'")

    if not required_seen:
        fail("Catalog should mark at least one feature as required")

    print("[PASS] Feature catalog and manifests are valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
