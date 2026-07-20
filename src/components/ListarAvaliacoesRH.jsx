import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../tailwind.css";

const ListarAvaliacoesRH = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  const buscarAvaliacoes = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/avaliacoes-mensais", {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
        withCredentials: true,
        params: { page, size },
      });

      const { data } = response.data;

      setAvaliacoes(data.content);
      setPageInfo({
        number: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        first: data.first,
        last: data.last,
        empty: data.empty,
      });
    } catch (err) {
      console.error("Erro ao buscar avaliações", err);
      setError(err.response?.data?.message || "Erro ao buscar avaliações.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && avaliacoes.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Carregando avaliações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 md:py-12 flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Avaliações Mensais
          </h1>
          <p className="text-gray-600">
            Acompanhe o histórico de avaliações da empresa
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center items-start gap-3">
            <p className="text-red-700 font-medium">⚠️ Erro</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Avaliacoes List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Lista de Avaliações
              </h2>
              <span className="text-gray-600 font-medium">
                ({pageInfo.totalElements})
              </span>
            </div>
            
            <button
              onClick={() => navigate("/menu")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Voltar ao Menu
            </button>
          </div>

          {pageInfo.empty ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-medium">
                Nenhuma avaliação encontrada
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                    <div className="flex items-start justify-between mb-9">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                          Criado em:
                        </p>
                        <p className="text-2xl font-bold">
                          {new Date(avaliacao.criadoEm).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          avaliacao.status
                            ? "bg-white/20 text-white"
                            : "bg-gray-500/20 text-gray-100"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            avaliacao.status ? "bg-white" : "bg-gray-300"
                          }`}
                        ></span>
                        {avaliacao.status ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-4 flex-1">
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">
                        CNPJ:
                      </p>
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {avaliacao.cnpj}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/avaliacoes/${avaliacao.id}`)}
                        className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        Visualizar Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!pageInfo.empty && pageInfo.totalPages > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    buscarAvaliacoes(pageInfo.number - 1, pageInfo.size)
                  }
                  disabled={pageInfo.first}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <button
                  onClick={() =>
                    buscarAvaliacoes(pageInfo.number + 1, pageInfo.size)
                  }
                  disabled={pageInfo.last}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima →
                </button>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-700 font-medium">
                  Página{" "}
                  <span className="font-bold text-blue-600">
                    {pageInfo.number + 1}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-blue-600">
                    {pageInfo.totalPages}
                  </span>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Total: {pageInfo.totalElements} registros
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarAvaliacoesRH;