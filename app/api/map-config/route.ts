import { mapConfiguration } from "@/lib/amap-service";

export const dynamic = "force-dynamic";

export function GET() {
  return mapConfiguration({
    NEXT_PUBLIC_AMAP_KEY: process.env.NEXT_PUBLIC_AMAP_KEY,
  });
}
