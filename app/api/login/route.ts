import { NextResponse } from "next/server";

// Sample user data (this would typically come from a database)
const users = [
  {
    id: "vijay1234",
    credential: "vijay",
    password: "password123", // ⚠️ In production, store hashed passwords!
    login_token: "0aac612f9f81b9f2833710f5cbba08bb",
    login_token_expiration: "1742014482",
  },
  {
    id: "johnDoe",
    credential: "john",
    password: "johnpass",
    login_token: "abc123xyz456",
    login_token_expiration: "1743015582",
  },
];

// API Route to handle authentication
export async function POST(req: Request) {
  try {
    const { action, credential, password } = await req.json();

    if (action !== "login") {
      return NextResponse.json({ status: "error", message: "Invalid action" }, { status: 400 });
    }

    const user = users.find((u) => u.credential === credential && u.password === password);

    if (!user) {
      return NextResponse.json({ status: "error", message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      status: "success",
      message: "Login successful",
      user_id: user.id,
      login_token: user.login_token,
      login_token_expiration: user.login_token_expiration,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
