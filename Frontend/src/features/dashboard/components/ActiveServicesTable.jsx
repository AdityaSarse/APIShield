import { Server, CircleCheck, ArrowUpRight, Layers } from "lucide-react";
import { useServiceAnalytics } from "../hooks/useDashboardAnalytics";

function formatServiceName(slug) {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ActiveServicesTable() {
  const { data, isLoading, isError } = useServiceAnalytics();

  const services = Array.isArray(data?.data) ? data.data : [];
  const totalRequests = services.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
            <Layers className="h-4 w-4 text-[#18181B]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Active API Services
            </h3>
            <p className="text-[10px] font-medium text-[#71717A]">
              Derived from gateway request logs
            </p>
          </div>
        </div>

        {!isLoading && !isError && services.length > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5]">
            {services.length} Service{services.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center text-sm text-[#71717A]">
          Loading service data…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-40 items-center justify-center text-sm text-red-500">
          Unable to load service analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && services.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center gap-1">
          <Server className="h-7 w-7 text-[#A1A1AA]" />
          <p className="text-sm font-semibold text-[#18181B]">
            No API services detected
          </p>
          <p className="text-xs text-[#71717A]">
            Services appear here once your gateway receives traffic on{" "}
            <span className="font-mono">/api/v1/gateway/&lt;service&gt;</span>
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && services.length > 0 && (
        <div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F1F3F5] text-[#A1A1AA] uppercase tracking-wider text-[10px]">
                  <th className="px-4 py-3 font-bold">Service</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Requests</th>
                  <th className="px-4 py-3 text-right font-bold">Traffic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {services.map((service) => {
                  const count = service.count;
                  const percentage =
                    totalRequests > 0
                      ? (count / totalRequests) * 100
                      : 0;

                  return (
                    <tr
                      key={service.service}
                      className="transition-colors hover:bg-[#FAFAFA]"
                    >
                      {/* Service */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
                            <Server className="h-3.5 w-3.5 text-[#18181B]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold text-[#18181B]">
                              {formatServiceName(service.service)}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#A1A1AA] font-mono">
                              /gateway/{service.service}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#15803D]">
                          <CircleCheck className="h-3 w-3" />
                          Active
                        </span>
                      </td>

                      {/* Requests */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-mono text-xs font-bold text-[#18181B]">
                          {count.toLocaleString()}
                        </span>
                      </td>

                      {/* Traffic share bar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EBECEF]">
                            <div
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                              }}
                              className="h-full rounded-full bg-[#4F46E5]"
                            />
                          </div>

                          <span className="w-10 text-right font-mono text-[10px] font-semibold text-[#71717A]">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-medium text-[#A1A1AA]">
              {totalRequests.toLocaleString()} total service requests
            </span>

            <button
              type="button"
              className="flex items-center gap-1 text-[10px] font-bold text-[#4F46E5] transition hover:text-[#4338CA]"
            >
              View analytics
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveServicesTable;
