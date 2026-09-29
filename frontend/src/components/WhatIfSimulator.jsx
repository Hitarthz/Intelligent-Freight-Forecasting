import React, { useState, useEffect } from 'react';

export default function WhatIfSimulator({ currentQuantity = 50000, currentRate = 34.81, onRunScenario }) {
  const [demand, setDemand] = useState(currentQuantity || 50000);
  const [increase, setIncrease] = useState(15);
  const [capacity, setCapacity] = useState(55000);
  const [stock, setStock] = useState(15000);

  // Sync when currentQuantity changes
  useEffect(() => {
    if (currentQuantity) {
      setDemand(currentQuantity);
    }
  }, [currentQuantity]);

  // Real-time calculations
  const forecastDemand = Math.round(demand * (1 + increase / 100));
  const currentVessels = Math.max(1, Math.ceil(demand / capacity));
  const requiredVessels = Math.max(1, Math.ceil(forecastDemand / capacity));
  const additionalVessels = Math.max(0, requiredVessels - currentVessels);
  const safetyStock = Math.round(capacity * 0.2);
  const procurement = Math.max(0, forecastDemand + safetyStock - stock);

  // AI Decision logic for scenario
  let decisionAction = 'WAIT';
  if (increase >= 8 || additionalVessels >= 1) {
    decisionAction = 'BOOK NOW';
  } else if (increase >= 3) {
    decisionAction = 'PARTIAL BOOK';
  } else {
    decisionAction = 'WAIT';
  }

  const handleApplyScenario = () => {
    if (onRunScenario) {
      onRunScenario({
        quantity: forecastDemand,
        rateChange: increase,
      });
    }
  };

  return (
    <section className="card simulator" id="simulator">
      <div className="card-title">
        <div>
          <h2>
            <span>🔮</span> What-If Decision Simulator
          </h2>
          <span className="small">Test sensitivity to parcel sizing, demand surge & vessel capacities</span>
        </div>
      </div>

      <div className="sim-grid">
        {/* Controls */}
        <div>
          <div className="input-group">
            <label>
              Current Cargo Demand
              <span>{Number(demand).toLocaleString()} MT</span>
            </label>
            <input
              type="range"
              min="20000"
              max="200000"
              step="5000"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>
              Expected Demand / Rate Increase
              <span>{increase >= 0 ? `+${increase}%` : `${increase}%`}</span>
            </label>
            <input
              type="range"
              min="-20"
              max="40"
              step="1"
              value={increase}
              onChange={(e) => setIncrease(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Optimal Vessel Class</label>
            <select value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}>
              <option value="35000">Handysize — 35,000 DWT</option>
              <option value="55000">Supramax — 55,000 DWT</option>
              <option value="75000">Panamax — 75,000 DWT</option>
              <option value="150000">Capesize — 150,000 DWT</option>
            </select>
          </div>

          <div className="input-group">
            <label>
              Plant Silo Stock
              <span>{Number(stock).toLocaleString()} MT</span>
            </label>
            <input
              type="range"
              min="0"
              max="60000"
              step="2500"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <button className="book-btn" onClick={handleApplyScenario}>
            🧠 RUN INTELLIGENT ANALYSIS
          </button>
        </div>

        {/* Results */}
        <div className="sim-result">
          <div className="result-row">
            <span>Current Demand</span>
            <strong>{Number(demand).toLocaleString()} MT</strong>
          </div>

          <div className="result-row">
            <span>Forecast Demand</span>
            <strong>{Number(forecastDemand).toLocaleString()} MT</strong>
          </div>

          <div className="result-row">
            <span>Vessel Capacity</span>
            <strong>{Number(capacity).toLocaleString()} DWT</strong>
          </div>

          <div className="result-row">
            <span>Vessels Required</span>
            <strong>{requiredVessels}</strong>
          </div>

          <div className="result-row">
            <span>Additional Vessels Needed</span>
            <strong style={{ color: additionalVessels > 0 ? '#ffc85a' : '#4be29d' }}>
              {additionalVessels}
            </strong>
          </div>

          <div className="result-row">
            <span>Recommended Procurement</span>
            <strong>{Number(procurement).toLocaleString()} MT</strong>
          </div>

          <div className="decision">
            <small>AI RECOMMENDATION</small>
            <h2
              style={{
                color:
                  decisionAction === 'BOOK NOW'
                    ? '#43e79b'
                    : decisionAction === 'PARTIAL BOOK'
                    ? '#ffc85a'
                    : '#42d9ff',
              }}
            >
              {decisionAction === 'BOOK NOW' ? '🚢 BOOK NOW' : decisionAction === 'PARTIAL BOOK' ? '⚡ PARTIAL BOOK' : '⏳ WAIT'}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
