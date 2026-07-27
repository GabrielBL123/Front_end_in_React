import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { decodeAccessToken } from "../utils/decodeToken";
import { setAccessToken, clearAccessToken } from "../tokenStore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true); // block routing until we know auth state

  useEffect(() => {
    const bootstrapAuth = async () => {
      let accessToken;
      try {
        const refreshResponse = await axios.post("/auth/refresh");
        const refreshPayload = refreshResponse?.data?.data || refreshResponse?.data;
        accessToken = refreshPayload?.accessToken;

        if (!accessToken) {
          clearAccessToken();
          setAuth(() => ({}));
          setLoading(false);
          return;
        }

        setAccessToken(accessToken);
        const decodedRoles = decodeAccessToken(accessToken)?.roles;
        const roles = Array.isArray(decodedRoles)
          ? decodedRoles
          : decodedRoles
            ? [decodedRoles]
            : [];

        setAuth((prev) => ({
          ...prev,
          accessToken,
          roles,
        }));
      } catch {
        clearAccessToken();
        setAuth(() => ({}));
        setLoading(false);
        return;
      }

      try {
        const meResponse = await axios.get("/auth/me", {
          headers: { Authorization: "Bearer ".concat(accessToken) },
        });
        const mePayload = meResponse?.data?.data || meResponse?.data;
        const profileRoles = mePayload?.roles;

        setAuth((prev) => ({
          ...prev,
          roles: Array.isArray(profileRoles)
            ? profileRoles
            : profileRoles
              ? [profileRoles]
              : prev?.roles || [],
          user: mePayload?.login,
          nome: mePayload?.nome,
          empresaNome: mePayload?.empresaNome,
          empresaId: mePayload?.empresaID,
          usuarioId: mePayload?.usuarioID,
          avaliacaoAtivaId: mePayload?.avaliacaoAtivaId,
        }));
      } catch (error) {
        void error;
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
