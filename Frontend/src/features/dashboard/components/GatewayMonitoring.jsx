import { ShieldCheck, Database, Zap, Activity, Gauge } from "lucide-react";
import { useGatewayMonitoring } from "../hooks/useDashboardAnalytics";

function formatUptime(seconds) {
  if (seconds == null) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const STATUS_CONFIG = {
  healthy: {
    dot: "bg-[#16A34A]",
    badge: "bg-[#DCFCE7] text-[#15803D]",
    label: "Healthy",
    pulse: true,
  },
  degraded: {
    dot: "bg-[#D97706]",
    badge: "bg-[#FEF3C7] text-[#B45309]",
    label: "Degraded",
    pulse: true,
  },
  unhealthy: {
    dot: "bg-[#DC2626]",
    badge: "bg-[#FEE2E2] text-[#B91C1C]",
    label: "Unhealthy",
    pulse: false,
  },
};

const SERVICE_STATUS_CONFIG = {
  connected: { dot: "bg-[#16A34A]", text: "text-[#18181B]" },
  healthy: { dot: "bg-[#16A34A]", text: "text-[#18181B]" },
  disconnected: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
  unknown: { dot: "bg-[#A1A1AA]", text: "text-[#71717A]" },
};

function GatewayMonitoring() {
  const { data, isLoading, isError } = useGatewayMonitoring();

  const monitoring = data?.data ?? null;

  const gatewayStatus = monitoring?.gateway?.status ?? "unknown";
  const dbStatus = monitoring?.database?.status ?? "unknown";
  const redisStatus = monitoring?.redis?.status ?? "unknown";
  const averageResponseTime = monitoring?.metrics?.averageResponseTime ?? 0;
  const recentErrors = monitoring?.metrics?.recentErrors ?? 0;
  const uptime = monitoring?.gateway?.uptime ?? null;

  const gatewayConfig = STATUS_CONFIG[gatewayStatus] ?? STATUS_CONFIG.unhealthy;
  const uptimeText = formatUptime(uptime);

  const services = [
    {
      label: "API Gateway Core",
      value: gatewayStatus.charAt(0).toUpperCase() + gatewayStatus.slice(1),
      icon: ShieldCheck,
      status: gatewayStatus === "healthy" ? "healthy" : "disconnected",
    },
    {
      label: "PostgreSQL Database",
      value: dbStatus.charAt(0).toUpperCase() + dbStatus.slice(1),
      icon: Database,
      status: dbStatus === "connected" ? "connected" : "disconnected",
    },
    {
      label: "Redis Rate Limiter",
      value: redisStatus.charAt(0).toUpperCase() + redisStatus.slice(1),
      icon: Zap,
      status: redisStatus === "connected" ? "connected" : "disconnected",
    },
    {
      label: "Recent Errors (24h)",
      value: recentErrors.toLocaleString(),
      icon: Activity,
      status: recentErrors === 0 ? "healthy" : "disconnected",
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Gateway Monitoring
            </h3>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Infrastructure state &amp; Redis rate limiter health
            </p>
          </div>

          {/* Overall status badge */}
          {!isLoading && !isError && monitoring && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${gatewayConfig.badge}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${gatewayConfig.dot} ${
                  gatewayConfig.pulse ? "animate-pulse" : ""
                }`}
              />
              {gatewayConfig.label}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex h-40 items-center justify-center text-sm text-[#71717A]">
            Checking infrastructure…
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex h-40 items-center justify-center text-sm text-red-500">
            Unable to reach monitoring endpoint.
          </div>
        )}

        {/* Services Status Grid */}
        {!isLoading && !isError && monitoring && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              const config =
                SERVICE_STATUS_CONFIG[service.status] ??
                SERVICE_STATUS_CONFIG.unknown;

              return (
                <div
                  key={service.label}
                  className="rounded-2xl border border-[#EBECEF] bg-[#F8F9FA] p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#71717A]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <span className="truncate text-[10px] font-semibold text-[#71717A]">
                      {service.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                    />

                    <span className={`truncate font-mono text-xs font-bold ${config.text}`}>
                      {service.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance Panel */}
      {!isLoading && !isError && monitoring && (
        <div className="mt-4 rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] p-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[#4F46E5]" />

            <span className="text-xs font-bold text-[#4F46E5]">
              Gateway Performance
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium text-[#71717A]">
                Avg Response
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                {Number(averageResponseTime).toFixed(0)} ms
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#71717A]">
                Uptime
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                {uptimeText}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#71717A]">
                Errors / 24h
              </p>

              <p className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                {recentErrors.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GatewayMonitoring;
