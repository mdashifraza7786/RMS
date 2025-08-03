from fastapi import FastAPI, Query
from forecast import generate_forecast, generate_revenue_forecast
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/forecast")
def get_inventory_forecast(item: str = Query(...), days: int = Query(30)):
    """
    Inventory forecast by item name.
    """
    return generate_forecast(item_name=item, periods=days)

@app.get("/revenue-forecast")
def get_revenue_forecast(days: int = Query(30)):
    """
    Revenue forecast for all paid invoices.
    """
    return generate_revenue_forecast(periods=days)
