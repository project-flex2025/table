import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), "public", "tabledata.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    let data = JSON.parse(rawData);

    // Extract query params
    const { page = "1", limit = "10", search = "", ...filters } = req.query;

    console.log("Filters:111222", filters);
    

    // Convert page & limit to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    // Apply search filter (if provided)
    if (search) {
      const searchQuery = (search as string).toLowerCase();
      data = data.filter((item: any) =>
        Object.values(item).some((value:any) =>
          value.toString().toLowerCase().includes(searchQuery)
        )
      );
    }

    // Apply dynamic filters
    Object.keys(filters).forEach((key) => {
      data = data.filter((item: any) =>  item[key] == filters[key]);
    });

    // Paginate the data
    const paginatedData = data.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      totalRecords: data.length,
      totalPages: Math.ceil(data.length / limitNumber),
      currentPage: pageNumber,
      pageSize: limitNumber,
      data: paginatedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching data", error });
  }
}
