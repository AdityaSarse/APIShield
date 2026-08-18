import { Folder, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useDashboardSummary } from "../hooks/useDashboardAnalytics";

function StatCards() {
  const { data, isLoading, isError } = useDashboardSummary();
  const summary = data?.data;

  const stats = [
    {
      id: "total",
      label: "Total Requests",
      value: summary?.totalRequests ?? 0,
      icon: Folder,
      badgeText: isLoading ? "Loading..." : "Requests",
      badgeStyle: "bg-[#EEF2FF] text-[#4F46E5]",
    },
    {
      id: "allowed",
      label: "Allowed Requests",
      value: summary?.successfulRequests ?? 0,
      icon: CheckCircle,
      badgeText: isLoading ? "Loading..." : "Success",
      badgeStyle: "bg-[#DCFCE7] text-[#15803D]",
    },
    {
      id: "rejected",
      label: "Rejected Requests",
      value: summary?.failedRequests ?? 0,
      icon: AlertTriangle,
      badgeText: isLoading ? "Loading..." : "Errors",
      badgeStyle: "bg-[#FEE2E2] text-[#B91C1C]",
    },
    {
      id: "latency",
      label: "Avg Latency",
      value: `${Number(summary?.averageResponseTime ?? 0).toFixed(0)}ms`,
      icon: Clock,
      badgeText: isLoading ? "Loading..." : "Live",
      badgeStyle: "bg-[#EEF2FF] text-[#4F46E5]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EBECEF] bg-[#F8F9FA] text-[#18181B] shadow-2xs">
                <Icon className="h-4 w-4 text-[#18181B]" />
              </div>

              <span className="text-xs font-semibold text-[#71717A]">
                {stat.label}
              </span>
            </div>

            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-extrabold tracking-tight text-[#18181B]">
                {isLoading ? "—" : stat.value}
              </span>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${stat.badgeStyle}`}
              >
                {stat.badgeText}
              </span>
            </div>
          </div>
        );
      })}

      {isError && (
        <div className="col-span-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
          Unable to load analytics data. Check that the APIShield backend is
          running and your access token is valid.
        </div>
      )}
    </div>
  );
}

export default StatCards;
