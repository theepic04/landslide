"""
predict_api.py — Bhu Netr NER Landslide Risk API (v3)

Model: binary XGBoost (Low/High), 3 real leakage-safe features
(slope_deg, elevation_m, historical_incidents_5yr). See README.md.

NEW in v3: precomputed DEM lookup grid (data/ner_dem_lookup.csv, 21,000 real
points, ~0.05deg/~5km spacing across the NER bounding box) replaces the old
jittered/fabricated values in /predict-area, and powers new /enrich-location
and location-based /predict. The raw 96MB DEM itself is NOT deployed — only
this compact derived lookup table. Nearest-grid-point lookup, not exact
per-coordinate DEM sampling — documented, not claimed as exact.
"""

import json
from typing import Literal, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator

app = FastAPI(title="Bhu Netr — NER Landslide Risk API", version="3.1.0")

# CRITICAL FIX (audit): no CORS policy was set. Without this, a browser-based
# frontend on a different origin (e.g. your Vercel/Netlify domain) calling this
# Render API directly gets blocked by the browser's CORS policy — this WILL
# break a live demo where the frontend calls the API from JS in a browser.
# Wide open (*) is fine for a hackathon demo; tighten to specific origins later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
label_encoder = joblib.load("label_encoder.pkl")
with open("feature_columns.json") as f:
    FEATURE_SCHEMA = json.load(f)
MODEL_FEATURES = FEATURE_SCHEMA["numeric"]

LOOKUP = pd.read_csv("data/ner_dem_lookup.csv")
LOOKUP_LAT = LOOKUP["latitude"].to_numpy()
LOOKUP_LON = LOOKUP["longitude"].to_numpy()
NER_BOUNDS = {"min_lat": 22.0, "max_lat": 29.5, "min_lon": 89.5, "max_lon": 96.5}

# Real NASA COOLR event coordinates (same 346 points used at training time) —
# used to compute historical_incidents_5yr per-cell in /predict-area, with the
# SAME radius (~0.15deg / ~16km) used when this feature was built for training.
REAL_EVENTS = pd.read_csv("data/ner_real_events.csv")
EVENT_LAT = REAL_EVENTS["latitude"].to_numpy()
EVENT_LON = REAL_EVENTS["longitude"].to_numpy()
INCIDENT_RADIUS_DEG = 0.15  # must match generate_data/training feature definition


def count_nearby_incidents(lat: float, lon: float, exclude_self: bool = False) -> int:
    d = np.sqrt((EVENT_LAT - lat) ** 2 + (EVENT_LON - lon) ** 2)
    if exclude_self:
        d = d[d > 1e-9]
    return int((d < INCIDENT_RADIUS_DEG).sum())


def nearest_grid_point(lat: float, lon: float):
    """Real DEM lookup via nearest precomputed grid point (not live DEM sampling)."""
    d2 = (LOOKUP_LAT - lat) ** 2 + (LOOKUP_LON - lon) ** 2
    idx = int(np.argmin(d2))
    row = LOOKUP.iloc[idx]
    return {"grid_lat": float(row["latitude"]), "grid_lon": float(row["longitude"]),
            "elevation_m": float(row["elevation_m"]), "slope_deg": float(row["slope_deg"])}


def in_ner_coverage(lat: float, lon: float) -> bool:
    return (NER_BOUNDS["min_lat"] <= lat <= NER_BOUNDS["max_lat"] and
            NER_BOUNDS["min_lon"] <= lon <= NER_BOUNDS["max_lon"])


