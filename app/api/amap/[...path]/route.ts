import { proxyMapRequest } from "@/lib/amap-service";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyMapRequest(req, path.join("/"), {
    AMAP_SECURITY_CODE: process.env.AMAP_SECURITY_CODE,
  });
}
