// app/page.tsx
import SidebarResearcher from "@/components/SidebarR";

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarResearcher />

      {children}
    </div>
  );
}
