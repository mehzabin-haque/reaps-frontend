"use client";
import { useState, useEffect } from "react";

interface Publication {
  title: string;
  date: string;
  summary: string;
}

export default function OECDReports() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/oecd")
      .then((response) => response.json())
      .then((data) => {
        // Ensure data is in the correct structure
        if (data.status === 'success' && Array.isArray(data.data)) {
          setPublications(data.data);
        } else {
          setError("No publications found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching publications:', err);
        setError("Failed to fetch publications");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading Publications...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Safely render publications only if it's an array
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">OECD Publications</h1>
      <div className="space-y-4">
        {publications.length > 0 ? (
          publications.map((publication, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold mb-2">{publication.title}</h2>
              <div className="text-sm text-gray-600 mb-2">Date: {publication.date}</div>
              <p className="text-gray-700">{publication.summary}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No publications available.</div>
        )}
      </div>
    </div>
  );
}