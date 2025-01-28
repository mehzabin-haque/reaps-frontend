import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * This route expects a query parameter named "userId".
 * It scans `public/output_{userId}` for PDFs and returns them as reports.
 */

export async function GET(request: Request) {
  try {
    // 1. Extract the user ID from the query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 2. If no userId provided, return an empty list or a 400 error
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter." },
        { status: 400 }
      );
    }

    // 3. Define the folder path for this user: /public/output_{userId}
    const publicDir = path.join(process.cwd(), "public");
    const userFolderName = `output_${userId}`;
    const userFolderPath = path.join(publicDir, userFolderName);

    // 4. Check if the folder exists. If not, return an empty array or handle gracefully
    if (!fs.existsSync(userFolderPath)) {
      return NextResponse.json({ reports: [] }, { status: 200 });
    }

    // 5. Read only PDF files from this folder
    const fileDirents = fs.readdirSync(userFolderPath, { withFileTypes: true });
    const pdfFiles = fileDirents
      .filter((dirent) => dirent.isFile() && path.extname(dirent.name).toLowerCase() === ".pdf")
      .map((dirent) => dirent.name);

    // 6. Build report objects
    const allReports = pdfFiles.map((filename, index) => {
      const fullPath = path.join(userFolderPath, filename);
      const stats = fs.statSync(fullPath);
      const uploadDate = stats.ctime; // or stats.mtime

      // Remove ".pdf" from filename to create a title
      const ext = path.extname(filename);
      const docTitle = path.basename(filename, ext);

      return {
        id: `${userId}-${index}`,
        title: docTitle, 
        country: "N/A", // Update if you have more info
        uploadDate: uploadDate.toISOString().split("T")[0],
        status: "completed" as const,
        outputPath: `/${userFolderName}/${filename}`, 
        userId,
        fileType: "pdf",
      };
    });

    // 7. Sort results by upload date descending
    allReports.sort((a, b) => {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      return dateB - dateA;
    });

    // 8. Return the sorted list of PDF reports for this user
    return NextResponse.json({ reports: allReports }, { status: 200 });
  } catch (err: any) {
    console.error("Error reading user output directory:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
