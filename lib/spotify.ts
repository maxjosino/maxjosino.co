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

export const emptySpotifyTrack: SpotifyTrackPayload = {
  title: null,
  artist: null,
  album: null,
  albumImageUrl: null,
  songUrl: null,
  isPlaying: false,
  playedAt: null
};

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

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
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

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function fetchSpotifyResource(path: string, accessToken: string) {
  return fetch(`https://api.spotify.com/v1${path}`, {
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
