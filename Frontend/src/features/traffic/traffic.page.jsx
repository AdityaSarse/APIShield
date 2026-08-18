import { useState } from "react";
import { Activity, Search, RefreshCw, Clock, Filter, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { useRecentRequests, useDailyRequestAnalytics } from "../dashboard/hooks/useDashboardAnalytics";

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

function TrafficPage() {
  const { data, isLoading, isError, refetch } = useRecentRequests();
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const requests = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.path?.toLowerCase().includes(search.toLowerCase()) ||
      req.apiKeyPrefix?.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === "ALL" || req.method === methodFilter;

    let matchesStatus = true;
    if (statusFilter === "2xx") matchesStatus = req.statusCode >= 200 && req.statusCode < 300;
    else if (statusFilter === "3xx") matchesStatus = req.statusCode >= 300 && req.statusCode < 400;
    else if (statusFilter === "4xx") matchesStatus = req.statusCode >= 400 && req.statusCode < 500;
    else if (statusFilter === "5xx") matchesStatus = req.statusCode >= 500;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] shadow-2xs">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              Traffic Monitor
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Live request inspection, HTTP methods, response codes, and latency stream
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#EBECEF] bg-white px-4 text-xs font-bold text-[#18181B] shadow-2xs hover:bg-[#F8F9FA] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#71717A]" />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search request logs by endpoint or key prefix..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-[#EBECEF] bg-[#F8F9FA] pl-9 pr-4 py-2 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Method Filter */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] border border-[#EBECEF] p-1 rounded-full text-xs font-semibold">
            {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                  methodFilter === m
                    ? "bg-[#18181B] text-white shadow-2xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] border border-[#EBECEF] p-1 rounded-full text-xs font-semibold">
            {["ALL", "2xx", "3xx", "4xx", "5xx"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-[#4F46E5] text-white shadow-2xs"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Stream Table */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Live Gateway Request Log Stream
            </h3>
            <p className="text-xs text-[#71717A] font-medium">
              Showing {filteredRequests.length} of {requests.length} recent logs
            </p>
          </div>

          <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
            Auto-polling (10s)
          </span>
        </div>

        {isLoading && (
          <div className="mt-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-[#F4F4F5]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600">
            Unable to fetch recent request logs.
          </div>
        )}

        {!isLoading && !isError && filteredRequests.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <Activity className="h-7 w-7 text-[#A1A1AA] mb-2" />
            <p className="text-sm font-semibold text-[#18181B]">No Matching Request Logs</p>
            <p className="mt-0.5 text-xs text-[#71717A]">
              {search || methodFilter !== "ALL" || statusFilter !== "ALL"
                ? "Try clearing your filters or search terms."
                : "Gateway request logs will populate here."}
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredRequests.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F1F3F5]">
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Method
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Endpoint Path
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Key Prefix
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Status
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Response Latency
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Timestamp
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F3F5]">
                {filteredRequests.map((req) => {
                  const status = getStatus(req.statusCode);
                  const Icon = status.icon;

                  return (
                    <tr key={req.id} className="transition-colors hover:bg-[#FAFAFA]">
                      <td className="px-3 py-3.5">
                        <span className="rounded-md bg-[#F4F4F5] px-2 py-1 font-mono text-[10px] font-extrabold text-[#18181B]">
                          {req.method}
                        </span>
                      </td>

                      <td className="max-w-[280px] px-3 py-3.5">
                        <p className="truncate font-mono text-xs font-bold text-[#18181B]">
                          {req.path}
                        </p>
                      </td>

                      <td className="px-3 py-3.5">
                        <span className="font-mono text-[10px] text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-md">
                          {req.apiKeyPrefix ?? "—"}
                        </span>
                      </td>

                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${status.bg} ${status.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          HTTP {req.statusCode}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-right font-mono text-xs font-bold text-[#18181B]">
                        {req.responseTime} ms
                      </td>

                      <td className="px-3 py-3.5 text-right font-mono text-[11px] text-[#71717A]">
                        {formatTime(req.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrafficPage;
