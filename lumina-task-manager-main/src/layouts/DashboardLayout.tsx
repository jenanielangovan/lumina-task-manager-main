import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { FAB } from "@/components/shared/FAB";

export const DashboardLayout = () => (
  <div className="flex h-screen w-full overflow-hidden">
    <AppSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
    <FAB />
  </div>
);
