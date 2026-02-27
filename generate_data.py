import pandas as pd
import numpy as np

np.random.seed(42)

rows = 10000

data = {
    "item_count": np.random.randint(1, 6, rows),
    "complexity": np.random.randint(1, 10, rows),
    "active_orders": np.random.randint(0, 15, rows),
    "hour_of_day": np.random.randint(0, 24, rows)
}

df = pd.DataFrame(data)

peak_bonus = np.where((df["hour_of_day"] >= 18) & (df["hour_of_day"] <= 22), 5, 0)

df["prep_time"] = (
    5
    + df["item_count"] * 2
    + df["complexity"] * 1.5
    + df["active_orders"] * 1.2
    + peak_bonus
    + np.random.normal(0, 2, rows)
)

df.to_csv("orders.csv", index=False)

print("Dataset created successfully.")