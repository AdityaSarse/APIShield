import { Search, ArrowLeft, Bell, Settings, Clock, ShieldCheck } from "lucide-react";

function Topbar() {
  return (
    <header className="px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none">
      {/* Greeting & Back Navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          className="h-8 w-8 rounded-full border border-[#EBECEF] bg-white flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
            Hello, Leonardo
          </h1>
          <p className="text-xs text-[#71717A] font-medium">
            What are you securing today?
          </p>
        </div>
      </div>

      {/* Center Search Pill & Right Utility Controls */}
      <div className="flex items-center gap-3">
        {/* Search Input Pill */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#EBECEF] rounded-full placeholder-[#A1A1AA] text-[#18181B] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] transition-all"
          />
        </div>

        {/* Action Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="h-9 w-9 rounded-full bg-white border border-[#EBECEF] flex items-center justify-center text-[#71717A] hover:text-[#18181B] hover:border-[#18181B] transition-all cursor-pointer shadow-2xs"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Gateway Status"
            className="h-9 w-9 rounded-full bg-white border border-[#EBECEF] flex items-center justify-center text-[#71717A] hover:text-[#18181B] hover:border-[#18181B] transition-all cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
          </button>

          <button
            type="button"
            aria-label="Settings"
            className="h-9 w-9 rounded-full bg-white border border-[#EBECEF] flex items-center justify-center text-[#71717A] hover:text-[#18181B] hover:border-[#18181B] transition-all cursor-pointer shadow-2xs"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Session Timer Pill */}
          <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#EBECEF] text-xs font-mono font-semibold text-[#18181B] flex items-center gap-1.5 shadow-2xs">
            <Clock className="h-3.5 w-3.5 text-[#71717A]" />
            <span>0:00:00</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
