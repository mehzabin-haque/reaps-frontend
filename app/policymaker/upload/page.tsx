// app/upload/page.tsx
'use client';
import { useState, useCallback } from "react";
import { CloudArrowUpIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { cn } from "../../../lib/utils/classname";
import useUser from "@/hooks/useUser";

export default function UploadDocument() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, updateUser } = useUser();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    // Basic file validation (you can add more checks)
    if (!file) return;
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return;
    }

    // Simulate upload (replace with actual API call)
    setIsUploading(true);
    setError(null);

    // Here you would normally send the file to your backend
    // For now, we'll just simulate a successful upload
    const formData = new FormData();
    formData.append("file", file);

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  });

  // Update drag state (for visual feedback)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 ">
      <h2 className="text-2xl font-bold mb-8">Upload Policy Document</h2>
      <div className="flex space-x-32 justify-center items-center h-[70vh] ">
      <div className="min-w">
       
       {/* Drag and Drop zone */}
       <div
         {...getRootProps()}
         className={cn(
           "w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
           "dark:bg-gray-900 dark:text-gray-100",
           isDragActive || isDragging 
             ? "border-blue-500 bg-blue-50" 
             : "border-gray-300 hover:border-gray-400",
           error ? "border-red-500 bg-red-50" : ""
         )}
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
       >
         <input {...getInputProps()} />
 
         <div className="text-center">
           <DocumentTextIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
           <p className="mb-4 text-gray-600 dark:text-gray-300">
             {isDragActive || isDragging 
               ? "Drop your file here"
               : "Drag and drop your file here, or"}
           </p>
           <button
             className={cn(
               "text-blue-600 hover:text-blue-800 font-medium",
               "dark:text-blue-400 dark:hover:text-blue-200"
             )}
             onClick={() => document.getElementById("dropzone-input")?.click()}
           >
             browse to select a file
           </button>
         </div>
       </div>
 
       {/* Error message */}
       {error && (
         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
           {error}
         </div>
       )}
 
       {/* Upload progress (if needed) */}
       {isUploading && (
         <div className="mt-8 text-center">
           <p className="text-gray-600 dark:text-gray-400">Uploading document...</p>
         </div>
       )}
      </div>
 
       {/* File details form */}
       {/* <div className="mt-12 space-y-4 w-1/2 flex flex-col">
         <div className="space-y-4">
           <div>
             <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Document Title
             </label>
             <input
               type="text"
               id="title"
               className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
               placeholder="Enter document title"
             />
           </div>
 
           <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Description
             </label>
             <textarea
               id="description"
               rows={3}
               className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
               placeholder="Enter document description"
             />
           </div>
 
           <div>
             <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
               Country
             </label>
             <select
               id="country"
               className="block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
             >
               <option value="">Select a country</option>
               <option value="bangladesh">Bangladesh</option>
               <option value="india">India</option>
               <option value="pakistan">Pakistan</option>
             </select>
           </div>
         </div>
 
         <button
           className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
           onClick={() => {
             // Handle form submission
             if (!error) {
               // Add your submission logic here
               console.log("Submitting document...");
             }
           }}
           disabled={isUploading}
         >
           {isUploading ? "Uploading..." : "Upload Document"}
         </button>
       </div> */}
      </div>
    </div>
  );
}