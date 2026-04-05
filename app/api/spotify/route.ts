import { NextResponse } from "next/server";
import { fallbackSpotifyTrack, getSpotifyTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const latestTrack = await getSpotifyTrack();
  const payload = latestTrack.title ? latestTrack : fallbackSpotifyTrack;

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
