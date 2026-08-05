import { BaseUrl, type ApiResponse } from "@chomp/shared";

/**
 * Returns the base API URL:
 * 1. Explicit override via VITE_API_URL if provided
 * 2. BaseUrl.deployedServer when in production mode (Vite import.meta.env.PROD / MODE === "production" / VITE_ENV === "production")
 * 3. BaseUrl.server (localhost:3000) in development mode
 */
export const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const isProduction =
    import.meta.env.PROD ||
    import.meta.env.MODE === "production" ||
    import.meta.env.VITE_ENV === "production";

  return isProduction ? BaseUrl.deployedServer : BaseUrl.server;
};

const BASE_URL = getBaseUrl();

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
}: ApiCall): Promise<ApiResponse<T>> {
  try {
    const finalConfig: RequestInit = {
      ...config,
      method,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    };

    let response = await fetch(BASE_URL + url, finalConfig);

    // 1. Handle Token Refresh
    if (response.status === 401 && url !== "/auth/refresh") {
      const refreshResponse = await fetch(BASE_URL + "/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        // Retry the original request exactly as it was
        response = await fetch(BASE_URL + url, finalConfig);
      } else {
        return {
          statusCode: 401,
          success: false,
          message: "Session Finished Re Login",
        };
      }
    }

    // 2. Safe JSON Parsing
    const result = await response.json().catch(() => ({}));

    // 3. Structured Response Handling
    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message:
          result.message || `Request failed with status ${response.status}`,
        error: result.error || "API_ERROR",
      };
    }

    return {
      success: true,
      statusCode: response.status,
      body: result.body as T, // Extracting .body from the backend's result
      message: result.message || "Success",
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown Error";
    return {
      success: false,
      statusCode: 500,
      message: errorMessage,
      error: "INTERNAL_CLIENT_ERROR",
    };
  }
}
