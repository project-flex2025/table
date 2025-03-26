import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const apiType = req.headers.get("X-API-TYPE");
    let apiUrl = "";

    switch (apiType) {
      case "search":
        apiUrl = "http://183.82.7.208:3002/anyapp/search/";
        break;
      case "create":
        apiUrl = "http://183.82.7.208:3002/anyapp/create/";
        break;
      case "update":
        apiUrl = "http://183.82.7.208:3002/anyapp/update/";
        break;
      case "delete":
        apiUrl = "http://183.82.7.208:3002/anyapp/delete/";
        break;
      default:
        return NextResponse.json({ error: "Invalid API type" }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
