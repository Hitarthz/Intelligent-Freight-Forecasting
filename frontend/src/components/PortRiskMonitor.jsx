import React from 'react';

const PORTS_DATA = [
  { name: 'Visakhapatnam', maxDraft: 13.0, congestionRisk: 68, level: 'MEDIUM' },
  { name: 'Paradip', maxDraft: 12.5, congestionRisk: 42, level: 'LOW' },
  { name: 'Gangavaram', maxDraft: 14.5, congestionRisk: 35, level: 'LOW' },
  { name: 'Dhamra', maxDraft: 14.0, congestionRisk: 38, level: 'LOW' },
  { name: 'Chennai', maxDraft: 10.5, congestionRisk: 25, level: 'LOW' },
  { name: 'Haldia', maxDraft: 8.5, congestionRisk: 78, level: 'HIGH' },
];

export default function PortRiskMonitor({ selectedPort = 'Paradip', currentVessel = null }) {
  const vesselDraft = currentVessel?.draft || 10.2;

  return (
    <section className="card port-risk-card" id="risk">
      <div className="card-title">
        <h2>
          <span>⚓</span> Port Risk Monitor
        </h2>
        <span className="small">AI Congestion & Draft Feasibility Assessment</span>
      </div>

      <div className="ports-list">
        {PORTS_DATA.map((port) => {
          const isSelected = selectedPort && port.name.toLowerCase() === selectedPort.trim().toLowerCase();
          const isCompatible = vesselDraft <= port.maxDraft;
          const riskColor = port.congestionRisk >= 70 ? '#ff6d78' : port.congestionRisk >= 40 ? '#ffc85a' : '#4be29d';
          const levelClass = port.congestionRisk >= 70 ? 'high' : port.congestionRisk >= 40 ? 'medium' : 'low';

          return (
            <div
              key={port.name}
              className={`risk-row ${isSelected ? 'selected-destination' : ''}`}
            >
              <div className="port">
                <div className="port-icon">⚓</div>
                <div className="port-details">
                  <strong>
                    {port.name} {isSelected && <span style={{ color: '#42d9ff', fontSize: '11px' }}>(Destination)</span>}
                  </strong>
                  <small>
                    Max Draft: {port.maxDraft}m • Vessel: {vesselDraft}m
                  </small>
                  <div className="progress" style={{ width: '180px' }}>
                    <div style={{ width: `${port.congestionRisk}%`, background: riskColor }} />
                  </div>
                </div>
              </div>

              <div className="risk-tags-group">
                <span className={`draft-pill ${isCompatible ? 'compatible' : 'incompatible'}`}>
                  {isCompatible ? 'Fits Draft ✅' : 'Draft Incompatible ❌'}
                </span>
                <span className={`risk ${levelClass}`}>
                  {port.level} · {port.congestionRisk}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
