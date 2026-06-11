import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from "recharts";
import { motion } from "motion/react";

interface DataPoint {
  year: string;
  historical: number | null;
  forecast: number | null;
  showLabel: boolean;
}

interface ChartDataset {
  data: DataPoint[];
  domain: [number, number];
  summary: { current: number; forecast2028: number };
}

export interface FinancialRiskChartProps {
  modelType: "cnn" | "fuzzy-cnn";
  chartIndex?: number;
  companyCode?: string;
  year?: string;
}

const THRESHOLDS = {
  cnn:         { healthy: 0.390, warning: 0.465 },
  "fuzzy-cnn": { healthy: 0.404, warning: 0.475 },
};

// ── CNN datasets (STK=0, PLX=1, MCP=2) ──────────────────────────────────
const CNN_DATASETS: ChartDataset[] = [
  {
    domain: [0.28, 0.49],
    summary: { current: 0.336, forecast2028: 0.355 },
    data: [
      { year: "2023", historical: 0.343, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.336, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.336, forecast: 0.336, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.372, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.352, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.355, showLabel: true  },
    ],
  },
  {
    domain: [0.32, 0.50],
    summary: { current: 0.400, forecast2028: 0.357 },
    data: [
      { year: "2023", historical: 0.390, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.420, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.400, forecast: 0.400, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.383, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.355, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.357, showLabel: true  },
    ],
  },
  {
    domain: [0.36, 0.56],
    summary: { current: 0.426, forecast2028: 0.375 },
    data: [
      { year: "2023", historical: 0.433, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.425, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.426, forecast: 0.426, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.488, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.378, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.375, showLabel: true  },
    ],
  },
];

// ── Fuzzy-CNN datasets (STK=0, PLX=1, MCP=2) ────────────────────────────
const FUZZY_DATASETS: ChartDataset[] = [
  {
    domain: [0.30, 0.50],
    summary: { current: 0.356, forecast2028: 0.421 },
    data: [
      { year: "2023", historical: 0.357, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.371, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.356, forecast: 0.356, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.424, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.417, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.421, showLabel: true  },
    ],
  },
  {
    domain: [0.35, 0.52],
    summary: { current: 0.435, forecast2028: 0.420 },
    data: [
      { year: "2023", historical: 0.430, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.410, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.435, forecast: 0.435, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.428, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.413, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.420, showLabel: true  },
    ],
  },
  {
    domain: [0.41, 0.57],
    summary: { current: 0.487, forecast2028: 0.434 },
    data: [
      { year: "2023", historical: 0.466, forecast: null,  showLabel: false },
      { year: "2024", historical: 0.466, forecast: null,  showLabel: false },
      { year: "2025", historical: 0.487, forecast: 0.487, showLabel: false },
      { year: "2026", historical: null,  forecast: 0.479, showLabel: true  },
      { year: "2027", historical: null,  forecast: 0.460, showLabel: true  },
      { year: "2028", historical: null,  forecast: 0.434, showLabel: true  },
    ],
  },
];

function getZoneStatus(value: number, healthy: number, warning: number): { label: string; color: string } {
  if (value < healthy)  return { label: "Healthy", color: "#10B981" };
  if (value < warning)  return { label: "Warning", color: "#F59E0B" };
  return                       { label: "Risk",    color: "#EF4444" };
}

function generateTicks(min: number, max: number, step = 0.025): number[] {
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max + 1e-9; v += step) {
    ticks.push(parseFloat(v.toFixed(3)));
  }
  return ticks;
}

function CustomTooltip({ active, payload, label, healthy, warning }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload.find((p: any) => p.value != null);
  if (!entry) return null;
  const score = Number(entry.value);
  const { label: statusLabel, color: statusColor } = getZoneStatus(score, healthy, warning);
  const isForecast = entry.dataKey === "forecast";
  return (
    <div style={{ background: "rgba(10,10,10,0.96)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", boxShadow: "0 10px 36px rgba(0,0,0,0.7)", minWidth: 170 }}>
      <div style={{ color: "#6B7280", fontSize: 11, marginBottom: 5, letterSpacing: "0.05em" }}>
        {label} · {isForecast ? "FORECAST" : "OBSERVED"}
      </div>
      <div style={{ color: "#FFF", fontSize: 13, marginBottom: 2 }}>
        Status: <span style={{ color: statusColor, fontWeight: 700 }}>{statusLabel}</span>
      </div>
      <div style={{ color: "#FFF", fontSize: 13 }}>
        IF Score: <span style={{ color: statusColor, fontWeight: 700 }}>{score.toFixed(3)}</span>
      </div>
    </div>
  );
}

function HistoricalDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.historical == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8}   fill="#3B82F6" fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4.5} fill="#3B82F6" stroke="#93C5FD" strokeWidth={1.5} />
    </g>
  );
}

function makeForecastDot(healthy: number, warning: number) {
  return function ForecastDot(props: any) {
    const { cx, cy, payload } = props;
    if (payload.forecast == null) return null;
    const { label: statusLabel, color: statusColor } = getZoneStatus(payload.forecast, healthy, warning);
    const show = payload.showLabel;
    return (
      <g>
        <circle cx={cx} cy={cy} r={9}   fill={statusColor} fillOpacity={0.22} />
        <circle cx={cx} cy={cy} r={5}   fill={statusColor} stroke="#111111" strokeWidth={1.5} />
        {show && (
          <text x={cx + 9} y={cy - 7} fill={statusColor} fontSize={11} fontWeight="700"
            style={{ userSelect: "none", fontFamily: "Inter, sans-serif" }}>
            {statusLabel}
          </text>
        )}
      </g>
    );
  };
}

