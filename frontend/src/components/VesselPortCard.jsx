import React from 'react';

export default function VesselPortCard({ vessel, port }) {
  if (!vessel && !port) return null;

  const isCompatible = port?.status === 'Compatible';
  const isDraftExceeded = port?.status === 'Incompatible';
  const isUnknownPort = !port?.known;

  return (
    <div className="card vessel-port-card">
      <div className="card-header">
        <h3>VESSEL & PORT FIT</h3>
        <span className="card-subtitle">Operational Feasibility & Harbor Draft Validation</span>
      </div>

      <div className="vessel-port-content">
        {/* Vessel Column */}
        <div className="spec-subcol">
          <div className="subcol-title">OPTIMIZED VESSEL (DEMO)</div>
          <div className="spec-row">
            <span>Selected Vessel:</span>
            <b>{vessel?.name || 'None Feasible'}</b>
          </div>
          <div className="spec-row">
            <span>Vessel Type:</span>
            <b>{vessel?.type || '-'}</b>
          </div>
          <div className="spec-row">
            <span>Capacity (DWT):</span>
            <b>{vessel?.capacity_mt ? `${vessel.capacity_mt.toLocaleString()} MT` : '-'}</b>
          </div>
          <div className="spec-row">
            <span>Vessel Operating Draft:</span>
            <b>{vessel?.draft ? `${vessel.draft} m` : '-'}</b>
          </div>
          <div className="spec-row">
            <span>Charter Hire (Demo):</span>
            <b>{vessel?.daily_cost ? `$${vessel.daily_cost.toLocaleString()} / day` : '-'}</b>
          </div>
        </div>

        {/* Port Column */}
        <div className="spec-subcol">
          <div className="subcol-title">DESTINATION HARBOR CHECK</div>
          <div className="spec-row">
            <span>Port Name:</span>
            <b>{port?.name || '-'}</b>
          </div>
          <div className="spec-row">
            <span>Port Max Permissible Draft:</span>
            <b>{port?.max_draft ? `${port.max_draft} m` : 'Data Unavailable'}</b>
          </div>
          <div className="spec-row">
            <span>Compatibility Status:</span>
            <span
              className={`status-pill ${
                isCompatible ? 'pill-pass' : isDraftExceeded ? 'pill-fail' : 'pill-warn'
              }`}
            >
              {isCompatible
                ? 'COMPATIBLE'
                : isDraftExceeded
                ? 'INCOMPATIBLE'
                : 'PORT DATA UNAVAILABLE'}
            </span>
          </div>
          <div className="spec-row">
            <span>Draft Safety Margin:</span>
            <b>
              {port?.max_draft && vessel?.draft
                ? `${(port.max_draft - vessel.draft).toFixed(1)} m ${
                    port.max_draft >= vessel.draft ? '(Safe)' : '(Draft Exceeded)'
                  }`
                : 'Cannot verify'}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
