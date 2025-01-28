"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import useUser from "@/hooks/useUser";


/** Dummy data for your line chart, etc. */
const policyTrends = [
  { year: 2020, count: 125 },
  { year: 2021, count: 275 },
  { year: 2022, count: 450 },
  { year: 2023, count: 670 },
];

const COLORS = [
  "#C70039",
  "#45a2c8",
  "#5555c8",
  "#359476",
  "#000000",
  "#ffc658",
  "#ff8042",
  "#d0ed57",
  "#a4de6c",
  
];

const DashboardContainer = ({ children }: any) => (
  <div className="max-w-7xl mx-auto p-6 space-y-8 bg-white min-h-screen">
    {children}
  </div>
);

const Card = ({ title, children, isLoading, noDataMessage }: any) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    {isLoading ? (
      <div className="flex justify-center items-center h-48">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V8h4z"
          ></path>
        </svg>
      </div>
    ) : noDataMessage && !children ? (
      <p className="text-gray-500">{noDataMessage}</p>
    ) : (
      children
    )}
  </div>
);

export default function InteractiveDashboard() {
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [matrixHeaders, setMatrixHeaders] = useState<string[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState<boolean>(true);
  const [isLoadingPie, setIsLoadingPie] = useState<boolean>(true);

  const { user } = useUser(); 
  const userId = user?.id || "guest_user";
  const csvPath = `/output_${userId}/semantic_similarity_matrix.csv`;

  useEffect(() => {
    // Load "semantic_similarity_matrix.csv" from public folder
     Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        setMatrixData(data);

        if (data.length > 0) {
          const columns = Object.keys(data[0] as Record<string, any>);
          setMatrixHeaders(columns);
        }
        setIsLoadingMatrix(false);
      },
      error: (err) => {
        console.error("Error loading semantic_similarity_matrix.csv:", err);
        setIsLoadingMatrix(false);
      },
    });

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
  }, []);

  const processAllCsvData = (data: Record<string, any>[]) => {
    const areaCounts: Record<string, number> = {};

    data.forEach((row) => {
      const policyAreas = row["AI Policy Area(s)"];
      const otherPolicyAreas = row["Other AI Policy Area(s)"];

      // Combine both columns
      const combinedAreas = [policyAreas, otherPolicyAreas]
        .filter(Boolean) // Remove undefined or null
        .join(",")
        .split(",") // Split by comma
        .map((area) => area.trim().toLowerCase()) // Trim and lowercase
        .filter(Boolean); // Remove empty strings

      combinedAreas.forEach((area) => {
        // Capitalize first letter for consistency
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

    const topN = 5; // Number of top categories to display
    const topAreas = sortedAreas.slice(0, topN);
    const otherAreas = sortedAreas.slice(topN);

    // Convert counts to percentage
    const total = topAreas.reduce((a, b) => a + b[1], 0);
    const pieChartData = topAreas.map(([name, value]) => ({
      name,
      value: parseFloat(((value / total) * 100).toFixed(2)), // Keep two decimal places
    }));

    setPieData(pieChartData);
  };

  return (
    <DashboardContainer>
      {/* Semantic Similarity Matrix Table */}
      <Card
        title="Semantic Similarity Matrix"
        isLoading={isLoadingMatrix}
        noDataMessage="No data available."
      >
        {matrixHeaders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {matrixHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matrixData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {matrixHeaders.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap"
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      {/* AI Policy Focus Areas (Pie Chart) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">AI Policy Focus Areas</h2>
        <div className="h-80 flex justify-center items-center">
          {isLoadingPie ? (
            <div className="flex justify-center items-center h-full">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" className={"pb-8"}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  isAnimationActive={true}
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
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available for Pie Chart.</p>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
}
