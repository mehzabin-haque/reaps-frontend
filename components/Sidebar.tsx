// components/Sidebar.tsx
'use client'; // Ensure this is at the top for client-side hooks
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils/classname";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BellIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  Cog8ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import useUser from "@/hooks/useUser";
import { useState } from "react";

const navigation = [
  { name: "Dashboard Home", href: "/policymaker", icon: DocumentTextIcon },
  { name: "Upload Policy Document", href: "/policymaker/upload", icon: CloudArrowUpIcon },
  { name: "Analysis Reports", href: "/policymaker/reports", icon: AcademicCapIcon },
  { name: "Notifications", href: "/policymaker/notification", icon: BellIcon },
  { name: "Customization Settings", href: "/policymaker/settings", icon: Cog8ToothIcon },
  { name: "AI Readiness Scorecard", href: "/policymaker/scorecard", icon: ArrowPathIcon },
  
];

export default function Sidebar() {
  const pathname = usePathname();
  // const [user, setUser] = useState(null);
  const router = useRouter();
  const { user, updateUser, logout } = useUser();
  
  const handleLogout = () => {
    logout(); // Call logout from useUser
    router.push('/login'); // Redirect to the home page or login page
  };


  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Navigation */}
      <nav className="mt-4 px-4 flex-1">
        <ul className="space-y-1 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-4 py-6 text-sm font-medium",
                    isActive
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-500 dark:text-white"
                      : "text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-blue-500"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-4 py-4">
        <button onClick={handleLogout} className="w-full text-left rounded-md bg-blue-300 text-white px-4 py-2 hover:bg-blue-500">
          Logout
        </button>
      </div>
    </aside>
  );
}
