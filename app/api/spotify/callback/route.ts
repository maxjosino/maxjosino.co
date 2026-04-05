import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeSpotifyAuthorizationCode, spotifyScopes } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function renderPage(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #161616;
        color: #f3efe4;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      main {
        width: min(680px, 100%);
        border: 1px solid rgba(243, 239, 228, 0.18);
        border-radius: 16px;
        padding: 24px;
        background: rgba(243, 239, 228, 0.03);
      }

      h1 {
        margin: 0 0 12px;
        font-size: 24px;
        line-height: 1.2;
      }

      p {
        margin: 0 0 14px;
        font-size: 15px;
        line-height: 1.6;
        color: rgba(243, 239, 228, 0.82);
      }

      code,
      pre {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }

      pre {
        margin: 18px 0;
        padding: 16px;
        border-radius: 12px;
        overflow-x: auto;
        background: #0f0f0f;
        color: #f3efe4;
        border: 1px solid rgba(243, 239, 228, 0.12);
      }

      .muted {
        color: rgba(243, 239, 228, 0.6);
      }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`;
}

function htmlResponse(title: string, body: string, status = 200) {
  return new NextResponse(renderPage(title, body), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const storedState = cookieStore.get("spotify_oauth_state")?.value ?? null;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return htmlResponse(
      "Spotify authorization failed",
      `<h1>Spotify authorization failed</h1>
       <p>Spotify returned <code>${error}</code>. You can retry the flow from <code>/api/spotify/login</code>.</p>`,
      400
    );
  }

  if (!code || !state || !storedState || state !== storedState) {
    return htmlResponse(
      "Spotify authorization failed",
      `<h1>Spotify authorization failed</h1>
       <p>The OAuth state did not match or the authorization code is missing. Start again from <code>/api/spotify/login</code>.</p>`,
      400
    );
  }

  const tokenData = await exchangeSpotifyAuthorizationCode(code);
  const response = tokenData?.refresh_token
    ? htmlResponse(
        "Spotify refresh token ready",
        `<h1>Spotify refresh token ready</h1>
         <p>Copy the value below into your local and production environment as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>
         <pre>SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}</pre>
         <p class="muted">Scopes granted: ${spotifyScopes.join(", ")}</p>
         <p class="muted">After saving it, you can close this tab and restart your local dev server.</p>`
      )
    : htmlResponse(
        "Spotify refresh token missing",
        `<h1>Spotify refresh token missing</h1>
         <p>Spotify did not return a refresh token. If you already authorized this app before, remove it from your Spotify connected apps and run <code>/api/spotify/login</code> again.</p>`,
        400
      );

  response.cookies.set("spotify_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });

  return response;
}
