import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import Busboy from "busboy";
import { spawn } from "child_process";

export const runtime = "nodejs";

// 1. Disable the built-in bodyParser so we can handle the raw stream ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

// 2. Helper to run a Python script
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

export async function POST(request: Request) {
  try {
    // 3. Convert the incoming request into a readable stream for Busboy
    const { Readable } = require("stream");
    const reqStream = new Readable({
      read() {
        // We will push the request body below
      },
    });

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Convert Next.js headers to a Node-like object
    const rawHeadersObj = Object.fromEntries(request.headers.entries());
    const busboyHeaders = Object.entries(rawHeadersObj).reduce<Record<string, string>>(
      (acc, [key, val]) => {
        acc[key.toLowerCase()] = val;
        return acc;
      },
      {}
    );

    // 5. Create a Busboy instance
    const busboy = Busboy({
      headers: busboyHeaders,
    } as any);

    let userId = "guest_user";
    let updateFrequency = "quarterly";
    let ethics = false;
    let governance = false;
    let innovation = false;
    let socioEconomicInfos: any[] = [];

    // 6. Listen for fields
    busboy.on(
      "field",
      (
        fieldname: string,
        val: string,
        info: { nameTruncated: boolean; valueTruncated: boolean; encoding: string; mimeType: string }
      ) => {
        switch (fieldname) {
          case "userId":
            userId = val;
            break;
          case "updateFrequency":
            updateFrequency = val;
            break;
          case "ethics":
            ethics = val === "true";
            break;
          case "governance":
            governance = val === "true";
            break;
          case "innovation":
            innovation = val === "true";
            break;
          case "socioEconomicInfos":
            // val is the JSON string
            try {
              socioEconomicInfos = JSON.parse(val);
            } catch (err) {
              console.error("Error parsing socioEconomicInfos JSON:", err);
            }
            break;
          default:
            // ignore unknown fields or handle them as needed
            break;
        }
      }
    );

    // 7. Wrap Busboy’s finish event in a Promise
    const busboyFinished = new Promise<void>((resolve, reject) => {
      busboy.on("finish", () => resolve());
      busboy.on("error", (err: any) => reject(err));
    });

    // 8. Push the request data into Busboy
    reqStream.push(buffer);
    reqStream.push(null);
    reqStream.pipe(busboy);

    // 9. Wait until Busboy is done
    await busboyFinished;

    // 10. We now have all fields: userId, updateFrequency, etc.
    //     Create or ensure the user’s customization folder
    const customizationDir = path.join(process.cwd(), "public", `customization_${userId}`);
    await fs.mkdir(customizationDir, { recursive: true });

    // 11. Decide on a new entry number or name (Dynamic Increment)
    const getNextEntryNumber = async (dir: string): Promise<number> => {
      try {
        const files = await fs.readdir(dir);
        const entryNumbers = files
          .map((file) => {
            const match = file.match(/^customization_entry_(\d+)\.pdf$/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((num): num is number => num !== null);
        if (entryNumbers.length === 0) return 1;
        return Math.max(...entryNumbers) + 1;
      } catch (err) {
        console.error("Error reading customization directory:", err);
        return 1; // Fallback to 1 if there's an error
      }
    };

    const nextEntryNumber = await getNextEntryNumber(customizationDir);
    const entryBaseName = `customization_entry_${nextEntryNumber}`;

    // 12. Create an input JSON file for the python script
    const inputJsonPath = path.join(customizationDir, `${entryBaseName}_input.json`);
    const payload = {
      userId,
      updateFrequency,
      ethics,
      governance,
      innovation,
      socioEconomicInfos,
    };
    await fs.writeFile(inputJsonPath, JSON.stringify(payload, null, 2), "utf-8");

    // 13. Define the final PDF path
    //     e.g., /public/customization_{userId}/customization_entry_1.pdf
    const outputPdfPath = path.join(customizationDir, `${entryBaseName}.pdf`);

    // 14. Run the Python script with arguments:
    //     [<input json path>, <output pdf path>]
    //     (Replace this with your actual python script path)
    const scriptPath = "C:/Users/ASUS/Desktop/REAPS/Policies/customization_requirements.py";
    await runPythonScript(scriptPath, [inputJsonPath, outputPdfPath]);

    // 15. Respond with success
    return NextResponse.json(
      {
        message: "Customization processed successfully",
        inputFile: `/customization_${userId}/${entryBaseName}_input.json`,
        outputFile: `/customization_${userId}/${entryBaseName}.pdf`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Customization Error => ", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
