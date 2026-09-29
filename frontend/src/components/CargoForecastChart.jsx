import React, { useEffect, useRef } from 'react';

export default function CargoForecastChart({ currentRate = 34.81, forecast30 = 37.06, trend = 6.46 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Generate 12 data points based on actual rates
    const base = Number(currentRate) || 35;
    const future = Number(forecast30) || (base * (1 + (trend || 5) / 100));
    const step = (future - base) / 6;

    const data = [
      Math.round(base * 0.92 * 10) / 10,
      Math.round(base * 0.94 * 10) / 10,
      Math.round(base * 0.95 * 10) / 10,
      Math.round(base * 0.97 * 10) / 10,
      Math.round(base * 0.99 * 10) / 10,
      Math.round(base * 10) / 10, // Current month (index 5)
      Math.round((base + step * 1) * 10) / 10,
      Math.round((base + step * 2) * 10) / 10,
      Math.round((base + step * 3) * 10) / 10,
      Math.round((base + step * 4) * 10) / 10,
      Math.round((base + step * 5) * 10) / 10,
      Math.round(future * 10) / 10,
    ];

    const max = Math.max(...data) * 1.05;
    const min = Math.min(...data) * 0.92;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Horizontal Grid Lines
    ctx.strokeStyle = '#173149';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = 20 + (i * (h - 55)) / 4;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 15, y);
      ctx.stroke();

      // Y-axis value label
      const val = Math.round(max - (i * (max - min)) / 4);
      ctx.fillStyle = '#617a90';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`$${val}`, 34, y + 3);
    }

    // Line Path
    ctx.beginPath();
    data.forEach((val, idx) => {
      const x = 45 + (idx * (w - 70)) / (data.length - 1);
      const y = 20 + ((max - val) / (max - min)) * (h - 60);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#42d9ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Area Fill
    ctx.lineTo(w - 25, h - 35);
    ctx.lineTo(45, h - 35);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 20, 0, h - 35);
    gradient.addColorStop(0, 'rgba(66, 217, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(66, 217, 255, 0.01)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Points
    data.forEach((val, idx) => {
      const x = 45 + (idx * (w - 70)) / (data.length - 1);
      const y = 20 + ((max - val) / (max - min)) * (h - 60);

      ctx.beginPath();
      ctx.arc(x, y, idx === 5 || idx === data.length - 1 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 5 ? '#ffc85a' : idx === data.length - 1 ? '#43e79b' : '#42d9ff';
      ctx.fill();
      ctx.strokeStyle = '#07111f';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Month Labels
    ctx.fillStyle = '#71879c';
    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'center';

    const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep (Now)', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    labels.forEach((label, idx) => {
      const x = 45 + (idx * (w - 70)) / (data.length - 1);
      ctx.fillStyle = idx === 5 ? '#ffc85a' : idx > 5 ? '#42d9ff' : '#71879c';
      ctx.fillText(label, x, h - 14);
    });
  }, [currentRate, forecast30, trend]);

  return (
    <div className="chart-box">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
