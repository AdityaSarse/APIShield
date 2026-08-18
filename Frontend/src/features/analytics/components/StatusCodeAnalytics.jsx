import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  BarChart3,
} from "lucide-react";
import { useStatusCodeAnalytics } from "../hooks/useAnalytics";

function getStatus(code) {
  const n = Number(code);
  if (n >= 500)
    return {
      label: "Server Error",
      icon: XCircle,
      color: "text-[#B91C1C]",
      bg: "bg-[#FEE2E2]",
    };
  if (n >= 400)
    return {
      label: "Client Error",
      icon: AlertTriangle,
      color: "text-[#D97706]",
      bg: "bg-[#FEF3C7]",
    };
  if (n >= 300)
    return {
      label: "Redirect",
      icon: Info,
      color: "text-[#2563EB]",
      bg: "bg-[#EFF6FF]",
    };
  return {
    label: "Success",
    icon: CheckCircle2,
    color: "text-[#15803D]",
    bg: "bg-[#DCFCE7]",
  };
}

function StatusCodeAnalytics() {
  const { data, isLoading, isError } = useStatusCodeAnalytics();

  const rows = Array.isArray(data?.data) ? data.data : [];
  const total = rows.reduce((sum, r) => sum + Number(r.count || 0), 0);

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#18181B]" />
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Status Codes
            </h3>
            <p className="mt-0.5 text-xs font-medium text-[#71717A]">
              HTTP response distribution across all services
            </p>
          </div>
        </div>

        {!isLoading && !isError && total > 0 && (
          <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#18181B]">
            {total.toLocaleString()} total
          </span>
        )}
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
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600">
          Unable to load status code analytics.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && rows.length === 0 && (
        <div className="flex h-40 items-center justify-center text-xs font-medium text-[#71717A]">
          No response code data logged yet.
        </div>
      )}

      {/* Rows */}
      {!isLoading && !isError && rows.length > 0 && (
        <div className="mt-5 space-y-4">
          {rows.map((row) => {
            const meta = getStatus(row.statusCode);
            const Icon = meta.icon;
            const count = Number(row.count || 0);
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={row.statusCode}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${meta.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-[#18181B]">
                        HTTP {row.statusCode}
                      </p>
                      <p className="text-[10px] text-[#71717A]">{meta.label}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#18181B]">
                      {count.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#A1A1AA]">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F4F4F5]">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full rounded-full bg-[#4F46E5] transition-all duration-500"
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

export default StatusCodeAnalytics;
