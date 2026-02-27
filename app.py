from fastapi import FastAPI
import joblib
import numpy as np
from progress_engine import (
    calculate_progress,
    should_assign_rider,
    compute_kci,
    compute_mrs,
    dynamic_dispatch_threshold
)

app = FastAPI()

model = joblib.load("prep_model.pkl")

@app.get("/")
def home():
    return {"message": "Adaptive Bias-Resilient Dispatch Intelligence Running"}

@app.post("/predict")
def predict(data: dict):

    item_count       = data["item_count"]
    complexity       = data["complexity"]
    active_orders    = data["active_orders"]
    hour_of_day      = data["hour_of_day"]
    time_elapsed     = data["time_elapsed"]
    rider_travel_time = data["rider_travel_time"]

    features = np.array([[item_count, complexity, active_orders, hour_of_day]])

    predicted_time    = float(model.predict(features)[0])
    progress          = int(calculate_progress(predicted_time, time_elapsed))
    remaining_prep_time = float(max(predicted_time - time_elapsed, 0))

    historical_avg_prep  = 30
    prep_inflation       = min(predicted_time / historical_avg_prep, 1)
    throughput_ratio     = max(0.5, 1 - (active_orders / 20))
    variance_spike       = min(active_orders / 15, 1)

    kci = compute_kci(prep_inflation, throughput_ratio, variance_spike)

    drift_score          = min(abs(predicted_time - historical_avg_prep) / 20, 1)
    variance_instability = min(active_orders / 20, 1)
    for_bias_score       = min(active_orders / 25, 1)

    mrs = compute_mrs(drift_score, variance_instability, for_bias_score)

    dynamic_assign, dynamic_threshold = should_assign_rider(
        progress,
        predicted_time,
        time_elapsed,
        rider_travel_time,
        kci,
        mrs
    )

    static_threshold = 70
    static_assign    = progress >= static_threshold and rider_travel_time <= remaining_prep_time

    rider_cost_per_minute = 102 / 60
    delay_penalty_per_min = 12

    static_dispatch_at   = 0.70 * predicted_time
    static_rider_arrival = static_dispatch_at + rider_travel_time
    static_idle_time     = max(predicted_time - static_rider_arrival, 0)
    static_delay_time    = max(static_rider_arrival - predicted_time, 0)
    static_idle_cost     = round(static_idle_time * rider_cost_per_minute, 2)
    static_delay_cost    = round(static_delay_time * delay_penalty_per_min, 2)
    static_total_cost    = round(static_idle_cost + static_delay_cost, 2)

    dynamic_dispatch_at   = (dynamic_threshold / 100) * predicted_time
    dynamic_rider_arrival = dynamic_dispatch_at + rider_travel_time
    dynamic_idle_time     = max(predicted_time - dynamic_rider_arrival, 0)
    dynamic_delay_time    = max(dynamic_rider_arrival - predicted_time, 0)
    dynamic_idle_cost     = round(dynamic_idle_time * rider_cost_per_minute, 2)
    dynamic_delay_cost    = round(dynamic_delay_time * delay_penalty_per_min, 2)
    dynamic_total_cost    = round(dynamic_idle_cost + dynamic_delay_cost, 2)

    net_advantage = round(static_total_cost - dynamic_total_cost, 2)

    eta = remaining_prep_time + rider_travel_time

    return {
        "predicted_prep_time":        round(predicted_time, 2),
        "progress_percent":           progress,
        "kitchen_congestion_index":   round(kci, 2),
        "merchant_reliability_score": round(mrs, 2),
        "dynamic_dispatch_threshold": round(dynamic_threshold, 2),
        "dynamic_assign_rider":       bool(dynamic_assign),
        "static_assign_rider":        bool(static_assign),
        "estimated_eta":              round(eta, 2),
        "dynamic_idle_cost_rs":       dynamic_idle_cost,
        "static_idle_cost_rs":        static_idle_cost,
        "dynamic_delay_cost_rs":      dynamic_delay_cost,
        "static_delay_cost_rs":       static_delay_cost,
        "dynamic_total_cost_rs":      dynamic_total_cost,
        "static_total_cost_rs":       static_total_cost,
        "net_advantage_rs":           net_advantage
    }