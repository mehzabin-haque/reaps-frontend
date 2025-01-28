'use client ';
import Image from "next/image";
import LoginPage from "./login/page";

export default function Home() {
  return (
    <>
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

        <LoginPage />

        
      </body>
    </>
  );
}
