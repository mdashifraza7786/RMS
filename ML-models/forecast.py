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

    # Override: start forecasting from today's date
    last_date = max(item_df['ds'])
    today = pd.Timestamp(datetime.now().date())

    if today > last_date:
        start_date = today
    else:
        start_date = last_date + pd.Timedelta(days=1)

    # Generate future dates starting from 'start_date'
    future = model.make_future_dataframe(periods=periods)
    future = future[future['ds'] >= start_date]  # filter future to start from today

    forecast = model.predict(future)

    # Rename columns for clarity
    forecast = forecast.rename(columns={
        'ds': 'forecasted date',
        'yhat': 'predicted value'
    })

    return forecast[['forecasted date', 'predicted value', 'yhat_lower', 'yhat_upper']].head(periods).to_dict(orient='records')
