# AI-Based Garment Evaluation and Resale-Price Estimation for Second-Hand Clothing

COSC 499A Capstone. The project estimates the condition and resale price of second-hand garments from photos.

## Project status

| Area | Status |
|---|---|
| Data collection and cleaning | Done. 11 Turkish garment categories, 7,320 records (Excel). |
| Image dataset download | Done. 5,273 of 7,320 images downloaded and verified (see below). |
| Backend (FastAPI + Neon PostgreSQL) | Started. App skeleton, DB connection, `/` and `/db-health` endpoints, SQLAlchemy models and an initial Alembic migration. No real routes or services yet. |
| Frontend (React Native / Expo, `ReWearAI`) | Started. Dashboard, Upload, Analysis, Pricing and Listing screens exist. They use mock data (`constants/mockDataTemp.js`). Not connected to the backend. |
| AI model (garment evaluation / price estimation) | Not started. |

## Repository layout

```
Backend/               FastAPI app (app/), Alembic migrations, requirements.txt
Frontend/ReWearAI/     Expo / React Native app
Data-Cleaning/         Raw (dataset/) and cleaned (dataset cleaned/) Excel files + cleaning notebook
Dataset-Preparation/   Image download + verification scripts
dataset_images/        Downloaded images by category, download_mapping.csv, download_report.txt
```

## Dataset

Source: gardrops.com listings. Each cleaned Excel file (`Data-Cleaning/dataset cleaned/*_cleaned.xlsx`) has a
`Sheet1` with the columns `image_url`, `price` (TL), `brand`, `category` and `image_name`.
It also has a `Cleaning Summary` sheet. All 11 files have the same structure.

| Excel | Turkish category | English folder | Records | Downloaded | Failed (404) |
|---|---|---|---:|---:|---:|
| bluz | Bluz | blouses | 720 | 576 | 144 |
| elbise | Elbise | dresses | 120 | 92 | 28 |
| etek | Etek | skirts | 720 | 500 | 220 |
| gomlek | Gömlek | shirts | 720 | 529 | 191 |
| kaban | Kaban | coats | 720 | 411 | 309 |
| kazak | Kazakj* | sweaters | 720 | 634 | 86 |
| mont | Mont | jackets | 720 | 454 | 266 |
| pantolon | Pantolon | trousers | 720 | 490 | 230 |
| sort | Şort | shorts | 720 | 520 | 200 |
| sweatshirt | SweatShirt | sweatshirts | 720 | 494 | 226 |
| tshirt | Tshirt | t-shirts | 720 | 573 | 147 |
| **Total** | | | **7,320** | **5,273** | **2,047** |

\* `Kazakj` is a typo for `Kazak` in the source data. It is kept as-is in `category_turkish`.

All 2,047 failures are HTTP 404: the listing images no longer exist on the server (about 28% of the links).
They are recorded in `dataset_images/download_mapping.csv` with `download_status = failed`.
A re-run produced the same failures. No invalid or corrupt images were found.

`dataset_images/download_mapping.csv` links every record to its Excel file, worksheet and row number, and to its local file.

## Re-running the download

```
pip install openpyxl pillow requests      # use a separate venv, not the backend one
python Dataset-Preparation/download_images.py     # resumable; skips valid existing files, never overwrites
python Dataset-Preparation/verify_dataset.py      # checks files, mapping vs Excel, and report
```

## Next steps / needs attention

- Decide how to handle the missing 28% of images. Options are to re-scrape, or to proceed with the 5,273 available.
- The dataset has prices and brands but no condition labels, so decide how condition will be labelled for the evaluation model.
- Decide whether `dataset_images/` should be git-ignored. It holds about 5,000 binary files and is not currently ignored.
- Build the real backend routes and services, and connect the frontend to them.
- Train the model (not started).