def run_prediction(features: dict) -> dict:
    row = pd.DataFrame([{k: features[k] for k in MODEL_FEATURES}])
    proba = model.predict_proba(row)[0]
    classes = list(label_encoder.classes_)
    prob_high = float(proba[classes.index("High")]) if "High" in classes else float(proba[-1])

    if prob_high < 0.25: risk_level = "Low"
    elif prob_high < 0.50: risk_level = "Moderate"
    elif prob_high < 0.75: risk_level = "High"
    else: risk_level = "Severe"

    class_probs = {classes[i]: round(float(proba[i]), 4) for i in range(len(proba))}
    factors = []
    if features["slope_deg"] > 25:
        factors.append(f"Steep slope ({features['slope_deg']:.0f}°)")
    if features["elevation_m"] > 1200:
        factors.append(f"High elevation ({features['elevation_m']:.0f} m)")
    if features["historical_incidents_5yr"] >= 3:
        factors.append(f"{features['historical_incidents_5yr']} real recorded incidents nearby (~16km)")
    if not factors:
        factors.append("No dominant risk factor among modeled variables")

    return {"risk_level": risk_level, "risk_score_0_100": round(prob_high * 100, 1),
            "class_probabilities": class_probs, "top_contributing_factors": factors}


@app.get("/health")
def health():
    return {"status": "ok", "model_features": MODEL_FEATURES, "lookup_points": len(LOOKUP)}


# ---------- /enrich-location ----------
class LocationRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


@app.post("/enrich-location")
def enrich_location(loc: LocationRequest):
    if not in_ner_coverage(loc.latitude, loc.longitude):
        raise HTTPException(status_code=400, detail=(
            f"Coordinate ({loc.latitude},{loc.longitude}) is outside supported NER "
            f"lookup coverage (lat {NER_BOUNDS['min_lat']}-{NER_BOUNDS['max_lat']}, "
            f"lon {NER_BOUNDS['min_lon']}-{NER_BOUNDS['max_lon']})."))
    g = nearest_grid_point(loc.latitude, loc.longitude)
    return {
        "latitude": loc.latitude, "longitude": loc.longitude,
        "nearest_grid_latitude": g["grid_lat"], "nearest_grid_longitude": g["grid_lon"],
        "slope_deg": g["slope_deg"], "elevation_m": g["elevation_m"],
        "source": "precomputed DEM lookup (nearest grid point, ~5km resolution)",
    }


# ---------- /predict (backward compatible + new location mode) ----------
class ZoneFeatures(BaseModel):
    zone_id: str
    slope_deg: Optional[float] = Field(None, ge=0, le=90)
    elevation_m: Optional[float] = Field(None, ge=0)
    historical_incidents_5yr: Optional[int] = Field(None, ge=0)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    # legacy, accepted, unused
    rainfall_24h_mm: Optional[float] = None
    rainfall_72h_mm: Optional[float] = None
    soil_moisture_pct: Optional[float] = None
    distance_to_stream_m: Optional[float] = None
    land_cover: Optional[Literal["forest","sparse_vegetation","bare_soil","agriculture","built_up"]] = None

    @model_validator(mode="after")
    def check_inputs(self):
        has_location = self.latitude is not None and self.longitude is not None
        if has_location:
            return self  # all 3 features auto-derived from location — nothing else required
        has_direct = (self.slope_deg is not None and self.elevation_m is not None
                      and self.historical_incidents_5yr is not None)
        if not has_direct:
            raise ValueError("Provide either (latitude AND longitude) OR "
                              "(slope_deg AND elevation_m AND historical_incidents_5yr).")
        return self


class PredictionResponse(BaseModel):
    zone_id: str
    risk_level: str
    risk_score_0_100: float
    class_probabilities: dict
    top_contributing_factors: list
    terrain_source: str
    unused_inputs_note: Optional[str] = None


