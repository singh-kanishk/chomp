import { BaseUrl } from "@chomp/shared";

interface ApiCall {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  config?: RequestInit;
}

export async function apiCall<T>({
  config,
  url,
  method,
  body,
}: ApiCall): Promise<T> {
  try {
    const finalConfig: RequestInit = {
      ...config,
      method,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    let response = await fetch(BaseUrl.server + url, finalConfig);

    if (response.status === 401 && url !== "/refresh") {
      const refreshResponse = await fetch(BaseUrl.server + "/refresh", {
        method: "POST",
      });

      if (refreshResponse.ok) {
        response = await fetch(BaseUrl.server + url, finalConfig);
      }
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `Request failed with status ${response.status}`,
      );
    }

    return result as T;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown Error";
    throw new Error(errorMessage);
  }
}
