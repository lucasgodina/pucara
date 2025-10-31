/**
 * Simple API client for the CRUD backend
 * Reads base URL from environment variables
 *
 * Server-side only by default (Astro SSR). If you need client-side access,
 * expose PUBLIC_BACKEND_API_URL and use it explicitly.
 */

const DEFAULT_BASE_URL = "https://pucara-api-9424c4c471cc.herokuapp.com";

export const API_BASE_URL: string =
  // Server-only variable (preferred)
  (import.meta as any).env?.BACKEND_API_URL ||
  // Optional public fallback when running in the browser
  (import.meta as any).env?.PUBLIC_BACKEND_API_URL ||
  DEFAULT_BASE_URL;

export function buildUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiGet<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    // Astro SSR runs on Node, no need for credentials by default
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GET ${url} failed: ${res.status} ${res.statusText} ${text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // Fall back to text
  return (await res.text()) as unknown as T;
}

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};
