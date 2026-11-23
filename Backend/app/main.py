
from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db

app = FastAPI(
    title="Garment AI API",
    description="AI-Based Garment Evaluation and Resale-Price Estimation",
    version="1.0.0"
)


@app.get("/")
async def root():
    return {"message": "Garment AI API is running!"}


@app.get("/db-health")
def database_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected", "status": "healthy"}
    except Exception:
        return {"database": "disconnected", "status": "error"}
