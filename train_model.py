import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from xgboost import XGBRegressor
import joblib
import matplotlib.pyplot as plt

df = pd.read_csv("orders.csv")

X = df[["item_count", "complexity", "active_orders", "hour_of_day"]]

y = df["prep_time"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    random_state=42,
    objective="reg:squarederror"
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\nModel Evaluation Results")
print("------------------------")
print("Mean Absolute Error (MAE):", round(mae, 2))
print("R2 Score:", round(r2, 2))

importance = model.feature_importances_
feature_names = X.columns

print("\nFeature Importance:")
for name, score in zip(feature_names, importance):
    print(f"{name}: {round(score, 3)}")

plt.figure(figsize=(8, 5))
plt.barh(feature_names, importance)
plt.xlabel("Importance Score")
plt.title("Feature Importance - Prep Time Prediction")
plt.tight_layout()
plt.show()

joblib.dump(model, "prep_model.pkl")
print("\nModel trained and saved successfully as prep_model.pkl")