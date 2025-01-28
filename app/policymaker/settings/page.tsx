"use client";

import useUser from "@/hooks/useUser";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation"; 

interface SocioEconomicInfo {
  id: string;
  gdpRange: number;
  population: number;
  incomeType: "Low" | "Mid" | "High";
}

export default function CustomizationSettings() {
  const [values, setValues] = useState({
    updateFrequency: "quarterly",
    socioEconomicInfos: [] as SocioEconomicInfo[],
    ethics: true,
    governance: true,
    innovation: true,
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { user } = useUser();
  const userId = user?.id || "guest_user"; // Fallback if user is not logged in
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      // 1) Build FormData so we can POST to /api/customize in multipart form
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("updateFrequency", values.updateFrequency);
      formData.append("ethics", String(values.ethics));
      formData.append("governance", String(values.governance));
      formData.append("innovation", String(values.innovation));

      // Because we have multiple entries, let's pass them as a JSON string
      formData.append(
        "socioEconomicInfos",
        JSON.stringify(values.socioEconomicInfos)
      );

      // 2) Send data to the new API route
      const res = await axios.post("/api/customize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3) Handle success
      alert("Customization data processed successfully!");
      console.log("Response from server:", res.data);

      // Redirect to /policymaker/reports
      router.push("/policymaker/reports");
    } catch (error) {
      console.error("Error saving customization data:", error);
      alert("Error saving customization data. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  // The rest of your UI for adding/updating entries remains the same...
  const toggleFocusArea = (area: keyof typeof values) => {
    setValues((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  const addSocioEconomicInfo = () => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: [
        ...prev.socioEconomicInfos,
        {
          id: uuidv4(),
          gdpRange: 5,
          population: 1000000,
          incomeType: "Low",
        },
      ],
    }));
  };

  const removeSocioEconomicInfo = (id: string) => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: prev.socioEconomicInfos.filter(
        (info) => info.id !== id
      ),
    }));
  };

  const updateSocioEconomicInfo = (
    id: string,
    field: keyof Omit<SocioEconomicInfo, "id">,
    value: any
  ) => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: prev.socioEconomicInfos.map((info) =>
        info.id === id ? { ...info, [field]: value } : info
      ),
    }));
  };

  return (
    <div className="min-h-screen w-3/4 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-semibold mb-8 text-blue-500">
          Customization Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Update Frequency Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-400">
              Update Frequency
            </label>
            <select
              value={values.updateFrequency}
              onChange={(e) =>
                setValues({ ...values, updateFrequency: e.target.value })
              }
              className="w-full bg-blue-50 border border-blue-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={isLoading} // Disable during loading
            >
              <option value="quarterly">Quarterly Updates</option>
              <option value="bi-annual">Bi-Annual Updates</option>
              <option value="annual">Annual Updates</option>
            </select>
          </div>

          {/* Socio-Economic Information Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-500">
              Socio-Economic Information
            </label>

            <button
              type="button"
              onClick={addSocioEconomicInfo}
              className={`bg-blue-300 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading} // Disable during loading
            >
              Add Socio-Economic Entry
            </button>

            {values.socioEconomicInfos.length > 0 && (
              <div className="space-y-6">
                {values.socioEconomicInfos.map((info, index) => (
                  <div
                    key={info.id}
                    className="border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-blue-600">
                        Entry {index + 1}
                      </h2>
                      <button
                        type="button"
                        onClick={() => removeSocioEconomicInfo(info.id)}
                        className={`text-red-500 hover:text-red-700 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading} // Disable during loading
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* GDP Range */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">
                          GDP Growth Rate (-10 to 30)
                        </label>
                        <input
                          type="range"
                          min={-10}
                          max={30}
                          step={0.1}
                          value={info.gdpRange}
                          onChange={(e) =>
                            updateSocioEconomicInfo(
                              info.id,
                              "gdpRange",
                              Number(e.target.value)
                            )
                          }
                          className="w-full"
                          disabled={isLoading} // Disable during loading
                        />
                        <div className="flex justify-between text-sm text-blue-500">
                          <span>-10</span>
                          <span>30</span>
                        </div>
                        <div className="mt-1 text-sm text-blue-600">
                          Selected: {info.gdpRange.toFixed(1)}
                        </div>
                      </div>

                      {/* Population */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">
                          Population
                        </label>
                        <input
                          type="number"
                          value={info.population}
                          onChange={(e) =>
                            updateSocioEconomicInfo(
                              info.id,
                              "population",
                              Number(e.target.value)
                            )
                          }
                          className="w-full bg-blue-50 border border-blue-300 text-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          min={0}
                          disabled={isLoading} // Disable during loading
                        />
                      </div>

                      {/* Income Type */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">
                          Income Type
                        </label>
                        <select
                          value={info.incomeType}
                          onChange={(e) =>
                            updateSocioEconomicInfo(
                              info.id,
                              "incomeType",
                              e.target.value as "Low" | "Mid" | "High"
                            )
                          }
                          className="w-full bg-blue-50 border border-blue-300 text-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          disabled={isLoading} // Disable during loading
                        >
                          <option value="Low">Low</option>
                          <option value="Mid">Mid</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Focus Areas Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-700">
              Focus Areas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries({
                Ethics: "ethics",
                Governance: "governance",
                Innovation: "innovation",
              }).map(([label, key]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={values[key as keyof typeof values] as boolean}
                    onChange={() =>
                      toggleFocusArea(key as keyof typeof values)
                    }
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isLoading} // Disable during loading
                  />
                  <label htmlFor={key} className="ml-3 text-md text-blue-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button Section */}
          <div className="flex justify-end items-center space-x-4">
            {isLoading && (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
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
                <span className="text-blue-600">Saving...</span>
              </div>
            )}

            <button
              type="submit"
              className={`bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading} // Disable during loading
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
