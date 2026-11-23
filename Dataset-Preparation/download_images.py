"""
Download and organise garment images referenced by the cleaned Excel datasets.

Reads   : Data-Cleaning/dataset cleaned/*.xlsx   (never modified)
Writes  : dataset_images/<category_english>/<image_name>.<ext>
          dataset_images/download_mapping.csv
          dataset_images/download_report.txt

Resumable: re-running skips images that already exist on disk and are valid,
retries failed ones, and never overwrites an existing file.

Usage:  python download_images.py [--workers 6] [--delay 0.15] [--limit N]
Requires: openpyxl, pillow, requests
"""
import argparse
import csv
import os
import threading
import time
import unicodedata
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import openpyxl
import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
EXCEL_DIR = ROOT / "Data-Cleaning" / "dataset cleaned"
OUT_DIR = ROOT / "dataset_images"
MAPPING = OUT_DIR / "download_mapping.csv"
REPORT = OUT_DIR / "download_report.txt"

# Keyed by Excel filename prefix (ASCII, as in the file names). Values: English folder name.
# Distinct Turkish garments stay distinct folders.
CATEGORY_EN = {
    "bluz": "blouses",
    "elbise": "dresses",
    "etek": "skirts",
    "gomlek": "shirts",
    "kaban": "coats",
    "kazak": "sweaters",
    "mont": "jackets",
    "pantolon": "trousers",
    "sort": "shorts",
    "sweatshirt": "sweatshirts",
    "tshirt": "t-shirts",
}
FIELDS = ["source_excel", "worksheet_name", "row_number", "category_turkish",
          "category_english", "image_url", "original_filename", "local_filename",
          "local_image_path", "download_status", "failure_reason"]
FORMAT_EXT = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp", "GIF": ".gif", "BMP": ".bmp"}
IMG_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp")
HEADERS = {"User-Agent": "Mozilla/5.0 (academic dataset preparation; COSC 499A capstone)"}


def nfc(s):
    return unicodedata.normalize("NFC", str(s)).strip() if s is not None else ""


def is_valid_image(path):
    try:
        with Image.open(path) as im:
            im.verify()
        with Image.open(path) as im:
            im.load()
        return True
    except Exception:
        return False


def load_rows():
    """Return (rows, stats). One dict per data row of every worksheet that has an image_url column."""
    rows, stats = [], {"files": 0, "sheets": 0, "records": 0, "structures": {}}
    for xl in sorted(EXCEL_DIR.glob("*.xlsx")):
        stats["files"] += 1
        key = xl.stem.replace("_cleaned", "").lower()
        wb = openpyxl.load_workbook(xl, read_only=True, data_only=True)
        for ws in wb.worksheets:
            stats["sheets"] += 1
            data = list(ws.iter_rows(values_only=True))
            if not data:
                continue
            header = [nfc(h).lower() for h in data[0]]
            stats["structures"][(xl.name, ws.title)] = header
            if "image_url" not in header:
                continue  # e.g. 'Cleaning Summary' sheet: metadata, not garment records
            ci = {h: i for i, h in enumerate(header)}
            for n, r in enumerate(data[1:], start=2):  # n = Excel row number
                if all(v is None or str(v).strip() == "" for v in r):
                    continue
                get = lambda col: nfc(r[ci[col]]) if col in ci and ci[col] < len(r) else ""
                stats["records"] += 1
                rows.append({
                    "source_excel": xl.name, "worksheet_name": ws.title, "row_number": n,
                    "category_turkish": get("category"),
                    "category_english": CATEGORY_EN.get(key, ""),
                    "image_url": get("image_url"), "original_filename": get("image_name"),
                })
        wb.close()
    return rows, stats


