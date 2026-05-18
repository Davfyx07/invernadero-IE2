import { useState, useRef } from "react";

export default function AreaChart({ data }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: "", value: "" });

  const w = 600, h = 260, pad = { top: 10, right: 20, bottom: 30, left: 40 };
  const gw = w - pad.left - pad.right;
  const gh = h - pad.top - pad.bottom;
  const n = data.length;
  const maxH = 100, maxT = 30;

  const safeDiv = Math.max(n - 1, 1);
  const x = (i) => pad.left + (i / safeDiv) * gw;
  const yH = (v) => pad.top + gh - ((v ?? 0) / maxH) * gh;
  const yT = (v) => pad.top + gh - ((v ?? 0) / maxT) * gh;

  const humPoints = data.map((d, i) => `${x(i)},${yH(d.humedad)}`).join(" ");
  const tempPoints = data.map((d, i) => `${x(i)},${yT(d.temp)}`).join(" ");
  const humArea = n > 0 ? `${x(0)},${pad.top + gh} ${humPoints} ${x(n - 1)},${pad.top + gh}` : "";
  const tempArea = n > 0 ? `${x(0)},${pad.top + gh} ${tempPoints} ${x(n - 1)},${pad.top + gh}` : "";

  const handleMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((t) => ({
      ...t,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 40,
    }));
  };

  return (
    <div ref={containerRef} className="relative h-72">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <defs>
          <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F97316" stopOpacity="0.25" />
            <stop offset="95%" stopColor="#F97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }).map((_, i) => {
          const yy = pad.top + (gh / 4) * i;
          return <line key={i} x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-cenit-700" />;
        })}

        <polygon points={humArea} fill="url(#gradHum)" />
        <polygon points={tempArea} fill="url(#gradTemp)" />

        <polyline points={humPoints} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={tempPoints} fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={x(i)} cy={yH(d.humedad)} r="4" fill="#3B82F6" stroke="white" strokeWidth="2"
              className="cursor-pointer"
              onMouseEnter={() => setTooltip({ visible: true, x: 0, y: 0, label: d.zona, value: `Humedad: ${d.humedad}%` })}
              onMouseMove={handleMove}
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
            />
            <circle
              cx={x(i)} cy={yT(d.temp)} r="4" fill="#F97316" stroke="white" strokeWidth="2"
              className="cursor-pointer"
              onMouseEnter={() => setTooltip({ visible: true, x: 0, y: 0, label: d.zona, value: `Temp: ${d.temp}°C` })}
              onMouseMove={handleMove}
              onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
            />
            <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-cenit-400 dark:fill-cenit-300" style={{ fontSize: 10 }}>
              {d.zona}
            </text>
          </g>
        ))}

        <g transform={`translate(${w - 140}, 10)`}>
          <circle cx="0" cy="0" r="3" fill="#3B82F6" />
          <text x="8" y="3" className="fill-cenit-500 dark:fill-cenit-300" style={{ fontSize: 10 }}>Humedad %</text>
          <circle cx="70" cy="0" r="3" fill="#F97316" />
          <text x="78" y="3" className="fill-cenit-500 dark:fill-cenit-300" style={{ fontSize: 10 }}>Temp °C</text>
        </g>
      </svg>

      {tooltip.visible && (
        <div
          className="absolute bg-white dark:bg-cenit-800 border border-cenit-200 dark:border-cenit-700 rounded-xl px-3 py-2 text-xs shadow-lg pointer-events-none z-10"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold text-cenit-800 dark:text-white">{tooltip.label}</div>
          <div className="text-cenit-400 dark:text-cenit-300">{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
