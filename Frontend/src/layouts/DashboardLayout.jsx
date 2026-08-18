import { Outlet } from "react-router-dom";
import NavBar from "../components/layout/NavBar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#18181B] antialiased">
      {/* Horizontal sticky top navigation */}
      <NavBar />

      {/* Page content */}
      <main className="max-w-[1600px] mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pb-16">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
