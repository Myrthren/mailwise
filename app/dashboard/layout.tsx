import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/DashboardNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <DashboardNav />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
