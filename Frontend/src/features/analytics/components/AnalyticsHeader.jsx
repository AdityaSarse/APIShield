import { BarChart3, Calendar, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function AnalyticsHeader() {
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
        <div className="h-10 w-10 rounded-2xl bg-[#F4F4F5] border border-[#EBECEF] flex items-center justify-center text-[#18181B] shadow-2xs">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Detailed API traffic and performance analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBECEF] bg-white text-xs font-semibold text-[#18181B] shadow-2xs">
          <Calendar className="h-3.5 w-3.5 text-[#71717A]" />
          <span>Last 30 days</span>
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

export default AnalyticsHeader;
