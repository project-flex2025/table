// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";

// export async function GET(req: Request) {
//   try {
//     // Read tabledata.json from the public folder
//     const filePath = path.join(process.cwd(), "public", "tabledata.json");
//     const rawData = await fs.readFile(filePath, "utf-8");
//     let data = JSON.parse(rawData);

//     // Extract query parameters
//     const url = new URL(req.url);
//     console.log(url,"url params..");
    
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);
//     const search = url.searchParams.get("search")?.toLowerCase() || "";

//     // Extract filters dynamically
//     const filters: Record<string, string> = {};
//     url.searchParams.forEach((value, key) => {
//       if (!["page", "limit", "search"].includes(key) && value) {
//         filters[key] = value.toLowerCase(); // Normalize for case-insensitive filtering
//       }
//     });

//     // Apply global search filter (if provided)
//     if (search) {
//       data = data.filter((item: any) =>
//         Object.values(item).some((value: any) =>
//           value.toString().toLowerCase().includes(search)
//         )
//       );
//     }

//     // Apply dynamic filters
//     Object.keys(filters).forEach((key) => {
//       data = data.filter((item: any) => {
//         const itemValue = item[key]?.toString().toLowerCase();

//         if (key === "status") {
//           // **Exact match for status**
//           return itemValue === filters[key];
//         } else {
//           // **Partial match for other filters**
//           return itemValue?.includes(filters[key]);
//         }
//       });
//     });

//     // Paginate the data
//     const startIndex = (page - 1) * limit;
//     const paginatedData = data.slice(startIndex, startIndex + limit);

//     console.log(paginatedData,"pagination data ...");
    

//     return NextResponse.json({
//       success: true,
//       totalRecords: data.length,
//       totalPages: Math.ceil(data.length / limit),
//       currentPage: page,
//       pageSize: limit,
//       data: paginatedData,
//     });
//   } catch (error) {
//     console.error("Error in API:", error);
//     return NextResponse.json(
//       { success: false, message: "Error fetching data", error },
//       { status: 500 }
//     );
//   }
// }





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
    console.log(url, "URL Params...");

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const sortBy = url.searchParams.get("sort_by") || "";
    const order = url.searchParams.get("order") === "desc" ? "desc" : "asc"; // Default to 'asc'

    // Extract filters dynamically
    const filters: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (!["page", "limit", "search", "sort_by", "order"].includes(key) && value) {
        filters[key] = value.toLowerCase(); // Normalize for case-insensitive filtering
      }
    });

    // Apply global search filter (if provided)
    if (search) {
      data = data.filter((item: any) =>
        Object.values(item).some((value: any) =>
          value.toString().toLowerCase().includes(search)
        )
      );
    }

    // Apply dynamic filters
    Object.keys(filters).forEach((key) => {
      data = data.filter((item: any) => {
        const itemValue = item[key]?.toString().toLowerCase();
        return itemValue?.includes(filters[key]);
      });
    });

    // Apply sorting
    if (sortBy && data.length > 0 && data[0].hasOwnProperty(sortBy)) {
      data.sort((a: any, b: any) => {
        const aValue = a[sortBy]?.toString().toLowerCase();
        const bValue = b[sortBy]?.toString().toLowerCase();

        if (order === "asc") return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
      });
    }

    // Paginate the data
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    console.log(paginatedData, "Paginated Data...");

    return NextResponse.json({
      success: true,
      totalRecords: data.length,
      totalPages: Math.ceil(data.length / limit),
      currentPage: page,
      pageSize: limit,
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data", error },
      { status: 500 }
    );
  }
}


