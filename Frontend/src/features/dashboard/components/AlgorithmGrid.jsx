import { Activity, Sliders, Clock3, Gauge } from "lucide-react";
import { useRateLimitAnalytics } from "../hooks/useDashboardAnalytics";

// ── helpers ──────────────────────────────────────────────────────────────────

function getUtilizationClass(pct) {
  if (pct >= 95) return "bg-[#DC2626]";
  if (pct >= 75) return "bg-[#D97706]";
  return "bg-[#18181B]";
}

function getStatusMeta(status) {
  if (status === "limited") {
    return {
      label: "Throttled",
      badge: "bg-[#FEE2E2] text-[#B91C1C]",
      dot: "bg-[#B91C1C]",
    };
  }
  return {
    label: "Active",
    badge: "bg-[#DCFCE7] text-[#15803D]",
    dot: "bg-[#15803D]",
  };
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ limit, windowSeconds }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-[#EBECEF] bg-[#F8F9FA] py-14">
      <div className="h-10 w-10 rounded-xl border border-[#EBECEF] bg-white flex items-center justify-center shadow-2xs">
        <Activity className="h-5 w-5 text-[#A1A1AA]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-[#18181B]">No active rate-limit windows</p>
        <p className="mt-0.5 text-[11px] text-[#71717A]">
          Make a gateway request to see live utilization here.
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] px-3 py-1 text-[11px] font-semibold text-[#71717A]">
        <Clock3 className="h-3 w-3" />
        Fixed Window · {limit} req / {windowSeconds}s
      </span>
    </div>
  );
}

// ── AlgorithmGrid ─────────────────────────────────────────────────────────────

function AlgorithmGrid() {
  const { data, isLoading, isError } = useRateLimitAnalytics();

  const limit         = data?.data?.limit         ?? 5;
  const windowSeconds = data?.data?.windowSeconds  ?? 60;
  const activeKeys    = data?.data?.activeKeys     ?? 0;
  const engines       = Array.isArray(data?.data?.engines) ? data.data.engines : [];

  return (
    <div className="space-y-4">
      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-[#18181B]" />
          <h4 className="text-xs font-extrabold tracking-wider text-[#A1A1AA] uppercase">
            Rate Limiting Engines
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {!isLoading && !isError && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
              Live
            </span>
          )}
          {!isLoading && !isError && activeKeys > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#18181B]">
              {activeKeys} Active
            </span>
          )}
        </div>
      </div>

      {/* ── Loading skeleton ─────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-52 rounded-[22px] border border-[#EBECEF] bg-[#F8F9FA] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {isError && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-sm font-semibold text-red-500">
          Unable to load rate-limit data.
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!isLoading && !isError && engines.length === 0 && (
        <EmptyState limit={limit} windowSeconds={windowSeconds} />
      )}

      {/* ── Engine cards ─────────────────────────────────────────────── */}
      {!isLoading && !isError && engines.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {engines.map((engine) => {
            const meta = getStatusMeta(engine.status);

            return (
              <div
                key={engine.identifier}
                className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center">
                        <Sliders className="h-4 w-4 text-[#18181B]" />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs text-[#18181B]">
                          Fixed Window
                        </h4>

                        <p className="mt-0.5 text-[10px] font-medium text-[#71717A]">
                          API key protection
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full animate-pulse ${meta.dot}`}
                      />
                      {meta.label}
                    </span>
                  </div>

                  {/* Key identifier */}
                  <div className="mt-4 flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-[#71717A] shrink-0" />
                    <span className="truncate font-mono text-[10px] font-semibold text-[#71717A]">
                      {engine.identifier}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[#71717A]">
                      Capacity
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#18181B]">
                      {engine.requests} / {engine.limit}
                    </span>
                  </div>

                  {/* Utilization bar */}
                  <div className="mt-2">
                    <div className="h-2 overflow-hidden rounded-full border border-[#EBECEF] bg-[#F4F4F5] p-0.5">
                      <div
                        style={{ width: `${Math.min(engine.utilization, 100)}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${getUtilizationClass(engine.utilization)}`}
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#71717A]">
                        Utilization
                      </span>
                      <span className="font-mono text-[10px] font-extrabold text-[#18181B]">
                        {engine.utilization}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-[#F1F3F5] pt-3">
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-[#71717A]" />
                    <span className="text-[10px] font-medium text-[#71717A]">
                      Resets in
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#18181B]">
                      {Math.max(engine.ttl, 0)}s
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-[#15803D]">
                    {engine.remaining} remaining
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

export default AlgorithmGrid;
