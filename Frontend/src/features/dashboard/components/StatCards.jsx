import { Folder, CheckCircle, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";
import { useDashboardSummary } from "../hooks/useDashboardAnalytics";
import ImpactBadge from "../../../components/ui/ImpactBadge";

function StatCards() {
  const { data, isLoading, isError } = useDashboardSummary();
  const summary = data?.data;

  const errorRate = summary && summary.totalRequests > 0
    ? (summary.failedRequests / summary.totalRequests) * 100
    : 0;

  const avgLatency = Number(summary?.averageResponseTime ?? 0);

  const stats = [
    {
      id: "total",
      label: "Total Requests",
      value: summary?.totalRequests ?? 0,
      display: isLoading ? "—" : (summary?.totalRequests ?? 0).toLocaleString(),
      icon: Folder,
      badgeText: "Requests",
      badgeStyle: "bg-[#F4F4F5] text-[#18181B]",
      sub: "All-time gateway calls",
    },
    {
      id: "allowed",
      label: "Allowed Requests",
      value: summary?.successfulRequests ?? 0,
      display: isLoading ? "—" : (summary?.successfulRequests ?? 0).toLocaleString(),
      icon: CheckCircle,
      badgeText: "Success",
      badgeStyle: "bg-[#DCFCE7] text-[#15803D]",
      sub: "2xx / 3xx responses",
    },
    {
      id: "rejected",
      label: "Rejected Requests",
      value: summary?.failedRequests ?? 0,
      display: isLoading ? "—" : (summary?.failedRequests ?? 0).toLocaleString(),
      icon: AlertTriangle,
      badgeText: "Errors",
      badgeStyle: "bg-[#FEE2E2] text-[#B91C1C]",
      sub: "4xx / 5xx responses",
    },
    {
      id: "latency",
      label: "Avg Latency",
      value: avgLatency,
      display: isLoading ? "—" : `${avgLatency.toFixed(0)}ms`,
      icon: Clock,
      badgeText: "Live",
      badgeStyle: "bg-[#F4F4F5] text-[#18181B]",
      sub: "Gateway roundtrip",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs transition-all hover:shadow-md hover:-translate-y-0.5 duration-150"
          >
            {/* Top row: label + icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717A] tracking-tight">
                {stat.label}
              </span>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5 text-[#A1A1AA]" />
              </div>
            </div>

            {/* Hero number */}
            <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-[#111111]">
              {stat.display}
            </div>

            {/* Sub label + badge row */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-medium text-[#A1A1AA]">
                {stat.sub}
              </span>
              {/* Impact badge for relevant cards */}
              {stat.id === "rejected" && !isLoading ? (
                <ImpactBadge value={errorRate} type="errorRate" />
              ) : stat.id === "latency" && !isLoading ? (
                <ImpactBadge value={avgLatency} type="latency" />
              ) : (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${stat.badgeStyle}`}>
                  {stat.badgeText}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {isError && (
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
          Unable to load analytics data. Check that the APIShield backend is
          running and your access token is valid.
        </div>
      )}
    </div>
  );
}

export default StatCards;
