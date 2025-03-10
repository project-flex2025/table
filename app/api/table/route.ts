import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  try {
    // Read tabledata.json from the public folder
    const filePath = path.join(process.cwd(), "public", "tabledata.json");
    const rawData = await fs.readFile(filePath, "utf-8");
    let data = JSON.parse(rawData);

    // Extract query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";
    
    // Extract filters dynamically
    const filters: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (!["page", "limit", "search"].includes(key)) {
        filters[key] = value;
      }
    });

    // Apply search filter (if provided)
    if (search) {
      const searchQuery = search.toLowerCase();
      data = data.filter((item: any) =>
        Object.values(item).some((value: any) =>
          value.toString().toLowerCase().includes(searchQuery)
        )
      );
    }

    // Apply dynamic filters
    Object.keys(filters).forEach((key) => {
      data = data.filter((item: any) => item[key] == filters[key]);
    });

    // Paginate the data
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      totalRecords: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page,
      pageSize: limit,
      data: paginatedData,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching data", error }, { status: 500 });
  }
}
