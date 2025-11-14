const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiFetch = async (
  path: string,
  options: RequestInit = {},
  token?: string | null
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.error || "Request failed");
  }
  
  return data;
};
