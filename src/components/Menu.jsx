import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Menu = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // Estado para o feedback visual do botão de copiar link
  const [linkCopiado, setLinkCopiado] = useState(false);

  // 1. Verifica se tem a role de Admin
  const isAdmin = auth?.roles?.includes("ADMIN") || auth?.role === "ADMIN";

  // 2. Verifica se tem a role de User
  const isUser = auth?.roles?.includes("USER") || auth?.role === "USER";

  // 3. Garante que é APENAS usuário comum (esconde as coisas de admin dele)
  const isOnlyUser = isUser && !isAdmin;

  const handleLogout = () => {
    setAuth({});
    navigate("/login", { replace: true });
  };

  // Função que copia o link e muda o estado do botão
  const handleCopiarLink = () => {
    // Pega o endereço base do site (ex: http://localhost:5173) e junta com a rota
    const linkParaCadastro = `${window.location.origin}/CadastroFuncionarios`;

    navigator.clipboard
      .writeText(linkParaCadastro)
      .then(() => {
        setLinkCopiado(true);
        // Volta ao normal depois de 3 segundos
        setTimeout(() => setLinkCopiado(false), 3000);
      })
      .catch((err) => {
        console.error("Erro ao copiar o link: ", err);
      });
  };

  return (
    <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
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
        {/* --- OPÇÕES APENAS PARA USUÁRIOS COMUNS --- */}
        {isOnlyUser && (
          <>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Ver Perfil
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Veja e edite suas informações pessoais, cargo e jornada de
                trabalho.
              </p>
            </div>
          </>
        )}

        {/* --- OPÇÕES APENAS PARA ADMINS (RH) --- */}
        {isAdmin && (
          <>
            <div
              onClick={() => navigate("/criar-setores")}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Criar Setores
              </h3>
              <p className="text-green-50 leading-relaxed">
                Estruture e gerencie os departamentos e setores da sua empresa.
              </p>
            </div>

            <div
              onClick={() => navigate("/status")}
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Status de Resposta
              </h3>
              <p className="text-green-50 leading-relaxed">
                Abra a avaliação do mês, veja médias por setor e status.
              </p>
            </div>

            <div
              onClick={() => navigate("/criar-questionario")}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Criar Questionário
              </h3>
              <p className="text-green-50 leading-relaxed">
                Crie e modifique os questionários para os funcionários.
              </p>
            </div>

            {/* BOTÃO COPIAR LINK COM EFEITO VISUAL */}
            <div
              onClick={handleCopiarLink}
              className={`group cursor-pointer rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start relative overflow-hidden ${
                linkCopiado
                  ? "bg-green-500 hover:shadow-green-500/30"
                  : "bg-gradient-to-br from-green-600 to-green-800 hover:shadow-green-900/30"
              }`}
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {linkCopiado ? "Link Copiado! ✅" : "Copiar Link"}
              </h3>
              <p className="text-green-50 leading-relaxed">
                {linkCopiado
                  ? "Agora é só colar (Ctrl+V) no WhatsApp ou E-mail."
                  : "Copiar o link de cadastro para enviar aos funcionários."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
