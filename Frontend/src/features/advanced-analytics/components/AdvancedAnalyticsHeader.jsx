import { LineChart, Calendar, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function AdvancedAnalyticsHeader({ timeRange, setTimeRange }) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["analytics"] });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] shadow-2xs">
          <LineChart className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
            Advanced Analytics
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Deep endpoint metrics, latency percentiles, error concentrations &amp; traffic trends
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Time range selector pills */}
        <div className="flex items-center rounded-full border border-[#EBECEF] bg-[#F8F9FA] p-1 shadow-2xs">
          {["today", "7d", "30d"].map((range) => {
            const label =
              range === "today" ? "Today" : range === "7d" ? "Last 7 Days" : "Last 30 Days";
            const active = timeRange === range;

            return (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  active
                    ? "bg-white text-[#18181B] shadow-2xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#EBECEF] bg-white px-3.5 text-xs font-semibold text-[#18181B] shadow-2xs transition hover:bg-[#F8F9FA] active:scale-95 disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-[#71717A] ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}

export default AdvancedAnalyticsHeader;
