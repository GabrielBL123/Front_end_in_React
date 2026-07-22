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
  const [telefoneEmpresa, setTelefoneEmpresa] = useState(""); 

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
        role: "RH",
        cnpj: cnpj,
        nomeEmpresa: nomeEmpresa,
        emailEmpresa: emailEmpresa,
        telefoneEmpresa: telefoneEmpresa, 
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
          await axios.post(
            "auth/enviar_link_email",
            JSON.stringify({ email: login }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
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
        setTelefoneEmpresa(""); 
        
        // Cronômetro automático removido daqui!
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
            "Erro 400: Verifique se todos os campos foram preenchidos corretamente.",
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
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');
        .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
        .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
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
        .psy-btn-secondary {
          background-color: transparent;
          color: #3a423e;
          border: 1px solid #d8d6cb;
        }
        .psy-btn-secondary:hover { background-color: #f3f1e9; }
      `}</style>

      {success ? (
        <div 
          className="psy-shell w-full max-w-2xl p-10 md:p-14 rounded-3xl text-center mx-auto"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl" style={{ backgroundColor: "#E3F0E6", color: "#2F5C3E" }}>
            ✓
          </div>
          <h1 className="psy-display text-4xl mb-4" style={{ color: "#1F2A27" }}>
            Sucesso!
          </h1>
          <p className="text-lg font-medium mb-2" style={{ color: "#5C7D63" }}>
            Registro de RH e Empresa concluído.
          </p>
          <p className="text-base mb-10 leading-relaxed" style={{ color: "#6B7570" }}>
            O link de acesso foi enviado com sucesso para o e-mail informado.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="psy-btn px-8 py-3.5 font-semibold rounded-xl transition-all shadow-sm w-full sm:w-auto"
          >
            Voltar ao Painel Admin
          </button>
        </div>
      ) : (
        <div 
          className="psy-shell w-full max-w-4xl p-8 md:p-14 rounded-3xl mx-auto"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div className="mb-10 border-b pb-6" style={{ borderBottomColor: "#E4E1D3" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}>
                ✚
              </span>
              <p className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: "#5C7D63" }}>
                Administração
              </p>
            </div>
            <h2 className="psy-display text-3xl md:text-4xl" style={{ color: "#1F2A27" }}>
              Registrar RH e Empresa
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#6B7570" }}>
              Preencha os dados abaixo para cadastrar um novo cliente no sistema.
            </p>
          </div>

          <p
            ref={errRef}
            className={errMsg ? "block w-full p-4 rounded-xl text-center mb-8 text-sm font-medium" : "hidden"}
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* DADOS DA EMPRESA */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4" style={{ color: "#3a423e", borderBottomColor: "#E4E1D3" }}>
                  Dados da Empresa
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nomeEmpresa" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  id="nomeEmpresa"
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  value={nomeEmpresa}
                  required
                  placeholder="Ex: Tech Solutions Ltda"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="cnpj" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  CNPJ
                </label>
                <input
                  type="text"
                  id="cnpj"
                  onChange={(e) => setCnpj(e.target.value)}
                  value={cnpj}
                  required
                  placeholder="Ex: 00.000.000/0001-00"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="emailEmpresa" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  E-mail Comercial
                </label>
                <input
                  type="email"
                  id="emailEmpresa"
                  onChange={(e) => setEmailEmpresa(e.target.value)}
                  value={emailEmpresa}
                  required
                  placeholder="Ex: contato@empresa.com.br"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefoneEmpresa" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefoneEmpresa"
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                  value={telefoneEmpresa}
                  required
                  placeholder="Ex: (00) 00000-0000"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              {/* DADOS DO RESPONSÁVEL (RH) */}
              <div className="md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4" style={{ color: "#3a423e", borderBottomColor: "#E4E1D3" }}>
                  Dados do Responsável (RH)
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nome" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required
                  placeholder="Ex: Ana Silva"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="login" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  E-mail de Acesso (Login)
                </label>
                <input
                  type="email"
                  id="login"
                  ref={emailRef}
                  onChange={(e) => setLogin(e.target.value)}
                  value={login}
                  required
                  placeholder="Ex: ana.silva@empresa.com.br"
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Senha Temporária
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirm_pwd" className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  className="psy-input w-full px-4 py-3 rounded-xl transition-shadow sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                className="psy-btn flex-1 py-3.5 px-6 font-semibold rounded-xl shadow-md transition-all text-sm"
              >
                Registrar Empresa e RH
              </button>

              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="psy-btn-secondary flex-1 py-3.5 px-6 font-semibold rounded-xl transition-all text-sm"
              >
                Voltar ao Painel Admin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CadastroRH;