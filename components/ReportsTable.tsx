"use client";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/classname";

interface Report {
  id: string;
  title: string;
  uploadDate: string;
  status: "completed" | "in-progress" | "failed";
  outputPath?: string;
  userId?: string;
  fileType?: string;
}

interface ReportsTableProps {
  title: string;
  apiEndpoint: string;
}

export default function ReportsTable({ title, apiEndpoint }: ReportsTableProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [sortConfig, setSortConfig] = useState<null | {
    key: keyof Report;
    direction: "ascending" | "descending";
  }>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports || []);
      })
      .catch((err) => console.error(`Error fetching from ${apiEndpoint}:`, err));
  }, [apiEndpoint]);

  const sortedReports = [...reports].sort((a, b) => {
    if (!sortConfig) return 0;

    const aVal = (a[sortConfig.key] || "") as string;
    const bVal = (b[sortConfig.key] || "") as string;

    if (aVal < bVal) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredReports = sortedReports.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      report.title.toLowerCase().includes(term) 
      
    );
  });

  const handleSort = (key: keyof Report) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                {/* Title */}
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("title")}
                >
                  Document Title
                  {sortConfig?.key === "title" && (
                    <span className="ml-2 inline-block align-middle">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )}
                    </span>
                  )}
                </th>

                
               

                {/* Upload Date */}
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("uploadDate")}
                >
                  Upload Date
                  {sortConfig?.key === "uploadDate" && (
                    <span className="ml-2 inline-block align-middle">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )}
                    </span>
                  )}
                </th>

                {/* Status */}
                <th
                  className={cn(
                    "px-6 py-3 text-left text-sm font-semibold text-gray-900",
                    "hover:bg-blue-100 cursor-pointer"
                  )}
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig?.key === "status" && (
                    <span className="ml-2 inline-block align-middle">
                      {sortConfig.direction === "ascending" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )}
                    </span>
                  )}
                </th>

                {/* Actions */}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {report.title}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
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
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // "View" => open the file in a new tab if completed
                          if (report.status === "completed" && report.outputPath) {
                            window.open(report.outputPath, "_blank");
                          }
                        }}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View
                      </button>
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // "Export" => also open or force download
                          if (report.status === "completed" && report.outputPath) {
                            window.open(report.outputPath, "_blank");
                          }
                        }}
                      >
                        <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No matching reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
