import "server-only";

export interface SpotifyTrackPayload {
  title: string | null;
  artist: string | null;
  album: string | null;
  albumImageUrl: string | null;
  songUrl: string | null;
  isPlaying: boolean;
  playedAt: string | null;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
}

interface SpotifyTrack {
  name?: string;
  artists?: SpotifyArtist[];
  album?: {
    name?: string;
    images?: SpotifyImage[];
  };
  external_urls?: {
    spotify?: string;
  };
}

interface SpotifyCurrentlyPlayingResponse {
  is_playing?: boolean;
  item?: SpotifyTrack | null;
}

interface SpotifyRecentlyPlayedResponse {
  items?: Array<{
    played_at?: string;
    track?: SpotifyTrack | null;
  }>;
}

interface SpotifyTokenResponse {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: number;
}

const defaultSpotifyRedirectUri = "http://127.0.0.1:3000/api/spotify/callback";

export const spotifyScopes = ["user-read-currently-playing", "user-read-recently-played"] as const;

export const emptySpotifyTrack: SpotifyTrackPayload = {
  title: null,
  artist: null,
  album: null,
  albumImageUrl: null,
  songUrl: null,
  isPlaying: false,
  playedAt: null
};

export const fallbackSpotifyTrack: SpotifyTrackPayload = {
  title: "Goth",
  artist: "Sidewalks and Skeletons",
  album: null,
  albumImageUrl: null,
  songUrl: "https://open.spotify.com/track/0uMZbmAAgOhdMrv25iPEH6?si=de1fcfb202634fb9",
  isPlaying: false,
  playedAt: null
};

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function getSpotifyConfig() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID ?? null,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? null,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN ?? null,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI ?? defaultSpotifyRedirectUri
  };
}

function normalizeTrack(track: SpotifyTrack | null | undefined, isPlaying: boolean, playedAt: string | null) {
  if (!track?.name) {
    return emptySpotifyTrack;
  }

  return {
    title: track.name ?? null,
    artist: track.artists?.map((artist) => artist.name).filter(Boolean).join(", ") || null,
    album: track.album?.name ?? null,
    albumImageUrl: track.album?.images?.[0]?.url ?? null,
    songUrl: track.external_urls?.spotify ?? null,
    isPlaying,
    playedAt
  } satisfies SpotifyTrackPayload;
}

function getSpotifyBasicAuthorization(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

export function getSpotifyAuthorizationUrl(state: string) {
  const { clientId, redirectUri } = getSpotifyConfig();

  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
    scope: spotifyScopes.join(" ")
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeSpotifyAuthorizationCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getSpotifyConfig();

  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetchWithTimeout("https://accounts.spotify.com/api/token", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: getSpotifyBasicAuthorization(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as SpotifyTokenResponse;
}

async function getAccessToken() {
  const { clientId, clientSecret, refreshToken } = getSpotifyConfig();

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetchWithTimeout("https://accounts.spotify.com/api/token", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: getSpotifyBasicAuthorization(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  return data.access_token ?? null;
}

async function fetchSpotifyResource(path: string, accessToken: string) {
  return fetchWithTimeout(`https://api.spotify.com/v1${path}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getSpotifyTrack(): Promise<SpotifyTrackPayload> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return emptySpotifyTrack;
  }

  try {
    const currentResponse = await fetchSpotifyResource("/me/player/currently-playing", accessToken);

    if (currentResponse.status === 200) {
      const currentData = (await currentResponse.json()) as SpotifyCurrentlyPlayingResponse;
      const currentTrack = normalizeTrack(currentData.item, Boolean(currentData.is_playing), null);

      if (currentTrack.title && currentTrack.isPlaying) {
        return currentTrack;
      }
    }

    const recentResponse = await fetchSpotifyResource("/me/player/recently-played?limit=1", accessToken);

    if (!recentResponse.ok) {
      return emptySpotifyTrack;
    }

    const recentData = (await recentResponse.json()) as SpotifyRecentlyPlayedResponse;
    const latestItem = recentData.items?.[0];

    return normalizeTrack(latestItem?.track, false, latestItem?.played_at ?? null);
  } catch {
    return emptySpotifyTrack;
  }
}
