// app/layout.tsx
'use client';
import { type Metadata } from "next";
import Sidebar from "../components/Sidebar"; // Adjust the path if necessary
import "./globals.css"; // Ensure your global styles are imported
import { UserIcon } from "@heroicons/react/24/outline";
import LoginPage from "./login/page";

// export const metadata: Metadata = {
//   title: "Policy Maker Dashboard | REAPS",
//   description: "AI-powered policy analysis platform",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
        {/* Header */}
        {/* <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">REAPS</span>
            </div>
            <div className="flex items-center">
              <button className="rounded-full hover:bg-gray-100 p-2">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </header> */}
        {children}
        
      </body>
    </html>
  );
}
