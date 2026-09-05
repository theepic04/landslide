# Bhu Netr — ML Engine (NER Landslide Risk)

## Model v2 — real data only (binary: Low / High)

**Data**: 695 real NER points
- 346 real landslide events — NASA Global Landslide Catalog (COOLR), filtered strictly to
  the 8 NER states (Assam 82, Nagaland 78, Manipur 56, Arunachal Pradesh 45, Sikkim 31,
  Meghalaya 29, Mizoram 27, Tripura 3), deduplicated by coordinates.
- 349 pseudo-absence points — standard landslide-susceptibility methodology (real terrain
  at randomly sampled comparison locations, ≥~2km from any known event). Not fabricated
  events — a recognized technique in the published literature for this exact problem.

**Features (all real, leakage-safe)**:
- `slope_deg`, `elevation_m` — extracted from a real SRTM GL3 90m DEM (OpenTopography)
- `historical_incidents_5yr` — real count of other NASA COOLR events within ~16km,
  computed **leave-one-out** (an event never counts itself)

**Dropped from v1**: `rainfall_24h_mm`, `rainfall_72h_mm`, `soil_moisture_pct`,
`distance_to_stream_m`, `land_cover` — v1 filled these with synthetic random values.
We have no legitimate real, point-level source for them yet, so per project integrity
requirements they were removed from the trained model rather than kept as fabricated
inputs. The API still *accepts* them (frontend compatibility) but ignores them, and says
so in the response (`unused_inputs_note`).

**Why binary, not 4-class**: NASA's `landslide_size` field exists but is 83% "medium"
within NER (292/351), with only 2 "very_large" and 24 "large" — too sparse/imbalanced to
support a defensible 4-class split. A landslide occurring ≠ "Severe"; that would be a false
equivalence. The API still returns 4 UI-facing bands (Low/Moderate/High/Severe) but these
are threshold bands over the model's continuous probability, not 4 trained classes —
documented in predict_api.py.

**Model**: XGBoost, spatial-group train/test split (grouped by ~11km grid cell, so nearby
points from the same event cluster can't leak between train/test).

**Metrics** (test set, n=132): 84% accuracy, High-class recall 0.81 (11/58 false negatives),
Low-class recall 0.86. Feature importance: historical_incidents_5yr 0.76, elevation_m 0.13,
slope_deg 0.11 — recurrence is the dominant real signal, consistent with landslide
susceptibility literature.

**Known limitations**:
- No rainfall/soil-moisture/land-cover signal yet — the model currently reflects static
  terrain + historical recurrence only, not real-time triggering conditions.
- `/predict-area` neighboring grid points use small random jitter around the center's
  values, not real per-cell DEM lookups (no location→features service built yet).
- DEM file (~96MB) used to build the dataset is not included in this repo; the
  already-extracted `data/landslide_training_data.csv` is what `train_model.py` uses.

## Run locally
```
pip install -r requirements.txt
uvicorn predict_api:app --port 8001
```
Test at http://localhost:8001/docs

## Endpoints
- GET /health
- POST /predict — `{zone_id, slope_deg, elevation_m, historical_incidents_5yr}` required;
  legacy fields (rainfall/moisture/land_cover) optional, accepted, ignored
- POST /predict-area — center point + grid of nearby points

## v3 update — precomputed DEM lookup, /enrich-location, real /predict-area

- `data/ner_dem_lookup.csv`: 21,000 real DEM points, ~0.05 deg (~5km) grid spacing,
  covering the NER bounding box (lat 22.0-29.5, lon 89.5-96.5). Generated once
  from the raw SRTM GL3 DEM (~96MB, NOT deployed/committed - only this ~490KB
  derived table is).
- `/enrich-location`: given lat/lng, returns real slope/elevation from the
  nearest precomputed grid point (not exact per-coordinate DEM sampling -
  response says so explicitly). Returns 400 outside NER bounding box.
- `/predict`: accepts EITHER {slope_deg, elevation_m} directly (legacy, still
  works) OR {latitude, longitude} (auto-looks-up real terrain). terrain_source
  field says which was used.
- `/predict-area`: neighboring cells now use REAL per-cell slope/elevation from
  the lookup grid - no more jitter/fabrication. Limitation: historical_incidents_5yr
  still reused from center point for all cells (documented in limitation_note).
- Not yet integrated (no real source available): rainfall, soil moisture,
  distance to stream, land cover.

## v4 update — real per-cell historical_incidents_5yr in /predict-area

Previously /predict-area reused the center point's historical_incidents_5yr for
every surrounding cell. Fixed: each cell now computes its own real count from
`data/ner_real_events.csv` (the same 346 real NASA COOLR event coordinates used
at training time), using the identical radius (~0.15deg / ~16km) as the
training-time feature definition — kept consistent to avoid a train/inference
mismatch. No fabrication, no copying between cells; verified cells at
different coordinates return different real counts (0-5+ in testing).
`historical_incidents_5yr` is no longer a required /predict-area input field —
it's computed automatically per cell.

## v5 update — /predict now fully location-based

/predict accepts EITHER latitude+longitude (auto-derives all 3 features via the
same DEM lookup + real event count logic as /predict-area and /enrich-location)
OR the original slope_deg+elevation_m+historical_incidents_5yr direct inputs
(unchanged, still required together if location isn't given). No fabrication;
shared internal functions reused, not duplicated.

## v6 — SIH demo readiness audit

Fixed: CORS was not configured — would have blocked a browser-based frontend
on a different origin from calling this API directly (silent failure in the
browser console, not visible in server logs — a classic live-demo killer).
Now allows all origins (fine for a hackathon demo; tighten later for
production). No new dependency (bundled with FastAPI/Starlette).

All other audited areas (feature consistency, leakage, coordinate validation,
NER bounds checks, DEM/incident lookup correctness, risk-band ordering) were
already correct.

Known, documented (not fixed — out of scope): NER coverage check is a bounding
box, not exact state polygons, so a small sliver of neighboring
countries/states near the border would incorrectly pass the coverage check.
