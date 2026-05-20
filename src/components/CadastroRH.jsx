import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const REGISTER_URL = "/admin/criar-rh-empresa";

const CadastroRH = () => {
  const navigate = useNavigate();

  const errRef = useRef();
  const emailRef = useRef();

  // Dados do Administrador (RH)
  const [login, setLogin] = useState("");
  const [nome, setNome] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");

  // Dados da Empresa
  const [cnpj, setCnpj] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [telefoneEmpresa, setTelefoneEmpresa] = useState(""); // ✨ Novo estado para o Telefone

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [login, nome, pwd, matchPwd, cnpj, nomeEmpresa, emailEmpresa, telefoneEmpresa]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pwd !== matchPwd) {
      setErrMsg("As senhas não coincidem.");
      return;
    }

    try {
      // 1️⃣ PRIMEIRO PASSO: SALVAR O CADASTRO NO BANCO
      const payload = JSON.stringify({
        nome: nome,
        login: login,
        password: pwd,
        role: "ADMIN",
        cnpj: cnpj,
        nomeEmpresa: nomeEmpresa,
        emailEmpresa: emailEmpresa,
        telefoneEmpresa: telefoneEmpresa, // ✨ Adicionado ao envio de dados
      });

      const response = await axios.post(REGISTER_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, 
      });

      if (response.status === 200 || response.status === 201) {
        
        // 2️⃣ SEGUNDO PASSO: DISPARAR O E-MAIL AUTOMATICAMENTE
        try {
          await axios.post("auth/enviar_link_email", JSON.stringify({ email: login }), {
            headers: {
              "Content-Type": "application/json",
            }
          });
          console.log("E-mail enviado com sucesso!");
        } catch (emailErr) {
          console.error("Falha ao enviar o e-mail: ", emailErr);
        }

        // 3️⃣ FINALIZAR E MOSTRAR TELA DE SUCESSO
        setSuccess(true);
        setLogin("");
        setNome("");
        setPwd("");
        setMatchPwd("");
        setCnpj("");
        setNomeEmpresa("");
        setEmailEmpresa("");
        setTelefoneEmpresa(""); // ✨ Limpar após sucesso
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sem resposta do servidor.");
      } else if (err.response?.status === 409) {
        setErrMsg("Login (E-mail) ou CNPJ já existente.");
      } else if (err.response?.status === 400) {
        setErrMsg(
          err.response.data?.message ||
            err.response.data ||
            "Erro 400: Verifique se todos os campos foram preenchidos corretamente."
        );
      } else if (err.response?.status === 403) {
        setErrMsg("Sem permissão para realizar esta ação.");
      } else {
        setErrMsg("Falha no registro.");
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
          <p className="text-xl text-gray-700 mb-4">
            Registro de RH e Empresa concluído.
          </p>
          <p className="text-lg text-blue-600 font-medium mb-6">
            O link de acesso foi enviado com sucesso para o e-mail informado.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-lg font-bold rounded-lg shadow-md transition-all"
          >
            Voltar ao Painel Admin
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white p-10 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
          <div className="flex justify-center mb-8 border-b-2 border-green-100 pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700">
              Registrar RH e Empresa
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
              <div className="flex flex-col gap-2">
                <label htmlFor="nome" className="font-semibold text-gray-700 text-lg">
                  Nome Completo (Admin):
                </label>
                <input
                  type="text"
                  id="nome"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required
                  placeholder="Ex: Ana Silva"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="login" className="font-semibold text-gray-700 text-lg">
                  E-mail de Acesso (Login):
                </label>
                <input
                  type="email"
                  id="login"
                  ref={emailRef}
                  onChange={(e) => setLogin(e.target.value)}
                  value={login}
                  required
                  placeholder="Ex: ana.silva@empresa.com.br"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nomeEmpresa" className="font-semibold text-gray-700 text-lg">
                  Nome da Empresa:
                </label>
                <input
                  type="text"
                  id="nomeEmpresa"
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  value={nomeEmpresa}
                  required
                  placeholder="Ex: Tech Solutions Ltda"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="cnpj" className="font-semibold text-gray-700 text-lg">
                  CNPJ da Empresa:
                </label>
                <input
                  type="text"
                  id="cnpj"
                  onChange={(e) => setCnpj(e.target.value)}
                  value={cnpj}
                  required
                  placeholder="Ex: 00.000.000/0001-00"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="emailEmpresa" className="font-semibold text-gray-700 text-lg">
                  E-mail Comercial (Empresa):
                </label>
                <input
                  type="email"
                  id="emailEmpresa"
                  onChange={(e) => setEmailEmpresa(e.target.value)}
                  value={emailEmpresa}
                  required
                  placeholder="Ex: contato@empresa.com.br"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              {/* ✨ Novo Campo de Telefone substituindo a antiga Div vazia */}
              <div className="flex flex-col gap-2">
                <label htmlFor="telefoneEmpresa" className="font-semibold text-gray-700 text-lg">
                  Telefone da Empresa:
                </label>
                <input
                  type="text"
                  id="telefoneEmpresa"
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                  value={telefoneEmpresa}
                  required
                  placeholder="Ex: (00) 00000-0000"
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-semibold text-gray-700 text-lg">
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

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm_pwd" className="font-semibold text-gray-700 text-lg">
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
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg shadow-md transition-all"
              >
                Registrar Empresa e RH
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold rounded-lg transition-all border border-gray-300"
              >
                Voltar ao Painel Admin
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CadastroRH;