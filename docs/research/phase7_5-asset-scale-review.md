# Phase 7.5 — Asset Scale Review

> Date: 2026-05-30

## Goal

Create a visual review mode for tuning scenery asset scale by direct inspection.

## Review URL

Open:

```text
http://127.0.0.1:5174/?scaleReview=1
```

This mode freezes flight, disables streamed scenery, and displays the active starter woodland assets in a numbered row ahead of the starting position.

## Number Mapping

| # | Asset ID | Role |
|---|----------|------|
| 1 | `pine-trees` | pine tree |
| 2 | `pine-trees-alt` | pine tree |
| 3 | `birch-trees` | canopy tree |
| 4 | `maple-trees` | canopy tree |
| 5 | `bushes` | bush |
| 6 | `flower-bushes` | bush |
| 7 | `grass` | grass |
| 8 | `rock` | rock |
| 9 | `rock-large` | rock |

## Feedback Format

Use direct scale feedback by number:

```text
1 too small, make 2x
2 okay
3 too tall, reduce 25%
5 should be lower/wider
```

## Current Limits

- Review mode uses each asset's midpoint scale: `(scaleMin + scaleMax) / 2`.
- Labels are visual scene text, not DOM text.
- The review camera is fixed so the lineup stays visible after reload.

## Scale Adjustment — 2026-05-30

User feedback from the numbered review:

| # | Asset ID | Adjustment |
|---|----------|------------|
| 1 | `pine-trees` | 10x |
| 2 | `pine-trees-alt` | 1.5x |
| 3 | `birch-trees` | no change |
| 4 | `maple-trees` | no change |
| 5 | `bushes` | 3x |
| 6 | `flower-bushes` | 4x |
| 7 | `grass` | 3x |
| 8 | `rock` | 4x |
| 9 | `rock-large` | no change |
