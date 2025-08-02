from prophet import Prophet
import pandas as pd
from datetime import datetime
import os

CSV_FILE = "recent_inventory_order.csv"

def generate_forecast(item_name, periods=30):
    if not os.path.exists(CSV_FILE):
        return {"error": f"{CSV_FILE} not found."}

    df = pd.read_csv(CSV_FILE)
    df['date'] = pd.to_datetime(df['date'])

    item_df = df[df['order_name'] == item_name]
    if item_df.empty:
        return {"error": f"No data found for item: {item_name}"}

    item_df = item_df.groupby('date').agg({'quantity': 'sum'}).reset_index()
    item_df.rename(columns={'date': 'ds', 'quantity': 'y'}, inplace=True)

    model = Prophet()
    model.fit(item_df)

    last_date = max(item_df['ds'])
    today = pd.Timestamp(datetime.now().date())

    # How many days we need to forecast *from today*?
    delta_days = (today - last_date).days
    total_periods = periods + max(0, delta_days)  # adjust total periods needed

    future = model.make_future_dataframe(periods=total_periods)
    future = future[future['ds'] >= today]

    forecast = model.predict(future)

    forecast = forecast.rename(columns={
        'ds': 'forecasted date',
        'yhat': 'predicted value'
    })

    result = forecast[['forecasted date', 'predicted value', 'yhat_lower', 'yhat_upper']]
    if len(result) < periods:
        return {
            "warning": f"Only {len(result)} forecast points available from {today.date()} onward.",
            "forecast": result.to_dict(orient='records')
        }
    return result.head(periods).to_dict(orient='records')
