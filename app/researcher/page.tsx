// app/page.tsx

import Sidebar from "@/components/Sidebar";
import Interactive from "./interactive/page";

export default function Dashboard() {
  return (
    <>
      
      <div className="flex-1 flex items-center justify-center bg-blue-50">
        <Interactive />
      </div>
    </>
  );
}
