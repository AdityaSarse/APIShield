/**
 * ImpactBadge — a small colour-coded severity pill.
 *
 * Props:
 *   value  {number}  The numeric value to evaluate.
 *   type   {"latency" | "errorRate" | "utilization"}  Determines thresholds.
 *   className {string?}  Optional extra classes.
 *
 * No data-fetching. Purely presentational.
 */
function ImpactBadge({ value, type, className = "" }) {
  const num = Number(value ?? 0);

  let label = "";
  let style = "";

  if (type === "latency") {
    if (num < 100) {
      label = "Low";
      style = "bg-[#DCFCE7] text-[#15803D]";
    } else if (num < 500) {
      label = "Medium";
      style = "bg-[#FEF3C7] text-[#B45309]";
    } else {
      label = "High";
      style = "bg-[#FEE2E2] text-[#B91C1C]";
    }
  } else if (type === "errorRate") {
    if (num === 0) {
      label = "Healthy";
      style = "bg-[#DCFCE7] text-[#15803D]";
    } else if (num < 5) {
      label = "Elevated";
      style = "bg-[#FEF3C7] text-[#B45309]";
    } else {
      label = "Critical";
      style = "bg-[#FEE2E2] text-[#B91C1C]";
    }
  } else if (type === "utilization") {
    if (num < 80) {
      label = "OK";
      style = "bg-[#DCFCE7] text-[#15803D]";
    } else if (num < 100) {
      label = "High";
      style = "bg-[#FEF3C7] text-[#B45309]";
    } else {
      label = "Throttled";
      style = "bg-[#FEE2E2] text-[#B91C1C]";
    }
  }

  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none ${style} ${className}`}
    >
      {label}
    </span>
  );
}

export default ImpactBadge;
