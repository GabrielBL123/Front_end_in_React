import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../tailwind.css";

const CriarAvaliacao = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [message, setMessage] = useState("");
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

  const [formData, setFormData] = useState({
    cnpj: "",
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

      const { message, data } = response.data;

      setMessage(message);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const criarAvaliacao = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axios.post(
        "/avaliacoes-mensais/iniciar?cnpj=" + formData.cnpj,

        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      setFormData({
        cnpj: "",
      });

      await buscarAvaliacoes(pageInfo.number, pageInfo.size);
    } catch (err) {
      console.error("Erro ao criar avaliação", err);
      setError(err.response?.data?.message || "Erro ao criar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const deletarAvaliacao = async (id) => {
    const confirmar = window.confirm(
      "Deseja realmente deletar esta avaliação?",
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(`/avaliacoes-mensais/${id}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
        withCredentials: true,
      });

      await buscarAvaliacoes(pageInfo.number, pageInfo.size);
    } catch (err) {
      console.error("Erro ao deletar avaliação", err);
      setError(err.response?.data?.message || "Erro ao deletar avaliação.");
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Avaliações Mensais
          </h1>
          <p className="text-gray-600">
            Gerencie todas as avaliações da sua empresa
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center items-start gap-3">
            <p className="text-red-700 font-medium">⚠️ Erro</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {message && !error && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <span className="text-green-600 text-xl">✅</span>
            <p className="text-green-700 font-medium">{message}</p>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Criar Nova Avaliação
            </h2>
          </div>

          <form onSubmit={criarAvaliacao} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="12345678000195"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : "Criar Avaliação"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Voltar ao Menu
              </button>
            </div>
          </form>
        </div>

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
          </div>

          {pageInfo.empty ? (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-medium">
                Nenhuma avaliação criada ainda
              </p>
              <p className="text-gray-500 mt-2">
                Crie a primeira avaliação usando o formulário acima
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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

                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">
                        CNPJ:
                      </p>
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {avaliacao.cnpj}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/avaliacoes/${avaliacao.id}`)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        Visualizar
                      </button>

                      <button
                        onClick={() => deletarAvaliacao(avaliacao.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        Deletar
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

export default CriarAvaliacao;
