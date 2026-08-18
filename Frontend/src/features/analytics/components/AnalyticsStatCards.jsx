import { Activity, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useAnalyticsSummary } from "../hooks/useAnalytics";

function AnalyticsStatCards() {
  const { data, isLoading, isError } = useAnalyticsSummary();

  const summary = data?.data ?? {};

  const totalRequests = Number(summary.totalRequests ?? 0);
  const successfulRequests = Number(summary.successfulRequests ?? 0);
  const failedRequests = Number(summary.failedRequests ?? 0);
  const avgResponseTime = Number(
    summary.averageResponseTime ?? summary.responseTime ?? summary.avgResponseTime ?? 0
  );

  const successRate =
    totalRequests > 0
      ? ((successfulRequests / totalRequests) * 100).toFixed(1)
      : "100.0";

  const errorRate =
    totalRequests > 0
      ? ((failedRequests / totalRequests) * 100).toFixed(2)
      : "0.00";

  const cards = [
    {
      title: "Total Requests",
      value: isLoading ? "—" : totalRequests.toLocaleString(),
      subtitle: "Lifetime gateway calls",
      icon: Activity,
      iconColor: "text-[#18181B]",
      iconBg: "bg-[#F4F4F5]",
    },
    {
      title: "Success Rate",
      value: isLoading ? "—" : `${successRate}%`,
      subtitle: `${successfulRequests.toLocaleString()} 2xx/3xx requests`,
      icon: CheckCircle2,
      iconColor: "text-[#15803D]",
      iconBg: "bg-[#DCFCE7]",
    },
    {
      title: "Error Rate",
      value: isLoading ? "—" : `${errorRate}%`,
      subtitle: `${failedRequests.toLocaleString()} 4xx/5xx requests`,
      icon: AlertTriangle,
      iconColor: Number(errorRate) > 0 ? "text-[#B91C1C]" : "text-[#71717A]",
      iconBg: Number(errorRate) > 0 ? "bg-[#FEE2E2]" : "bg-[#F4F4F5]",
    },
    {
      title: "Avg Response Time",
      value: isLoading ? "—" : `${avgResponseTime.toFixed(0)} ms`,
      subtitle: "Gateway roundtrip latency",
      icon: Clock,
      iconColor: "text-[#18181B]",
      iconBg: "bg-[#F4F4F5]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs transition hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717A] tracking-tight">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>

            {isLoading ? (
              <div className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-[#F4F4F5]" />
            ) : isError ? (
              <div className="mt-3 text-xs text-red-500 font-semibold">Error</div>
            ) : (
              <p className="mt-2 font-mono text-2xl font-extrabold text-[#18181B]">
                {card.value}
              </p>
            )}

            <p className="mt-1 text-[10px] font-medium text-[#A1A1AA]">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AnalyticsStatCards;
