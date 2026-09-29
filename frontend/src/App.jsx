import React, { useState, useEffect } from 'react';
import CargoForecastChart from './components/CargoForecastChart';
import PortRiskMonitor from './components/PortRiskMonitor';
import WhatIfSimulator from './components/WhatIfSimulator';
import AnalysisHistory from './components/AnalysisHistory';
import DecisionReportModal from './components/DecisionReportModal';
import { analyzeShipment, getHistory } from './services/api';
import './styles/App.css';

export default function App() {
  const [activeNav, setActiveNav] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // 5 Manual user inputs
  const [cargoType, setCargoType] = useState('Iron Ore');
  const [quantityMt, setQuantityMt] = useState(50000);
  const [origin, setOrigin] = useState('Australia');
  const [destination, setDestination] = useState('Paradip');
  const [shipmentDate, setShipmentDate] = useState('2026-10-15');

  // Analysis result state
  const [analysisData, setAnalysisData] = useState({
    current_rate: 34.81,
    forecast: {
      '7_days': 35.12,
      '30_days': 37.06,
      '60_days': 38.85,
    },
    trend_30_days: 6.46,
    data_confidence: 'HIGH',
    vessel: {
      name: 'MV Aeturnus 2',
      type: 'Supramax',
      capacity_mt: 55000,
      draft: 10.2,
      daily_cost: 24000,
    },
    port: {
      name: 'Paradip',
      status: 'Compatible',
      max_draft: 12.5,
      draft_check: 'Vessel draft 10.2m <= Port draft 12.5m',
    },
    risk: {
      score: 42,
      level: 'MEDIUM',
      explanation: 'Moderate port congestion and rising bunker volatility.',
    },
    cost: {
      freight: 1740500,
      vessel: 336000,
      total: 2076500,
    },
    decision: {
      action: 'BOOK NOW',
      reason: 'Forecast indicates rising freight rates (+6.46%) while vessel MV Aeturnus 2 is feasible and risk remains within threshold.',
      partial_quantity_mt: null,
      remaining_quantity_mt: null,
    },
  });

  // Initial load
  useEffect(() => {
    loadHistory();
    runAnalysis({
      cargo_type: cargoType,
      quantity_mt: quantityMt,
      origin: origin,
      destination: destination,
      shipment_date: shipmentDate,
    });
  }, []);

  const loadHistory = async () => {
    try {
      const records = await getHistory();
      if (records && records.length > 0) {
        setHistory(records);
      }
    } catch (e) {
      console.warn('Could not load history from backend, using session memory:', e);
    }
  };

  const runAnalysis = async (payload) => {
    setLoading(true);
    setError('');

    // Client-side validations
    if (!payload.quantity_mt || Number(payload.quantity_mt) <= 0) {
      setError('Please enter a valid positive cargo quantity (MT).');
      setLoading(false);
      return;
    }
    if (!payload.origin || payload.origin.trim() === '') {
      setError('Please enter origin port/country.');
      setLoading(false);
      return;
    }
    if (!payload.destination || payload.destination.trim() === '') {
      setError('Please enter destination port.');
      setLoading(false);
      return;
    }

    try {
      const res = await analyzeShipment(payload);
      setAnalysisData(res);
      loadHistory();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Analysis engine unavailable. Please ensure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    runAnalysis({
      cargo_type: cargoType,
      quantity_mt: Number(quantityMt),
      origin: origin.trim(),
      destination: destination.trim(),
      shipment_date: shipmentDate,
    });
  };

  const scrollToSection = (id) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // KPI calculations
  const kpiCargo = Number(quantityMt || 50000).toLocaleString();
  const kpiVessel = analysisData.vessel?.name ? `${analysisData.vessel.name} (${analysisData.vessel.type})` : 'None (Incompatible)';
  const kpiFreight = `$${analysisData.current_rate || 34.81} / MT`;
  const kpiRiskLevel = analysisData.risk?.level || 'LOW';
  const kpiRiskScore = analysisData.risk?.score || 35;
  const kpiTrend = analysisData.trend_30_days || 6.46;

  // Decision presentation
  const decisionAction = analysisData.decision?.action || 'WAIT';
  const decisionClass =
    decisionAction === 'BOOK NOW'
      ? 'action-book-now'
      : decisionAction === 'PARTIAL BOOK'
      ? 'action-partial-book'
      : 'action-wait';

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION (Matching dashboard.html) */}
      <aside className="sidebar">
        <div className="logo">
          FREIGHT <span>AI</span>
          <span className="team-badge">Aeturnus</span>
        </div>

        <div className="nav-title">COMMAND</div>
        <button
          className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
          onClick={() => scrollToSection('home')}
        >
          <span>🏠</span> Command Center
        </button>
        <button
          className={`nav-item ${activeNav === 'forecast' ? 'active' : ''}`}
          onClick={() => scrollToSection('forecast')}
        >
          <span>📦</span> Cargo Forecast
        </button>
        <button
          className={`nav-item ${activeNav === 'vessels' ? 'active' : ''}`}
          onClick={() => scrollToSection('vessels')}
        >
          <span>🚢</span> Vessel Planner
        </button>
        <button
          className={`nav-item ${activeNav === 'freight' ? 'active' : ''}`}
          onClick={() => scrollToSection('forecast')}
        >
          <span>💰</span> Freight Intelligence
        </button>
        <button
          className={`nav-item ${activeNav === 'risk' ? 'active' : ''}`}
          onClick={() => scrollToSection('risk')}
        >
          <span>⚓</span> Port Risk
        </button>

        <div className="nav-title">INTELLIGENCE</div>
        <button
          className={`nav-item ${activeNav === 'ai' ? 'active' : ''}`}
          onClick={() => scrollToSection('ai')}
        >
          <span>🧠</span> AI Decision Engine
        </button>
        <button
          className={`nav-item ${activeNav === 'simulator' ? 'active' : ''}`}
          onClick={() => scrollToSection('simulator')}
        >
          <span>🔮</span> What-If Simulator
        </button>
        <button
          className={`nav-item ${activeNav === 'reports' ? 'active' : ''}`}
          onClick={() => scrollToSection('reports')}
        >
          <span>📊</span> Reports & History
        </button>

        <div className="sidebar-footer">
          <div>
            <strong>SIH26006</strong> • Logistics
          </div>
          <div>Ministry of Steel</div>
          <div style={{ marginTop: '4px', fontSize: '10px', color: '#4a627a' }}>
            Decision Support Prototype
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main" id="home">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="page-title">
            <h1>INTELLIGENT FREIGHT FORECASTING</h1>
            <p>
              AI-powered freight forecasting & vessel chartering decision support • Ministry of Steel (SIH26006)
            </p>
          </div>

          <div className="topbar-right">
            <span className="gov-pill">MINISTRY OF STEEL • TEAM AETURNUS</span>
            <div className="status">
              <span className="dot" />
              AI SYSTEM ONLINE
            </div>
          </div>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        {/* 4 TOP KPI CARDS */}
        <section className="kpis">
          <div className="card">
            <div className="kpi-head">
              <span>📦 PREDICTED CARGO</span>
              <span className="kpi-icon">↗</span>
            </div>
            <div className="kpi-value">{kpiCargo} MT</div>
            <div className={`kpi-change ${kpiTrend >= 0 ? 'up' : 'down'}`}>
              {kpiTrend >= 0 ? `↑ +${kpiTrend}%` : `↓ ${kpiTrend}%`} 30-Day Trend
            </div>
          </div>

          <div className="card" id="vessels">
            <div className="kpi-head">
              <span>🚢 OPTIMAL VESSEL</span>
              <span className="kpi-icon">⚓</span>
            </div>
            <div className="kpi-value" style={{ fontSize: '18px', marginTop: '16px' }}>
              {kpiVessel}
            </div>
            <div className="kpi-change" style={{ color: analysisData.port?.status === 'Compatible' ? '#42d99a' : '#ff6d78' }}>
              {analysisData.port?.status === 'Compatible' ? 'Harbor Draft Compatible ✅' : 'Port Draft Incompatible ❌'}
            </div>
          </div>

          <div className="card">
            <div className="kpi-head">
              <span>💰 FREIGHT FORECAST</span>
              <span className="kpi-icon">💲</span>
            </div>
            <div className="kpi-value">{kpiFreight}</div>
            <div className="kpi-change">
              30D: ${analysisData.forecast?.['30_days'] || 37.06}/MT
            </div>
          </div>

          <div className="card">
            <div className="kpi-head">
              <span>⚠️ PORT & MARKET RISK</span>
              <span className="kpi-icon">!</span>
            </div>
            <div className="kpi-value" style={{ color: kpiRiskScore >= 70 ? '#ff6d78' : kpiRiskScore >= 40 ? '#ffc85a' : '#43e79b' }}>
              {kpiRiskLevel}
            </div>
            <div className="kpi-change amber">{kpiRiskScore}% Composite Risk</div>
          </div>
        </section>

        {/* MAIN GRID: 5-INPUTS + CHART (LEFT) & AI DECISION (RIGHT) */}
        <div className="grid">
          {/* LEFT: SHIPMENT INPUT FORM & DYNAMIC CANVAS CHART */}
          <section className="card" id="forecast">
            <div className="card-title">
              <h2>
                <span>📦</span> Cargo Demand & Rate Forecast
              </h2>
              <span className="small">Past 6 Months → Next 6 Months (XGBoost Extrapolated)</span>
            </div>

            {/* 5 MANUAL USER INPUTS STRIP */}
            <form onSubmit={handleFormSubmit} className="input-strip">
              <div className="input-strip-header">
                <h3>Enter Shipment Parameters</h3>
                <span className="small">All 5 fields user-configurable</span>
              </div>

              <div className="input-form-grid">
                {/* 1. Cargo Type */}
                <div className="form-field">
                  <label>1. Cargo Type</label>
                  <select value={cargoType} onChange={(e) => setCargoType(e.target.value)}>
                    <option value="Iron Ore">Iron Ore</option>
                    <option value="Coking Coal">Coking Coal</option>
                    <option value="Thermal Coal">Thermal Coal</option>
                    <option value="Limestone">Limestone</option>
                    <option value="Steel">Steel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 2. Cargo Quantity */}
                <div className="form-field">
                  <label>2. Quantity (MT)</label>
                  <input
                    type="number"
                    value={quantityMt}
                    min="1000"
                    step="1000"
                    onChange={(e) => setQuantityMt(Number(e.target.value))}
                    required
                  />
                  <div className="chips-row">
                    <button type="button" className="chip-btn" onClick={() => setQuantityMt(35000)}>
                      35k
                    </button>
                    <button type="button" className="chip-btn" onClick={() => setQuantityMt(50000)}>
                      50k
                    </button>
                    <button type="button" className="chip-btn" onClick={() => setQuantityMt(75000)}>
                      75k
                    </button>
                    <button type="button" className="chip-btn" onClick={() => setQuantityMt(150000)}>
                      150k
                    </button>
                  </div>
                </div>

                {/* 3. Origin (Text Input) */}
                <div className="form-field">
                  <label>3. Origin (Text)</label>
                  <input
                    type="text"
                    value={origin}
                    placeholder="e.g. Australia"
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>

                {/* 4. Destination (Text Input) */}
                <div className="form-field">
                  <label>4. Destination (Text)</label>
                  <input
                    type="text"
                    value={destination}
                    placeholder="e.g. Paradip"
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                {/* 5. Required Shipment Date */}
                <div className="form-field">
                  <label>5. Laycan / Date</label>
                  <input
                    type="date"
                    value={shipmentDate}
                    onChange={(e) => setShipmentDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-analyze" disabled={loading}>
                {loading ? 'ANALYZING SHIPMENT...' : '🧠 RUN INTELLIGENT ANALYSIS'}
              </button>
            </form>

            {/* INTERACTIVE CANVAS CHART */}
            <CargoForecastChart
              currentRate={analysisData.current_rate}
              forecast30={analysisData.forecast?.['30_days']}
              trend={analysisData.trend_30_days}
            />

            {/* BREAKDOWN ROW */}
            <div className="rates-breakdown-row">
              <div className="rate-item">
                <span>Current Rate</span>
                <strong>${analysisData.current_rate?.toFixed(2) || '34.81'}</strong>
              </div>
              <div className="rate-item">
                <span>7-Day Forecast</span>
                <strong>${analysisData.forecast?.['7_days']?.toFixed(2) || '35.12'}</strong>
              </div>
              <div className="rate-item">
                <span>30-Day Forecast</span>
                <strong>${analysisData.forecast?.['30_days']?.toFixed(2) || '37.06'}</strong>
              </div>
              <div className="rate-item">
                <span>60-Day Forecast</span>
                <strong>${analysisData.forecast?.['60_days']?.toFixed(2) || '38.85'}</strong>
              </div>
            </div>
          </section>

          {/* RIGHT: AI DECISION ENGINE CARD */}
          <section className="card ai-card" id="ai">
            <div className="ai-card-header">
              <div className="ai-badge">AI DECISION ENGINE</div>
              <span
                className={`confidence-tag ${
                  analysisData.data_confidence === 'HIGH'
                    ? 'high'
                    : analysisData.data_confidence === 'LOW'
                    ? 'low'
                    : 'medium'
                }`}
              >
                {analysisData.data_confidence || 'HIGH'} CONFIDENCE
              </span>
            </div>

            <h3 className={decisionClass}>{decisionAction}</h3>

            <p>{analysisData.decision?.reason || 'Generating chartering decision recommendation...'}</p>

            <div className="metrics">
              <div className="metric">
                <span>Demand Growth</span>
                <strong style={{ color: kpiTrend >= 0 ? '#43e79b' : '#ff6d78' }}>
                  {kpiTrend >= 0 ? `+${kpiTrend}%` : `${kpiTrend}%`}
                </strong>
              </div>

              <div className="metric">
                <span>Freight Risk</span>
                <strong style={{ color: kpiRiskScore >= 70 ? '#ff6d78' : kpiRiskScore >= 40 ? '#ffc85a' : '#43e79b' }}>
                  {kpiRiskLevel} ({kpiRiskScore}%)
                </strong>
              </div>

              <div className="metric">
                <span>Vessel Fit</span>
                <strong>{analysisData.vessel?.type || 'Supramax'}</strong>
              </div>

              <div className="metric">
                <span>Est. Total Cost</span>
                <strong style={{ fontSize: '13px' }}>
                  ${Number(analysisData.cost?.total || 2076500).toLocaleString()}
                </strong>
              </div>
            </div>

            <button className="book-btn" onClick={() => setModalOpen(true)}>
              🚢 VIEW DECISION REPORT
            </button>

            <div className="decision-disclaimer">
              Decision Support Prototype • Final commercial chartering remains with user
            </div>
          </section>
        </div>

        {/* PORT RISK MONITOR (Matching dashboard.html) */}
        <PortRiskMonitor selectedPort={destination} currentVessel={analysisData.vessel} />

        {/* WHAT-IF SIMULATOR (Matching dashboard.html) */}
        <WhatIfSimulator
          currentQuantity={quantityMt}
          currentRate={analysisData.current_rate}
          onRunScenario={(scenario) => {
            setQuantityMt(scenario.quantity);
            runAnalysis({
              cargo_type: cargoType,
              quantity_mt: scenario.quantity,
              origin: origin,
              destination: destination,
              shipment_date: shipmentDate,
            });
          }}
        />

        {/* SMART PROCUREMENT / AUDIT HISTORY (Matching dashboard.html) */}
        <AnalysisHistory history={history} />

        {/* DECISION REPORT MODAL (Matching dashboard.html booking modal) */}
        <DecisionReportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          analysisData={analysisData}
          shipmentInput={{
            cargo_type: cargoType,
            quantity_mt: quantityMt,
            origin: origin,
            destination: destination,
            shipment_date: shipmentDate,
          }}
        />
      </main>
    </div>
  );
}
