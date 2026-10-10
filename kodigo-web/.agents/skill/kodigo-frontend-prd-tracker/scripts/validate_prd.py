#!/usr/bin/env python3
"""Validate that a Kodigo website frontend PRD preserves the original baseline."""

from __future__ import annotations

import re
import sys
from pathlib import Path

BASELINE_IDS = [
    "W-01",
    "W-02",
    "W-03",
    "W-04",
    "W-05",
    "W-06",
    "W-07",
    "W-08",
    "W-09",
    "W-10",
    "W-11",
    "W-12",
]

ALLOWED_STATUSES = {
    "Not started",
    "In progress",
    "Blocked",
    "Ready for QA",
    "Done",
}


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_prd.py <docs/FRONTEND_PRD.md>")
        return 2

    path = Path(sys.argv[1])
    if not path.is_file():
        print(f"ERROR: PRD not found: {path}")
        return 1

    text = path.read_text(encoding="utf-8")
    errors: list[str] = []

    for ticket_id in BASELINE_IDS:
        count = len(re.findall(rf"\b{re.escape(ticket_id)}\b", text))
        if count == 0:
            errors.append(f"Missing baseline ticket {ticket_id}")

    required_sections = [
        "## 1. Executive status",
        "## 2. Baseline ticket tracker",
        "## 3. Ticket details",
        "## 5. Dependency and blocker register",
        "## 6. Derived frontend gaps",
        "## 7. Milestone readiness",
        "## 9. Changelog",
    ]
    for section in required_sections:
        if section not in text:
            errors.append(f"Missing required section: {section}")

    status_tokens = set(re.findall(r"\b(?:Not started|In progress|Blocked|Ready for QA|Done)\b", text))
    invalid_status_lines = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        if "Status:" in line:
            value = line.split("Status:", 1)[1].strip().strip("*` ")
            if value and value not in ALLOWED_STATUSES and not value.startswith("..."):
                invalid_status_lines.append((line_no, value))
    for line_no, value in invalid_status_lines:
        errors.append(f"Invalid status at line {line_no}: {value}")

    progress_values = re.findall(r"\b(\d{1,3})%\b", text)
    for raw in progress_values:
        value = int(raw)
        if value <= 100 and value not in {0, 25, 50, 75, 100}:
            # Executive aggregate metrics can be arbitrary; only flag values on ticket-like table rows.
            matching_lines = [ln for ln in text.splitlines() if f"{raw}%" in ln and re.search(r"W-\d{2}", ln)]
            if matching_lines:
                errors.append(f"Ticket progress must use 0/25/50/75/100, found {raw}%")

    if errors:
        print("PRD validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PRD validation passed.")
    print(f"Baseline tickets present: {len(BASELINE_IDS)}")
    if status_tokens:
        print("Statuses found: " + ", ".join(sorted(status_tokens)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
