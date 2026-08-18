import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

/**
 * ErrorRateGauge — an arc gauge for error rate.
 *
 * Props:
 *   errorRate  {number}  Current error rate percentage (0–100).
 *
 * Uses recharts RadialBarChart. No data-fetching — reads errorRate prop only.
 * Color sweeps: green (0%) → amber (5%) → red (≥10%).
 */
function ErrorRateGauge({ errorRate = 0 }) {
  const clamped = Math.min(Math.max(Number(errorRate), 0), 100);

  // Arc color based on severity
  const arcColor =
    clamped === 0
      ? "#16A34A"
      : clamped < 5
      ? "#D97706"
      : "#DC2626";

  // Background arc always full (100) in a light gray
  const data = [{ value: clamped, fill: arcColor }];

  // Text color for the center number
  const textColor =
    clamped === 0 ? "#16A34A" : clamped < 5 ? "#D97706" : "#DC2626";

  return (
    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height={160}>
        <RadialBarChart
          cx="50%"
          cy="80%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={14}
          data={data}
        >
          {/* Background track */}
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          {/* Grey background arc */}
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: "#F4F4F5" }}
            isAnimationActive
            animationDuration={800}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center label — sits on top of the arc */}
      <div className="absolute bottom-4 flex flex-col items-center">
        <span
          className="font-mono text-4xl font-extrabold leading-none"
          style={{ color: textColor }}
        >
          {clamped.toFixed(1)}
        </span>
        <span className="mt-0.5 text-xs font-semibold text-[#A1A1AA]">% error rate</span>
      </div>
    </div>
  );
}

export default ErrorRateGauge;
