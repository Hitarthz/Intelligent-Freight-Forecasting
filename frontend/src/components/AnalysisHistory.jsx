import React from 'react';

export default function AnalysisHistory({ history = [], onClearHistory }) {
  const exportToCSV = () => {
    if (!history || history.length === 0) {
      alert('No analysis records available to export.');
      return;
    }

    const headers = ['Timestamp', 'Route', 'Cargo', 'Quantity (MT)', 'Current Rate ($)', 'Risk Level', 'Decision', 'Assigned Vessel'];
    const rows = history.map((item) => [
      `"${item.timestamp || ''}"`,
      `"${item.route || `${item.origin || ''} → ${item.destination || ''}`}"`,
      `"${item.cargo || item.cargo_type || ''}"`,
      item.quantity || item.quantity_mt || 0,
      item.current_rate || 0,
      `"${item.risk_level || ''}"`,
      `"${item.decision || ''}"`,
      `"${item.vessel_assigned || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Freight_Chartering_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayRows = history || [];

  return (
    <section className="card table-card" id="reports">
      <div className="card-title">
        <h2>
          <span>📊</span> Smart Procurement Plan & Analysis History
        </h2>
        <div className="table-header-actions">
          <span className="small">AI Decision Support Audit Records</span>
          {displayRows.length > 0 && onClearHistory && (
            <button
              className="btn-csv"
              style={{ borderColor: '#e05260', color: '#ff6d78' }}
              onClick={onClearHistory}
            >
              🗑️ CLEAR
            </button>
          )}
          <button className="btn-csv" onClick={exportToCSV}>
            📥 EXPORT CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>COMMODITY</th>
              <th>ROUTE / DESTINATION</th>
              <th>PARCEL (MT)</th>
              <th>FREIGHT RATE</th>
              <th>VESSEL ASSIGNED</th>
              <th>RISK</th>
              <th>AI ACTION</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '28px',
                    color: '#687f94',
                    fontStyle: 'italic',
                  }}
                >
                  No previous analyses recorded yet. Click "RUN INTELLIGENT ANALYSIS" to generate a record.
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => {
                const action = row.decision || 'WAIT';
                const tagClass =
                  action === 'BOOK NOW'
                    ? 'tag-book-now'
                    : action === 'PARTIAL BOOK'
                    ? 'tag-partial-book'
                    : 'tag-wait';

                return (
                  <tr key={idx}>
                    <td>
                      <strong>{row.cargo || row.cargo_type}</strong>
                    </td>
                    <td>{row.route || `${row.origin} → ${row.destination}`}</td>
                    <td>{Number(row.quantity || row.quantity_mt || 0).toLocaleString()} MT</td>
                    <td>${row.current_rate ? Number(row.current_rate).toFixed(2) : '34.81'} / MT</td>
                    <td>{row.vessel_assigned || 'MV Aeturnus 2'}</td>
                    <td>
                      <span style={{ fontSize: '11px', color: '#8ca6bd' }}>{row.risk_level || 'LOW'}</span>
                    </td>
                    <td>
                      <span className={`tag ${tagClass}`}>{action}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
