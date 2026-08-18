import { Layers, Activity, Zap } from "lucide-react";
import { useEndpointAnalytics } from "../hooks/useAdvancedAnalytics";

function getMethodStyle(method) {
  switch (method?.toUpperCase()) {
    case "GET":
      return "bg-[#DCFCE7] text-[#15803D]";
    case "POST":
      return "bg-[#EEF2FF] text-[#4F46E5]";
    case "PUT":
    case "PATCH":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "DELETE":
      return "bg-[#FEE2E2] text-[#B91C1C]";
    default:
      return "bg-[#F4F4F5] text-[#18181B]";
  }
}

function EndpointPerformance() {
  const { data, isLoading, isError } = useEndpointAnalytics();

  const endpoints = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#18181B]" />
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Endpoint Performance Analytics
            </h3>
            <p className="mt-0.5 text-xs font-medium text-[#71717A]">
              Detailed breakdown of traffic, error rates, average latency, and P95/P99 percentiles by endpoint
            </p>
          </div>
        </div>

        {!isLoading && !isError && endpoints.length > 0 && (
          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#4F46E5]">
            {endpoints.length} Endpoints Tracked
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-sm font-semibold text-red-500">
          Unable to load endpoint performance analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && endpoints.length === 0 && (
        <div className="flex h-32 flex-col items-center justify-center text-center">
          <Activity className="h-6 w-6 text-[#A1A1AA]" />
          <p className="mt-2 text-sm font-semibold text-[#18181B]">
            No endpoint traffic logged
          </p>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Gateway traffic will populate per-endpoint metrics here.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && endpoints.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F1F3F5]">
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Endpoint
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Requests
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Success / Error
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Error Rate
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Avg Latency
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
                  P95 Latency
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">
                  P99 Latency
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F3F5]">
              {endpoints.map((ep) => {
                const methodBadge = getMethodStyle(ep.method);

                return (
                  <tr
                    key={ep.endpoint}
                    className="transition-colors hover:bg-[#FAFAFA]"
                  >
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-extrabold ${methodBadge}`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#18181B] truncate max-w-[240px]">
                          {ep.path}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-right font-mono text-xs font-bold text-[#18181B]">
                      {ep.totalRequests.toLocaleString()}
                    </td>

                    <td className="px-3 py-3.5 text-right font-mono text-xs">
                      <span className="text-[#15803D] font-bold">{ep.successCount.toLocaleString()}</span>
                      {" / "}
                      <span className={ep.errorCount > 0 ? "text-[#B91C1C] font-bold" : "text-[#71717A]"}>
                        {ep.errorCount.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                          ep.errorRate === 0
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : ep.errorRate < 5
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}
                      >
                        {ep.errorRate.toFixed(2)}%
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-right font-mono text-xs font-semibold text-[#18181B]">
                      {ep.averageResponseTime} ms
                    </td>

                    <td className="px-3 py-3.5 text-right font-mono text-xs font-extrabold text-[#D97706]">
                      {ep.p95ResponseTime ?? ep.p95} ms
                    </td>

                    <td className="px-3 py-3.5 text-right font-mono text-xs font-extrabold text-[#4F46E5]">
                      {ep.p99ResponseTime ?? ep.p99} ms
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EndpointPerformance;
