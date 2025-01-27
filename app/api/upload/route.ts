import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import Busboy from "busboy";
import { spawn } from "child_process";

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    // 1. Prepare a Node.js readable stream from the incoming Request
    const { Readable } = require("stream");
    const reqStream = new Readable({
      read() { /* We'll push the data later */ },
    });

    // 2. Read the entire request body into a buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Convert Next.js headers to a Node-like object
    const rawHeadersObj = Object.fromEntries(request.headers.entries());
    const busboyHeaders = Object.entries(rawHeadersObj).reduce<Record<string, string>>(
      (acc, [key, val]) => {
        acc[key.toLowerCase()] = val;
        return acc;
      },
      {}
    );

    // 4. Create a Busboy instance
    const busboy = Busboy({
      headers: busboyHeaders,
    } as any);

    let userId = "guest_user";
    let originalFilename = "";
    let fileBuffer: Buffer | null = null;

    // 5. Listen for the "file" event
    //    Note: the 3rd argument is "info" in Busboy >= v1
    busboy.on("file", (fieldname, fileStream, info) => {
      const { filename, encoding, mimeType } = info;
      // Now "filename" is a string (or undefined), not an object
      originalFilename = filename || "uploadedFile";

      const chunks: Buffer[] = [];
      fileStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
      fileStream.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    // 6. Listen for normal fields (e.g. userId)
    busboy.on("field", (fieldname: string, val: string) => {
      if (fieldname === "userId") {
        userId = val;
      }
    });

    // 7. Wrap Busboy's finish event
    const busboyFinished = new Promise<void>((resolve, reject) => {
      busboy.on("finish", () => resolve());
      busboy.on("error", (err) => reject(err));
    });

    // 8. Pipe data into Busboy
    reqStream.push(buffer);
    reqStream.push(null);
    reqStream.pipe(busboy);

    // 9. Wait for Busboy to finish
    await busboyFinished;

    // 10. If no file was parsed
    if (!fileBuffer) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 11. Write file to disk in public/input_{userId}
    const inputDir = path.join(process.cwd(), "public", `input_${userId}`);
    await fs.mkdir(inputDir, { recursive: true });

    const finalInputPath = path.join(inputDir, originalFilename);
    await fs.writeFile(finalInputPath, fileBuffer);

    // 12. Spawn the Python script
    const scriptPath = "C:/Users/ASUS/Desktop/REAPS/Policies/country_specific_policy.py";
    const outputDir = path.join(process.cwd(), "public", `output_${userId}`);
    await fs.mkdir(outputDir, { recursive: true });

    // e.g. produce analysis_report_{baseName}.pdf
    const baseName = path.parse(originalFilename).name;
    const outputFileName = `analysis_report_${baseName}.pdf`;
    const finalOutputPath = path.join(outputDir, outputFileName);

    await runPythonScript(scriptPath, [finalInputPath, finalOutputPath]);

    return NextResponse.json({
      message: "File uploaded & processed successfully",
      inputFile: `/input_${userId}/${originalFilename}`,
      outputFile: `/output_${userId}/${outputFileName}`,
    });
  } catch (err: any) {
    console.error("Upload Error => ", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

/**
 * Run the Python script with arguments. 
 * Returns a Promise that resolves when the script finishes or rejects on error.
 */
function runPythonScript(scriptPath: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const pyProcess = spawn("python", [scriptPath, ...args], { windowsHide: true });

    let errorData = "";

    pyProcess.stdout.on("data", (data) => {
      console.log("[PYTHON STDOUT]:", data.toString());
    });

    pyProcess.stderr.on("data", (data) => {
      errorData += data.toString();
      console.error("[PYTHON STDERR]:", data.toString());
    });

    pyProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(errorData || `Python script exited with code: ${code}`);
      }
    });
  });
}

