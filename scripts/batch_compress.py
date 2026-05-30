#!/usr/bin/env python3
"""Batch compress GLB assets: dedup → prune → resize(512) → webp → [draco for >200KB].
Output to apps/web/public/compressed/{source}/ — adds entries to glb-database.json."""

import json, os, subprocess, struct, time, sys, shutil
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
COMPRESSED_DIR = BASE / "apps/web/public/compressed"
DB_PATH = BASE / "docs/assets/glb-database.json"
PUBLIC_DB = BASE / "apps/web/public/glb-database.json"

def run_transform(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        stderr = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"{' '.join(args[:2])} failed: {stderr}")

# ── metadata parser (same as DB builder) ──
def parse_glb_metadata(filepath):
    try:
        with open(filepath, 'rb') as f:
            data = f.read()
        magic = struct.unpack_from('<I', data, 0)[0]
        if magic != 0x46546C67:
            return None
        json_len = struct.unpack_from('<I', data, 12)[0]
        json_data = json.loads(data[20:20+json_len])
        all_mins, all_maxs = [], []
        vertex_count, mesh_count = 0, len(json_data.get('meshes', []))
        for mesh in json_data.get('meshes', []):
            for prim in mesh.get('primitives', []):
                pos_acc = prim.get('attributes', {}).get('POSITION')
                if pos_acc is not None:
                    acc = json_data['accessors'][pos_acc]
                    all_mins.append(acc.get('min', [0,0,0]))
                    all_maxs.append(acc.get('max', [0,0,0]))
                    vertex_count += acc.get('count', 0)
        if all_mins:
            gmin = [min(m[i] for m in all_mins) for i in range(3)]
            gmax = [max(m[i] for m in all_maxs) for i in range(3)]
        else:
            gmin, gmax = [0,0,0], [1,1,1]
        width = gmax[0] - gmin[0]
        height = gmax[1] - gmin[1]
        depth = gmax[2] - gmin[2]
        radius = max(width, height, depth) / 2
        material_count = len(json_data.get('materials', []))
        has_normals = has_colors = has_uvs = False
        for mesh in json_data.get('meshes', []):
            for prim in mesh.get('primitives', []):
                attrs = prim.get('attributes', {})
                if 'NORMAL' in attrs: has_normals = True
                if 'COLOR_0' in attrs: has_colors = True
                if 'TEXCOORD_0' in attrs: has_uvs = True
        suggested_scale = 3.0 / height if height > 0 else 10.0
        return {
            "width": round(width, 3), "height": round(height, 3),
            "depth": round(depth, 3), "radius": round(radius, 3),
            "vertexCount": vertex_count, "meshCount": mesh_count,
            "materialCount": material_count, "hasNormals": has_normals,
            "hasColors": has_colors, "hasUVs": has_uvs,
            "min": [round(v, 5) for v in gmin],
            "max": [round(v, 5) for v in gmax],
            "fileSizeKB": round(os.path.getsize(filepath) / 1024, 1),
        }
    except Exception as e:
        print(f"  WARN: metadata parse failed: {e}")
        return None

# ── load DB ──
with open(DB_PATH) as f:
    db = json.load(f)

# Already-compressed IDs
existing_ids = {e["id"] for e in db if e["source"] == "compressed"}
print(f"Existing compressed entries: {len(existing_ids)}")

# ── filter: skip ≤50KB, skip already compressed ──
to_process = []
for entry in db:
    if entry["source"] == "compressed":
        continue
    if entry["fileSizeKB"] <= 50:
        continue
    src_path = BASE / entry["path"]
    if not src_path.exists():
        continue
    to_process.append(entry)

print(f"Files to process: {len(to_process)}")
print(f"  Full pipeline (draco, >200KB): {len([e for e in to_process if e['fileSizeKB'] > 200])}")
print(f"  Light pipeline (no draco, 50-200KB): {len([e for e in to_process if e['fileSizeKB'] <= 200])}")
print()

# ── process ──
new_entries = []
success = 0
failed = 0
skipped_existing = 0

