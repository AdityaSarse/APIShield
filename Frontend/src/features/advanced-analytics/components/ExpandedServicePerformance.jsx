import { Server, Activity } from "lucide-react";
import { useServiceAnalytics } from "../hooks/useAdvancedAnalytics";

function ExpandedServicePerformance() {
  const { data, isLoading, isError } = useServiceAnalytics();

  const services = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-[#18181B]" />
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-[#18181B]">
              Service Performance Analytics
            </h3>
            <p className="mt-0.5 text-xs font-medium text-[#71717A]">
              Service-level volume, success rate, latency &amp; P95/P99 metrics
            </p>
          </div>
        </div>

        {!isLoading && !isError && services.length > 0 && (
          <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#18181B]">
            {services.length} Services
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-600 font-semibold">
          Unable to load service performance analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && services.length === 0 && (
        <div className="flex h-36 flex-col items-center justify-center text-center">
          <Server className="h-6 w-6 text-[#A1A1AA]" />
          <p className="mt-2 text-sm font-semibold text-[#18181B]">
            No service data recorded
          </p>
          <p className="mt-1 text-xs text-[#71717A]">
            Gateway traffic will populate service metrics here.
          </p>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !isError && services.length > 0 && (
        <div className="mt-4 space-y-3">
          {services.map((svc) => {
            const reqs = Number(svc.totalRequests ?? svc.count ?? 0);
            const hasTraffic = reqs > 0;

            return (
              <div
                key={svc.service}
                className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FA] hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#4F46E5]" />
                    <span className="text-sm font-extrabold text-[#18181B]">
                      {svc.service}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-extrabold text-[#18181B]">
                    {reqs.toLocaleString()} reqs
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 pt-2 border-t border-[#EBECEF] text-center">
                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Success</span>
                    <p className="font-mono text-xs font-bold text-[#15803D]">
                      {hasTraffic && svc.successRate !== null ? `${svc.successRate}%` : "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Error %</span>
                    <p className={`font-mono text-xs font-bold ${hasTraffic && svc.errorRate > 0 ? "text-[#B91C1C]" : "text-[#18181B]"}`}>
                      {hasTraffic && svc.errorRate !== null ? `${svc.errorRate}%` : "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Avg Latency</span>
                    <p className="font-mono text-xs font-bold text-[#18181B]">
                      {hasTraffic && svc.averageResponseTime !== null ? `${svc.averageResponseTime} ms` : "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">P95 / P99</span>
                    <p className="font-mono text-xs font-bold text-[#4F46E5]">
                      {hasTraffic && svc.p95 !== null && svc.p99 !== null
                        ? `${svc.p95} / ${svc.p99} ms`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpandedServicePerformance;
