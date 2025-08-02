from fastapi import FastAPI, Query
from forecast import generate_forecast
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/forecast")
def get_forecast(item: str = Query(...), days: int = Query(30)):
    return generate_forecast(item_name=item, periods=days)
