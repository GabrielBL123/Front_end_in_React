import { useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../tailwind.css";

const LOGIN_URL = "/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ login: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      // Pega os dados dentro do ResponseDTO
      const payload = response?.data?.data || response?.data;

      const accessToken = payload?.token;
      const roles = payload?.roles || [];
      const nome = payload?.nome;
      
      // ✅ AGORA SIM! Escrito exatamente igual ao seu Record do Java (com 'ID' maiúsculo)
      const empresaNome = payload?.empresaNome;
      const empresaId = payload?.empresaID; 
      const usuarioId = payload?.usuarioID; 

      // ✅ Salva no contexto global (podemos manter o nome da variável local com 'd' minúsculo para padronizar no React)
      setAuth({
        user,
        roles,
        accessToken,
        nome,
        empresaNome,
        empresaId,
        usuarioId, 
      });

      setUser("");
      setPwd("");
      navigate("/menu", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sem resposta do servidor");
      } else if (err.response?.status === 400) {
        setErrMsg("Usuário ou senha ausentes");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setErrMsg("Não autorizado (Credenciais incorretas)");
      } else {
        setErrMsg("Falha no login");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "text-red-500 block" : "hidden"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="remember" defaultValue={true} />
        <div className="">
          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium"
            >
              Login:
            </label>
            <input
              id="email-address"
              name="email"
              autoComplete="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Digite seu login ou email"
              required
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mt-4"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
              />
            </div>

            <div className="mt-4">
              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;