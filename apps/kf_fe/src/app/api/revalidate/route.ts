import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { hasAdminAccessToken } from "@/lib/authRoles";

const AUTH_TOKEN_KEY = "kf_token";
const REVALIDATE_HEADER = "x-revalidate-secret";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const tag = typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : "site-settings";

  revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tag });
}

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  const requestSecret = request.headers.get(REVALIDATE_HEADER);
  if (configuredSecret && requestSecret === configuredSecret) {
    return true;
  }

  return hasAdminAccessToken(request.cookies.get(AUTH_TOKEN_KEY)?.value);
}
