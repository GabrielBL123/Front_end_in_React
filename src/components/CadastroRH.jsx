import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const REGISTER_URL = "/auth/registrar";

const CadastroRH = () => {
  const navigate = useNavigate();

  const errRef = useRef();
  const emailRef = useRef();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [empresaCnpj, setEmpresaCnpj] = useState("");
  const [cargo, setCargo] = useState("");
  const [tempoDeTrabalho, setTempoDeTrabalho] = useState("");
  const [jornada, setJornada] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, nome, pwd, matchPwd]);

  const traduzirTempoDeTrabalho = (texto) => {
    if (!texto) return null;
    const textoMin = texto.toLowerCase();
    const hoje = new Date();

    const regexData = /(\d{2})\/(\d{2})\/(\d{4})/;
    const matchData = texto.match(regexData);
    if (matchData) {
      return `${matchData[3]}-${matchData[2]}-${matchData[1]}T08:00:00`;
    }

    if (textoMin.includes("ano")) {
      const qtd = parseInt(texto.replace(/\D/g, "")) || 0;
      hoje.setFullYear(hoje.getFullYear() - qtd);
      return hoje.toISOString().split(".")[0];
    }

    if (textoMin.includes("mes") || textoMin.includes("mês")) {
      const qtd = parseInt(texto.replace(/\D/g, "")) || 0;
      hoje.setMonth(hoje.getMonth() - qtd);
      return hoje.toISOString().split(".")[0];
    }

    return hoje.toISOString().split(".")[0];
  };

  const traduzirJornada = (texto) => {
    if (!texto) return null;
    const horas = texto.replace(/\D/g, "");
    return horas ? `PT${horas}H` : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pwd !== matchPwd) {
      setErrMsg("As senhas não coincidem.");
      return;
    }

    try {
      const payload = JSON.stringify({
        login: email,
        nome: nome,
        password: pwd,
        role: "ADMIN",
        empresaCnpj: empresaCnpj,
        cargo: cargo,
        tempoDeTrabalho: traduzirTempoDeTrabalho(tempoDeTrabalho),
        jornada: traduzirJornada(jornada),
      });

      const response = await axios.post(REGISTER_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setEmail("");
        setNome("");
        setPwd("");
        setMatchPwd("");
        setEmpresaCnpj("");
        setCargo("");
        setTempoDeTrabalho("");
        setJornada("");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sem resposta do servidor.");
      } else if (err.response?.status === 409) {
        setErrMsg("Login (E-mail) já existente.");
      } else if (err.response?.status === 400) {
        setErrMsg(
          err.response.data ||
            "Erro 400: Dados inválidos ou Empresa não encontrada.",
        );
      } else if (err.response?.status === 403) {
        setErrMsg("Sem permissão para cadastrar administradores.");
      } else {
        setErrMsg("Falha no registo.");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl my-8 text-center mx-auto">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6">
            Sucesso!
          </h1>
          <p className="text-xl text-gray-700 mb-4">Registo de RH concluído.</p>
          <p className="text-lg text-blue-600 font-medium mb-6">
            O link de acesso foi enviado com sucesso para o e-mail informado.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-lg font-bold rounded-lg shadow-md transition-all"
          >
            Ir para o Menu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white p-10 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
          <div className="flex justify-center mb-8 border-b-2 border-green-100 pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700">
              Registar RH
            </h2>
          </div>

          <p
            ref={errRef}
            className={
              errMsg
                ? "block w-full bg-red-100 border border-red-300 text-red-700 font-bold p-4 rounded-lg text-center mb-6"
                : "hidden"
            }
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. E-MAIL (Usado como Login) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  E-mail de Acesso:
                </label>
                <input
                  type="email"
                  id="email"
                  ref={emailRef}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  placeholder="Ex: rh@empresa.com.br"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 2. NOME */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="nome"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Nome Completo:
                </label>
                <input
                  type="text"
                  id="nome"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 3. CNPJ DA EMPRESA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="empresaCnpj"
                  className="font-semibold text-gray-700 text-lg"
                >
                  CNPJ da Empresa:
                </label>
                <input
                  type="text"
                  id="empresaCnpj"
                  onChange={(e) => setEmpresaCnpj(e.target.value)}
                  value={empresaCnpj}
                  required
                  placeholder="Ex: 00.000.000/0001-00"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 4. SENHA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Senha Temporária:
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 5. CONFIRMAR SENHA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirm_pwd"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Confirmar Senha:
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 6. CARGO */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cargo"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Cargo:
                </label>
                <input
                  type="text"
                  id="cargo"
                  onChange={(e) => setCargo(e.target.value)}
                  value={cargo}
                  required
                  placeholder="Ex: Analista de RH"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 7. TEMPO DE TRABALHO */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="tempoDeTrabalho"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Tempo de Empresa:
                </label>
                <input
                  type="text"
                  id="tempoDeTrabalho"
                  onChange={(e) => setTempoDeTrabalho(e.target.value)}
                  value={tempoDeTrabalho}
                  required
                  placeholder="Ex: 5 anos"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* 8. JORNADA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="jornada"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Jornada Semanal:
                </label>
                <input
                  type="text"
                  id="jornada"
                  onChange={(e) => setJornada(e.target.value)}
                  value={jornada}
                  required
                  placeholder="Ex: 40h"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg shadow-md transition-all"
              >
                Registar RH
              </button>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold rounded-lg transition-all border border-gray-300"
              >
                Pular esta etapa
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CadastroRH;
