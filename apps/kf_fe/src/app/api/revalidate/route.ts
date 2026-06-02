import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tag = typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : "site-settings";

  revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tag });
}
