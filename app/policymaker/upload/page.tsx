"use client";

import { useState, useCallback } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { cn } from "../../../lib/utils/classname";
import useUser from "@/hooks/useUser";

export default function UploadDocument() {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useUser(); 
  const userId = user?.id || "guest_user"; // fallback if user is not logged in

  // 1. Handle dropping a file onto the dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Basic validation
    if (
      !["application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ].includes(file.type)
    ) {
      setError("Please upload a PDF or Word document");
      return;
    }

    setError(null);
    setSelectedFile(file);
  }, []);

  // 2. React Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  });

  // 3. Submit the form to the API
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", selectedFile);

      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded and processed successfully!");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setError("There was an error uploading your file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto py-36">
      <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 py-6 justify-center flex">Upload Policy Document</h2>
      
      <div {...getRootProps()} 
           className={cn(
             "p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
             isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
           )}
      >
        <input {...getInputProps()} />
        <DocumentTextIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        {!selectedFile ? (
          <p className="text-gray-600">
            Drag and drop your file here, or click to browse
          </p>
        ) : (
          <p className="font-semibold">Selected file: {selectedFile.name}</p>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-center">
      <button
        className="mt-6 bg-blue-500  text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={handleSubmit}
        disabled={isUploading || !selectedFile}
      >
        {isUploading ? "Uploading..." : "Submit Document"}
      </button>
      </div>
    </div>
    </div>
  );
}
