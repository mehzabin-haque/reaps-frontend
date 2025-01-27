#!/usr/bin/env python
# scripts/process_doc.py

import sys
import os
import shutil

def main():
    if len(sys.argv) < 3:
        print("Usage: process_doc.py <input_file> <user_folder>")
        sys.exit(1)

    input_file = sys.argv[1]
    user_folder = sys.argv[2]

    # e.g. parse user id from user_folder => 'input_123' -> '123'
    user_id = user_folder.replace("input_", "")

    # Make the output folder
    output_folder = f"public/output_{user_id}"
    os.makedirs(output_folder, exist_ok=True)

    # For demonstration, we'll pretend we processed the input and produced an output.pdf
    # Let's just copy the input file to the output folder or produce a new PDF
    output_file = os.path.join(output_folder, "analysis_report.pdf")

    # If you have actual PDF generation, do it here. 
    # For demonstration, let's just copy the original file (if PDF) or create a dummy PDF.
    if input_file.lower().endswith(".pdf"):
        shutil.copy(input_file, output_file)
    else:
        # create a dummy PDF if not originally PDF
        with open(output_file, "wb") as f:
            f.write(b"%PDF-1.4\n% ... a minimal PDF ...")

    print(f"Output PDF saved at: {output_file}")


if __name__ == "__main__":
    main()
