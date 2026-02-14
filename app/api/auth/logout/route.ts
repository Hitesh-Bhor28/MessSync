import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(0), // immediately expire
  });

  return response;
}
