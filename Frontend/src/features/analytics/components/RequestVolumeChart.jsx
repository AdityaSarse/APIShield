import { Activity, TrendingUp } from "lucide-react";
import { useDailyRequestAnalytics } from "../hooks/useAnalytics";

function RequestVolumeChart() {
  const { data, isLoading, isError } = useDailyRequestAnalytics();

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
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
            Request Volume
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

        {!isLoading && !isError && visibleRows.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-3 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span className="text-[10px] font-bold text-[#4F46E5]">
              {totalRequests.toLocaleString()} total requests
            </span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-6 flex h-[260px] items-end gap-3">
          {[40, 65, 30, 85, 50, 75, 60, 90, 45, 70].map((h, idx) => (
            <div
              key={idx}
              style={{ height: `${h}%` }}
              className="flex-1 animate-pulse rounded-t-lg bg-[#E4E4E7]"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-6 flex h-[260px] items-center justify-center rounded-2xl bg-red-50 text-sm font-medium text-red-600">
          Unable to load request volume analytics.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && visibleRows.length === 0 && (
        <div className="flex h-[260px] flex-col items-center justify-center text-center">
          <Activity className="h-7 w-7 text-[#A1A1AA]" />
          <p className="mt-3 text-sm font-semibold text-[#18181B]">
            No traffic recorded
          </p>
          <p className="mt-1 text-xs text-[#71717A]">
            Requests to your API gateway will appear here over time.
          </p>
        </div>
      )}

      {/* Bar Chart Display */}
      {!isLoading && !isError && visibleRows.length > 0 && (
        <div className="mt-6">
          <div className="flex h-[260px] items-end gap-2 sm:gap-3">
            {visibleRows.map((item) => {
              const allowed = Number(item.allowed ?? item.count ?? 0);
              const rejected = Number(item.rejected ?? 0);

              const allowedH = Math.max(5, (allowed / maxCount) * 100);
              const rejectedH = Math.max(rejected > 0 ? 3 : 0, (rejected / maxCount) * 100);

              const dateStr = new Date(item.date).toLocaleDateString("en-US", {
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
                    {dateStr}
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

export default RequestVolumeChart;
