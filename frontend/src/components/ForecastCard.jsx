import React from 'react';

export default function ForecastCard({ forecastData }) {
  if (!forecastData) return null;

  const { current_rate, forecast, trend_30_days, data_confidence, data_note } = forecastData;

  const isUp = trend_30_days >= 0;

  return (
    <div className="card forecast-card">
      <div className="card-header">
        <h3>FREIGHT FORECAST</h3>
        <div className="confidence-tag">
          Data Confidence:{' '}
          <span className={`tag-${(data_confidence || 'MEDIUM').toLowerCase()}`}>
            {data_confidence || 'MEDIUM'}
          </span>
        </div>
      </div>

      <div className="forecast-metrics-grid">
        <div className="metric-box">
          <span className="metric-label">CURRENT</span>
          <div className="metric-num">${current_rate?.toFixed(2)}</div>
          <span className="metric-unit">/ MT (Benchmark)</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">7 DAYS</span>
          <div className="metric-num">${forecast?.['7_days']?.toFixed(2)}</div>
          <span className="metric-unit">/ MT (XGBoost)</span>
        </div>

        <div className="metric-box highlight">
          <span className="metric-label">30 DAYS</span>
          <div className="metric-num">${forecast?.['30_days']?.toFixed(2)}</div>
          <div className={`trend-pill ${isUp ? 'pill-up' : 'pill-down'}`}>
            {isUp ? `+${trend_30_days}%` : `${trend_30_days}%`} (30d)
          </div>
        </div>

        <div className="metric-box">
          <span className="metric-label">60 DAYS</span>
          <div className="metric-num">${forecast?.['60_days']?.toFixed(2)}</div>
          <span className="metric-unit">/ MT (Horizon)</span>
        </div>
      </div>

      {data_note && (
        <div className="data-note-bar">
          <span className="note-icon">ℹ️</span> {data_note}
        </div>
      )}
    </div>
  );
}
