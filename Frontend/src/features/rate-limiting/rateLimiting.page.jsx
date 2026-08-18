import { Gauge, Sliders, ShieldAlert, Activity, RefreshCw } from "lucide-react";
import { useRateLimitAnalytics } from "../dashboard/hooks/useDashboardAnalytics";
import ImpactBadge from "../../components/ui/ImpactBadge";

function RateLimitingPage() {
  const { data, isLoading, isError, refetch } = useRateLimitAnalytics();

  const analytics = data?.data ?? null;
  const engines = Array.isArray(analytics?.engines) ? analytics.engines : [];

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-5 sm:pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-[#D97706] shadow-2xs">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              Rate Limiting &amp; Quotas
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Live Redis Fixed-Window rate limiters, active consumer budgets, and throttling rules
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#EBECEF] bg-white px-4 text-xs font-bold text-[#18181B] shadow-2xs hover:bg-[#F8F9FA] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#71717A]" />
          <span>Refresh Engines</span>
        </button>
      </div>

      {/* Global Config Banner */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#71717A]">Rate Limit Window</span>
          <p className="mt-2 font-mono text-2xl font-extrabold text-[#18181B]">
            {analytics?.windowSeconds ?? 60} <span className="text-xs text-[#71717A]">sec</span>
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Fixed sliding window duration</p>
        </div>

        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#71717A]">Max Quota per Window</span>
          <p className="mt-2 font-mono text-2xl font-extrabold text-[#18181B]">
            {analytics?.limit ?? 5} <span className="text-xs text-[#71717A]">reqs</span>
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Maximum requests allowed</p>
        </div>

        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-bold text-[#71717A]">Active Redis Identifiers</span>
          <p className="mt-2 font-mono text-2xl font-extrabold text-[#4F46E5]">
            {analytics?.activeKeys ?? engines.length}
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Consumers currently in window</p>
        </div>
      </div>

      {/* Live Engines Grid */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Active Redis Rate Limiter Instances
            </h3>
            <p className="text-xs text-[#71717A] font-medium">
              Real-time fixed window counters, TTL countdowns, and throttling status per consumer
            </p>
          </div>

          {!isLoading && !isError && (
            <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
              Auto-refreshing (10s)
            </span>
          )}
        </div>

        {isLoading && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#F4F4F5]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600">
            Unable to fetch live Redis rate-limiting state.
          </div>
        )}

        {!isLoading && !isError && engines.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <Gauge className="h-7 w-7 text-[#A1A1AA] mb-2" />
            <p className="text-sm font-semibold text-[#18181B]">No Active Rate Limiter Instances</p>
            <p className="mt-0.5 text-xs text-[#71717A]">
              Send requests to the API Gateway to see Redis rate limiter windows populate live.
            </p>
          </div>
        )}

        {!isLoading && !isError && engines.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {engines.map((eng) => {
              const isLimited = eng.status === "limited";
              const util = eng.utilization ?? 0;

              return (
                <div
                  key={eng.identifier}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLimited
                      ? "border-[#FCA5A5] bg-[#FEF2F2]"
                      : "border-[#EBECEF] bg-[#F8F9FA] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#18181B] truncate max-w-[180px]">
                      {eng.identifier}
                    </span>

                    <span
                      className={`inline-flex items-center font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isLimited
                          ? "bg-[#FEE2E2] text-[#B91C1C]"
                          : "bg-[#DCFCE7] text-[#15803D]"
                      }`}
                    >
                      {isLimited ? "THROTTLED (429)" : "ACTIVE"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-[#71717A]">Requests / Limit</span>
                      <p className="font-mono text-lg font-extrabold text-[#18181B]">
                        {eng.requests} / {eng.limit}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-[#71717A]">TTL Countdown</span>
                      <p className="font-mono text-xs font-bold text-[#18181B]">
                        {eng.ttl}s
                      </p>
                    </div>
                  </div>

                  {/* Utilization Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-[9px] font-bold text-[#71717A] mb-1">
                      <span>Quota Used</span>
                      <div className="flex items-center gap-1.5">
                        <span>{util}%</span>
                        <ImpactBadge value={util} type="utilization" />
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#EBECEF] overflow-hidden">
                      <div
                        style={{ width: `${Math.min(util, 100)}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          util >= 100 ? "bg-[#B91C1C]" : util >= 80 ? "bg-[#D97706]" : "bg-[#16A34A]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RateLimitingPage;
