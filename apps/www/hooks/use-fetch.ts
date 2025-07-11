// Server-side fetch function for SSR only
export async function useFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      return text as T;
    }
  } catch (error) {
    throw error;
  }
}

// Convenience functions for specific HTTP methods
export async function useGet<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return useFetch<T>(url, { ...options, method: "GET" });
}

export async function usePost<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return useFetch<T>(url, { ...options, method: "POST" });
}

export async function usePut<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return useFetch<T>(url, { ...options, method: "PUT" });
}

export async function useDelete<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return useFetch<T>(url, { ...options, method: "DELETE" });
}