for i, entry in enumerate(to_process):
    src_path = BASE / entry["path"]
    dest_dir = COMPRESSED_DIR / entry["source"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Output filename: append _compressed before .glb
    stem = entry["filename"].replace(".glb", "")
    dest_file = dest_dir / f"{stem}_compressed.glb"
    compressed_id = f"compressed-{entry['id']}"
    
    if compressed_id in existing_ids:
        skipped_existing += 1
        continue
    
    use_draco = entry["fileSizeKB"] > 200
    
    # Temp files
    tmp_base = f"/tmp/hermes_batch_{os.getpid()}"
    
    try:
        # Step 1-2: dedup + prune
        run_transform(["gltf-transform", "dedup", str(src_path), f"{tmp_base}_1.glb"])
        run_transform(["gltf-transform", "prune", f"{tmp_base}_1.glb", f"{tmp_base}_2.glb"])
        
        # Step 3-4: resize + webp
        run_transform([
            "gltf-transform", "resize", f"{tmp_base}_2.glb", f"{tmp_base}_3.glb",
            "--width", "512", "--height", "512",
        ])
        run_transform(["gltf-transform", "webp", f"{tmp_base}_3.glb", f"{tmp_base}_4.glb"])
        
        if use_draco:
            run_transform([
                "gltf-transform", "draco", f"{tmp_base}_4.glb", str(dest_file),
                "--encode-speed", "10", "--decode-speed", "4",
            ])
        else:
            shutil.copy2(f"{tmp_base}_4.glb", str(dest_file))
        
        # Parse metadata
        meta = parse_glb_metadata(str(dest_file))
        if meta is None:
            print(f"  FAIL [{i+1}/{len(to_process)}] {entry['filename']}: metadata parse failed")
            failed += 1
            continue
        
        # Build compressed entry
        tags = entry.get("tags", []) + ["compressed", "webp"]
        if use_draco:
            tags.append("draco")
        
        compressed_entry = {
            "id": compressed_id,
            "filename": dest_file.name,
            "source": "compressed",
            "path": str(dest_file.relative_to(BASE)),
            "category": entry["category"],
            "tags": tags,
            "suggestedScale": meta.get("suggestedScale", entry["suggestedScale"]),
            **{k: v for k, v in meta.items()}
        }
        
        new_entries.append(compressed_entry)
        existing_ids.add(compressed_id)
        success += 1
        
        orig_kb = entry["fileSizeKB"]
        comp_kb = meta["fileSizeKB"]
        pct = (1 - comp_kb / orig_kb) * 100 if orig_kb > 0 else 0
        
        bar = "█" if use_draco else "░"
        print(f"  {bar} [{i+1}/{len(to_process)}] {entry['filename']}: {orig_kb:.0f}KB → {comp_kb:.0f}KB ({pct:.0f}%)")
        
    except subprocess.TimeoutExpired:
        print(f"  FAIL [{i+1}/{len(to_process)}] {entry['filename']}: timeout")
        failed += 1
    except Exception as e:
        print(f"  FAIL [{i+1}/{len(to_process)}] {entry['filename']}: {e}")
        failed += 1
    finally:
        # Cleanup temp files
        for tmp in [f"{tmp_base}_1.glb", f"{tmp_base}_2.glb", f"{tmp_base}_3.glb", f"{tmp_base}_4.glb"]:
            try:
                os.remove(tmp)
            except:
                pass

# ── update DB ──
db.extend(new_entries)
with open(DB_PATH, 'w') as f:
    json.dump(db, f, indent=2)
shutil.copy2(DB_PATH, PUBLIC_DB)

print()
print(f"=== DONE ===")
print(f"Success: {success}")
print(f"Failed: {failed}")
print(f"Skipped (already exist): {skipped_existing}")
print(f"Total compressed entries in DB: {len(existing_ids)}")
print(f"DB entries total: {len(db)}")

# Show top savings
new_sorted = sorted(new_entries, key=lambda e: e["fileSizeKB"])
if new_sorted:
    print(f"\nSmallest compressed: {new_sorted[0]['filename']} ({new_sorted[0]['fileSizeKB']} KB)")
    print(f"Largest compressed: {new_sorted[-1]['filename']} ({new_sorted[-1]['fileSizeKB']} KB)")
