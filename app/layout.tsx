// app/layout.tsx
'use client';
import { type Metadata } from "next";
import Sidebar from "../components/Sidebar"; // Adjust the path if necessary
import "./globals.css"; // Ensure your global styles are imported
import { UserIcon } from "@heroicons/react/24/outline";
import LoginPage from "./login/page";
import { UserProvider } from "@/context/UserContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <html lang="en">
      <body >
      <UserProvider>
        {children}
        </UserProvider>
      </body>
    </html>
    
  );
}
