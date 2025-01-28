// components/AIScorecard.tsx
'use client';

import { useState, useEffect } from "react";
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
import axios from "axios";

interface AIData {
  Country: string;
  Government: number;
  Technology: number;
  Sector: number;
  Data_and_Infrastructure: number;
}

interface HistoricalData {
  year: number;
  score: number;
}

interface Category {
  name: string;
  score: number;
  maxScore: number;
}

const AIScorecard: React.FC = () => {
  const [aiData, setAiData] = useState<AIData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("United States of America");
  const [currentData, setCurrentData] = useState<AIData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  // Fetch AI readiness data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AIData[]>("/score.json");
        setAiData(response.data);
      } catch (error) {
        console.error("Error fetching AI readiness data:", error);
      }
    };
    fetchData();
  }, []);

  // Update currentData and historicalData when selectedCountry changes
  useEffect(() => {
    if (aiData.length > 0) {
      const countryData = aiData.find(
        (country) => country.Country === selectedCountry
      );
      setCurrentData(countryData || null);

      // Generate mock historical data for demonstration
      if (countryData) {
        setHistoricalData([
          { year: 2020, score: countryData.Government - 20 },
          { year: 2021, score: countryData.Government - 10 },
          { year: 2022, score: countryData.Government - 5 },
          { year: 2023, score: countryData.Government },
          { year: 2024, score: countryData.Government },
        ]);
      } else {
        setHistoricalData([]);
      }
    }
  }, [selectedCountry, aiData]);

  // Handle country selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  // Define category breakdown based on currentData
  const categories: Category[] = currentData
    ? [
        { name: "Government", score: currentData.Government, maxScore: 100 },
        { name: "Technology", score: currentData.Technology, maxScore: 100 },
        { name: "Sector", score: currentData.Sector, maxScore: 100 },
        {
          name: "Data and Infrastructure",
          score: currentData.Data_and_Infrastructure,
          maxScore: 100,
        },
      ]
    : [];

  // Define color scale
  const getColor = (score: number) => {
    return score > 75
      ? "#004529"
      : score > 70
      ? "#006837"
      : score > 65
      ? "#238443"
      : score > 60
      ? "#41ab5d"
      : score > 55
      ? "#78c679"
      : score > 50
      ? "#addd8e"
      : "#d9f0a3";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Readiness Scorecard</h1>

      {/* Country Selection */}
      <div className="flex justify-center mb-8">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {aiData.map((country) => (
            <option key={country.Country} value={country.Country}>
              {country.Country}
            </option>
          ))}
        </select>
      </div>

      {/* Overall Readiness Score */}
      {currentData && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Overall Readiness Score</h2>
              <p className="text-sm text-gray-600">
                Current level of AI readiness and preparedness
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">{currentData.Government}%</span>
              <span className="text-gray-500 text-sm">/ 100%</span>
            </div>
          </div>

          {/* Progress circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
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
                strokeDasharray={2 * Math.PI * 40} // Total circumference
                strokeDashoffset={2 * Math.PI * 40 * (1 - currentData.Government / 100)} // Offset based on percentage
                strokeLinecap="round"
                stroke="currentColor"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">{currentData.Government}%</span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-600 text-center">
            Indicates a strong foundation in AI readiness with room for improvement in certain areas
          </p>
        </div>
      )}

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <span className="mr-2 text-2xl">
                  <Cog8ToothIcon className="text-blue-600 w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">
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
      )}

      
    </div>
  );
};

export default AIScorecard;
