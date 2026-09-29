// Centralized API service for FreightForecaster
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return await res.json();
  } catch (err) {
    console.error('API health check error:', err);
    return { status: 'offline' };
  }
}

export async function analyzeShipment(payload) {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(errorData.detail || 'Failed to analyze shipment');
  }

  return await res.json();
}

export async function runWhatIfSimulation(payload) {
  const res = await fetch(`${API_URL}/api/what-if`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'What-if calculation failed' }));
    throw new Error(errorData.detail || 'Simulation error');
  }

  return await res.json();
}

export async function getHistory() {
  try {
    const res = await fetch(`${API_URL}/api/history`);
    if (res.ok) {
      const data = await res.json();
      return data.history || [];
    }
  } catch (err) {
    console.error('Failed to fetch history:', err);
  }
  return [];
}
