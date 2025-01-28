"use client";
import { useState, useEffect } from "react";
// Tailwind HeroIcons
import {
  BellIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
// Utility for conditional classNames
import { cn } from "../../../lib/utils/classname";
// Hook to retrieve the current user's data
import useUser from "@/hooks/useUser";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Example shape of a Publication
interface Publication {
  id: string;
  title: string;
  description?: string;
  date: string;     // e.g., "2025-01-28"
  category?: string;
  link?: string;    // Link to publication details
}

export default function Notifications() {
  // 1) Access user info (replace with your real user retrieval logic)
  const { user } = useUser();
  const userId = user?.id || "guest_user";

  // 2) Local state
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3) Fetch publications data from your /api/oecd-publications
  const fetchPublications = async () => {
    try {
      setLoading(true);

      // This endpoint is your own Next.js API route or backend endpoint
      // that scrapes/parses the OECD site and returns JSON
      const response = await fetch(`/api/oecd-publications`);
      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      // The response is expected to be an array of Publication objects
      const data: Publication[] = await response.json();

      // Filter publications from the last 7 days
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const recentPublications = data.filter((publication) => {
        const publicationDate = new Date(publication.date);
        return publicationDate >= lastWeek;
      });

      setPublications(recentPublications);
      setLoading(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch publications"
      );
      setLoading(false);
    }
  };

  // 4) useEffect: fetch on mount + refresh every 24 hrs
  useEffect(() => {
    fetchPublications();
    const interval = setInterval(fetchPublications, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper: check if the date is within the last week
  const isRecent = (dateString: string) => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const publicationDate = new Date(dateString);
    return publicationDate >= lastWeek;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            OECD Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as: {userId}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          // Loading state
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-32 mx-auto" />
              ))}
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : publications.length === 0 ? (
          // No new publications
          <div className="p-8 text-center text-gray-500">
            <InformationCircleIcon className="mx-auto mb-4 h-12 w-12" />
            <p className="text-sm">No new OECD publications in the last 7 days.</p>
          </div>
        ) : (
          // Success: Show list of new publications
          <>
            {/* Table header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-1">Status</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Category</div>
                <div className="col-span-3">Date</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {publications.map((publication) => (
                <div
                  key={publication.id}
                  className={cn(
                    "p-4 hover:bg-blue-50 cursor-pointer transition-colors",
                    isRecent(publication.date) ? "bg-blue-50" : ""
                  )}
                >
                  <div className="grid grid-cols-12 gap-4">
                    {/* Status */}
                    <div className="col-span-1 flex items-center space-x-1">
                      <BellIcon className="h-5 w-5 text-blue-600" />
                      {isRecent(publication.date) && (
                        <span className="text-xs text-blue-600 font-semibold">
                          New
                        </span>
                      )}
                    </div>

                    {/* Title and description */}
                    <div className="col-span-5">
                      <div className="text-gray-900 font-semibold">
                        {publication.title}
                      </div>
                      {publication.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {publication.description}
                        </div>
                      )}
                      {publication.link && (
                        <a
                          href={publication.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Publication
                        </a>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-span-3 flex items-center">
                      <span className="text-sm text-gray-600">
                        {publication.category || "–"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-3 flex items-center">
                      <span className="text-sm text-gray-600">
                        {new Date(publication.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Example placeholder for "Historical Notification Count Chart" or other analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Historical Notification Count
        </h2>
        <div className="h-64">
          {/* Replace with your real chart data */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { date: "Jan 22", count: 4 },
                { date: "Jan 23", count: 3 },
                { date: "Jan 24", count: 6 },
                { date: "Jan 25", count: 2 },
                { date: "Jan 26", count: 7 },
                { date: "Jan 27", count: 5 },
                { date: "Jan 28", count: 8 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#4f46e5" />
              <YAxis stroke="#4f46e5" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: "#4f46e5", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
