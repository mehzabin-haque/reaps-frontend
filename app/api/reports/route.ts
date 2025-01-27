import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * This route scans the public folder for subdirectories named "output_*"
 * and returns only the PDFs inside those folders.
 *
 * The "title" field is the filename without extension 
 * (e.g. "analysis_report_bd_2024" if the file is "analysis_report_bd_2024.pdf").
 */

export async function GET(request: Request) {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const dirs = fs.readdirSync(publicDir, { withFileTypes: true });

    // 1. Get all subfolders named "output_*"
    const outputDirs = dirs
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith("output_"))
      .map(dirent => dirent.name);

    const allReports: any[] = [];

    // 2. For each "output_*" folder, list only PDF files
    outputDirs.forEach((folder) => {
      const userId = folder.replace("output_", "");
      const folderPath = path.join(publicDir, folder);

      // Filter for .pdf files only
      const pdfFiles = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(f => f.isFile() && path.extname(f.name).toLowerCase() === ".pdf")
        .map(f => f.name);

      // 3. Build "reports" from each PDF file
      pdfFiles.forEach((filename, index) => {
        const fullPath = path.join(folderPath, filename);
        const stats = fs.statSync(fullPath);
        const uploadDate = stats.ctime; // or mtime

        // Extension (should be '.pdf')
        const ext = path.extname(filename).toLowerCase(); 
        // Title is the filename without extension: "analysis_report_bd_2024"
        const docTitle = path.basename(filename, ext);

        // We'll mark status as "completed" for each PDF
        const status: "completed" | "in-progress" | "failed" = "completed";

        allReports.push({
          id: `${userId}-${index}`,
          title: docTitle, // e.g. "analysis_report_bd_2024"
          country: "N/A",  // or set dynamically if you have that info
          uploadDate: uploadDate.toISOString().split("T")[0],
          status,
          outputPath: `/${folder}/${filename}`, // e.g. "/output_123/analysis_report_bd_2024.pdf"
          userId,
          fileType: "pdf",
        });
      });
    });

    // 4. Sort by upload date descending
    allReports.sort((a, b) => {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ reports: allReports });
  } catch (err: any) {
    console.error("Error reading output directories:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
