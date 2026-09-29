import React, { useState } from 'react';

export default function DecisionCard({ decision, cargoDetails }) {
  const [saved, setSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!decision) return null;

  const action = decision.action || 'WAIT';
  const isBookNow = action === 'BOOK NOW';
  const isPartial = action === 'PARTIAL BOOK';

  const badgeClass = isBookNow
    ? 'decision-badge badge-green'
    : isPartial
    ? 'decision-badge badge-amber'
    : 'decision-badge badge-blue';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={`card decision-card ${isBookNow ? 'border-green' : isPartial ? 'border-amber' : 'border-blue'}`}>
      <div className="card-header">
        <span className="card-tag">AI DECISION RECOMMENDATION</span>
        <span className="human-tag">Human Authorization Required</span>
      </div>

      <div className="decision-hero">
        <div className={badgeClass}>{action}</div>
        <p className="decision-explanation">{decision.reason}</p>
      </div>

      {isPartial && decision.partial_quantity_mt && (
        <div className="partial-recommendation-box">
          <div className="partial-title">Recommended Partial Procurement Strategy:</div>
          <div className="partial-split">
            <div className="split-item">
              <span>Recommended partial quantity:</span>
              <b>{decision.partial_quantity_mt.toLocaleString()} MT</b>
            </div>
            <div className="split-item">
              <span>Remaining quantity to float:</span>
              <b>{decision.remaining_quantity_mt ? decision.remaining_quantity_mt.toLocaleString() : '-'} MT</b>
            </div>
          </div>
          <div className="partial-note">
            Note: This is a strategy recommendation to hedge market volatility. No vessels are automatically booked.
          </div>
        </div>
      )}

      <div className="decision-footer">
        <span className="disclaimer-text">
          ⚠️ Decision-Support Prototype: Final chartering decision remains with authorized human personnel.
        </span>
        <div className="decision-actions">
          <button type="button" className="btn-secondary" onClick={() => setShowReportModal(true)}>
            VIEW DECISION REPORT
          </button>
          <button type="button" className="btn-secondary" onClick={handleSave}>
            {saved ? '✓ RECOMMENDATION SAVED' : 'SAVE RECOMMENDATION'}
          </button>
        </div>
      </div>

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h4>Chartering Decision Summary Report</h4>
              <button className="btn-close" onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p><b>Decision:</b> {decision.action}</p>
              <p><b>Reason:</b> {decision.reason}</p>
              {cargoDetails && (
                <>
                  <p><b>Cargo:</b> {cargoDetails.cargo_type} ({cargoDetails.quantity_mt?.toLocaleString()} MT)</p>
                  <p><b>Route:</b> {cargoDetails.origin} → {cargoDetails.destination}</p>
                </>
              )}
              <p className="modal-note">
                Status: Commercial charter transaction must be formally approved and executed by the Ministry of Steel procurement officer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
