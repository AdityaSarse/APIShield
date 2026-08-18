import { useState } from "react";
import { Sliders, Shield, Save, Check } from "lucide-react";

function SettingsPage() {
  const [windowSize, setWindowSize] = useState("60");
  const [maxLimit, setMaxLimit] = useState("5");
  const [rateLimitMode, setRateLimitMode] = useState("fail-open");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#F4F4F5] border border-[#EBECEF] flex items-center justify-center text-[#18181B] shadow-2xs">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              Gateway Configuration &amp; Settings
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Manage rate limiting rules, fail-over policies, and system settings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex h-9 items-center gap-1.5 rounded-full bg-[#18181B] px-5 text-xs font-extrabold text-white shadow-md hover:bg-[#27272A] cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Sections */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Rate Limiting Configuration */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-[#F1F3F5]">
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#4F46E5]" />
              <span>Rate Limiter Defaults</span>
            </h3>
            <p className="text-xs text-[#71717A] font-medium">
              Global Redis fixed-window parameters applied to API requests
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                Sliding Window Size (Seconds)
              </label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(e.target.value)}
                className="w-full rounded-xl border border-[#EBECEF] bg-[#F8F9FA] px-3.5 py-2.5 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-[#71717A]">Default duration for request counter reset (60s)</p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                Max Request Limit per Window
              </label>
              <input
                type="number"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value)}
                className="w-full rounded-xl border border-[#EBECEF] bg-[#F8F9FA] px-3.5 py-2.5 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-[#71717A]">Maximum requests allowed per API Key or IP (5 reqs)</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F3F5]">
            <label className="block text-xs font-extrabold text-[#18181B] mb-2">
              Redis Outage Strategy (Fail Policy)
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                onClick={() => setRateLimitMode("fail-open")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  rateLimitMode === "fail-open"
                    ? "border-[#4F46E5] bg-[#EEF2FF]/60"
                    : "border-[#EBECEF] bg-[#F8F9FA]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">Fail-Open (Recommended)</span>
                  <input
                    type="radio"
                    name="failPolicy"
                    checked={rateLimitMode === "fail-open"}
                    onChange={() => setRateLimitMode("fail-open")}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#71717A]">
                  If Redis drops, allow API traffic through with <code>X-RateLimit-Degraded: true</code> header to prevent total downtime.
                </p>
              </label>

              <label
                onClick={() => setRateLimitMode("fail-closed")}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  rateLimitMode === "fail-closed"
                    ? "border-[#4F46E5] bg-[#EEF2FF]/60"
                    : "border-[#EBECEF] bg-[#F8F9FA]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">Fail-Closed</span>
                  <input
                    type="radio"
                    name="failPolicy"
                    checked={rateLimitMode === "fail-closed"}
                    onChange={() => setRateLimitMode("fail-closed")}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#71717A]">
                  If Redis drops, immediately reject all unmeasured traffic with 503 Service Unavailable.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs space-y-3">
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
            Environment &amp; Security
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
              <span className="text-[10px] font-semibold text-[#71717A]">Environment</span>
              <p className="mt-1 font-mono font-bold text-[#18181B]">development</p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#EBECEF] bg-[#F8F9FA]">
              <span className="text-[10px] font-semibold text-[#71717A]">CORS Origin</span>
              <p className="mt-1 font-mono font-bold text-[#18181B]">http://localhost:5173</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
