import { jwtDecode } from "jwt-decode";

export const decodeAccessToken = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug("Failed to decode access token", error);
    }
    return null;
  }
};
