import { NextResponse } from "next/server";
import { emptySpotifyTrack, getSpotifyTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await getSpotifyTrack();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch {
    return NextResponse.json(emptySpotifyTrack, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }
}
