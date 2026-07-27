import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../tailwind.css";

const Perfil = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [dadosBanco, setDadosBanco] = useState({
    nome: "",
    login: "",
    role: "",
    nomeEmpresa: "",
    empresaEmail: "",
    cnpj: "",
  });
  
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let isMounted = true;

    const buscarDadosDoUsuario = async () => {
      try {
        const identificador = auth?.usuarioId || auth?.user;

        if (!identificador) {
          setErro("Sessão inválida. Não foi possível identificar o usuário.");
          setCarregando(false);
          return;
        }

        const response = await axiosPrivate.get(`/usuario/${auth?.usuarioId}`);
        const dados = response.data?.data || response.data;
        
        if (isMounted) {
          setDadosBanco({
            nome: dados.nome || "Não informado",
            login: dados.login || "Não informado",
            role: dados.role || "USER",
            nomeEmpresa: dados.nomeEmpresa || "Não informado",
            empresaEmail: dados.empresaEmail || "Não informado",
            cnpj: dados.cnpj || "Não informado",
          });
          setCarregando(false);
        }

      } catch (err) {
        console.error("Erro ao buscar os dados do usuário:", err);
        if (isMounted) {
          setErro("Não foi possível carregar as informações do perfil.");
          setCarregando(false);
        }
      }
    };

    if (auth?.user || auth?.usuarioId) {
      buscarDadosDoUsuario();
    } else {
      setCarregando(false);
      setErro("Usuário não autenticado.");
    }

    return () => {
      isMounted = false;
    };
  }, [auth, axiosPrivate]);

  const formatarRole = (role) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "RH") return "Recursos Humanos";
    return "Usuário Comum";
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col items-center p-4 md:p-8"
      style={{ backgroundColor: "#EDEEE8", colorScheme: "light" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');
        .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
        .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .psy-btn-secondary {
          background-color: transparent;
          color: #3A423E;
          border: 1px solid #D8D6CB;
        }
        .psy-btn-secondary:hover { background-color: #F3F1E9; }
      `}</style>

      <div 
        className="psy-shell w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8"
        style={{
          backgroundColor: "#FCFBF7",
          border: "1px solid #DCD9CC",
        }}
      >
        {/* Cabeçalho do Perfil */}
        <div 
          className="py-12 px-6 flex flex-col items-center relative text-white"
          style={{ background: "linear-gradient(135deg, #1E3835, #152826)" }}
        >
          <div 
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black shadow-xl mb-4 border-4 z-10"
            style={{ backgroundColor: "#C7A76B", color: "#1F2A27", borderColor: "rgba(255,255,255,0.2)" }}
          >
            {dadosBanco.nome && dadosBanco.nome !== "Não informado" ? dadosBanco.nome.charAt(0).toUpperCase() : (auth?.user ? auth.user.charAt(0).toUpperCase() : "U")}
          </div>
          <h2 className="psy-display text-3xl md:text-4xl z-10 text-center" style={{ color: "#F3F1E9" }}>
            {dadosBanco.nome !== "Não informado" ? dadosBanco.nome : "Meu Perfil"}
          </h2>
          <span 
            className="z-10 px-4 py-1.5 rounded-full mt-3 text-xs font-bold uppercase tracking-wider shadow-inner border"
            style={{ backgroundColor: "rgba(199,167,107,0.2)", color: "#C7A76B", borderColor: "rgba(199,167,107,0.4)" }}
          >
            {formatarRole(dadosBanco.role)}
          </span>
        </div>

        {/* Conteúdo */}
        <div className="p-8 md:p-10 flex flex-col gap-8">
          {carregando ? (
            <div className="flex flex-col justify-center items-center py-12 gap-4">
              <div className="w-12 h-12 border-4 border-t-[#6E8F76] rounded-full animate-spin" style={{ borderColor: "#E3F0E6", borderTopColor: "#6E8F76" }}></div>
              <p className="font-bold animate-pulse" style={{ color: "#5C7D63" }}>Carregando seus dados...</p>
            </div>
          ) : erro ? (
            <div className="p-4 rounded-xl text-center font-medium" style={{ backgroundColor: "rgba(201,123,107,0.1)", border: "1px solid rgba(201,123,107,0.4)", color: "#8A3E31" }}>
              {erro}
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b flex items-center gap-2" style={{ color: "#5C7D63", borderColor: "#E4E1D3" }}>
                  Dados de Acesso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border" style={{ backgroundColor: "#EDEEE8", borderColor: "#D8D6CB" }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#8B9188" }}>E-mail (Login)</span>
                    <span className="text-sm font-semibold truncate" style={{ color: "#1F2A27" }} title={dadosBanco.login}>
                      {dadosBanco.login}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#8B9188" }}>Nível de Permissão</span>
                    <span className="text-sm font-semibold" style={{ color: "#1F2A27" }}>{formatarRole(dadosBanco.role)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b flex items-center gap-2" style={{ color: "#5C7D63", borderColor: "#E4E1D3" }}>
                  Informações da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border" style={{ backgroundColor: "#EDEEE8", borderColor: "#D8D6CB" }}>
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#8B9188" }}>Nome da Empresa</span>
                    <span className="psy-display text-xl" style={{ color: "#1E3835" }}>
                      {dadosBanco.nomeEmpresa}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#8B9188" }}>CNPJ</span>
                    <span className="text-xs font-semibold font-mono px-3 py-1.5 rounded-lg border inline-block w-fit bg-white shadow-sm" style={{ color: "#3A423E", borderColor: "#D8D6CB" }}>
                      {dadosBanco.cnpj}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#8B9188" }}>E-mail Comercial</span>
                    <span className="text-sm font-semibold truncate" style={{ color: "#1F2A27" }} title={dadosBanco.empresaEmail}>
                      {dadosBanco.empresaEmail}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => navigate(-1)}
            className="psy-btn-secondary mt-2 w-full py-3.5 px-4 font-semibold rounded-xl transition-all shadow-sm text-sm"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;