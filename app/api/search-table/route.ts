import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.data || !body.app_secret) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Proxy API Received Data:", body); // Debugging

    // Forward the request to the external API
    const externalResponse = await fetch(
      "http://183.82.7.208:3002/anyapp/search/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await externalResponse.json();

    return NextResponse.json(result, {
      status: externalResponse.status,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow CORS
      },
    });
  } catch (error) {
    console.error("Proxy API Internal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