def load_previous():
    prev = {}
    if MAPPING.exists():
        with open(MAPPING, newline="", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                prev[(r["source_excel"], r["worksheet_name"], str(r["row_number"]))] = r
    return prev


def plan_names(rows, prev):
    """Assign each row a (category folder, stem). Same stem in same folder -> suffix, so nothing collides."""
    used, conflicts = {}, 0
    for r in rows:
        r["conflict"] = False
        if not (r["original_filename"] and r["image_url"] and r["category_english"]):
            continue
        folder = r["category_english"]
        stem = r["original_filename"]
        k = (folder, stem.lower())
        if k in used:
            stem = f"{stem}__{Path(r['source_excel']).stem}_r{r['row_number']}"
            r["conflict"] = True
            conflicts += 1
        used[(folder, stem.lower())] = True
        r["stem"] = stem
    return conflicts


def existing_for(r, prev):
    """Path of a previously downloaded, still-valid file for this row, else None."""
    p = prev.get((r["source_excel"], r["worksheet_name"], str(r["row_number"])))
    if p and p["download_status"] in ("downloaded", "already_exists") and p["local_image_path"]:
        path = ROOT / p["local_image_path"]
        if path.exists() and is_valid_image(path):
            return path
    return None


def fetch(session, r, prev, args, lock):
    folder = OUT_DIR / r["category_english"]
    old = existing_for(r, prev)
    if old:
        return "already_exists", old, ""
    url = r["image_url"]
    last_err = ""
    for attempt in range(1, args.retries + 1):
        time.sleep(args.delay)
        part = folder / f".{r['stem']}.{threading.get_ident()}.part"
        try:
            resp = session.get(url, timeout=(10, 30), stream=True)
            if resp.status_code != 200:
                last_err = f"HTTP {resp.status_code}"
                if resp.status_code in (400, 401, 403, 404, 410):
                    return "failed", None, last_err  # permanent, don't retry
                time.sleep(2 * attempt)
                continue
            with open(part, "wb") as f:
                for chunk in resp.iter_content(65536):
                    f.write(chunk)
            if part.stat().st_size == 0:
                last_err = "empty response body"
                continue
            try:
                with Image.open(part) as im:
                    fmt = im.format
            except Exception as e:
                part.unlink(missing_ok=True)
                return "failed", None, f"invalid image file (not decodable: {type(e).__name__})"
            if not is_valid_image(part):
                part.unlink(missing_ok=True)
                return "failed", None, "invalid image file (truncated or corrupt)"
            url_ext = os.path.splitext(url.split("?")[0])[1].lower()
            actual = FORMAT_EXT.get(fmt, "." + (fmt or "img").lower())
            # keep the dataset/URL extension when it agrees with the real format
            ext = url_ext if url_ext in IMG_EXTS and FORMAT_EXT.get(fmt) == (".jpg" if url_ext == ".jpeg" else url_ext) else actual
            with lock:  # never overwrite
                target = folder / f"{r['stem']}{ext}"
                if target.exists():
                    part.unlink(missing_ok=True)
                    target = folder / f"{r['stem']}__{Path(r['source_excel']).stem}_r{r['row_number']}{ext}"
                    if target.exists():
                        return "failed", None, "target filename already exists; refused to overwrite"
                    r["conflict"] = True
                os.replace(part, target)
            return "downloaded", target, ""
        except (requests.Timeout, requests.ConnectionError) as e:
            last_err = f"{type(e).__name__}: {str(e)[:120]}"
            time.sleep(2 * attempt)
        except Exception as e:
            last_err = f"{type(e).__name__}: {str(e)[:120]}"
        finally:
            part.unlink(missing_ok=True)
    return "failed", None, f"after {args.retries} attempts: {last_err}"


def write_mapping(rows):
    OUT_DIR.mkdir(exist_ok=True)
    tmp = MAPPING.with_suffix(".csv.tmp")
    with open(tmp, "w", newline="", encoding="utf-8-sig") as f:  # BOM so Excel reads Turkish chars
        w = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)
    os.replace(tmp, MAPPING)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--delay", type=float, default=0.15)
    ap.add_argument("--retries", type=int, default=3)
    ap.add_argument("--limit", type=int, default=0, help="only process first N downloadable rows (testing)")
    args = ap.parse_args()

    OUT_DIR.mkdir(exist_ok=True)
    rows, stats = load_rows()
    prev = load_previous()
    conflicts = plan_names(rows, prev)
    for r in rows:
        r.update(local_filename="", local_image_path="", download_status="", failure_reason="")
        if not r["image_url"]:
            r.update(download_status="skipped_missing_url", failure_reason="image_url cell is empty")
        elif not r["original_filename"]:
            r.update(download_status="skipped_missing_filename",
                     failure_reason="image_name cell is empty; no filename invented")
        elif not r["category_english"]:
            r.update(download_status="skipped_unknown_category", failure_reason="no English mapping for category")
        elif not r["image_url"].lower().startswith(("http://", "https://")):
            r.update(download_status="failed", failure_reason="invalid URL (not http/https)")
    for c in {r["category_english"] for r in rows if r["category_english"]}:
        (OUT_DIR / c).mkdir(exist_ok=True)

    todo = [r for r in rows if not r["download_status"]]
    if args.limit:
        todo = todo[: args.limit]
    session = requests.Session()
    session.headers.update(HEADERS)
    lock, done, t0 = threading.Lock(), [0], time.time()

    def work(r):
        status, path, reason = fetch(session, r, prev, args, lock)
        r["download_status"], r["failure_reason"] = status, reason
        if path:
            r["local_filename"] = path.name
            r["local_image_path"] = path.relative_to(ROOT).as_posix()
        with lock:
            done[0] += 1
            if done[0] % 100 == 0:
                print(f"  {done[0]}/{len(todo)}  ({time.time()-t0:.0f}s)", flush=True)
                write_mapping(rows)  # checkpoint

    try:
        with ThreadPoolExecutor(args.workers) as ex:
            list(ex.map(work, todo))
    except KeyboardInterrupt:
        print("Interrupted; saving progress.")
    pending = [r for r in rows if not r["download_status"]]
    for r in pending:
        r["download_status"] = "not_attempted"
        r["failure_reason"] = "run limited/interrupted; re-run to continue"
    write_mapping(rows)
    write_report(rows, stats, conflicts, time.time() - t0)
    print(f"Done. {Counter(r['download_status'] for r in rows)}")


