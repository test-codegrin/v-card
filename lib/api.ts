import { Card } from '@/types/card';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string | null;
  body?: any;
};

// Generic fetch wrapper that attaches Authorization header when token is provided.
async function apiFetch<T>(url: string, { method = 'GET', token, body }: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

// Auth API wrappers
export async function signupUser(payload: { name: string; email: string; password: string }) {
  return apiFetch<{ message: string }>('/api/auth/signup', { method: 'POST', body: payload });
}

export async function loginUser(payload: { email: string; password: string }) {
  return apiFetch<{ token: string; user: { id: number; name: string; email: string } }>('/api/auth/login', {
    method: 'POST',
    body: payload
  });
}

export async function fetchCurrentUser(token: string) {
  return apiFetch<{ id: number; name: string; email: string }>('/api/auth/me', { token });
}

// Card API wrappers
export async function createCard(token: string, payload: Omit<Card, 'slug' | 'createdAt'>) {
  return apiFetch<Card>('/api/cards', { method: 'POST', token, body: payload });
}

export async function getCards(token: string) {
  return apiFetch<Card[]>('/api/cards', { method: 'GET', token });
}

export async function getCardBySlug(slug: string, token?: string | null) {
  return apiFetch<Card>(`/api/cards/${slug}`, { method: 'GET', token });
}

export async function updateCard(slug: string, token: string, payload: Partial<Card>) {
  return apiFetch<Card>(`/api/cards/${slug}`, { method: 'PUT', token, body: payload });
}

export async function deleteCard(slug: string, token: string) {
  return apiFetch<{ success: boolean }>(`/api/cards/${slug}`, { method: 'DELETE', token });
}
