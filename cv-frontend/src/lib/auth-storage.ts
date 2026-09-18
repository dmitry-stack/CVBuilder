import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let refreshPromise: Promise<string | null> | null = null;

export const authStorage = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1, sameSite: "lax" });

    if (typeof window !== "undefined") {
      fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
        }),
      }).catch((err) => {
        console.error("Failed to persist session to server:", err);
      });
    }
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    if (typeof window !== "undefined") {
      fetch("/api/auth/session", {
        method: "DELETE",
      }).catch((err) => {
        console.error("Failed to clear server session:", err);
      });
    }
  },

  refreshTokens: async (): Promise<string | null> => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const res = await fetch("/api/auth/refresh", {
            method: "POST",
          });

          if (!res.ok) {
            authStorage.clearTokens();
            return null;
          }

          const data = await res.json();
          if (data.access_token) {
            Cookies.set(ACCESS_TOKEN_KEY, data.access_token, {
              expires: 1,
              sameSite: "lax",
            });
            return data.access_token as string;
          }

          authStorage.clearTokens();
          return null;
        } catch {
          authStorage.clearTokens();
          return null;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    return refreshPromise;
  },
};
