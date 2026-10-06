const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://furbowl.onrender.com/api/v1';

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const url = `${API_BASE.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const status = res.status;
    let data: T | undefined;
    try {
      data = await res.json();
    } catch {
      // Non-json response
    }

    if (!res.ok) {
      return { error: (data as { message?: string })?.message || `API error ${status}`, status };
    }

    return { data, status };
  } catch (err) {
    console.warn(`API call failed to ${url}:`, err);
    return { error: 'Network request to backend failed', status: 500 };
  }
}

export const api = {
  baseUrl: API_BASE,
  request: apiRequest,
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};
