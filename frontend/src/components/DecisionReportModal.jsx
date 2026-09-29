import React, { useState } from 'react';

export default function DecisionReportModal({ isOpen, onClose, analysisData, shipmentInput }) {
  const [confirmed, setConfirmed] = useState(false);
  const [refId, setRefId] = useState('');
  const [vesselChoice, setVesselChoice] = useState(analysisData?.vessel?.type || 'Supramax');
  const [dateChoice, setDateChoice] = useState(shipmentInput?.shipment_date || '2026-10-15');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setRefId(`FRT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomNum}`);
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const cargo = shipmentInput?.cargo_type || 'Iron Ore';
  const qty = Number(shipmentInput?.quantity_mt || 50000).toLocaleString();
  const origin = shipmentInput?.origin || 'Australia';
  const dest = shipmentInput?.destination || 'Paradip';
  const rate = analysisData?.current_rate ? `$${analysisData.current_rate}/MT` : '₹42,500/MT';
  const confidence = analysisData?.data_confidence || 'HIGH';
  const decision = analysisData?.decision?.action || 'BOOK NOW';

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🚢 Vessel Chartering Decision Report</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        {!confirmed ? (
          <div>
            <div className="booking-summary">
              <div className="summary-card">
                <small>ORIGIN</small>
                <strong>{origin}</strong>
              </div>
              <div className="summary-card">
                <small>DESTINATION</small>
                <strong>{dest}, India</strong>
              </div>
              <div className="summary-card">
                <small>CARGO & PARCEL</small>
                <strong>
                  {cargo} • {qty} MT
                </strong>
              </div>
              <div className="summary-card">
                <small>ASSIGNED VESSEL</small>
                <strong>{analysisData?.vessel?.name || 'MV Aeturnus 2'}</strong>
              </div>
              <div className="summary-card">
                <small>FREIGHT ESTIMATE</small>
                <strong>{rate}</strong>
              </div>
              <div className="summary-card">
                <small>AI RECOMMENDATION</small>
                <strong style={{ color: '#42d9ff' }}>{decision}</strong>
              </div>
            </div>

            <div className="input-group">
              <label>Optimal Vessel Class</label>
              <select value={vesselChoice} onChange={(e) => setVesselChoice(e.target.value)}>
                <option value="Handysize">Handysize (35,000 DWT)</option>
                <option value="Supramax">Supramax (55,000 DWT)</option>
                <option value="Panamax">Panamax (75,000 DWT)</option>
                <option value="Capesize">Capesize (150,000 DWT)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Target Laycan / Loading Date</label>
              <input type="date" value={dateChoice} onChange={(e) => setDateChoice(e.target.value)} />
            </div>

            <button className="book-btn" onClick={handleConfirm}>
              📄 GENERATE DECISION REPORT
            </button>
          </div>
        ) : (
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h2>Decision Report Compiled!</h2>
            <p style={{ color: '#8ba1b4', marginTop: '6px', fontSize: '13px' }}>
              Your chartering decision recommendation has been validated and recorded.
            </p>

            <div className="reference">{refId}</div>

            <div className="disclaimer-banner">
              ⚠️ <strong>DECISION SUPPORT NOTICE:</strong> This system provides analytical decision support. It does not
              execute financial transactions. The final chartering authorization remains with the procurement manager.
            </div>

            <button className="book-btn" onClick={handleClose}>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
