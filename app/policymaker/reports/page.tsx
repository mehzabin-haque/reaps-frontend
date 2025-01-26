// app/reports/page.tsx
'use client'
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils/classname";

interface Report {
  id: string;
  title: string;
  country: string;
  uploadDate: string;
  status: "completed" | "in-progress" | "failed";
}

export default function AnalysisReports() {
  const [sortConfig, setSortConfig] = useState<null | {
    key: keyof Report;
    direction: "ascending" | "descending";
  }>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sampleReports: Report[] = [
    {
      id: "1",
      title: "National AI Policy 2023",
      country: "Bangladesh",
      uploadDate: "2023-09-15",
      status: "completed",
    },
    {
      id: "2",
      title: "AI Governance Framework",
      country: "Canada",
      uploadDate: "2023-09-14",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Ethics in AI Development",
      country: "Sweden",
      uploadDate: "2023-09-13",
      status: "failed",
    },
  ];

  const sortedReports = [...sampleReports].sort((a, b) => {
    if (!sortConfig) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof Report) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analysis Reports</h1>
      
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search reports..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("title")}
                >
                  Document Title
                  {sortConfig?.key === "title" && (
                    <span className="ml-2">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("country")}
                >
                  Country
                  {sortConfig?.key === "country" && (
                    <span className="ml-2">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("uploadDate")}
                >
                  Upload Date
                  {sortConfig?.key === "uploadDate" && (
                    <span className="ml-2">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </th>
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig?.key === "status" && (
                    <span className="ml-2">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedReports.map((report) => (
                <tr key={report.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {report.country}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {report.uploadDate}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        report.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : report.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View
                      </button>
                      <button className="flex items-center text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                      Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}