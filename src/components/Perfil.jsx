import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

        // 🚀 O JAVA AGORA MANDA TUDO AQUI! Não precisamos mais de segunda requisição.
        const response = await axiosPrivate.get(`/usuario/${auth?.usuarioId}`);
        const dados = response.data?.data || response.data;
        

        if (isMounted) {
          setDadosBanco({
            // Lendo exatamente os nomes que estão no seu UserResponseDTO do Java
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
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto my-12 border border-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-500 py-10 flex flex-col items-center relative">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-green-700 text-5xl font-extrabold shadow-xl mb-4 border-4 border-green-100 z-10">
          {dadosBanco.nome && dadosBanco.nome !== "Não informado" ? dadosBanco.nome.charAt(0).toUpperCase() : (auth?.user ? auth.user.charAt(0).toUpperCase() : "U")}
        </div>
        <h2 className="text-3xl font-extrabold text-white z-10">
          {dadosBanco.nome !== "Não informado" ? dadosBanco.nome : "Meu Perfil"}
        </h2>
        <p className="text-green-100 font-medium z-10 bg-green-700 px-4 py-1 rounded-full mt-2 text-sm shadow-inner">
          {formatarRole(dadosBanco.role)}
        </p>
      </div>

      <div className="p-8 md:p-10 flex flex-col gap-8">
        {carregando ? (
          <div className="flex flex-col justify-center items-center py-12 gap-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-green-700 font-bold animate-pulse">Carregando seus dados...</p>
          </div>
        ) : erro ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-center font-medium">
            {erro}
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                Dados de Acesso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">E-mail (Login)</span>
                  <span className="text-base font-semibold text-gray-800 truncate" title={dadosBanco.login}>
                    {dadosBanco.login}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nível de Permissão</span>
                  <span className="text-base font-semibold text-gray-800">{formatarRole(dadosBanco.role)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                Informações da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-green-50 p-6 rounded-2xl border border-green-100">
                <div className="flex flex-col md:col-span-2">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Nome da Empresa</span>
                  <span className="text-lg font-extrabold text-green-800">
                    {dadosBanco.nomeEmpresa}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">CNPJ</span>
                  <span className="text-base font-semibold text-gray-800 font-mono bg-white px-3 py-1 rounded border border-green-200 inline-block w-fit">
                    {dadosBanco.cnpj}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">E-mail Comercial</span>
                  <span className="text-base font-semibold text-gray-800 truncate" title={dadosBanco.empresaEmail}>
                    {dadosBanco.empresaEmail}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 active:scale-95 border border-gray-300"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
};

export default Perfil;