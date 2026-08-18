import { Server, Activity } from "lucide-react";
import { useServiceAnalytics } from "../hooks/useAnalytics";

function ServicePerformance() {
  const { data, isLoading, isError } = useServiceAnalytics();

  const services = Array.isArray(data?.data) ? data.data : [];
  const maxCount = Math.max(
    ...services.map((s) => Number(s.count || 0)),
    1
  );

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-[#F1F3F5]">
        <Server className="h-4 w-4 text-[#18181B]" />
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-[#18181B]">
            Service Performance
          </h3>
          <p className="mt-0.5 text-xs font-medium text-[#71717A]">
            Request volume breakdown by target service
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-xl bg-[#F4F4F5]"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-600">
          Unable to load service analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && services.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center text-center">
          <Server className="h-6 w-6 text-[#A1A1AA]" />
          <p className="mt-2 text-sm font-semibold text-[#18181B]">
            No service traffic registered
          </p>
          <p className="mt-1 text-xs text-[#71717A]">
            Active services will appear here after receiving API requests.
          </p>
        </div>
      )}

      {/* Service Rows */}
      {!isLoading && !isError && services.length > 0 && (
        <div className="mt-5 space-y-4">
          {services.map((service) => {
            const count = Number(service.count || 0);
            const percentage = (count / maxCount) * 100;

            return (
              <div key={service.service}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-[#71717A]" />
                    <span className="text-xs font-bold text-[#18181B]">
                      {service.service}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#18181B]">
                    {count.toLocaleString()} reqs
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F4F4F5]">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ServicePerformance;
