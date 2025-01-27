// app/notifications/page.tsx
'use client';
import { useState } from "react";
import {
  BellIcon,
  EyeIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils/classname";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, CartesianGrid } from "recharts";

// Sample data for notifications
const notifications = [
  {
    id: 1,
    title: "AI Policy Draft Completion",
    description: "The AI policy draft for Bangladesh has been successfully analyzed.",
    date: "2023-10-15",
    category: "Analysis",
    status: "completed",
    read: false,
  },
  {
    id: 2,
    title: "New Updates Available",
    description: "New policy updates for the AI governance framework are available.",
    date: "2023-10-14",
    category: "Updates",
    status: "new",
    read: false,
  },
  {
    id: 3,
    title: "System Maintenance",
    description: "Scheduled maintenance will occur on October 16, 2023, from 2 AM to 4 AM.",
    date: "2023-10-13",
    category: "Maintenance",
    status: "info",
    read: true,
  },
];

// Sample historical data for notification counts
const historicalData = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 18 },
  { month: "Mar", count: 25 },
  { month: "Apr", count: 15 },
  { month: "May", count: 22 },
  { month: "Jun", count: 29 },
  { month: "Jul", count: 17 },
  { month: "Aug", count: 24 },
  { month: "Sep", count: 28 },
  { month: "Oct", count: 19 },
  { month: "Nov", count: 14 },
  { month: "Dec", count: 21 },
];

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Filtered notifications
  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort notifications (you can add more sorting logc here)
  const sortedNotifications = [...filteredNotifications];
  if (sortBy === "date") {
    sortedNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Notifications</h1>

      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full sm:w-2/3 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by date</option>
          <option value="status">Sort by status</option>
          <option value="category">Sort by category</option>
        </select>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="col-span-2">Type</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 hover:bg-blue-50 cursor-pointer",
                !notification.read ? "font-semibold bg-blue-50" : ""
              )}
            >
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 flex items-center">
                  <BellIcon className="mr-2 h-4 w-4 text-blue-600" />
                  {notification.read ? (
                    <span className="text-sm text-gray-500">Read</span>
                  ) : (
                    <span className="text-sm text-blue-600">New</span>
                  )}
                </div>
                <div className="col-span-4">
                  <div className="text-lg">
                    <span className="text-gray-900 dark:text-gray-200">{notification.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.description}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.category}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(notification.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      notification.status === "completed" ? "bg-green-100 text-green-800" :
                      notification.status === "new" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    )}
                  >
                    {notification.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state (if needed) */}
        {sortedNotifications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <InformationCircleIcon className="mx-auto mb-4 h-12 w-12" />
            <p className="text-sm">No notifications found.</p>
          </div>
        )}
      </div>

      {/* Historical Notification Count Chart */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#667eea"
                tick={{ fill: "#667eea" }}
                axisLine={{ stroke: "#667eea" }}
              />
              <YAxis
                stroke="#667eea"
                tick={{ fill: "#667eea" }}
                axisLine={{ stroke: "#667eea" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#f8fafc", border: "none", borderRadius: "8px" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ fill: "#667eea", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    
  );
}