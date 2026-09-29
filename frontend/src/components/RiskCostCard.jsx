import React from 'react';

export default function RiskCostCard({ risk, cost }) {
  if (!risk && !cost) return null;

  const score = risk?.score || 0;
  const level = risk?.level || 'LOW';

  const riskClass = level === 'LOW' ? 'level-low' : level === 'MEDIUM' ? 'level-med' : 'level-high';

  return (
    <div className="card risk-cost-card">
      <div className="card-header">
        <h3>RISK & ESTIMATED COST</h3>
        <span className="card-subtitle">Operational Exposure & Voyage Financial Estimates</span>
      </div>

      <div className="risk-cost-grid">
        {/* Risk Box */}
        <div className="risk-box">
          <div className="box-top">
            <span className="box-heading">OPERATIONAL & MARKET RISK</span>
            <span className={`risk-level-badge ${riskClass}`}>{level}</span>
          </div>

          <div className="risk-score-display">
            <span className="score-num">{score}</span>
            <span className="score-max">/ 100</span>
          </div>

          <p className="risk-desc">{risk?.explanation || 'Risk assessment completed.'}</p>
        </div>

        {/* Cost Box */}
        <div className="cost-box">
          <div className="box-top">
            <span className="box-heading">VOYAGE COST BREAKDOWN</span>
            <span className="estimate-badge">ESTIMATED ONLY</span>
          </div>

          <div className="cost-breakdown-list">
            <div className="cost-item">
              <span>Freight Cost (Cargo Rate × Qty):</span>
              <b>${cost?.freight?.toLocaleString()} USD</b>
            </div>
            <div className="cost-item">
              <span>Vessel Hire ({cost?.voyage_days || 18}d Voyage Est.):</span>
              <b>${cost?.vessel?.toLocaleString()} USD</b>
            </div>
            <div className="cost-total-row">
              <span>Total Estimated Voyage Cost:</span>
              <b className="total-highlight">
                ${cost?.total?.toLocaleString()} USD
              </b>
            </div>
          </div>
          <div className="cost-note">
            Note: Figures represent decision-support estimates. Does not constitute a binding commercial charter quote.
          </div>
        </div>
      </div>
    </div>
  );
}