function ChartLegend() {
  const items = [
    { symbol: <div style={{ width: 26, height: 2.5, background: "#3B82F6", borderRadius: 2 }} />, label: "Observed" },
    { symbol: <div style={{ width: 26, height: 2.5, background: "repeating-linear-gradient(90deg,#F59E0B 0,#F59E0B 5px,transparent 5px,transparent 9px)" }} />, label: "Forecast (2026–2028)" },
    { symbol: <div style={{ width: 13, height: 10, background: "rgba(16,185,129,0.35)", borderRadius: 2, border: "1px solid rgba(16,185,129,0.5)" }} />, label: "Healthy" },
    { symbol: <div style={{ width: 13, height: 10, background: "rgba(245,158,11,0.35)", borderRadius: 2, border: "1px solid rgba(245,158,11,0.5)" }} />, label: "Warning" },
    { symbol: <div style={{ width: 13, height: 10, background: "rgba(239,68,68,0.35)", borderRadius: 2, border: "1px solid rgba(239,68,68,0.5)" }} />, label: "Risk" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 px-6 pb-3" style={{ marginTop: 2 }}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.symbol}
          <span style={{ color: "#9CA3AF", fontSize: 12 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function FinancialRiskChart({
  modelType,
  chartIndex = 0,
  companyCode = "{{COMPANY_CODE}}",
  year = "{{SELECTED_YEAR}}",
}: FinancialRiskChartProps) {
  const datasets  = modelType === "cnn" ? CNN_DATASETS : FUZZY_DATASETS;
  const idx       = Math.min(Math.max(chartIndex, 0), 2);
  const { data, domain, summary } = datasets[idx];
  const { healthy, warning }      = THRESHOLDS[modelType];
  const chartLabel  = modelType === "cnn" ? "[2.1] CNN Only" : "[2.2] Fuzzy-CNN";
  const { label: projStatus, color: projColor } = getZoneStatus(summary.forecast2028, healthy, warning);
  const ForecastDot = makeForecastDot(healthy, warning);
  const ticks = generateTicks(domain[0], domain[1]);

  return (
    <motion.div key={`${modelType}-${idx}`} className="rounded-2xl overflow-hidden"
      style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)" }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

      <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#FF3B3B", boxShadow: "0 0 6px #FF3B3B" }} />
            <span style={{ color: "#E5E7EB", fontSize: 14, fontWeight: 600 }}>
              Financial Risk Trajectory — {chartLabel}
            </span>
          </div>
          <p style={{ color: "#4B5563", fontSize: 12, marginTop: 2 }}>
            {companyCode} · {modelType === "cnn" ? "CNN" : "Fuzzy-CNN"} · IF Risk Score · {year}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280" }}>
          2023–2028
        </span>
      </div>

      <div className="pt-5 pb-1 px-2">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={data} margin={{ top: 16, right: 90, bottom: 28, left: 54 }}>
            <ReferenceArea y1={warning}           y2={domain[1] + 0.05} fill="rgba(239,68,68,0.10)"    ifOverflow="hidden" />
            <ReferenceArea y1={healthy}           y2={warning}          fill="rgba(245,158,11,0.10)"   ifOverflow="hidden" />
            <ReferenceArea y1={domain[0] - 0.05} y2={healthy}          fill="rgba(16,185,129,0.12)"   ifOverflow="hidden" />
            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.12)" tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false}
              label={{ value: "Year", position: "insideBottomRight", offset: -2, fill: "#4B5563", fontSize: 12 }} />
            <YAxis domain={domain} ticks={ticks} stroke="rgba(255,255,255,0.08)"
              tick={{ fill: "#6B7280", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={(v: number) => v.toFixed(3)}
              label={{ value: "IF Risk Score", angle: -90, position: "insideLeft", offset: -14, fill: "#6B7280", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip healthy={healthy} warning={warning} />}
              cursor={{ stroke: "rgba(255,255,255,0.07)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <ReferenceLine y={warning} stroke="rgba(239,68,68,0.6)" strokeDasharray="6 4" strokeWidth={1}
              label={{ value: `Risk  ${warning.toFixed(3)}`, position: "right", fill: "rgba(239,68,68,0.75)", fontSize: 10 }} />
            {healthy >= domain[0] && (
              <ReferenceLine y={healthy} stroke="rgba(245,158,11,0.6)" strokeDasharray="6 4" strokeWidth={1}
                label={{ value: `Warning  ${healthy.toFixed(3)}`, position: "right", fill: "rgba(245,158,11,0.75)", fontSize: 10 }} />
            )}
            <ReferenceLine x="2025" stroke="rgba(255,255,255,0.14)" strokeDasharray="4 4" strokeWidth={1.5} />
            <Line dataKey="historical" stroke="#3B82F6" strokeWidth={2.5}
              dot={<HistoricalDot />} activeDot={{ r: 6, fill: "#60A5FA", stroke: "#93C5FD", strokeWidth: 2 }}
              connectNulls={false} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out" name="Observed" />
            <Line dataKey="forecast" stroke="#F59E0B" strokeWidth={2.5} strokeDasharray="8 5"
              dot={<ForecastDot />} activeDot={{ r: 6, fill: "#FCD34D", stroke: "#FDE68A", strokeWidth: 2 }}
              connectNulls={true} isAnimationActive={true} animationDuration={1300} animationEasing="ease-out" name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <ChartLegend />

      <div className="px-6 py-4 border-t grid grid-cols-3 gap-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "Current Score (2025)",  value: summary.current.toFixed(3),      color: "#F59E0B" },
          { label: "Forecast Score (2028)", value: summary.forecast2028.toFixed(3),  color: projColor },
          { label: "Projected Status",       value: projStatus,                       color: projColor },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div style={{ color: "#4B5563", fontSize: 11, marginBottom: 3 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}