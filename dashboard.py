import streamlit as st
import numpy as np
import joblib
import matplotlib.pyplot as plt
import matplotlib.patches as patches

from progress_engine import (
    calculate_progress,
    compute_kci,
    compute_mrs,
    should_assign_rider
)

st.set_page_config(page_title="Zomato Order Tracker", layout="wide")

st.markdown("""
<style>
body {
    background-color: #fafafa;
}
.zomato-header {
    background-color: #E23744;
    padding: 20px;
    color: white;
    font-size: 28px;
    font-weight: bold;
    border-radius: 10px;
}
.status-card {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 2px 10px rgba(0,0,0,0.08);
}
.green {
    color: #2E7D32;
    font-weight: bold;
}
.red {
    color: #C62828;
    font-weight: bold;
}
.gray {
    color: #555;
}
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="zomato-header">Zomato Live Order Tracking</div>', unsafe_allow_html=True)

model = joblib.load("prep_model.pkl")

st.sidebar.header("Simulate Order")

item_count = st.sidebar.slider("Item Count", 1, 10, 3)
complexity = st.sidebar.slider("Complexity", 1, 10, 5)
active_orders = st.sidebar.slider("Active Orders", 1, 20, 8)
hour_of_day = st.sidebar.slider("Hour", 0, 23, 20)
time_elapsed = st.sidebar.slider("Time Elapsed (mins)", 1, 40, 15)
rider_travel_time = st.sidebar.slider("Rider Travel Time", 1, 15, 6)

features = np.array([[item_count, complexity, active_orders, hour_of_day]])
predicted_time = float(model.predict(features)[0])
progress = calculate_progress(predicted_time, time_elapsed)
remaining_time = max(predicted_time - time_elapsed, 0)

historical_avg = 30
prep_inflation = min(predicted_time / historical_avg, 1)
throughput_ratio = max(0.5, 1 - (active_orders / 20))
variance_spike = min(active_orders / 15, 1)

kci = compute_kci(prep_inflation, throughput_ratio, variance_spike)

drift_score = min(abs(predicted_time - historical_avg) / 20, 1)
variance_instability = min(active_orders / 20, 1)
for_bias_score = min(active_orders / 25, 1)

mrs = compute_mrs(drift_score, variance_instability, for_bias_score)

dynamic_assign, dynamic_threshold = should_assign_rider(
    progress,
    predicted_time,
    time_elapsed,
    rider_travel_time,
    kci,
    mrs
)

static_assign = progress >= 70 and rider_travel_time <= remaining_time

st.markdown("### Order Status")

col1, col2, col3 = st.columns(3)

with col1:
    st.markdown('<div class="status-card">', unsafe_allow_html=True)
    st.markdown(f"**Cooking Progress**")
    st.progress(progress / 100)
    st.write(f"{progress}% Complete")
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    st.markdown('<div class="status-card">', unsafe_allow_html=True)
    st.write("**Kitchen Intelligence**")
    st.write(f"KCI: {kci:.2f}")
    st.write(f"MRS: {mrs:.2f}")
    st.markdown("</div>", unsafe_allow_html=True)

with col3:
    st.markdown('<div class="status-card">', unsafe_allow_html=True)
    st.write("**Dispatch Decision**")
    if dynamic_assign:
        st.markdown('<p class="green">Adaptive: Rider Dispatched</p>', unsafe_allow_html=True)
    else:
        st.markdown('<p class="red">Adaptive: Waiting</p>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

st.markdown("### Rider Tracking")

if dynamic_assign:
    arrival_time = rider_travel_time
    if arrival_time < remaining_time:
        st.success(f"Rider will arrive early. Idle time ≈ {remaining_time - arrival_time:.2f} mins")
    else:
        st.warning(f"Rider may arrive late. Delay risk ≈ {arrival_time - remaining_time:.2f} mins")
else:
    st.info("Rider not yet dispatched (Adaptive Logic).")

st.write(f"Estimated Delivery Time: {remaining_time + rider_travel_time:.2f} mins")

st.markdown("### Static vs Adaptive Comparison")

rider_cost = 102 / 60
delay_penalty = 8

dynamic_idle = max(remaining_time - rider_travel_time, 0) if dynamic_assign else 0
static_idle = max(remaining_time - rider_travel_time, 0) if static_assign else 0

dynamic_delay = max(rider_travel_time - remaining_time, 0) if dynamic_assign else rider_travel_time
static_delay = rider_travel_time * (1 + kci) if not static_assign else max(rider_travel_time - remaining_time, 0)

dynamic_total = dynamic_idle * rider_cost + dynamic_delay * delay_penalty
static_total = static_idle * rider_cost + static_delay * delay_penalty

col4, col5 = st.columns(2)

with col4:
    st.markdown('<div class="status-card">', unsafe_allow_html=True)
    st.write("Static Model Cost")
    st.write(f"₹ {static_total:.2f}")
    st.markdown("</div>", unsafe_allow_html=True)

with col5:
    st.markdown('<div class="status-card">', unsafe_allow_html=True)
    st.write("Adaptive Model Cost")
    st.write(f"₹ {dynamic_total:.2f}")
    st.markdown("</div>", unsafe_allow_html=True)

st.write(f"Net Advantage: ₹ {static_total - dynamic_total:.2f}")

st.markdown("### Order Timeline")

fig, ax = plt.subplots(figsize=(10, 3))

cook_end = predicted_time
dispatch_time = (dynamic_threshold / 100) * predicted_time
arrival = dispatch_time + rider_travel_time

ax.add_patch(patches.Rectangle((0, 0.4), cook_end, 0.2))
ax.axvline(dispatch_time)
ax.scatter(arrival, 0.8)

ax.set_xlim(0, cook_end + rider_travel_time + 5)
ax.set_ylim(0, 1)
ax.set_yticks([])
ax.set_xlabel("Time (mins)")
ax.set_title("Cooking → Dispatch → Rider Arrival")

st.pyplot(fig)