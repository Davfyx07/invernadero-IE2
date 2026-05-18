import { useState, useRef } from "react";

const PIE_COLORS = ["#059669", "#34D399", "#3B82F6", "#F97316", "#94A3B8"];

export default function PieChart({ data, totalLabel }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: "", value: 0 });

  const total = data.reduce((a, b) => a + b.value, 0);
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const innerR = 55;

  let startAngle = 0;
  const segments = total > 0 ? data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    startAngle = endAngle;
    return { path, color: PIE_COLORS[i % PIE_COLORS.length], name: d.name, value: d.value };
  }) : [];

  const handleMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((t) => ({
      ...t,
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 30,
    }));
  };

  return (
    <div ref={containerRef} className="relative h-72">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            stroke="#fff"
            strokeWidth="2"
            className="transition hover:opacity-80 cursor-pointer"
            onMouseEnter={() =>
              setTooltip({ visible: true, x: 0, y: 0, name: s.name, value: s.value })
            }
            onMouseMove={handleMove}
            onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-cenit-800 dark:fill-white" style={{ fontSize: 14, fontWeight: 700 }}>
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="fill-cenit-400 dark:fill-cenit-300" style={{ fontSize: 10 }}>
          {totalLabel}
        </text>
      </svg>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-white dark:bg-cenit-800 border border-cenit-200 dark:border-cenit-700 rounded-xl px-3 py-2 text-xs shadow-lg pointer-events-none z-10"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold text-cenit-800 dark:text-white">{tooltip.name}</div>
          <div className="text-cenit-400 dark:text-cenit-300">{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
