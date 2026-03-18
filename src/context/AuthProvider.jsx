import { createContext, useState } from "react";

const AuthContext = createContext({}); //caixa vazia

export const AuthProvider = ({ children }) => {
  //tudo que estiver em children tera acesso aos dados de login
  const [auth, setAuth] = useState({}); //use salva objeto no auth

  return (
    //Tudo o que estiver dentro de mim (children) pode acessar o valor value={{ auth, setAuth }}
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
