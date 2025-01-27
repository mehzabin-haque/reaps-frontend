// app/interactive/page.tsx
'use client';
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { HomeIcon, InboxIcon,FilmIcon, Cog8ToothIcon, ChartPieIcon } from "@heroicons/react/24/outline";

// Sample data for charts
const policyAnalysis = [
  { country: "USA", score: 85 },
  { country: "Canada", score: 80 },
  { country: "UK", score: 78 },
  { country: "Germany", score: 82 },
  { country: "Japan", score: 76 },
];

const policyTrends = [
  { year: 2020, count: 125 },
  { year: 2021, count: 275 },
  { year: 2022, count: 450 },
  { year: 2023, count: 670 },
];

const focusAreas = [
  { area: "Ethics", value: 25 },
  { area: "Governance", value: 30 },
  { area: "Innovation", value: 20 },
  { area: "Economic Impact", value: 25 },
];

export default function InteractiveDashboard() {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const colors = ["#667eea", "#818cf8", "#9333ea", "#a855f4", "#ec4899"];

  return (
    <div className="flex flex-col py-8">
      
      {/* Dashboard sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analysis by Country (Bar Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Analysis by Country</h2>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              <Cog8ToothIcon className="mr-2 h-4 w-4" />
              Customize
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={policyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="country"
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
                <Bar
                  dataKey="score"
                  fill="#667eea"
                  radius={[4, 4, 0, 0]}
                  label={(props) => {
                    const { x, y, width, value } = props;
                    return (
                      <text
                        x={x + width / 2}
                        y={y - 5}
                        fill="#667eea"
                        textAnchor="middle"
                      >
                        {value}%
                      </text>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy Trends Over Time (Line Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Policy Trends Over Time</h2>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              <ChartPieIcon className="mr-2 h-4 w-4" />
              View Data
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={policyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="year"
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

        {/* Focus Areas (Pie Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Focus Areas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={focusAreas}
                  dataKey="value"
                  nameKey="area"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#fff"
                  label
                  stroke="#667eea"
                >
                  {focusAreas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}