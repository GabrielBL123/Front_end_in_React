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
      const avaliacaoAtivaId = payload?.avaliacaoAtivaId;

      // ✅ Salva no contexto global (podemos manter o nome da variável local com 'd' minúsculo para padronizar no React)
      setAuth({
        user,
        roles,
        accessToken,
        nome,
        empresaNome,
        empresaId,
        usuarioId,
        avaliacaoAtivaId,
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');

        .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
        .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }

        @keyframes psy-breathe {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.12); opacity: 0.9; }
        }
        @keyframes psy-breathe-slow {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.06); opacity: 0.6; }
        }
        .psy-ring-1 { animation: psy-breathe 9s ease-in-out infinite; }
        .psy-ring-2 { animation: psy-breathe-slow 9s ease-in-out infinite; animation-delay: -1.5s; }
        .psy-ring-3 { animation: psy-breathe-slow 9s ease-in-out infinite; animation-delay: -3s; }

        @media (prefers-reduced-motion: reduce) {
          .psy-ring-1, .psy-ring-2, .psy-ring-3 { animation: none; }
        }

        .psy-input {
          background-color: #ffffff;
          border: 1px solid #d8d6cb;
          color: #23302b;
        }
        .psy-input::placeholder { color: #9ca39c; }
        .psy-input:focus {
          outline: none;
          border-color: #6e8f76;
          box-shadow: 0 0 0 3px rgba(110, 143, 118, 0.18);
        }
        .psy-btn {
          background-color: #1e3835;
          color: #f3f1e9;
        }
        .psy-btn:hover { background-color: #254440; }
        .psy-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px #fcfbf7, 0 0 0 4px #6e8f76;
        }
      `}</style>

      <div
        className="psy-shell w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 rounded-2xl overflow-hidden"
        style={{
          colorScheme: "light",
          border: "1px solid #dcd9cc",
          boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
        }}
      >
        {/* Left panel — calm / mindfulness signature */}
        <div
          className="relative hidden md:flex md:col-span-2 flex-col justify-between p-10 overflow-hidden min-h-[560px]"
          style={{
            background: "linear-gradient(to bottom, #1e3835, #152826)",
            color: "#f3f1e9",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="psy-ring-3 absolute w-64 h-64 rounded-full"
              style={{ border: "1px solid rgba(199,167,107,0.25)" }}
            />
            <span
              className="psy-ring-2 absolute w-48 h-48 rounded-full"
              style={{ border: "1px solid rgba(199,167,107,0.35)" }}
            />
            <span
              className="psy-ring-1 absolute w-32 h-32 rounded-full"
              style={{ border: "1px solid rgba(199,167,107,0.5)" }}
            />
            <span
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: "#c7a76b" }}
            />
          </div>

          <div className="relative z-10">
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "rgba(199,167,107,0.9)" }}
            >
                Bem vindo ao sistema Cuida+
            </p>
            <h1 className="psy-display italic text-3xl mt-3 leading-snug">
              Um espaço para
              <br />
              organizar o cuidado.
            </h1>
          </div>

          <p
            className="relative z-10 text-sm max-w-[26ch] leading-relaxed"
            style={{ color: "rgba(217,214,200,0.8)" }}
          >
            Acesse o painel para acompanhar avaliações, sessões e o histórico
            de cada paciente em um só lugar.
          </p>
        </div>

        {/* Right panel — form */}
        <section
          className="md:col-span-3 p-8 sm:p-12 flex flex-col justify-center"
          style={{ backgroundColor: "#fcfbf7" }}
        >
          <div className="max-w-sm w-full mx-auto">
            <p
              className="text-xs tracking-[0.25em] uppercase font-medium mb-2"
              style={{ color: "#5c7d63" }}
            >
              Bem-vindo(a) de volta
            </p>
            <h2
              className="psy-display text-2xl mb-8"
              style={{ color: "#1f2a27" }}
            >
              Entrar na plataforma
            </h2>

            <p
              ref={errRef}
              className={errMsg ? "block mb-5 rounded-lg px-4 py-2.5 text-sm" : "hidden"}
              style={
                errMsg
                  ? {
                      border: "1px solid rgba(201,123,107,0.4)",
                      backgroundColor: "rgba(201,123,107,0.1)",
                      color: "#8a3e31",
                    }
                  : undefined
              }
              aria-live="assertive"
            >
              {errMsg}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="remember" defaultValue={true} />

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#3a423e" }}
                >
                  Login
                </label>
                <input
                  id="email-address"
                  name="email"
                  autoComplete="email"
                  className="psy-input appearance-none block w-full rounded-lg px-3.5 py-2.5 transition-shadow sm:text-sm"
                  placeholder="Digite seu login ou email"
                  required
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#3a423e" }}
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="psy-input appearance-none block w-full rounded-lg px-3.5 py-2.5 transition-shadow sm:text-sm"
                  placeholder="Senha"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />
              </div>

              <button
                type="submit"
                className="psy-btn w-full mt-2 rounded-lg font-medium text-sm py-2.5 transition-colors"
              >
                Entrar
              </button>
            </form>

            <p
              className="mt-8 text-xs text-center leading-relaxed"
              style={{ color: "#8b9188" }}
            >
              Seus dados são tratados com confidencialidade,
              <br />
              como parte do cuidado com cada paciente.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;