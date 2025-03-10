import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import csv from "csv-parser";
import { createReadStream } from "fs";

export async function POST(req: NextRequest) {
  try {
    console.log("API: Upload endpoint hit");

    // Parse the file from formData()
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    console.log("Received file:", file.name);

    // Save the uploaded CSV file to /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    console.log("File saved:", filePath);

    // Read and parse CSV file
    const parsedData: any[] = [];
    await new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          parsedData.push({
            id: Number(row.id),
            name: row.name,
            email: row.email,
            role: row.role,
            status: row.status,
            created_at: row.created_at,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log("Parsed CSV Data:", parsedData);

    // Read existing JSON file
    const jsonFilePath = path.join(process.cwd(), "public", "tabledata.json");
    let existingData: any[] = [];

    if (await fs.stat(jsonFilePath).then(() => true).catch(() => false)) {
      const rawJson = await fs.readFile(jsonFilePath, "utf-8");
      existingData = JSON.parse(rawJson);
    }

    // Merge new data while avoiding duplicates
    const updatedData = [
      ...existingData,
      ...parsedData.filter((row) => !existingData.some((item) => item.id === row.id)),
    ];

    // Write back updated data
    await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));

    console.log("Data appended successfully");
    return NextResponse.json({ success: true, message: "CSV data appended successfully" });
  } catch (error) {
    console.error("Unhandled Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
