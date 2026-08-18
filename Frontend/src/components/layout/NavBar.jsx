import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  FolderKanban,
  Clock,
  Gauge,
  Activity,
  Sliders,
  AlertTriangle,
  LineChart,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "Clients & Keys", path: "/api-keys", icon: Users },
  { name: "Services", path: "/services", icon: FolderKanban },
  { name: "Analytics", path: "/analytics", icon: Clock },
  { name: "Advanced", path: "/advanced-analytics", icon: LineChart },
  { name: "Rate Limits", path: "/rate-limiting", icon: Gauge },
  { name: "Algorithms", path: "/algorithms", icon: Sliders },
  { name: "Traffic", path: "/traffic", icon: Activity },
  { name: "Alerts & Health", path: "/system-health", icon: AlertTriangle },
  { name: "Settings", path: "/settings", icon: Settings },
];

function NavBar() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/dashboard" && location.pathname === "/");

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#EBECEF] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-[56px] sm:h-[60px] flex items-center gap-3">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link
            to="/dashboard"
            className="flex items-center shrink-0"
          >
            <span className="font-extrabold text-[15px] tracking-tight text-[#111111]">
              APIShield
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto scrollbar-hide flex-1 min-w-0 mx-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all select-none ${
                    active
                      ? "bg-[#111111] text-white shadow-sm"
                      : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                  }`}
                >
                  <item.icon
                    className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white" : "text-[#A1A1AA]"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Spacer (mobile) ───────────────────────────────────── */}
          <div className="flex-1 lg:hidden" />

          {/* ── Right Controls ───────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Search — desktop only */}
            <div className="relative hidden xl:block">
              {searchOpen ? (
                <>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA] pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search..."
                    onBlur={() => setSearchOpen(false)}
                    className="w-48 pl-9 pr-3 py-1.5 text-xs bg-[#F4F4F5] border border-[#EBECEF] rounded-full placeholder-[#A1A1AA] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all"
                  />
                </>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="h-8 w-8 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#EBECEF] hover:text-[#18181B] transition-all cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="h-8 w-8 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#EBECEF] hover:text-[#18181B] transition-all cursor-pointer relative"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
            </button>

            {/* Avatar / User Menu — desktop */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-[#F4F4F5] hover:bg-[#EBECEF] transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-[#111111] flex items-center justify-center font-bold text-[10px] text-white">
                  AU
                </div>
                <span className="text-[12px] font-semibold text-[#18181B] hidden md:block">
                  Leonardo
                </span>
                <ChevronDown className="h-3 w-3 text-[#71717A]" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white border border-[#EBECEF] shadow-lg overflow-hidden z-50"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-[#F1F3F5]">
                    <p className="text-xs font-bold text-[#18181B]">Leonardo / Admin</p>
                    <p className="text-[10px] text-[#71717A] mt-0.5">admin@apishield.io</p>
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-[#71717A] hover:bg-[#F8F9FA] hover:text-[#18181B] transition-all"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Settings & Config
                  </Link>
                  <button
                    type="button"
                    onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium text-[#71717A] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger — mobile/tablet only */}
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-8 w-8 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#EBECEF] hover:text-[#18181B] transition-all cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer Panel ───────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBECEF]">
          <span className="font-extrabold text-[15px] tracking-tight text-[#111111]">
            APIShield
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="h-8 w-8 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#EBECEF] hover:text-[#18181B] transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#111111] text-white"
                    : "text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#A1A1AA]"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer — user info + sign out */}
        <div className="px-3 py-4 border-t border-[#EBECEF] space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#EBECEF]">
            <div className="h-8 w-8 rounded-full bg-[#111111] flex items-center justify-center font-bold text-xs text-white shrink-0">
              AU
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#18181B] truncate">Leonardo / Admin</p>
              <p className="text-[10px] text-[#71717A] truncate">admin@apishield.io</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#71717A] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export default NavBar;
