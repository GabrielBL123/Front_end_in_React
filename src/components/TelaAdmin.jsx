import { useNavigate } from "react-router-dom";
import "../tailwind.css";

const TelaAdmin = () => {
  const navigate = useNavigate();

  // Função para o botão de CSV navegar para a nova página
  const handleGerarCSV = () => {
    // Nota: Lembre-se de criar essa rota no App.js no futuro!
    navigate("/gerar-csv");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Cabeçalho do Painel */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-green-600 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Painel de Administração
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Bem-vinda, Tati. Escolha uma ação abaixo para gerenciar o sistema.
            </p>
          </div>
          {/* Indicador Booleano de Respostas */}
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-sm font-semibold text-gray-600 mb-2">
              Status das Respostas (RH)
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-full border border-blue-300">
              🚧 Em desenvolvimento no Back-end
            </span>
          </div>
        </div>

        {/* Grid de 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Criar Questionário */}
          <button
            onClick={() => navigate("/cria-questionario")}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all border-t-4 border-blue-500 group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Criar Questionário</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Elabore novas perguntas para avaliação
            </p>
          </button>

          {/* 2. Ver Quem Respondeu (Corrigido para /status) */}
          <button
            onClick={() => navigate("/status")}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all border-t-4 border-purple-500 group"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Ver Quem Respondeu</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Acompanhe o engajamento e métricas
            </p>
          </button>

          {/* 3. Cadastro RH (Corrigido e Validado) */}
          <button
            onClick={() => navigate("/cadastro-rh")}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all border-t-4 border-green-500 group"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Cadastrar RH</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Gera o link de acesso e envia por e-mail automaticamente
            </p>
          </button>

          {/* 4. Gerar Arquivo CSV */}
          <button
            onClick={handleGerarCSV}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all border-t-4 border-orange-500 group"
          >
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Gerar Arquivo CSV</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Faça o download dos dados em formato de planilha
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelaAdmin;