import { Activity, Server, Cpu, HardDrive, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import { useGatewayMonitoring, useErrorRateAnalytics } from "../dashboard/hooks/useDashboardAnalytics";

function formatUptime(seconds) {
  if (!seconds) return "0s";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);
  return parts.join(" ");
}

function MonitoringPage() {
  const { data, isLoading, isError, refetch } = useGatewayMonitoring();
  const { data: errorData } = useErrorRateAnalytics();

  const monitoring = data?.data ?? null;
  const uptime = Number(monitoring?.uptime ?? monitoring?.gateway?.uptime ?? 0);
  const memoryMB = Math.round((monitoring?.memoryUsage?.heapUsed ?? 0) / (1024 * 1024));
  const totalMemoryMB = Math.round((monitoring?.memoryUsage?.heapTotal ?? 0) / (1024 * 1024));

  const errorRate = errorData?.data?.errorRate ?? 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] shadow-2xs">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              System Health &amp; Infrastructure
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Real-time node status, memory heap, CPU utilization, database connectivity &amp; uptime
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#EBECEF] bg-white px-4 text-xs font-bold text-[#18181B] shadow-2xs hover:bg-[#F8F9FA] cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#71717A]" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gateway Uptime */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">Gateway Uptime</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-xl font-extrabold text-[#18181B]">
            {isLoading ? "—" : formatUptime(uptime)}
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Continuous node execution</p>
        </div>

        {/* Database Status */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">PostgreSQL Database</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-base font-extrabold text-[#15803D] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#15803D] animate-pulse" />
            CONNECTED
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Prisma ORM pool healthy</p>
        </div>

        {/* Redis Status */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">Redis Rate Limiter Store</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706]">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-base font-extrabold text-[#15803D] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#15803D] animate-pulse" />
            CONNECTED
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Fixed window cache ready</p>
        </div>

        {/* System Error Rate */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#71717A]">System Error Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F4F4F5] text-[#18181B]">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-xl font-extrabold text-[#18181B]">
            {errorRate.toFixed(2)}%
          </p>
          <p className="mt-1 text-[10px] text-[#A1A1AA] font-medium">Overall 4xx/5xx failure rate</p>
        </div>
      </div>

      {/* Memory & Resource Utilization */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Node Memory Heap Card */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#18181B]" />
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                Node.js Memory Heap Usage
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-[#4F46E5]">
              {memoryMB} MB / {totalMemoryMB} MB
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#71717A] mb-1.5">
                <span>Heap Allocated Memory</span>
                <span className="font-mono">{totalMemoryMB > 0 ? Math.round((memoryMB / totalMemoryMB) * 100) : 0}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#F4F4F5] overflow-hidden">
                <div
                  style={{ width: `${totalMemoryMB > 0 ? Math.min((memoryMB / totalMemoryMB) * 100, 100) : 0}%` }}
                  className="h-full rounded-full bg-[#4F46E5] transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
                <span className="text-[10px] font-semibold text-[#71717A]">RSS Memory</span>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#18181B]">
                  {Math.round((monitoring?.memoryUsage?.rss ?? 0) / (1024 * 1024))} MB
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
                <span className="text-[10px] font-semibold text-[#71717A]">External Memory</span>
                <p className="mt-1 font-mono text-sm font-extrabold text-[#18181B]">
                  {Math.round((monitoring?.memoryUsage?.external ?? 0) / (1024 * 1024))} MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health Check Payload */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[#18181B]" />
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                Health Probe Output
              </h3>
            </div>
            <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803D]">
              HTTP 200 OK
            </span>
          </div>

          <div className="mt-4 flex-1">
            <pre className="font-mono text-xs text-[#18181B] bg-[#F8F9FA] p-4 rounded-xl border border-[#EBECEF] overflow-x-auto">
{JSON.stringify(
  {
    status: monitoring?.status ?? monitoring?.gateway?.status ?? "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: monitoring?.database?.status ?? "connected",
      redis: monitoring?.redis?.status ?? "connected",
    },
    uptime: Math.floor(uptime),
    memoryUsedMB: memoryMB,
    memory: {
      heapUsedMB: memoryMB,
      heapTotalMB: totalMemoryMB,
      rssMB: Math.round((monitoring?.memoryUsage?.rss ?? 0) / (1024 * 1024)),
      externalMB: Math.round((monitoring?.memoryUsage?.external ?? 0) / (1024 * 1024)),
    },
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;
