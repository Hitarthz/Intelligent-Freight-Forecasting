# INTELLIGENT FREIGHT FORECASTING (SIH26006)

**Project Title:** Development of an Intelligent Freight Forecasting Model for Optimized Vessel Chartering and Bulk Cargo Procurement from overseas to East Coast of India  
**Problem Statement ID:** SIH26006  
**Theme:** Transportation & Logistics  
**Category:** Software  
**Organization:** Ministry of Steel  
**Team Name:** Aeturnus  

---

> [!IMPORTANT]
> **Decision-Support System Only:**  
> This system is an AI-powered decision-support prototype. It does NOT automatically book vessels or execute commercial charter transactions. All commercial, legal, and operational chartering authorizations remain strictly with the human chartering and procurement manager.

---

## 1. Problem Overview

Procurement of bulk raw materials (coking coal, thermal coal, iron ore, limestone) from major overseas origins (Australia, Indonesia, Mozambique, US, Russia) to India's East Coast ports (Paradip, Visakhapatnam, Gangavaram, Dhamra, Haldia, Chennai) currently relies on daily manual spot market exploration. This reactive approach leads to:
- High vulnerability to volatile global freight rate spikes.
- Demurrage penalties ($25,000–$35,000/day) due to unmanaged port queues.
- Vessel-port mismatches (e.g., shallow riverine ports like Haldia unable to accommodate Panamax vessels).

This project provides predictive analytics, port compatibility validation, operational risk scoring, voyage cost estimation, and strategic charter recommendations (**BOOK NOW**, **PARTIAL BOOK**, or **WAIT**).

---

## 2. Core Capabilities & User Flow

```
USER INPUT (Cargo, Quantity, Origin, Destination, Date)
    ↓
FREIGHT FORECAST (Current, 7-Day, 30-Day, 60-Day, 30-Day Trend %)
    ↓
VESSEL OPTIMIZATION (Smallest feasible demo vessel selected: Handysize to Capesize)
    ↓
PORT COMPATIBILITY CHECK (Vessel operating draft vs. Port maximum permissible draft)
    ↓
RISK ANALYSIS (Score 0-100 & Level: LOW, MEDIUM, HIGH)
    ↓
COST CALCULATION (Estimated Freight Cost + Vessel Charter Hire)
    ↓
DECISION ENGINE (Exactly 3 recommendations: BOOK NOW, PARTIAL BOOK, WAIT)
    ↓
WHAT-IF SENSITIVITY SIMULATOR & AUDIT HISTORY LOG
```

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, Vanilla CSS design system (Dark navy SIH theme).
- **Backend:** Python 3.10+, FastAPI, Uvicorn.
- **Data & AI Layer:** Pandas, NumPy, native XGBoost regression for freight-rate trend forecasting.
- **Datasets:** Multi-route dry bulk historical records, demo vessels dataset, reference Indian port specifications.

---

## 4. How to Run the Project

### One-Click Launch (Windows)
Double-click `RUN.bat` in the root folder. Both the backend and frontend start in a single terminal window, and your browser opens automatically.

### Manual Launch

#### 1. Backend (FastAPI)
```bash
cd backend
# Activate Python environment
venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Start API server on port 8000
python -m uvicorn app:app --port 8000 --reload
```
API Root: `http://127.0.0.1:8000/`  
API Health: `http://127.0.0.1:8000/api/health`

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Dashboard URL: `http://localhost:5173/`

---

## 5. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and service metadata (fixes 404 issue) |
| `GET` | `/api/health` | Health check (`{"status": "ok"}`) |
| `POST` | `/api/analyze` | Core shipment analysis: returns forecast, vessel, port check, risk, cost, and decision |
| `POST` | `/api/what-if` | Sensitivity simulator for quantity & rate percentage shifts |
| `GET` | `/api/history` | Audit log of previous analyses performed in session |
| `GET` | `/api/report` | Summary report metadata |

---

## 6. Demo Test Scenarios

### Scenario 1: Standard Feasible Procurement (Panamax)
- **Cargo:** Coal
- **Quantity:** `75000` MT
- **Origin:** `Australia`
- **Destination:** `Paradip`
- **Date:** `2026-10-15`
- **Result:** Selects `MV Aeturnus 3 (Panamax 75k DWT)`. Draft 12.0m complies with Paradip 12.5m draft. Recommendation: **`BOOK NOW`** (+6.5% rate rise forecasted).

### Scenario 2: Deep-Water Capesize Procurement
- **Cargo:** Iron Ore
- **Quantity:** `150000` MT
- **Origin:** `Australia`
- **Destination:** `Gangavaram`
- **Date:** `2026-10-15`
- **Result:** Selects `MV Aeturnus 4 (Capesize 150k DWT)`. Fits Gangavaram 18.5m deep draft. Recommendation: **`WAIT`** (Softening spot market, delay booking).

### Scenario 3: Port Draft Restriction Violation (Incompatible)
- **Cargo:** Coal
- **Quantity:** `75000` MT
- **Origin:** `Indonesia`
- **Destination:** `Haldia`
- **Date:** `2026-10-15`
- **Result:** Panamax draft (12.0m) exceeds Haldia shallow draft (8.2m). Status: **`INCOMPATIBLE`**. Recommendation: **`WAIT`** (Draft exceeded alert).

### Scenario 4: Cargo Exceeding All Fleet Capacities
- **Quantity:** `200000` MT
- **Result:** Status: `NO_CAPACITY`. Recommendation: **`WAIT`** (Exceeds maximum 150k DWT demo vessel).

### Scenario 5: Unknown Port
- **Destination:** `Atlantis`
- **Result:** Port status: `Port data unavailable`. Data confidence: `LOW`. Recommendation: **`WAIT`**.

---

## 7. Limitations & Future Scope

1. **Demo Fleet & Port Data:** Vessel specifications (MV Aeturnus 1–4) and port drafts are curated reference demo data. Production deployment requires real-time AIS vessel lineups and live Port Marine Department bathymetric notices.
2. **Exogenous Market Feeds:** Currently uses 1,710 historical benchmark records. Full enterprise roadmap connects live API streams from the Baltic Exchange (BDI, BCI, BPI), Clarksons SIN, and S&P Global Platts.
