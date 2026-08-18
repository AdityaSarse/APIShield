import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardPageHeader({ onRefresh }) {
  const navigate = useNavigate();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Monitor API traffic, gateway latency, and rate-limiting metrics across all active services.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-white border border-[var(--color-border)] rounded-xl shadow-2xs hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 text-[var(--color-text-muted)]" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/api-keys")}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create API Key</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardPageHeader;
