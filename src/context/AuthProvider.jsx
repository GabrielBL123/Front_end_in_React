import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true); // block routing until we know auth state

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const response = await axios.post("/auth/refresh"); // refreshToken cookie sent automatically
        const payload = response?.data?.data || response?.data;

        setAuth({
          accessToken: payload?.token,
          roles: payload?.roles || [],
          nome: payload?.nome,
          empresaNome: payload?.empresaNome,
          empresaId: payload?.empresaID,
          usuarioId: payload?.usuarioID,
          avaliacaoAtivaId: payload?.avaliacaoAtivaId,
        });
      } catch {
        setAuth({}); // no valid refresh token -> stay logged out
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
