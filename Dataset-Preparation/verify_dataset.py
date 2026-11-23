"""Phase 7 verification: mapping CSV vs Excel vs files on disk vs report. Read-only."""
import csv
import re
import sys
from collections import Counter
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from download_images import MAPPING, OUT_DIR, REPORT, ROOT, load_rows  # noqa: E402

problems = []
rows, stats = load_rows()
with open(MAPPING, newline="", encoding="utf-8-sig") as f:
    mp = list(csv.DictReader(f))

# 1+2: every success exists and opens
ok = [m for m in mp if m["download_status"] in ("downloaded", "already_exists")]
for m in ok:
    p = ROOT / m["local_image_path"]
    if not p.exists():
        problems.append(f"missing file: {p}")
        continue
    try:
        with Image.open(p) as im:
            im.verify()
        with Image.open(p) as im:
            im.load()
    except Exception as e:
        problems.append(f"cannot open {p}: {e}")
print(f"[1,2] successful records: {len(ok)}; all exist and open: {not any(x.startswith(('missing','cannot')) for x in problems)}")

# 3: mapping vs Excel
key = lambda r: (r["source_excel"], r["worksheet_name"], str(r["row_number"]), r["image_url"], r["original_filename"], r["category_turkish"])
a, b = Counter(map(key, rows)), Counter(map(key, mp))
print(f"[3] Excel records {len(rows)} vs mapping rows {len(mp)}; identical key sets: {a == b}")
if a != b:
    problems.append("mapping does not match Excel records")

# traceability / uniqueness
paths = [m["local_image_path"] for m in ok]
if len(paths) != len(set(p.lower() for p in paths)):
    problems.append("two records point to the same local file")
print(f"[3] unique local paths: {len(set(paths)) == len(paths)}")

# 4: no overwrite -> files on disk == files in mapping (nothing unaccounted, none shared)
disk = {p.relative_to(ROOT).as_posix() for p in OUT_DIR.rglob("*") if p.is_file() and p.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")}
extra = disk - set(paths)
print(f"[4] images on disk: {len(disk)}; unmapped files: {len(extra)}; leftover .part files: {len(list(OUT_DIR.rglob('*.part')))}")
if extra:
    problems.append(f"unmapped files on disk: {sorted(extra)[:5]}")

# 5: category folders
cats = {m["category_english"] for m in mp}
missing = [c for c in cats if not (OUT_DIR / c).is_dir()]
print(f"[5] categories {len(cats)}; all have folders: {not missing}")
problems += [f"missing folder {c}" for c in missing]

# 6: report vs actual
txt = REPORT.read_text(encoding="utf-8")
claimed_ok = int(re.search(r"Successful downloads \(valid\):\s+(\d+)", txt).group(1))
claimed_fail = int(re.search(r"Failed downloads:\s+(\d+)", txt).group(1))
real_fail = sum(m["download_status"] == "failed" for m in mp)
print(f"[6] report ok/fail = {claimed_ok}/{claimed_fail}; actual = {len(ok)}/{real_fail}; files on disk = {len(disk)}")
if (claimed_ok, claimed_fail) != (len(ok), real_fail) or len(disk) != len(ok):
    problems.append("report does not match actual results")
print("Statuses:", dict(Counter(m["download_status"] for m in mp)))
print("RESULT:", "PASS" if not problems else "PROBLEMS")
for p in problems:
    print("  -", p)
