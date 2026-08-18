import { Plus, RefreshCw, Shield } from "lucide-react";
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      {/* Left: greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#111111] flex items-center justify-center shadow-sm shrink-0">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111]">
            Hello, Leonardo 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] font-medium mt-0.5">
            Here is your API gateway overview
          </p>
        </div>
      </div>

      {/* Right: action pills */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#71717A] bg-white border border-[#EBECEF] rounded-full shadow-2xs hover:bg-[#F4F4F5] hover:text-[#18181B] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/api-keys")}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#111111] rounded-full shadow-sm hover:bg-[#333333] transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Create API Key</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardPageHeader;
