// app/page.tsx
import Sidebar from "@/components/Sidebar";
import Interactive from "./interactive/page";
import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

  return (
    <UserProvider>
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {children}
    </div>
    </UserProvider>
  );
}
