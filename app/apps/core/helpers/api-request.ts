import { getAntiCSRFToken } from "blitz";

const DEFAULT_REQUEST_OPTIONS: RequestInit = {
  credentials: "include",
  headers: {
    "anti-csrf": typeof window === "undefined" ? "" : getAntiCSRFToken(),
  },
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(endpoint, {
    ...DEFAULT_REQUEST_OPTIONS,
    ...options,
    headers: { ...DEFAULT_REQUEST_OPTIONS.headers, ...options.headers },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || res.statusText);

  return data as T;
};

export default apiRequest;
