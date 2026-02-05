import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Clear auth cookie
  response.cookies.set("token", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
