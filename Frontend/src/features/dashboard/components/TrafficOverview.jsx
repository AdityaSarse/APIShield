import { Activity, TrendingUp, ChevronDown, Download } from "lucide-react";
import { useDailyRequestAnalytics } from "../hooks/useDashboardAnalytics";

function TrafficOverview() {
  const { data, isLoading, isError } = useDailyRequestAnalytics();

  // The API returns an array directly — support both shapes
  const raw = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const visibleRows = raw.slice(-30);

  const totalRequests = visibleRows.reduce(
    (sum, item) => sum + Number(item.count || item.allowed || 0),
    0
  );

  const maxCount = Math.max(
    ...visibleRows.map((item) =>
      Math.max(
        Number(item.count || 0),
        Number(item.allowed || 0),
        Number(item.rejected || 0)
      )
    ),
    1
  );

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
            Traffic Over Time
          </h3>
          <div className="flex items-center gap-4 mt-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-[#71717A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
              <span>Allowed Traffic</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-[#71717A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#93C5FD]" />
              <span>Rejected Traffic</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLoading && !isError && visibleRows.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-2.5 py-1">
              <TrendingUp className="h-3 w-3 text-[#4F46E5]" />
              <span className="text-[10px] font-bold text-[#4F46E5]">
                {totalRequests.toLocaleString()} requests
              </span>
            </div>
          )}

          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full border border-[#EBECEF] bg-white text-xs font-semibold text-[#18181B] flex items-center gap-1.5 hover:bg-[#F8F9FA] transition-all cursor-pointer shadow-2xs"
          >
            <span>Last 30 days</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#71717A]" />
          </button>

          <button
            type="button"
            aria-label="Export Chart"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EBECEF] bg-white text-[#71717A] shadow-2xs transition hover:bg-[#F8F9FA] hover:text-[#18181B]"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Loading skeleton ────────────────────────────────────────── */}
      {isLoading && (
        <div className="mt-6 flex h-[260px] items-end gap-3">
          {[35, 55, 42, 70, 48, 80, 60, 75, 45, 65].map((height, index) => (
            <div
              key={index}
              style={{ height: `${height}%` }}
              className="flex-1 animate-pulse rounded-t-lg bg-[#E4E4E7]"
            />
          ))}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {isError && (
        <div className="mt-6 flex h-[260px] items-center justify-center rounded-2xl bg-red-50 text-sm font-medium text-red-600">
          Unable to load traffic analytics.
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!isLoading && !isError && visibleRows.length === 0 && (
        <div className="flex h-[260px] flex-col items-center justify-center text-center">
          <Activity className="h-7 w-7 text-[#A1A1AA]" />
          <p className="mt-3 text-sm font-semibold text-[#18181B]">
            No traffic data yet
          </p>
          <p className="mt-1 text-xs text-[#71717A]">
            Gateway requests will appear here once traffic is received.
          </p>
        </div>
      )}

      {/* ── Bar chart ───────────────────────────────────────────────── */}
      {!isLoading && !isError && visibleRows.length > 0 && (
        <div className="mt-6">
          <div className="flex h-[260px] items-end gap-2 sm:gap-3">
            {visibleRows.map((item) => {
              // Support both {count} (simple) and {allowed, rejected} shapes
              const allowed  = Number(item.allowed  ?? item.count ?? 0);
              const rejected = Number(item.rejected ?? 0);

              const allowedH  = Math.max(5, (allowed  / maxCount) * 100);
              const rejectedH = Math.max(rejected > 0 ? 3 : 0, (rejected / maxCount) * 100);

              const date = new Date(item.date);
              const label = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={item.date}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div className="flex h-full items-end justify-center gap-0.5">
                    <div
                      title={`Allowed: ${allowed.toLocaleString()}`}
                      style={{ height: `${allowedH}%` }}
                      className="w-3 rounded-t-md bg-[#4F46E5] transition-all duration-300 group-hover:bg-[#4338CA]"
                    />
                    {rejected > 0 && (
                      <div
                        title={`Rejected: ${rejected.toLocaleString()}`}
                        style={{ height: `${rejectedH}%` }}
                        className="w-3 rounded-t-md bg-[#93C5FD] transition-all duration-300 group-hover:opacity-80"
                      />
                    )}
                  </div>

                  <span className="mt-2 truncate text-center text-[9px] font-medium text-[#A1A1AA]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrafficOverview;
