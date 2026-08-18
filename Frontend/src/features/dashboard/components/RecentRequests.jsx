import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  List,
} from "lucide-react";
import { useRecentRequests } from "../hooks/useDashboardAnalytics";

// ── helpers ───────────────────────────────────────────────────────────────────

function getStatus(code) {
  const n = Number(code);
  if (n >= 500)
    return {
      icon: XCircle,
      color: "text-[#B91C1C]",
      bg: "bg-[#FEE2E2]",
    };
  if (n >= 400)
    return {
      icon: AlertTriangle,
      color: "text-[#D97706]",
      bg: "bg-[#FEF3C7]",
    };
  if (n >= 300)
    return {
      icon: Info,
      color: "text-[#2563EB]",
      bg: "bg-[#EFF6FF]",
    };
  return {
    icon: CheckCircle2,
    color: "text-[#15803D]",
    bg: "bg-[#DCFCE7]",
  };
}

function formatTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

function RecentRequests() {
  const { data, isLoading, isError } = useRecentRequests();

  const requests = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-[#18181B]" />
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Recent Requests
            </h3>
            <p className="mt-0.5 text-xs font-medium text-[#71717A]">
              Last 10 gateway requests
            </p>
          </div>
        </div>

        {!isLoading && !isError && requests.length > 0 && (
          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
            {requests.length} logs
          </span>
        )}
      </div>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {isError && (
        <div className="mt-5 flex h-32 items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-sm font-semibold text-red-500">
          Unable to load request logs.
        </div>
      )}

      {/* ── Empty ────────────────────────────────────────────────────── */}
      {!isLoading && !isError && requests.length === 0 && (
        <div className="flex h-32 flex-col items-center justify-center text-center">
          <List className="h-6 w-6 text-[#A1A1AA]" />
          <p className="mt-2 text-sm font-semibold text-[#18181B]">
            No requests yet
          </p>
          <p className="mt-0.5 text-xs text-[#71717A]">
            Gateway activity will appear here.
          </p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────── */}
      {!isLoading && !isError && requests.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F1F3F5]">
                <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Method
                </th>
                <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Endpoint
                </th>
                <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Status
                </th>
                <th className="px-2 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Response
                </th>
                <th className="px-2 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F3F5]">
              {requests.map((request) => {
                const status = getStatus(request.statusCode);
                const Icon = status.icon;

                return (
                  <tr
                    key={request.id}
                    className="transition-colors hover:bg-[#FAFAFA]"
                  >
                    <td className="px-2 py-3.5">
                      <span className="rounded-md bg-[#F4F4F5] px-2 py-1 font-mono text-[10px] font-bold text-[#18181B]">
                        {request.method}
                      </span>
                    </td>

                    <td className="max-w-[260px] px-2 py-3.5">
                      <p className="truncate font-mono text-[10px] font-semibold text-[#18181B]">
                        {request.path}
                      </p>
                      {request.apiKeyPrefix && (
                        <p className="mt-0.5 truncate font-mono text-[9px] text-[#A1A1AA]">
                          {request.apiKeyPrefix}
                        </p>
                      )}
                    </td>

                    <td className="px-2 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${status.bg} ${status.color}`}
                      >
                        <Icon className="h-3 w-3" />
                        {request.statusCode}
                      </span>
                    </td>

                    <td className="px-2 py-3.5 text-right">
                      <span className="font-mono text-[10px] font-bold text-[#18181B]">
                        {request.responseTime} ms
                      </span>
                    </td>

                    <td className="px-2 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3 text-[#A1A1AA]" />
                        <span className="font-mono text-[9px] text-[#71717A]">
                          {formatTime(request.createdAt)}
                        </span>
                      </div>
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

export default RecentRequests;
