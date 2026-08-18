import { Cpu, CheckCircle2, AlertCircle, Layers, ShieldCheck, Zap, Info, Clock, Lock } from "lucide-react";
import { useRateLimitAnalytics } from "../dashboard/hooks/useDashboardAnalytics";

function AlgorithmsPage() {
  const { data } = useRateLimitAnalytics();
  const config = data?.data ?? null;

  const windowSize = config?.windowSeconds ?? 60;
  const maxLimit = config?.limit ?? 5;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] shadow-2xs">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              Rate Limiting Algorithm
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              How APIShield enforces request quotas and rate limits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-extrabold text-[#15803D]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Fixed-Window Active
          </span>
        </div>
      </div>

      {/* Section 1: Active Algorithm Detail Card */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                  Fixed-Window Rate Limiting
                </h3>
                <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#4F46E5]">
                  Primary Algorithm
                </span>
              </div>
              <p className="text-xs text-[#71717A] font-medium mt-0.5">
                Atomic time-bucket tracking backed by Redis
              </p>
            </div>
          </div>
        </div>

        {/* Live Config Summary Banner */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FA]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A]">
              Configured Window Size
            </span>
            <p className="mt-1 font-mono text-xl font-extrabold text-[#18181B]">
              {windowSize} <span className="text-xs text-[#71717A] font-medium">seconds</span>
            </p>
            <p className="mt-1 text-[10px] text-[#A1A1AA]">
              Time interval before quota resets
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FA]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A]">
              Max Quota Per Window
            </span>
            <p className="mt-1 font-mono text-xl font-extrabold text-[#18181B]">
              {maxLimit} <span className="text-xs text-[#71717A] font-medium">requests</span>
            </p>
            <p className="mt-1 text-[10px] text-[#A1A1AA]">
              Maximum allowed calls per consumer
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#F8F9FA]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A]">
              Fail-Open Resilience Strategy
            </span>
            <p className="mt-1 text-xs font-extrabold text-[#15803D] flex items-center gap-1.5 pt-1">
              <ShieldCheck className="h-4 w-4 text-[#15803D]" />
              Graceful Degradation Enabled
            </p>
            <p className="mt-1 text-[10px] text-[#A1A1AA]">
              Bypasses limiter on Redis outage with <code className="font-mono">X-RateLimit-Degraded</code> header
            </p>
          </div>
        </div>

        {/* Algorithm Mechanics Description */}
        <div className="mt-6 space-y-4 text-xs text-[#3F3F46] leading-relaxed">
          <div className="rounded-2xl bg-[#F8F9FA] p-4 border border-[#EBECEF]">
            <h4 className="font-extrabold text-[#18181B] text-sm mb-1.5 flex items-center gap-2">
              <Info className="h-4 w-4 text-[#4F46E5]" />
              How It Works
            </h4>
            <p>
              Fixed-window rate limiting divides time into non-overlapping fixed windows (e.g. 60-second slots).
              Each consumer (identified by their unique <strong>API Key ID</strong> or remote <strong>IP address</strong>)
              is assigned an isolated request budget for the active window. When a new window starts, the counter is reset.
            </p>
          </div>

          <div className="rounded-2xl border border-[#EBECEF] p-4">
            <h4 className="font-extrabold text-[#18181B] text-xs uppercase tracking-wider text-[#71717A] mb-3">
              APIShield Middleware Execution Flow (<code className="font-mono text-[#4F46E5]">rateLimiter.middleware.js</code>)
            </h4>
            <ol className="list-decimal list-inside space-y-2 font-medium">
              <li>
                <strong>Atomic Increment:</strong> Executes <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">INCR ratelimit:&lt;identifier&gt;</code> in Redis to track consumer request volume atomically.
              </li>
              <li>
                <strong>TTL Window Initialization:</strong> On the first request of a window (<code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">requests === 1</code>), sets a TTL via <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">EXPIRE ratelimit:&lt;identifier&gt; 60</code>.
              </li>
              <li>
                <strong>Observability Tracking:</strong> Registers the identifier in the Redis Set <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">ratelimit:active</code> for real-time engine telemetry.
              </li>
              <li>
                <strong>Response Header Attachment:</strong> Attaches standard compliance headers: <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">X-RateLimit-Limit</code>, <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">X-RateLimit-Remaining</code>, and <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">Retry-After</code>.
              </li>
              <li>
                <strong>Enforcement &amp; Audit Rejection:</strong> If request count exceeds <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">MAX_REQUEST_LIMIT</code> (5), logs a <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">429</code> audit entry in PostgreSQL and throws a <code className="font-mono bg-[#F4F4F5] px-1.5 py-0.5 rounded text-[#18181B]">429 Rate Limit Exceeded</code> error.
              </li>
            </ol>
          </div>

          {/* Trade-offs Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4">
              <h5 className="font-bold text-[#15803D] text-xs flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Advantages &amp; Pros
              </h5>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#166534] font-medium">
                <li>Minimal Redis memory usage (1 integer key per consumer)</li>
                <li>Fast, constant-time <code className="font-mono">O(1)</code> execution per API call</li>
                <li>Predictable reset interval for downstream API clients</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <h5 className="font-bold text-[#D97706] text-xs flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="h-4 w-4 text-[#D97706]" />
                Trade-offs &amp; Boundary Burst Weakness
              </h5>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-[#92400E] font-medium">
                <li>Allows traffic spikes at window boundaries (e.g. 5 reqs at 00:59 + 5 reqs at 01:01 = 10 reqs in 2 seconds)</li>
                <li>Fixed boundaries do not smooth traffic bursts like Sliding Window or Token Bucket</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Alternative Algorithms (Not Implemented) */}
      <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                Alternative Algorithms
              </h3>
              <span className="rounded-full bg-[#F4F4F5] border border-[#EBECEF] px-2.5 py-0.5 text-[10px] font-extrabold text-[#71717A]">
                Conceptual / Not Implemented
              </span>
            </div>
            <p className="text-xs text-[#71717A] font-medium mt-0.5">
              Common rate-limiting algorithms for context. APIShield currently enforces Fixed-Window.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Sliding Window */}
          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#FAFAFA] opacity-90">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#71717A]" />
                Sliding Window
              </h4>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#71717A]">
                Not Implemented
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Smooths out boundary bursts by weighting the previous window's request count based on current time offset into the active window.
            </p>
          </div>

          {/* Token Bucket */}
          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#FAFAFA] opacity-90">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#71717A]" />
                Token Bucket
              </h4>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#71717A]">
                Not Implemented
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Allows controlled bursts by accumulating tokens over time up to bucket capacity, consuming one token per request.
            </p>
          </div>

          {/* Leaky Bucket */}
          <div className="p-4 rounded-2xl border border-[#EBECEF] bg-[#FAFAFA] opacity-90">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#71717A]" />
                Leaky Bucket
              </h4>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#71717A]">
                Not Implemented
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              Processes requests at a constant output rate regardless of burstiness using a FIFO queue, rejecting overflow beyond queue capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmsPage;
