import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authStorage = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1, sameSite: "lax" });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires: 7,
      sameSite: "lax",
    });
  },

  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};
