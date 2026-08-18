import { Activity, TrendingUp } from "lucide-react";
import { useDailyRequestAnalytics } from "../hooks/useAdvancedAnalytics";

function TrafficTrends({ timeRange }) {
  const { data, isLoading, isError } = useDailyRequestAnalytics();

  const raw = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const daysToKeep = timeRange === "today" ? 1 : timeRange === "7d" ? 7 : 30;
  const visibleRows = raw.slice(-daysToKeep);

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
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
            Traffic Trends
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Allowed vs Rejected traffic progression ({timeRange === "today" ? "Today" : timeRange === "7d" ? "Last 7 Days" : "Last 30 Days"})
          </p>
        </div>

        {!isLoading && !isError && visibleRows.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#EEF2FF] px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-[#4F46E5]" />
            <span className="text-[10px] font-bold text-[#4F46E5]">
              {totalRequests.toLocaleString()} requests
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-6 flex h-[220px] items-end gap-3">
          {[40, 65, 30, 85, 50, 75, 60].map((h, idx) => (
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
        <div className="mt-6 flex h-[220px] items-center justify-center rounded-2xl bg-red-50 text-sm font-medium text-red-600">
          Unable to load traffic trends.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && visibleRows.length === 0 && (
        <div className="flex h-[220px] flex-col items-center justify-center text-center">
          <Activity className="h-6 w-6 text-[#A1A1AA]" />
          <p className="mt-2 text-sm font-semibold text-[#18181B]">
            No traffic recorded for this period
          </p>
        </div>
      )}

      {/* Bar Chart */}
      {!isLoading && !isError && visibleRows.length > 0 && (
        <div className="mt-6">
          <div className="flex h-[220px] items-end gap-2 sm:gap-3">
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
                      className="w-4 rounded-t-md bg-[#4F46E5] transition-all duration-300 group-hover:bg-[#4338CA]"
                    />
                    {rejected > 0 && (
                      <div
                        title={`Rejected: ${rejected.toLocaleString()}`}
                        style={{ height: `${rejectedH}%` }}
                        className="w-4 rounded-t-md bg-[#93C5FD] transition-all duration-300 group-hover:opacity-80"
                      />
                    )}
                  </div>

                  <span className="mt-2 truncate text-center text-[10px] font-semibold text-[#71717A]">
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

export default TrafficTrends;
