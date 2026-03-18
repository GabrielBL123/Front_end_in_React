import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Menu = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // Verifica se a Role que veio do Back-end é de Admin
  const isAdmin = auth?.roles?.includes("ADMIN") || auth?.role === "ADMIN";

  const handleLogout = () => {
    setAuth({});
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-green-100 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
            Menu Principal
          </h1>
          <p className="text-xl text-gray-500 mt-2">
            Bem-vindo(a),{" "}
            <span className="font-bold text-green-600">
              {auth?.user || "Usuário"}
            </span>
            .
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
        >
          Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* --- OPÇÕES PARA TODOS OS USUÁRIOS --- */}

        <div
          onClick={() => navigate("/questionario")}
          className="group cursor-pointer bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-green-400 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Fazer Questionário
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Preencha a sua autoavaliação de saúde mental e bem-estar no
            trabalho.
          </p>
        </div>

        <div
          onClick={() => navigate("/perfil")}
          className="group cursor-pointer bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-green-400 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ver Perfil</h3>
          <p className="text-gray-500 leading-relaxed">
            Veja e edite suas informações pessoais, cargo e jornada de trabalho.
          </p>
        </div>

        {/* --- OPÇÕES EXCLUSIVAS DE ADMIN --- */}

        {isAdmin && (
          <>
            {/* CARTÃO RESULTADOS GLOBAIS */}
            <div
              onClick={() => navigate("/resultados")}
              className="group cursor-pointer bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full">
                Admin
              </span>
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Resultados Globais
              </h3>
              <p className="text-green-50 leading-relaxed">
                Acesse os relatórios e estatísticas do mapeamento da empresa.
              </p>
            </div>

            {/* CARTÃO GESTÃO DE EMPRESAS */}
            <div
              onClick={() => navigate("/empresa")}
              className="group cursor-pointer bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full">
                Admin
              </span>
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Gestão de Empresas
              </h3>
              <p className="text-green-50 leading-relaxed">
                Cadastre novas filiais ou gerencie os dados já registrados.
              </p>
            </div>

            {/* NOVO CARTÃO: CADASTRO DE FUNCIONÁRIO */}
            <div
              onClick={() => navigate("/CadastroFuncionarios")}
              className="group cursor-pointer bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-300 hover:-translate-y-2 flex flex-col items-start relative overflow-hidden"
            >
              <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full">
                Admin
              </span>
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                {/* Ícone de Adicionar Usuário */}
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Cadastrar Funcionário
              </h3>
              <p className="text-green-50 leading-relaxed">
                Adicione novos colaboradores e configure os acessos no sistema.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
