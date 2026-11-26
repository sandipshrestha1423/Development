
from fastapi import FastAPI

app = FastAPI(
    title="Kaarya 2.0 Automation Service",
    description="NLP and automation services for Kaarya",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Kaarya 2.0 Automation Service is running!",
        "status": "success"
    }

@app.get("/health")
def health_check():
    return {
        "service": "automation-service",
        "status": "healthy"
    }
