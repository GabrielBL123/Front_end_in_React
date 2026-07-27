import { jwtDecode } from "jwt-decode";

export const decodeAccessToken = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
