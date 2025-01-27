// app/scorecard/page.tsx
'use client'
import { useState } from "react";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../../lib/utils/classname";

// Sample data for historical trends
const historicalData = [
  { year: 2020, score: 65 },
  { year: 2021, score: 72 },
  { year: 2022, score: 78 },
  { year: 2023, score: 85 },
];

// Sample categories data
const categories = [
  { name: "Governance", score: 85, maxScore: 100 },
  { name: "Ethics", score: 80, maxScore: 100 },
  { name: "Innovation", score: 88, maxScore: 100 },
  { name: "Economic Impact", score: 78, maxScore: 100 },
];

export default function AIScorecard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">AI Readiness Scorecard</h1>

      {/* Overall Readiness Score */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Overall Readiness Score
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current level of AI readiness and preparedness
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">85%</span>
            <span className="text-gray-500 text-sm">/ 100%</span>
          </div>
        </div>

        {/* Progress circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle
              className="text-gray-200"
              r={40}
              cx={50}
              cy={50}
              strokeWidth={8}
              fill="transparent"
              stroke="currentColor"
            />
            <circle
              className="text-blue-600"
              r={40}
              cx={50}
              cy={50}
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={`${85 * (2 * Math.PI)}`}
              strokeLinecap="round"
              strokeDashoffset={0}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">85%</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Indicates a strong foundation in AI readiness with room for improvement in certain areas
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="mr-2 text-2xl">
                <Cog8ToothIcon className="text-blue-600" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.score}/{category.maxScore}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2"
                style={{ width: `${(category.score / category.maxScore) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Historical Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                stroke="#667eea"
                tick={{ fill: "#667eea" }}
                axisLine={{ stroke: "#667eea" }}
              />
              <YAxis stroke="#667eea" tick={{ fill: "#667eea" }} axisLine={{ stroke: "#667eea" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f8fafc", border: "none", borderRadius: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="score"
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