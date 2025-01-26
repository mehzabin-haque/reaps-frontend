// app/page.tsx
import Sidebar from "@/components/Sidebar";
import Interactive from "./interactive/page";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex">
        <h1 className="text-3xl font-bold mb-4">Welcome, [Name]!</h1>
        <Interactive />
      </div>
    </div>
  );
}
