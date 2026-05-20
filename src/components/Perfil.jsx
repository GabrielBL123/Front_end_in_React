import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Perfil = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // Estado enxuto apenas com o e-mail da empresa e o novo CNPJ
  const [dadosBanco, setDadosBanco] = useState({
    empresaEmail: "",
    cnpj: "", // Nova variável
  });
  
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const buscarDadosDoUsuario = async () => {
      try {
        const idDoUsuario = auth?.usuarioId;

        if (!idDoUsuario) {
          console.error("ID do usuário não encontrado no contexto.");
          setCarregando(false);
          return;
        }

        const response = await axiosPrivate.get(`/usuario/${idDoUsuario}`);

        if (isMounted) {
          const dados = response.data.data;
          
          setDadosBanco({
            empresaEmail: dados.empresaEmail,
            // Aqui o React vai tentar ler o 'cnpj' vindo do seu Java
            cnpj: dados.cnpj || dados.empresaCnpj, 
          });
          setCarregando(false);
        }
      } catch (err) {
        console.error("Erro ao buscar os dados do banco:", err);
        setCarregando(false);
      }
    };

    if (auth?.user) {
      buscarDadosDoUsuario();
    }

    return () => {
      isMounted = false;
    };
  }, [auth, axiosPrivate]);

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto my-8">
      <div className="bg-green-600 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-700 text-4xl font-extrabold shadow-lg mb-4">
          {auth?.user ? auth.user.charAt(0).toUpperCase() : "U"}
        </div>
        <h2 className="text-3xl font-bold text-white">Meu Perfil</h2>
      </div>

      <div className="p-8 flex flex-col gap-6">
        {carregando ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-green-600 font-bold animate-pulse">
              Buscando dados no banco...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Usuário (Login)
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1 truncate">
                  {auth?.user || "Não informado"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nível de Acesso
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {auth?.roles?.includes("ADMIN") || auth?.role === "ADMIN"
                    ? "Administrador"
                    : "Usuário Comum"}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                E-mail da Empresa
              </span>
              <span className="text-lg font-bold text-green-700 mt-1">
                {dadosBanco.empresaEmail || "Não informado"}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* Novo bloco exibindo o CNPJ */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                CNPJ da Empresa
              </span>
              <span className="text-lg font-medium text-gray-800 mt-1">
                {dadosBanco.cnpj || "Não informado"}
              </span>
            </div>
          </>
        )}

        <hr className="border-gray-200 mt-2 mb-2" />

        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Perfil;