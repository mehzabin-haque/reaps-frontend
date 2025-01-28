"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import useUser from "@/hooks/useUser";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
  "#FF6384",
  "#36A2EB",
];

export default function InteractiveDashboard() {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [isLoadingPie, setIsLoadingPie] = useState<boolean>(true);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      console.log("No user ID available");
      setIsLoadingPie(false);
      return;
    }

    // Load "all.csv" from public folder
    Papa.parse("/all.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, any>[];
        processAllCsvData(data);
        setIsLoadingPie(false);
      },
      error: (err) => {
        console.error("Error loading all.csv:", err);
        setIsLoadingPie(false);
      },
    });
  }, [userId]);

  const processAllCsvData = (data: Record<string, any>[]) => {
    const areaCounts: Record<string, number> = {};

    data.forEach((row) => {
      const policyAreas = row["AI Policy Area(s)"];
      const otherPolicyAreas = row["Other AI Policy Area(s)"];

      // Combine both columns
      const combinedAreas = [policyAreas, otherPolicyAreas]
        .filter(Boolean)
        .join(",")
        .split(",")
        .map((area) => area.trim().toLowerCase())
        .filter(Boolean);

      combinedAreas.forEach((area) => {
        // Capitalize first letter
        const formattedArea =
          area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();

        if (areaCounts[formattedArea]) {
          areaCounts[formattedArea] += 1;
        } else {
          areaCounts[formattedArea] = 1;
        }
      });
    });

    // Sort areas by count in descending order
    const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);

    // Pick the top 5
    const topN = 5;
    const topAreas = sortedAreas.slice(0, topN);

    if (!topAreas.length) {
      setPieData([]);
      return;
    }

    // Convert counts to percentages
    const total = topAreas.reduce((acc, [, count]) => acc + count, 0);
    const pieChartData = topAreas.map(([name, count]) => ({
      name,
      value: parseFloat(((count / total) * 100).toFixed(2)),
    }));

    setPieData(pieChartData);
  };

  return (
    <div className="w-full flex justify-center p-8 bg-blue-50">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 ">
            AI Policy Focus Areas
          </h2>

          {isLoadingPie ? (
            <div className="flex justify-center items-center h-40 ">
              <svg
                className="animate-spin h-12 w-12 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          ) : pieData.length > 0 ? (
            <div className="flex items-center justify-center ">
              <ResponsiveContainer className="" width={400} height={400}>
                <PieChart >
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    
                    isAnimationActive
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: "14px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No data available for Pie Chart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
