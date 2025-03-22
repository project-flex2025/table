// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";
// import csv from "csv-parser";
// import { createReadStream } from "fs";
// import * as XLSX from "xlsx";

// export async function POST(req: NextRequest) {
//   try {
//     // Parse the file from formData()
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
//     }

//     // Save the uploaded file to /public/uploads
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     const filePath = path.join(uploadDir, file.name);
//     const fileBuffer = Buffer.from(await file.arrayBuffer());
//     await fs.writeFile(filePath, fileBuffer);
    
//     // Determine file type (CSV or Excel)
//     const fileExtension = path.extname(file.name).toLowerCase();
//     let parsedData: any[] = [];

//     if (fileExtension === ".csv") {
//       console.log("Processing CSV file...");
//       await new Promise((resolve, reject) => {
//         createReadStream(filePath)
//           .pipe(csv())
//           .on("data", (row) => {
//             parsedData.push({
//               id: Number(row.id),
//               name: row.name,
//               email: row.email,
//               role: row.role,
//               status: row.status,
//               created_at: row.created_at,
//             });
//           })
//           .on("end", resolve)
//           .on("error", reject);
//       });
//     } else if (fileExtension === ".xls" || fileExtension === ".xlsx") {
//       console.log("Processing Excel file...");
//       const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       parsedData = jsonData.map((row: any) => ({
//         id: Number(row.id),
//         name: row.name,
//         email: row.email,
//         role: row.role,
//         status: row.status,
//         created_at: row.created_at,
//       }));
//     } else {
//       return NextResponse.json({ success: false, message: "Unsupported file format" }, { status: 400 });
//     }

//     console.log("Parsed Data:", parsedData);

//     // Read existing JSON file
//     const jsonFilePath = path.join(process.cwd(), "public", "tabledata.json");
//     let existingData: any[] = [];

//     if (await fs.stat(jsonFilePath).then(() => true).catch(() => false)) {
//       const rawJson = await fs.readFile(jsonFilePath, "utf-8");
//       existingData = JSON.parse(rawJson);
//     }

//     // Merge new data while avoiding duplicates
//     const updatedData = [
//       ...existingData,
//       ...parsedData.filter((row) => !existingData.some((item) => item.id === row.id)),
//     ];

//     // Write back updated data
//     await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));

//     console.log("Data appended successfully");
//     return NextResponse.json({ success: true, message: "File data appended successfully" });
//   } catch (error) {
//     console.error("Unhandled Error:", error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import csv from "csv-parser";
import { createReadStream } from "fs";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    // Parse the file from formData()
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // Save the uploaded file to /public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);
    
    // Determine file type (CSV or Excel)
    const fileExtension = path.extname(file.name).toLowerCase();
    let parsedData: any[] = [];

    if (fileExtension === ".csv") {
      console.log("Processing CSV file...");
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
    } else if (fileExtension === ".xls" || fileExtension === ".xlsx") {
      console.log("Processing Excel file...");
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      parsedData = jsonData.map((row: any) => ({
        id: Number(row.id),
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        created_at: row.created_at,
      }));
    } else {
      return NextResponse.json({ success: false, message: "Unsupported file format" }, { status: 400 });
    }

    console.log("Parsed Data:", parsedData);

    // Read existing JSON file
    const jsonFilePath = path.join(process.cwd(), "public", "tabledata.json");
    let existingData: any[] = [];

    if (await fs.stat(jsonFilePath).then(() => true).catch(() => false)) {
      const rawJson = await fs.readFile(jsonFilePath, "utf-8");
      existingData = JSON.parse(rawJson);
    }

    // Separate valid and invalid records
    const validRecords: any[] = [];
    const failedRecords: any[] = [];    

    parsedData.forEach((row) => {
      if (!row.name || !row.email || !row.id) {
        failedRecords.push(row); // Record missing required fields
      } else {
        validRecords.push(row);
      }
    });

    console.log(failedRecords,"failedRecords...");
    

    // Merge valid data while avoiding duplicates
    const updatedData = [
      ...existingData,
      ...validRecords.filter((row) => !existingData.some((item) => item.id === row.id)),
    ];

    // Write back only valid records to the JSON file
    await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));

    console.log("Valid data appended successfully");

    return NextResponse.json({
      success: true,
      message: "File processed successfully",
      updatedRecords: validRecords.length,
      failedRecords, // Return records that failed validation
    });

  } catch (error) {
    console.error("Unhandled Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

