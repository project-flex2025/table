import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "tabledata.json");

    // Read existing data
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(rawData);
    }

    // Ensure body contains data
    let newData = [];
    if (req.body) {
      newData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }

    if (!Array.isArray(newData) || newData.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty data" });
    }

    console.log(newData,"newData....");
    

    // Merge new data while avoiding duplicates
    const updatedData = [...existingData, ...newData.filter((item) => !existingData.some((d:any) => d.id === item.id))];

    console.log(updatedData,"updatedData....");
    

    // Write the new data back to the file
    // fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    return res.status(200).json({ success: true, message: "Data uploaded successfully" });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: "Error uploading data" });
  }
}
