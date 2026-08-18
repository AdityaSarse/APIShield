import { Key, ShieldAlert } from "lucide-react";
import { useTopApiKeysAnalytics } from "../hooks/useAdvancedAnalytics";

function ApiKeyPerformance() {
  const { data, isLoading, isError } = useTopApiKeysAnalytics();

  const keys = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
            <Key className="h-4 w-4 text-[#18181B]" />
            <span>API Key Consumer Analytics</span>
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Per-key consumer traffic volume, failure rates, and P95 latency
          </p>
        </div>
        {!isLoading && !isError && (
          <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-full">
            {keys.length} Keys
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-600 font-semibold">
          Unable to load API key performance analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && keys.length === 0 && (
        <div className="flex h-36 flex-col items-center justify-center text-center">
          <Key className="h-6 w-6 text-[#A1A1AA] mb-1.5" />
          <p className="text-sm font-semibold text-[#18181B]">No API keys active</p>
          <p className="mt-0.5 text-xs text-[#71717A]">
            API key consumer metrics will appear after requests are made.
          </p>
        </div>
      )}

      {/* Key List */}
      {!isLoading && !isError && keys.length > 0 && (
        <div className="mt-4 space-y-3">
          {keys.map((k) => {
            return (
              <div
                key={k.apiKeyId}
                className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FA] hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white border border-[#EBECEF] flex items-center justify-center text-[#18181B] shadow-2xs">
                      <Key className="h-4 w-4 text-[#18181B]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#18181B] font-mono">
                        {k.keyPrefix ?? "—"}
                      </div>
                      <div className="text-[10px] text-[#71717A]">
                        ID: {k.apiKeyId.slice(0, 8)}…
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-extrabold text-[#18181B]">
                      {(k.totalRequests ?? k.requestCount ?? 0).toLocaleString()} reqs
                    </div>
                    <div className="text-[10px] text-[#71717A]">total volume</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 pt-2 border-t border-[#EBECEF] text-center">
                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Success</span>
                    <p className="font-mono text-xs font-bold text-[#15803D]">
                      {(k.successCount ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Errors</span>
                    <p className={`font-mono text-xs font-bold ${k.errorCount > 0 ? "text-[#B91C1C]" : "text-[#71717A]"}`}>
                      {(k.errorCount ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">Avg Latency</span>
                    <p className="font-mono text-xs font-bold text-[#18181B]">
                      {k.averageResponseTime ?? 0} ms
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] font-semibold text-[#71717A] uppercase">P95 / P99</span>
                    <p className="font-mono text-xs font-bold text-[#4F46E5]">
                      {k.p95 ?? 0} / {k.p99 ?? 0} <span className="text-[9px] text-[#71717A]">ms</span>
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

export default ApiKeyPerformance;
