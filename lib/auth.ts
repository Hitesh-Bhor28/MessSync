import { cookies } from "next/headers";

export async function getAuthToken(req?: Request) {
  const authHeader = req?.headers.get("authorization") || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7);
  }

  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}
