import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "tabledata.json");

    // Read current data
    const currentData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Merge new data with existing data
    const newData = req.body;
    const updatedData = [...currentData, ...newData];

    // Save updated data to file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
