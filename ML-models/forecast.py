from prophet import Prophet
import pandas as pd
import numpy as np
from datetime import datetime
import os

INVENTORY_CSV = "recent_inventory_order.csv"
REVENUE_CSV = "invoices.csv"


def generate_forecast(item_name, periods=30):
    if not os.path.exists(INVENTORY_CSV):
        return {"error": f"{INVENTORY_CSV} not found."}

    df = pd.read_csv(INVENTORY_CSV)
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
    delta_days = (today - last_date).days
    total_periods = periods + max(0, delta_days)

    future = model.make_future_dataframe(periods=total_periods)
    future = future[future['ds'] >= today]
    forecast = model.predict(future)

    forecast = forecast.rename(columns={'ds': 'forecasted date', 'yhat': 'predicted value'})
    result = forecast[['forecasted date', 'predicted value', 'yhat_lower', 'yhat_upper']]
    result[['predicted value', 'yhat_lower', 'yhat_upper']] = result[[
        'predicted value', 'yhat_lower', 'yhat_upper'
    ]].clip(lower=0)

    if len(result) < periods:
        return {
            "warning": f"Only {len(result)} forecast points available from {today.date()} onward.",
            "forecast": result.to_dict(orient='records')
        }

    return result.head(periods).to_dict(orient='records')


def generate_revenue_forecast(periods=30):
    if not os.path.exists(REVENUE_CSV):
        return {"error": f"{REVENUE_CSV} not found."}

    df = pd.read_csv(REVENUE_CSV)

    # Convert to datetime and filter only 'paid' invoices
    df['generated_at'] = pd.to_datetime(df['generated_at'])
    df = df[df['payment_status'].str.lower() == 'paid']

    # Group by date only (not datetime) and sum total_amount
    df['date'] = df['generated_at'].dt.date
    daily_revenue = df.groupby('date').agg({'total_amount': 'sum'}).reset_index()
    daily_revenue.rename(columns={'date': 'ds', 'total_amount': 'y'}, inplace=True)
    daily_revenue['ds'] = pd.to_datetime(daily_revenue['ds'])

    model = Prophet()
    model.fit(daily_revenue)

    last_date = max(daily_revenue['ds'])
    today = pd.Timestamp(datetime.now().date())
    delta_days = (today - last_date).days
    total_periods = periods + max(0, delta_days)

    future = model.make_future_dataframe(periods=total_periods)
    future = future[future['ds'] >= today]
    forecast = model.predict(future)

    forecast = forecast.rename(columns={'ds': 'forecasted date', 'yhat': 'predicted revenue'})
    result = forecast[['forecasted date', 'predicted revenue', 'yhat_lower', 'yhat_upper']]
    result[['predicted revenue', 'yhat_lower', 'yhat_upper']] = result[[
        'predicted revenue', 'yhat_lower', 'yhat_upper'
    ]].clip(lower=0)

    if len(result) < periods:
        return {
            "warning": f"Only {len(result)} forecast points available from {today.date()} onward.",
            "forecast": result.to_dict(orient='records')
        }

    return result.head(periods).to_dict(orient='records')
