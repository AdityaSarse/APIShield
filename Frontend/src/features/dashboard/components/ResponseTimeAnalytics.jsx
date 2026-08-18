import { Clock3, Activity, Zap } from "lucide-react";
import { useResponseTimeAnalytics } from "../hooks/useDashboardAnalytics";
import ImpactBadge from "../../../components/ui/ImpactBadge";

function ResponseTimeAnalytics() {
  const { data, isLoading, isError } = useResponseTimeAnalytics();

  const metrics = data?.data ?? null;

  const avg = Number(metrics?.averageResponseTime ?? 0).toFixed(0);
  const min = Number(metrics?.minimumResponseTime ?? 0).toFixed(0);
  const max = Number(metrics?.maximumResponseTime ?? 0).toFixed(0);
  const p50 = Number(metrics?.p50 ?? metrics?.p50ResponseTime ?? 0).toFixed(0);
  const p95 = Number(metrics?.p95 ?? metrics?.p95ResponseTime ?? 0).toFixed(0);
  const p99 = Number(metrics?.p99 ?? metrics?.p99ResponseTime ?? 0).toFixed(0);

  if (isLoading) {
    return (
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-[#F4F4F5]" />
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#F4F4F5]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[22px] border border-dashed border-red-200 bg-red-50 text-sm font-semibold text-red-500 h-full">
        Unable to load response time latency analytics.
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full flex flex-col justify-between">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#F1F3F5] pb-4">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[#18181B]" />
          <div>
            <h3 className="text-base font-extrabold text-[#18181B]">
              Response Time &amp; Percentiles
            </h3>
            <p className="mt-0.5 text-xs text-[#71717A]">
              Gateway latency statistics &amp; outlier metrics
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
          <Zap className="h-3 w-3 text-[#4F46E5]" />
          P95/P99 Tracked
        </span>
      </div>

      {/* ── Metric Grid ─────────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Average */}
        <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
          <p className="text-[10px] font-semibold text-[#71717A]">Average</p>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#18181B]">
            {avg}
            <span className="ml-1 text-xs text-[#71717A]">ms</span>
          </p>
        </div>

        {/* Minimum */}
        <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
          <p className="text-[10px] font-semibold text-[#71717A]">Minimum</p>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#18181B]">
            {min}
            <span className="ml-1 text-xs text-[#71717A]">ms</span>
          </p>
        </div>

        {/* P50 Median */}
        <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
          <p className="text-[10px] font-semibold text-[#71717A]">P50 (Median)</p>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#18181B]">
            {p50}
            <span className="ml-1 text-xs text-[#71717A]">ms</span>
          </p>
        </div>

        {/* P95 */}
        <div className="rounded-2xl bg-[#FEF3C7]/40 p-3.5 border border-[#FCD34D]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#D97706]">P95</p>
            <ImpactBadge value={Number(p95)} type="latency" />
          </div>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#92400E]">
            {p95}
            <span className="ml-1 text-xs text-[#B45309]">ms</span>
          </p>
        </div>

        {/* P99 */}
        <div className="rounded-2xl bg-[#FEF3C7]/40 p-3.5 border border-[#FCD34D]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#D97706]">P99</p>
            <ImpactBadge value={Number(p99)} type="latency" />
          </div>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#92400E]">
            {p99}
            <span className="ml-1 text-xs text-[#B45309]">ms</span>
          </p>
        </div>

        {/* Maximum */}
        <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
          <p className="text-[10px] font-semibold text-[#71717A]">Maximum</p>
          <p className="mt-1.5 font-mono text-xl font-extrabold text-[#18181B]">
            {max}
            <span className="ml-1 text-xs text-[#71717A]">ms</span>
          </p>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F1F3F5] pt-3">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#A1A1AA]" />
          <span className="text-[10px] text-[#71717A]">Measured requests</span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[#18181B]">
          {Number(metrics?.totalRequests ?? 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default ResponseTimeAnalytics;
