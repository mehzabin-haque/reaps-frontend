// app/page.tsx
import Sidebar from "@/components/Sidebar";
import Interactive from "./interactive/page";

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {children}
    </div>
  );
}
