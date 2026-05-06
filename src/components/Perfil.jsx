import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Perfil = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [dadosBanco, setDadosBanco] = useState({
    cargo: "",
    setor: "",
    tempoDeTrabalho: "",
    jornada: "",
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const buscarDadosDoUsuario = async () => {
      try {
        // ✅ Usa o hook com interceptor de token
        const response = await axiosPrivate.get(`/usuarios/${auth.user}`);

        if (isMounted) {
          // ✅ Acessa response.data.data (ResponseDTO encapsula os dados)
          setDadosBanco({
            cargo: response.data.data.cargo,
            setor: response.data.data.setor,
            tempoDeTrabalho: response.data.data.tempoDeTrabalho,
            jornada: response.data.data.jornada,
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

  const formatarData = (dataIso) => {
    if (!dataIso) return "Não informado";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarJornada = (jornadaIso) => {
    if (!jornadaIso) return "Não informado";
    return jornadaIso.replace("PT", "").replace("H", " Horas semanais");
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                <span className="text-lg font-medium text-gray-800 mt-1">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Cargo
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {dadosBanco.cargo || "Não informado"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Setor
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {dadosBanco.setor || "Não informado"}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Admissão
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {formatarData(dadosBanco.tempoDeTrabalho)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Jornada
                </span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {formatarJornada(dadosBanco.jornada)}
                </span>
              </div>
            </div>
          </>
        )}

        <hr className="border-gray-200 mt-2 mb-2" />

        <button
          onClick={() => navigate("/menu")}
          className="w-full py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
};

export default Perfil;
