#!/usr/bin/env python3
"""Resume batch compression — flushes DB every 50 files so asset browser stays live."""

import json, os, subprocess, struct, shutil, sys
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
COMPRESSED_DIR = BASE / "apps/web/public/compressed"
DB_PATH = BASE / "docs/assets/glb-database.json"
PUBLIC_DB = BASE / "apps/web/public/glb-database.json"
BATCH_SIZE = 50

def run_transform(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        stderr = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"{' '.join(args[:2])} failed: {stderr}")

def parse_glb_metadata(filepath):
    try:
        with open(filepath, 'rb') as f: data = f.read()
        magic = struct.unpack_from('<I', data, 0)[0]
        if magic != 0x46546C67: return None
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
        else: gmin, gmax = [0,0,0], [1,1,1]
        width, height, depth = gmax[0]-gmin[0], gmax[1]-gmin[1], gmax[2]-gmin[2]
        has_normals = has_colors = has_uvs = False
        for mesh in json_data.get('meshes', []):
            for prim in mesh.get('primitives', []):
                a = prim.get('attributes', {})
                if 'NORMAL' in a: has_normals = True
                if 'COLOR_0' in a: has_colors = True
                if 'TEXCOORD_0' in a: has_uvs = True
        return {
            "width": round(width,3), "height": round(height,3), "depth": round(depth,3),
            "radius": round(max(width,height,depth)/2, 3), "vertexCount": vertex_count,
            "meshCount": mesh_count, "materialCount": len(json_data.get('materials',[])),
            "hasNormals": has_normals, "hasColors": has_colors, "hasUVs": has_uvs,
            "min": [round(v,5) for v in gmin], "max": [round(v,5) for v in gmax],
            "fileSizeKB": round(os.path.getsize(filepath)/1024, 1),
            "suggestedScale": round(3.0/height if height>0 else 10.0, 3),
        }
    except: return None

def flush_db(db):
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=2)
    shutil.copy2(DB_PATH, PUBLIC_DB)

# Load current DB
with open(DB_PATH) as f:
    db = json.load(f)

existing_ids = {e["id"] for e in db}
compressed_done = {e["id"].replace("compressed-", "") for e in db if e["source"] == "compressed"}

# Find remaining files
remaining = []
for entry in db:
    if entry["source"] == "compressed":
        continue
    if entry["id"] in compressed_done:
        continue
    if entry["fileSizeKB"] <= 50:
        continue
    src_path = BASE / entry["path"]
    if src_path.exists():
        remaining.append(entry)

print(f"Remaining: {len(remaining)} files")
print(f"  Full pipeline (draco): {len([e for e in remaining if e['fileSizeKB'] > 200])}")
print(f"  Light pipeline: {len([e for e in remaining if e['fileSizeKB'] <= 200])}")
print()

new_entries = []
success = 0
failed = 0
pid = os.getpid()

for i, entry in enumerate(remaining):
    src_path = BASE / entry["path"]
    dest_dir = COMPRESSED_DIR / entry["source"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    stem = entry["filename"].replace(".glb", "")
    dest_file = dest_dir / f"{stem}_compressed.glb"
    compressed_id = f"compressed-{entry['id']}"
    
    use_draco = entry["fileSizeKB"] > 200
    tmp_base = f"/tmp/hermes_resume_{pid}"
    
    try:
        run_transform(["gltf-transform", "dedup", str(src_path), f"{tmp_base}_1.glb"])
        run_transform(["gltf-transform", "prune", f"{tmp_base}_1.glb", f"{tmp_base}_2.glb"])
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
        
        meta = parse_glb_metadata(str(dest_file))
        if meta is None:
            print(f"  FAIL [{i+1}/{len(remaining)}] {entry['filename']}: parse fail")
            failed += 1
            continue
        
        tags = list(set(entry.get("tags", []) + ["compressed", "webp"] + (["draco"] if use_draco else [])))
        
        new_entry = {
            "id": compressed_id,
            "filename": dest_file.name,
            "source": "compressed",
            "path": str(dest_file.relative_to(BASE)),
            "category": entry["category"],
            "tags": tags,
            "suggestedScale": meta.pop("suggestedScale"),
            **meta
        }
        
        new_entries.append(new_entry)
        success += 1
        
        orig_kb, comp_kb = entry["fileSizeKB"], meta["fileSizeKB"]
        pct = (1 - comp_kb/orig_kb)*100 if orig_kb > 0 else 0
        bar = "█" if use_draco else "░"
        print(f"  {bar} [{i+1}/{len(remaining)}] {entry['filename']}: {orig_kb:.0f}KB → {comp_kb:.0f}KB ({pct:.0f}%)")
        
    except Exception as e:
        print(f"  FAIL [{i+1}/{len(remaining)}] {entry['filename']}: {e}")
        failed += 1
    finally:
        for tmp in [f"{tmp_base}_1.glb", f"{tmp_base}_2.glb", f"{tmp_base}_3.glb", f"{tmp_base}_4.glb"]:
            try: os.remove(tmp)
            except: pass
    
    # Flush every BATCH_SIZE
    if len(new_entries) >= BATCH_SIZE:
        db.extend(new_entries)
        flush_db(db)
        print(f"  ── flushed {len(new_entries)} entries to DB ({len(db)} total) ──")
        new_entries = []

# Final flush
if new_entries:
    db.extend(new_entries)
    flush_db(db)
    print(f"  ── final flush: {len(new_entries)} entries ({len(db)} total) ──")

print(f"\n=== DONE ===")
print(f"Success: {success}, Failed: {failed}")
print(f"Compressed total: {len([e for e in db if e['source']=='compressed'])}")
