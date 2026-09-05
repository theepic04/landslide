"""
train_model.py — Bhu Netr NER model (v2, real data only)

Trains on data/landslide_training_data.csv: 695 real NER points (346 real NASA
COOLR landslide events + 349 pseudo-absence points), 3 real leakage-safe
features (slope_deg, elevation_m, historical_incidents_5yr — see README).
Uses a spatial-group split (grouped by ~11km grid cell) so nearby points from
the same event cluster can't leak between train and test.
"""
import pandas as pd, numpy as np, joblib, json
from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import xgboost as xgb

NUM = ["slope_deg", "elevation_m", "historical_incidents_5yr"]
DATA_PATH = "data/landslide_training_data.csv"

def main():
    df = pd.read_csv(DATA_PATH)
    df["geo_group"] = (df["latitude"].round(1).astype(str) + "_" + df["longitude"].round(1).astype(str))
    df["risk_level"] = df["label"].map({1: "High", 0: "Low"})

    le = LabelEncoder(); le.fit(["Low", "High"])
    y = le.transform(df["risk_level"])
    X = df[NUM]

    gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
    train_idx, test_idx = next(gss.split(X, y, groups=df["geo_group"]))
    Xtr, Xte, ytr, yte = X.iloc[train_idx], X.iloc[test_idx], y[train_idx], y[test_idx]

    clf = xgb.XGBClassifier(n_estimators=250, max_depth=4, learning_rate=0.05,
                             subsample=0.85, colsample_bytree=0.85, min_child_weight=3,
                             random_state=42, eval_metric="logloss")
    clf.fit(Xtr, ytr)
    pred = clf.predict(Xte)

    print(f"Train: {len(Xtr)}, Test: {len(Xte)} (spatial-group split)")
    print(classification_report(yte, pred, target_names=le.classes_))
    print("Confusion matrix:", le.classes_)
    print(confusion_matrix(yte, pred))
    print("\nFeature importances:")
    for f, i in zip(NUM, clf.feature_importances_):
        print(f"  {f}: {i:.3f}")

    joblib.dump(clf, "model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    with open("feature_columns.json", "w") as f:
        json.dump({"numeric": NUM, "categorical": []}, f, indent=2)
    print("\nSaved model.pkl, label_encoder.pkl, feature_columns.json")

if __name__ == "__main__":
    main()
