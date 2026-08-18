import { FolderKanban, Server, Activity, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { useServices } from "./hooks/useServices";

function ServicesPage() {
  const { data, isLoading, isError } = useServices();

  const services = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const totalRequests = services.reduce((sum, s) => sum + Number(s.totalRequests ?? s.count ?? 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] shadow-2xs">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              Gateway Services
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Registered downstream target microservices &amp; proxy routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-extrabold text-[#4F46E5]">
            {services.length} Services Configured
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">Registered Services</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-[#18181B]">
            {services.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">Total Service Calls</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-extrabold text-[#18181B]">
            {totalRequests.toLocaleString()}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">Gateway Proxy Status</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-sm font-extrabold text-[#15803D] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#15803D] animate-pulse" />
            Active &amp; Proxying
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Configured Microservices
            </h3>
            <p className="text-xs text-[#71717A] font-medium">
              Routing prefix, status, request count, and latency metrics
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F4F4F5]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600">
            Unable to load services analytics.
          </div>
        )}

        {!isLoading && !isError && services.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <Server className="h-7 w-7 text-[#A1A1AA] mb-2" />
            <p className="text-sm font-semibold text-[#18181B]">No Services Configured</p>
            <p className="mt-0.5 text-xs text-[#71717A]">
              Send API requests to <code>/api/v1/gateway/:service</code> to register traffic.
            </p>
          </div>
        )}

        {!isLoading && !isError && services.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F1F3F5]">
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Service Name
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Gateway Route Prefix
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Target Endpoint
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Total Volume
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Success Rate
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                    Avg Latency
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">
                    P95 / P99
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1F3F5]">
                {services.map((svc) => {
                  const reqs = Number(svc.totalRequests ?? svc.count ?? 0);

                  return (
                    <tr key={svc.service} className="transition-colors hover:bg-[#FAFAFA]">
                      <td className="px-3 py-4 font-bold text-xs text-[#18181B]">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-[#4F46E5]" />
                          <span>{svc.service}</span>
                        </div>
                      </td>

                      <td className="px-3 py-4 font-mono text-xs font-semibold text-[#71717A]">
                        /api/v1/gateway/{svc.service}
                      </td>

                      <td className="px-3 py-4 font-mono text-xs font-semibold text-[#4F46E5]">
                        {svc.target || "N/A"}
                      </td>

                      <td className="px-3 py-4 text-right font-mono text-xs font-extrabold text-[#18181B]">
                        {reqs.toLocaleString()}
                      </td>

                      <td className="px-3 py-4 text-right">
                        <span className="inline-flex items-center font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                          {reqs > 0 ? `${svc.successRate ?? 100}%` : "N/A"}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-right font-mono text-xs font-semibold text-[#18181B]">
                        {reqs > 0 ? `${svc.averageResponseTime ?? 0} ms` : "0 ms"}
                      </td>

                      <td className="px-3 py-4 text-right font-mono text-xs font-bold text-[#4F46E5]">
                        {reqs > 0 ? `${svc.p95 ?? 0} / ${svc.p99 ?? 0} ms` : "0 / 0 ms"}
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

export default ServicesPage;
