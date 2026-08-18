import {
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useErrorRateAnalytics } from "../hooks/useDashboardAnalytics";
import ErrorRateGauge from "./ErrorRateGauge";
import ImpactBadge from "../../../components/ui/ImpactBadge";

// ── helpers ───────────────────────────────────────────────────────────────────

function getRateMeta(errorRate) {
  if (errorRate === 0) {
    return {
      label: "Healthy",
      badge: "bg-[#DCFCE7] text-[#15803D]",
      dot: "bg-[#15803D]",
      icon: "text-[#15803D]",
      rateColor: "text-[#18181B]",
    };
  }
  if (errorRate < 5) {
    return {
      label: "Elevated",
      badge: "bg-[#FEF3C7] text-[#D97706]",
      dot: "bg-[#D97706]",
      icon: "text-[#D97706]",
      rateColor: "text-[#D97706]",
    };
  }
  return {
    label: "Critical",
    badge: "bg-[#FEE2E2] text-[#B91C1C]",
    dot: "bg-[#B91C1C]",
    icon: "text-[#B91C1C]",
    rateColor: "text-[#B91C1C]",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

function ErrorRate() {
  const { data, isLoading, isError } = useErrorRateAnalytics();

  const errorRate          = data?.data?.errorRate          ?? 0;
  const totalRequests      = data?.data?.totalRequests      ?? 0;
  const successfulRequests = data?.data?.successfulRequests ?? 0;
  const failedRequests     = data?.data?.failedRequests     ?? 0;
  const successRate        = 100 - errorRate;

  const rateMeta = getRateMeta(errorRate);

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full">
      {/* ── Card header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#18181B]" />
            <span>Error Rate</span>
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Request success &amp; failure breakdown
          </p>
        </div>

        {!isLoading && !isError && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${rateMeta.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${rateMeta.dot}`} />
            {rateMeta.label}
          </span>
        )}
      </div>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex h-48 items-center justify-center text-sm text-[#71717A]">
          Loading error analytics...
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {isError && (
        <div className="flex h-48 items-center justify-center text-sm font-semibold text-red-500">
          Unable to load error data.
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────── */}
      {!isLoading && !isError && (
        <>
          {/* ── Gauge hero ────────────────────────────────────────────────────── */}
          <ErrorRateGauge errorRate={errorRate} />

          {/* Error rate label row */}
          <div className="flex items-center justify-between mt-1 px-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-mono text-xl font-extrabold leading-none ${rateMeta.rateColor}`}>
                {errorRate.toFixed(2)}
              </span>
              <span className="font-mono text-sm font-bold text-[#71717A]">%</span>
            </div>
            <ImpactBadge value={errorRate} type="errorRate" />
          </div>

          {/* Success rate bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#71717A]">
              <span>Successful requests</span>
              <span className="font-mono">{successRate.toFixed(1)}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F4F4F5]">
              <div
                style={{ width: `${Math.min(successRate, 100)}%` }}
                className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
              />
            </div>
          </div>

          {/* Metric cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#EBECEF] bg-[#F8F9FA] p-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
                <span className="text-[10px] font-semibold text-[#71717A]">
                  Successful
                </span>
              </div>
              <p className="mt-2 font-mono text-lg font-extrabold text-[#18181B]">
                {successfulRequests.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-[#EBECEF] bg-[#F8F9FA] p-3.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-[#B91C1C]" />
                <span className="text-[10px] font-semibold text-[#71717A]">
                  Failed
                </span>
              </div>
              <p className="mt-2 font-mono text-lg font-extrabold text-[#18181B]">
                {failedRequests.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total footer */}
          <div className="mt-3 flex items-center justify-between border-t border-[#F1F3F5] pt-3">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#A1A1AA]" />
              <span className="text-[10px] font-medium text-[#71717A]">
                Total requests
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#18181B]">
              {totalRequests.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default ErrorRate;