def write_report(rows, stats, conflicts, secs):
    ok = ("downloaded", "already_exists")
    st = Counter(r["download_status"] for r in rows)
    with_url = [r for r in rows if r["image_url"]]
    fail_reasons = Counter(r["failure_reason"].split(" after")[0] if r["download_status"] == "failed" else None
                           for r in rows)
    fail_reasons.pop(None, None)
    L = ["DOWNLOAD REPORT", "=" * 60,
         f"Excel files processed:            {stats['files']}",
         f"Worksheets inspected:            {stats['sheets']} (worksheets without an image_url column are metadata and hold no records)",
         f"Total dataset records:           {stats['records']}",
         f"Total image URLs identified:     {len(with_url)}",
         f"Successful downloads (valid):    {st['downloaded'] + st['already_exists']}"
         f"  [{st['downloaded']} newly downloaded this run, {st['already_exists']} already on disk]",
         f"Failed downloads:                {st['failed']}",
         f"Skipped records:                 {sum(v for k, v in st.items() if k.startswith('skipped'))}",
         f"Not attempted (limit/interrupt): {st['not_attempted']}",
         f"Duplicate filename conflicts:    {conflicts} (resolved by suffixing; none overwritten)",
         f"Missing image URLs:              {st['skipped_missing_url']}",
         f"Missing filenames:               {st['skipped_missing_filename']}",
         f"Invalid image files:             {sum(1 for r in rows if r['failure_reason'].startswith('invalid image file'))}",
         f"Duplicate image URLs (same URL in multiple rows; each row kept as its own record): "
         f"{len(with_url) - len({r['image_url'] for r in with_url})}",
         f"Elapsed (last run):              {secs:.0f}s", "",
         "PER CATEGORY", "-" * 60,
         f"{'excel':<24}{'turkish':<12}{'folder':<13}{'rows':>5}{'ok':>6}{'fail':>6}{'skip':>6}"]
    by = defaultdict(list)
    for r in rows:
        by[(r["source_excel"], r["category_turkish"], r["category_english"])].append(r)
    for (x, tr, en), rs in sorted(by.items()):
        c = Counter(r["download_status"] for r in rs)
        L.append(f"{x:<24}{tr:<12}{en:<13}{len(rs):>5}{c['downloaded']+c['already_exists']:>6}"
                 f"{c['failed']:>6}{sum(v for k, v in c.items() if k.startswith('skipped')):>6}")
    L += ["", "WHY DOWNLOADS FAILED", "-" * 60]
    if fail_reasons:
        L += [f"{n:>5}  {reason}" for reason, n in fail_reasons.most_common()]
    else:
        L.append("No failures.")
    L += ["", "NOTES", "-" * 60,
          "- Category 'Kazakj' (kazak_cleaned.xlsx) looks like a typo for 'Kazak' (sweater) in the source data; "
          "it is preserved verbatim in category_turkish.",
          "- image_name values have no extension; extensions come from the URL and are confirmed against the actual image format.",
          "- Original Excel files are read-only inputs and were not modified."]
    REPORT.write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
