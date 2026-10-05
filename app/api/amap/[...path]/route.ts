import { NextRequest } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const joined = path.join("/");
  if (!/^(v3|v4|v5)\/[a-zA-Z0-9/_-]+$/.test(joined))
    return new Response("Unsupported map endpoint", { status: 400 });
  const secret = process.env.AMAP_SECURITY_CODE;
  if (!secret)
    return new Response("Map security code not configured", { status: 503 });
  const host =
    joined === "v4/map/styles"
      ? "https://webapi.amap.com/"
      : "https://restapi.amap.com/";
  const target = new URL(host + joined);
  req.nextUrl.searchParams.forEach((value, key) => {
    if (key !== "jscode") target.searchParams.set(key, value);
  });
  target.searchParams.set("jscode", secret);
  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return new Response("Map service unavailable", { status: 502 });
  }
}
