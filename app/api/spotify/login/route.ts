import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSpotifyAuthorizationUrl } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const state = randomBytes(16).toString("hex");
  const authorizationUrl = getSpotifyAuthorizationUrl(state);

  if (!authorizationUrl) {
    return NextResponse.json(
      {
        error: "Spotify client configuration is missing. Set SPOTIFY_CLIENT_ID first."
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  }

  cookies().set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/"
  });

  return NextResponse.redirect(authorizationUrl, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
