import "server-only";

const FOURSQUARE_API_VERSION = "20260405";
const DEFAULT_CACHE_SECONDS = 518400;
const REQUEST_TIMEOUT_MS = 4000;
type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export interface SwarmCheckinPayload {
  venueName: string;
  city: string | null;
  createdAt: string | null;
  venueId: string | null;
  venueUrl: string | null;
}

interface FoursquareCheckinsResponse {
  response?: {
    checkins?: {
      items?: FoursquareCheckinItem[];
    };
  };
}

interface FoursquareCheckinItem {
  createdAt?: number | string;
  venue?: {
    id?: string;
    name?: string;
    location?: {
      city?: string;
      locality?: string;
      formattedAddress?: string[];
    };
  };
}

function getCacheSeconds() {
  const rawValue = process.env.FOURSQUARE_CACHE_SECONDS;

  if (!rawValue) {
    return DEFAULT_CACHE_SECONDS;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : DEFAULT_CACHE_SECONDS;
}

async function fetchWithTimeout(input: RequestInfo | URL, init: NextFetchInit = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
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

function formatCreatedAt(createdAt: number | string | undefined) {
  if (typeof createdAt === "number" && Number.isFinite(createdAt)) {
    return new Date(createdAt * 1000).toISOString();
  }

  if (typeof createdAt === "string") {
    if (/^\d+$/.test(createdAt)) {
      const unixTimestamp = Number.parseInt(createdAt, 10);

      if (Number.isFinite(unixTimestamp)) {
        return new Date(unixTimestamp * 1000).toISOString();
      }
    }

    const parsedDate = new Date(createdAt);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  }

  return null;
}

function getCity(item: FoursquareCheckinItem | undefined) {
  const location = item?.venue?.location;

  if (location?.city) {
    return location.city;
  }

  if (location?.locality) {
    return location.locality;
  }

  return location?.formattedAddress?.[1] ?? null;
}

function normalizeLatestCheckin(item: FoursquareCheckinItem | undefined): SwarmCheckinPayload | null {
  const venueName = item?.venue?.name?.trim();

  if (!venueName) {
    return null;
  }

  const venueId = item?.venue?.id ?? null;

  return {
    venueName,
    city: getCity(item),
    createdAt: formatCreatedAt(item?.createdAt),
    venueId,
    venueUrl: venueId ? `https://foursquare.com/v/-/${venueId}` : null
  };
}

export async function getLatestSwarmCheckin(): Promise<SwarmCheckinPayload | null> {
  const accessToken = process.env.FOURSQUARE_ACCESS_TOKEN;

  if (!accessToken) {
    return null;
  }

  const url = new URL("https://api.foursquare.com/v2/users/self/checkins");
  url.searchParams.set("limit", "1");
  url.searchParams.set("v", FOURSQUARE_API_VERSION);

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      next: {
        revalidate: getCacheSeconds()
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as FoursquareCheckinsResponse;
    return normalizeLatestCheckin(data.response?.checkins?.items?.[0]);
  } catch {
    return null;
  }
}
