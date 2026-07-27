import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { decodeAccessToken } from "../utils/decodeToken";
import { setAccessToken, clearAccessToken } from "../tokenStore";

const AuthContext = createContext({});
const normalizeRoles = (roles) =>
  Array.isArray(roles) ? roles : roles ? [roles] : [];

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true); // block routing until we know auth state

  useEffect(() => {
    const bootstrapAuth = async () => {
      const clearAuthState = () => {
        clearAccessToken();
        setAuth(() => ({}));
      };

      let accessToken;
      try {
        const refreshResponse = await axios.post("/auth/refresh");
        const refreshPayload = refreshResponse?.data?.data || refreshResponse?.data;
        accessToken = refreshPayload?.accessToken;

        if (!accessToken) {
          clearAuthState();
          setLoading(false);
          return;
        }

        setAccessToken(accessToken);
        const roles = normalizeRoles(decodeAccessToken(accessToken)?.roles);

        setAuth((prev) => ({
          ...prev,
          accessToken,
          roles,
        }));
      } catch (error) {
        if (import.meta.env.DEV) console.debug("Failed to refresh auth", error);
        clearAuthState();
        setLoading(false);
        return;
      }

      try {
        const meResponse = await axios.get("/auth/me", {
          headers: { Authorization: "Bearer " + accessToken },
        });
        const mePayload = meResponse?.data?.data || meResponse?.data;
        const profileRoles = normalizeRoles(mePayload?.roles);

        setAuth((prev) => ({
          ...prev,
          roles: profileRoles.length ? profileRoles : (prev?.roles || []),
          user: mePayload?.login,
          nome: mePayload?.nome,
          empresaNome: mePayload?.empresaNome,
          empresaId: mePayload?.empresaID,
          usuarioId: mePayload?.usuarioID,
          avaliacaoAtivaId: mePayload?.avaliacaoAtivaId,
        }));
      } catch (error) {
        if (import.meta.env.DEV) console.debug("Failed to load /auth/me", error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
