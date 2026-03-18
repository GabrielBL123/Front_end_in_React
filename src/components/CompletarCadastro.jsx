import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const REGISTER_URL = "/auth/registrar";

const CompletarCadastro = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const errRef = useRef();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [empresaCnpj, setEmpresaCnpj] = useState("");
  const [cargo, setCargo] = useState("");
  const [tempoDeTrabalho, setTempoDeTrabalho] = useState("");
  const [jornada, setJornada] = useState("");

  useEffect(() => {
    const emailDaUrl = searchParams.get("email");
    if (emailDaUrl) {
      setEmail(emailDaUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    setErrMsg("");
  }, [nome, pwd, matchPwd]);

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
        role: "USER",
        empresaCnpj: empresaCnpj,
        cargo: cargo,
        tempoDeTrabalho: traduzirTempoDeTrabalho(tempoDeTrabalho),
        jornada: traduzirJornada(jornada),
      });

      await axios.post(REGISTER_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sem resposta do servidor.");
      } else if (err.response?.status === 400) {
        setErrMsg(
          err.response.data ||
            "Erro 400: Dados inválidos ou Empresa não encontrada.",
        );
      } else if (err.response?.status === 409) {
        setErrMsg("Este E-mail já concluiu o cadastro antes.");
      } else {
        setErrMsg("Falha ao concluir o cadastro.");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl my-8 text-center mx-auto">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6">
            Tudo Pronto! 🎉
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Seu cadastro foi concluído com sucesso.
          </p>
          <p className="text-lg text-blue-600 font-medium mb-6">
            Redirecionando você para a tela inicial...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white p-10 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
          <div className="flex flex-col justify-center items-center mb-8 border-b-2 border-green-100 pb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center">
              Completar Cadastro
            </h2>
            <p className="text-gray-500 mt-3 text-lg text-center">
              Quase lá! Preencha seus dados para ativar sua conta.
            </p>
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
              {/* E-MAIL (Bloqueado) */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700 text-lg">
                  E-mail (Login):
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none text-lg"
                />
              </div>

              {/* NOME COMPLETO */}
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
                  autoFocus
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required
                  placeholder="Ex: João da Silva"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* CNPJ DA EMPRESA */}
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

              {/* CARGO */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="cargo"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Seu Cargo:
                </label>
                <input
                  type="text"
                  id="cargo"
                  onChange={(e) => setCargo(e.target.value)}
                  value={cargo}
                  required
                  placeholder="Ex: Assistente Administrativo"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* TEMPO DE TRABALHO */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="tempoDeTrabalho"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Tempo na Empresa:
                </label>
                <input
                  type="text"
                  id="tempoDeTrabalho"
                  onChange={(e) => setTempoDeTrabalho(e.target.value)}
                  value={tempoDeTrabalho}
                  required
                  placeholder="Ex: 1 ano"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* JORNADA */}
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

              {/* SENHA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Crie sua Senha:
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* CONFIRMAR SENHA */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirm_pwd"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Confirme a Senha:
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg shadow-md transition-all"
              >
                Concluir Cadastro
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CompletarCadastro;
