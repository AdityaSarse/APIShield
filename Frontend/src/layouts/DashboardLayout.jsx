import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-[#18181B] antialiased">
      {/* Dreelio Sidebar */}
      <Sidebar />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 px-8 pb-12 max-w-[1600px] w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
