# Runtime Copy Plan

> Generated: 2026-05-30  
> Plan: source candidates are listed in `docs/references/asset-curation/asset-catalog.json`

## Summary

| Set | Assets | Target Folder |
|-----|--------|---------------|
| `starter-woodland` | 11 | `apps/web/public/scenery/starter-woodland/` |
| `paper-plane-landmarks` | 6 | `apps/web/public/scenery/paper-plane-landmarks/` |
| `settlement-sparse` | 5 | `apps/web/public/scenery/settlement-sparse/` |
| **Total** | **22** | |

## Target Structure

```
apps/web/public/scenery/
├── starter-woodland/
│   ├── pine-trees.glb
│   ├── pine-trees-w8zaiyjk8c.glb
│   ├── birch-trees.glb
│   ├── maple-trees.glb
│   ├── dead-trees.glb
│   ├── bushes.glb
│   ├── flower-bushes.glb
│   ├── grass.glb
│   ├── rock-large.glb
│   ├── rock.glb
│   └── rock-34w5ymeepk.glb
├── paper-plane-landmarks/
│   ├── castle-1234.glb
│   ├── lighthouse.glb
│   ├── gazebo.glb
│   ├── wind-turbine.glb
│   ├── watch-tower.glb
│   └── fantasy-ruins.glb
└── settlement-sparse/
    ├── farm-house.glb
    ├── house.glb
    ├── huts.glb
    ├── storage-shed.glb
    └── barn.glb
```

## Execution

To copy all assets later, Codex should:

```bash
cp assets/polypizza/nature/Pine_Trees_oYtDty0fR6.glb apps/web/public/scenery/starter-woodland/pine-trees.glb
# ... (see runtime-copy-plan.json for full list)
```

Or use the JSON plan programmatically:

```ts
// Pseudo-code for Codex
for (const { sourcePath, targetPath } of plan) {
  await fs.copyFile(sourcePath, targetPath);
}
```

## Notes

- Existing `public/scale-test-assets/` stays untouched. The new assets go to `public/scenery/`.
- All source files are `.glb` — no conversion needed.
- No file names changed from catalog IDs. Stable references.
- Each asset appears in exactly one target path (no duplicates across sets).
