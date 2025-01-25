// components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white flex justify-between items-center p-4">
      <div className="text-xl font-bold">REAPS</div>
      <div className="relative">
        <button className="flex items-center focus:outline-none">
          <img
            src="/profile-icon.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </button>
        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg hidden group-hover:block">
          <a href="#" className="block px-4 py-2 hover:bg-gray-200">Settings</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-200">Logout</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
