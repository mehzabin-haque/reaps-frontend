'use client';

import Sidebar from "@/components/Sidebar";
import Interactive from "./interactive/page";
import useUser from "@/hooks/useUser";

export default function Dashboard() {
  const { user, updateUser } = useUser();
  return (
    <div className="flex min-h-screen">
    
      <div className="flex py-4">
        
        <Interactive />
      </div>
    </div>
  );
}
