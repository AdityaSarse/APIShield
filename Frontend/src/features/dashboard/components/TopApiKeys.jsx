import { Key } from "lucide-react";
import { useTopApiKeysAnalytics } from "../hooks/useDashboardAnalytics";

function TopApiKeys() {
  const { data, isLoading, isError } = useTopApiKeysAnalytics();

  const keys = Array.isArray(data?.data) ? data.data : [];
  const maxRequests = Math.max(...keys.map((k) => k.requestCount), 1);

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
            <Key className="h-4 w-4 text-[#18181B]" />
            <span>Top API Keys</span>
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Active authentication keys &amp; usage volume
          </p>
        </div>
        {!isLoading && !isError && (
          <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-full">
            {keys.length} Key{keys.length !== 1 ? "s" : ""} Tracked
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-32 items-center justify-center text-sm text-[#71717A]">
          Loading key data...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex h-32 items-center justify-center text-sm text-red-500">
          Unable to load key data.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && keys.length === 0 && (
        <div className="flex h-32 flex-col items-center justify-center">
          <Key className="h-6 w-6 text-[#A1A1AA] mb-1.5" />
          <p className="text-sm font-semibold text-[#18181B]">No API keys used yet</p>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Create an API key and make requests to see activity here.
          </p>
        </div>
      )}

      {/* Key list */}
      {!isLoading && !isError && keys.length > 0 && (
        <div className="mt-4 space-y-3">
          {keys.map((k) => {
            const utilization = Math.round((k.requestCount / maxRequests) * 100);

            return (
              <div
                key={k.apiKeyId}
                className="p-3.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FA] hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-white border border-[#EBECEF] flex items-center justify-center text-[#18181B]">
                      <Key className="h-3.5 w-3.5 text-[#18181B]" />
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
                    <div className="text-xs font-bold font-mono text-[#18181B]">
                      {k.requestCount.toLocaleString()} reqs
                    </div>
                    <div className="text-[10px] text-[#71717A]">all time</div>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-[#EBECEF] overflow-hidden">
                    <div
                      style={{ width: `${utilization}%` }}
                      className="h-full bg-[#4F46E5] rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#71717A]">
                    {utilization}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopApiKeys;
