#!/usr/bin/env python3
"""Validate canonical docs links for FiceCal markdown documentation."""

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET_FILES = [ROOT / "README.md", *sorted((ROOT / "docs").rglob("*.md"))]

RTD_CANONICAL_PREFIX = "https://ficecal.readthedocs.io/en/latest/"
RTD_URL_PATTERN = re.compile(r"https?://ficecal\.readthedocs\.io[^\s)>'\"]*")
PUBLIC_MIRROR_DOC_URL_PATTERN = re.compile(
    r"https://duksh\.github\.io/(document\.html(?:#glossary)?|glossary\.html)"
)


def main() -> int:
    violations: list[str] = []

    for file_path in TARGET_FILES:
        rel_path = file_path.relative_to(ROOT)
        text = file_path.read_text(encoding="utf-8")

        for match in RTD_URL_PATTERN.finditer(text):
            url = match.group(0)
            if not url.startswith(RTD_CANONICAL_PREFIX):
                violations.append(
                    f"{rel_path}: non-canonical RTD URL '{url}'. "
                    f"Use '{RTD_CANONICAL_PREFIX}' prefix."
                )

        for match in PUBLIC_MIRROR_DOC_URL_PATTERN.finditer(text):
            url = match.group(0)
            violations.append(
                f"{rel_path}: public mirror docs URL '{url}' is not canonical for source docs. "
                f"Use '{RTD_CANONICAL_PREFIX}'."
            )

    if violations:
        print("[FAIL] Documentation link validation failed:")
        for issue in violations:
            print(f"  - {issue}")
        return 1

    print("[PASS] Documentation links are canonical")
    return 0


if __name__ == "__main__":
    sys.exit(main())
