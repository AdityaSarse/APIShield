import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Home,
  Users,
  FolderKanban,
  Clock,
  Gauge,
  Activity,
  Sliders,
  AlertTriangle,
  Headphones,
  LogOut,
  ChevronRight,
  LineChart,
  Settings,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const mainItems = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Clients & Keys", path: "/api-keys", icon: Users },
    { name: "Services", path: "/services", icon: FolderKanban },
    { name: "Traffic Analytics", path: "/analytics", icon: Clock },
    { name: "Advanced Analytics", path: "/advanced-analytics", icon: LineChart },
  ];

  const toolItems = [
    { name: "Rate Limits", path: "/rate-limiting", icon: Gauge },
    { name: "Algorithms", path: "/algorithms", icon: Sliders },
    { name: "Traffic Monitor", path: "/traffic", icon: Activity },
    { name: "Alerts & Health", path: "/system-health", icon: AlertTriangle },
  ];

  const isLinkActive = (path) => {
    return location.pathname === path || (path === "/dashboard" && location.pathname === "/");
  };

  return (
    <aside className="w-64 border-r border-[#EBECEF] bg-white flex flex-col justify-between h-screen sticky top-0 select-none p-5">
      <div className="space-y-7">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="h-9 w-9 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-xs">
            <Shield className="h-5 w-5 fill-white text-[#18181B]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#18181B]">
            APIShield
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* MAIN */}
          <div>
            <div className="px-3 mb-2.5 text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase">
              Main
            </div>
            <nav className="space-y-1">
              {mainItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all ${
                      active
                        ? "bg-[#F1F3F5] text-[#18181B] font-bold"
                        : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] font-medium"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[#18181B]" : "text-[#71717A]"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* TOOLS & GATEWAY */}
          <div>
            <div className="px-3 mb-2.5 text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase">
              Tools & Gateway
            </div>
            <nav className="space-y-1">
              {toolItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all ${
                      active
                        ? "bg-[#F1F3F5] text-[#18181B] font-bold"
                        : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] font-medium"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[#18181B]" : "text-[#71717A]"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ADMINISTRATION */}
      <div className="pt-4 border-t border-[#EBECEF] space-y-2">
        <div className="px-3 text-[10px] font-bold tracking-wider text-[#A1A1AA] uppercase">
          Administration
        </div>
        
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium transition-all ${
            location.pathname === "/settings"
              ? "bg-[#F1F3F5] text-[#18181B] font-bold"
              : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
          }`}
        >
          <Settings className="h-4 w-4 text-[#71717A]" />
          <span>Settings &amp; Config</span>
        </Link>
        
        <a
          href="#support"
          className="flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-all"
        >
          <Headphones className="h-4 w-4 text-[#71717A]" />
          <span>Support</span>
        </a>

        {/* User Profile Info Card */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#F8F9FA] border border-[#EBECEF]">
          <div className="h-8 w-8 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#18181B] truncate">Leonardo / Admin</div>
            <div className="text-[10px] text-[#71717A] truncate">admin@apishield.io</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-medium text-[#71717A] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
