
import React from 'react';

const DashboardHome: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Welcome, [Name]!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button className="bg-secondary text-white py-2 px-4 rounded flex items-center">
          {/* Upload Icon */}
          <svg className="w-5 h-5 mr-2" /* SVG PATH */></svg>
          Upload Document
        </button>
        <button className="bg-secondary text-white py-2 px-4 rounded flex items-center">
          {/* Reports Icon */}
          <svg className="w-5 h-5 mr-2" /* SVG PATH */></svg>
          View Reports
        </button>
        <button className="bg-secondary text-white py-2 px-4 rounded flex items-center">
          {/* Notifications Icon */}
          <svg className="w-5 h-5 mr-2" /* SVG PATH */></svg>
          Notifications
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Number of Uploaded Documents */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Uploaded Documents</h2>
          <p className="text-3xl">25</p>
        </div>
        {/* Latest Analysis Status */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Latest Analysis</h2>
          <p className="text-3xl">Completed</p>
        </div>
        {/* Upcoming Customization Options */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Upcoming Customizations</h2>
          <p className="text-3xl">3</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
