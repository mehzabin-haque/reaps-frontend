"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils/classname";
import useUser from "@/hooks/useUser";

interface Publication {
  id: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  link?: string;
  isRead: boolean; // Added isRead property
}

interface PolicyData {
  title: string;
  date: string;
  content: string;
}

export default function Notifications() {
  const { user } = useUser();
  const userId = user?.id || "guest_user";
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load policy data from JSON file
  const loadPolicyData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/policy.json");
      if (!response.ok) {
        throw new Error("Failed to load policy data");
      }
      const data: PolicyData[] = await response.json();

      // Transform the data to match Publication interface
      let publicationsData: Publication[] = data.map((item, index) => ({
        id: index.toString(),
        title: item.title,
        description: item.content,
        date: formatDateString(item.date),
        category: "Policy", // Assuming a default category; adjust as needed
        isRead: !isRecent(item.date), // Mark as read if not recent
      }));

      // Sort publications by date in descending order (newest first)
      publicationsData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPublications(publicationsData);
      setLoading(false);
    } catch (error) {
      setError("Failed to load policy data");
      setLoading(false);
    }
  };

  // Helper function to transform date string to ISO format
  const formatDateString = (dateString: string) => {
    const dateParts = dateString.split(" ");
    const day = dateParts[0];
    const month = new Date(dateParts[1] + " 1").getMonth() + 1; // Get month number
    const year = dateParts[2];
    return `${year}-${month.toString().padStart(2, "0")}-${day}`;
  };

  // Check if the publication date is within the last 7 days
  const isRecent = (dateString: string) => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const publicationDate = new Date(dateString);
    return publicationDate >= lastWeek;
  };

  useEffect(() => {
    loadPolicyData();
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = (id: string) => {
    setPublications((prev) =>
      prev.map((pub) =>
        pub.id === id
          ? {
              ...pub,
              isRead: true,
            }
          : pub
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            OECD Notifications
          </h1>
          {/* <p className="text-sm text-gray-500 mt-1">Logged in as: {userId}</p> */}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-32 mx-auto" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : publications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <InformationCircleIcon className="mx-auto mb-4 h-12 w-12" />
            <p className="text-sm">No new OECD publications in the last 7 days.</p>
          </div>
        ) : (
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
                  onClick={() => {
                    if (!publication.isRead) {
                      handleMarkAsRead(publication.id);
                    }
                  }}
                  className={cn(
                    "p-4 hover:bg-blue-50 cursor-pointer transition-colors",
                    !publication.isRead ? "bg-blue-50" : "bg-white"
                  )}
                >
                  <div className="grid grid-cols-12 gap-4">
                    {/* Status */}
                    <div className="col-span-1 flex items-center space-x-1">
                      <BellIcon className="h-5 w-5 text-blue-600" />
                      {!publication.isRead && (
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
    </div>
  );
}
