"use client";
import useUser from "@/hooks/useUser";
import ReportsTable from "../../../components/ReportsTable"; // Adjust the import path accordingly

export default function AnalysisReports() {
  const { user } = useUser();
  const userId = user?.id;
  
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analysis Reports</h1>

      <ReportsTable
        title="Policy Analysis Reports"
        apiEndpoint={`/api/reports?userId=${userId}`}
      />

      {/* Customization Reports Table */}
      <ReportsTable
        title="Customization Reports"
        apiEndpoint={`/api/customization?userId=${userId}`}
      />
    </div>
  );
}
