import { Sliders, CheckCircle2, XCircle } from "lucide-react";

function AlgorithmCard({ algorithm }) {
  const {
    name,
    tagline,
    badgeText,
    limitText,
    utilization,
    allowedCount,
    rejectedCount,
    status = "Active",
  } = algorithm;

  const getProgressColor = (val) => {
    if (val >= 80) return "bg-[#D97706]";
    if (val >= 95) return "bg-[#DC2626]";
    return "bg-[#18181B]";
  };

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center text-[#18181B]">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#18181B]">{name}</h4>
              <p className="text-[10px] text-[#71717A] font-medium">{tagline}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              status === "Throttled"
                ? "bg-[#FEE2E2] text-[#B91C1C]"
                : "bg-[#DCFCE7] text-[#15803D]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                status === "Throttled" ? "bg-[#B91C1C]" : "bg-[#15803D]"
              }`}
            />
            {status}
          </span>
        </div>

        {/* Limit Details */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-[#71717A] text-[11px] font-medium">{badgeText}</span>
          <span className="font-mono font-bold text-[#18181B] text-[11px]">{limitText}</span>
        </div>

        {/* Utilization Bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-medium text-[#71717A]">Capacity Utilization</span>
            <span className="font-mono font-extrabold text-xs text-[#18181B]">
              {utilization}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-[#F4F4F5] overflow-hidden p-0.5 border border-[#EBECEF]">
            <div
              style={{ width: `${utilization}%` }}
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(utilization)}`}
            />
          </div>
        </div>
      </div>

      {/* Allowed vs Rejected Footer */}
      <div className="mt-4 pt-3 border-t border-[#F1F3F5] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-[#15803D]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Allowed: {allowedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-[#B91C1C]">
          <XCircle className="h-3.5 w-3.5" />
          <span>Rejected: {rejectedCount}</span>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmCard;
