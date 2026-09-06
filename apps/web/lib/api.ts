const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type SessionUser = { id: string; name?: string; email: string; roles: string[] };

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: 'Request failed.' }))) as {
      message?: string | string[];
    };
    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(', ')
        : (error.message ?? 'Request failed.'),
    );
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}
