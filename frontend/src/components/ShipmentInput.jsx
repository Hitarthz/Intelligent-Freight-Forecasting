import React, { useState } from 'react';

const CARGO_OPTIONS = ['Iron Ore', 'Coal', 'Limestone', 'Steel', 'Other'];

export default function ShipmentInput({ onAnalyze, loading }) {
  const [form, setForm] = useState({
    cargo_type: 'Iron Ore',
    quantity_mt: 50000,
    origin: 'Australia',
    destination: 'Paradip',
    shipment_date: '2026-10-15',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.origin || !form.origin.trim()) {
      setValidationError('Please enter an origin country or port.');
      return;
    }

    if (!form.destination || !form.destination.trim()) {
      setValidationError('Please enter an East Coast destination port.');
      return;
    }

    const qty = Number(form.quantity_mt);
    if (isNaN(qty) || qty <= 0) {
      setValidationError('Please enter a valid cargo quantity.');
      return;
    }

    if (!form.shipment_date) {
      setValidationError('Please select a required shipment date.');
      return;
    }

    onAnalyze({
      cargo_type: form.cargo_type,
      quantity_mt: qty,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      shipment_date: form.shipment_date,
    });
  };

  return (
    <div className="card input-card">
      <div className="card-header">
        <h3>SHIPMENT INPUT</h3>
        <span className="card-subtitle">Enter bulk cargo and voyage requirements</span>
      </div>

      {validationError && (
        <div className="error-banner">{validationError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cargo_type">Cargo Type</label>
          <select
            id="cargo_type"
            value={form.cargo_type}
            onChange={(e) => handleChange('cargo_type', e.target.value)}
          >
            {CARGO_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity_mt">Cargo Quantity (MT)</label>
          <input
            id="quantity_mt"
            type="number"
            min="1000"
            step="1000"
            placeholder="e.g. 50000"
            value={form.quantity_mt}
            onChange={(e) => handleChange('quantity_mt', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="origin">Origin (Text Input)</label>
          <input
            id="origin"
            type="text"
            placeholder="e.g. Australia, Indonesia, Brazil, Mozambique"
            value={form.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination (Text Input)</label>
          <input
            id="destination"
            type="text"
            placeholder="e.g. Paradip, Visakhapatnam, Chennai, Haldia"
            value={form.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shipment_date">Required Shipment Date</label>
          <input
            id="shipment_date"
            type="date"
            value={form.shipment_date}
            onChange={(e) => handleChange('shipment_date', e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'ANALYZING...' : 'ANALYZE SHIPMENT'}
        </button>
      </form>
    </div>
  );
}
