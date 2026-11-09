export const TOKEN_KEY = 'veloop_token';
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(method, path, body) {
  const token = localStorage.getItem(TOKEN_KEY);
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event('veloop:unauthorized'));
    }
    throw new ApiError(data.message || 'Something went wrong. Please try again.', response.status, data);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
};