@app.post("/predict", response_model=PredictionResponse)
def predict(zone: ZoneFeatures):
    try:
        if zone.latitude is not None and zone.longitude is not None:
            if not in_ner_coverage(zone.latitude, zone.longitude):
                raise HTTPException(status_code=400, detail="Coordinate outside supported NER coverage.")
            g = nearest_grid_point(zone.latitude, zone.longitude)
            slope_deg, elevation_m = g["slope_deg"], g["elevation_m"]
            historical_incidents_5yr = count_nearby_incidents(zone.latitude, zone.longitude)
            terrain_source = "precomputed DEM lookup (nearest grid point) + real event count (~16km radius)"
        else:
            slope_deg, elevation_m = zone.slope_deg, zone.elevation_m
            historical_incidents_5yr = zone.historical_incidents_5yr
            terrain_source = "user-provided"

        features = {"slope_deg": slope_deg, "elevation_m": elevation_m,
                    "historical_incidents_5yr": historical_incidents_5yr}
        result = run_prediction(features)
        unused = [f for f in ["rainfall_24h_mm","rainfall_72h_mm","soil_moisture_pct",
                               "distance_to_stream_m","land_cover"] if getattr(zone, f) is not None]
        note = f"Provided but not used by model (no real source yet): {unused}" if unused else None
        return PredictionResponse(zone_id=zone.zone_id, terrain_source=terrain_source,
                                   unused_inputs_note=note, **result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- /predict-area (now uses real DEM lookup, no jitter) ----------
class AreaPredictionRequest(BaseModel):
    zone_id: str
    center_lat: float
    center_lng: float
    grid_radius: int = Field(1, ge=1, le=3)
    spacing_deg: float = Field(0.05, gt=0, description="Should roughly match lookup grid resolution (~0.05deg)")


class GridPoint(BaseModel):
    lat: float
    lng: float
    is_center: bool
    risk_level: str
    risk_score_0_100: float
    slope_deg: float
    elevation_m: float
    historical_incidents_5yr: int


class AreaPredictionResponse(BaseModel):
    zone_id: str
    center: GridPoint
    grid: list
    nearest_safer_point: Optional[GridPoint]
    summary: str
    limitation_note: str


@app.post("/predict-area", response_model=AreaPredictionResponse)
def predict_area(req: AreaPredictionRequest):
    try:
        if not in_ner_coverage(req.center_lat, req.center_lng):
            raise HTTPException(status_code=400, detail="Center coordinate outside supported NER coverage.")
        points, r = [], req.grid_radius
        for dx in range(-r, r+1):
            for dy in range(-r, r+1):
                is_center = (dx == 0 and dy == 0)
                lat = req.center_lat + dy * req.spacing_deg
                lng = req.center_lng + dx * req.spacing_deg
                g = nearest_grid_point(lat, lng)  # REAL DEM lookup, no jitter/fabrication
                incidents = count_nearby_incidents(lat, lng)  # REAL per-cell count, same radius as training
                feats = {"slope_deg": g["slope_deg"], "elevation_m": g["elevation_m"],
                         "historical_incidents_5yr": incidents}
                res = run_prediction(feats)
                points.append(GridPoint(lat=round(lat,6), lng=round(lng,6), is_center=is_center,
                                         risk_level=res["risk_level"], risk_score_0_100=res["risk_score_0_100"],
                                         slope_deg=g["slope_deg"], elevation_m=g["elevation_m"],
                                         historical_incidents_5yr=incidents))
        center_point = next(p for p in points if p.is_center)
        neighbors = [p for p in points if not p.is_center]
        safer = [p for p in neighbors if p.risk_score_0_100 < center_point.risk_score_0_100]
        nearest_safer = min(safer, key=lambda p: p.risk_score_0_100) if safer else None
        if nearest_safer:
            dlat = "north" if nearest_safer.lat>center_point.lat else "south" if nearest_safer.lat<center_point.lat else ""
            dlng = "east" if nearest_safer.lng>center_point.lng else "west" if nearest_safer.lng<center_point.lng else ""
            direction = " ".join(filter(None,[dlat,dlng])) or "nearby"
            summary = f"This location is {center_point.risk_level}. A lower-risk area was found to the {direction}."
        else:
            summary = f"This location is {center_point.risk_level}. No clearly safer nearby point found."
        return AreaPredictionResponse(
            zone_id=req.zone_id, center=center_point, grid=points, nearest_safer_point=nearest_safer,
            summary=summary,
            limitation_note=("All three features (slope_deg, elevation_m, historical_incidents_5yr) "
                              "are now real, independently computed per grid cell — no reused/copied "
                              "or fabricated values remain in /predict-area."),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
