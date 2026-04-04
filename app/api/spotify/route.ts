import { NextResponse } from "next/server";
import { fallbackSpotifyTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(fallbackSpotifyTrack, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
