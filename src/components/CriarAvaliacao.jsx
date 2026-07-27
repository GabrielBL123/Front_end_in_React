import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
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

  const buscarAvaliacoes = useCallback(async (page = 0, size = 10) => {
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
  }, [auth?.accessToken]);

  useEffect(() => {
    buscarAvaliacoes();
  }, [buscarAvaliacoes]);

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

      const payload = JSON.stringify({ cnpj: formData.cnpj });
      await axios.post("/avaliacoes-mensais/iniciar", payload, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

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

  const finalizarAvaliacao = async (cnpj) => {
    const confirmar = window.confirm(
      "Deseja realmente finalizar esta avaliação? O link será desativado e ela não receberá novas respostas."
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      setError("");

      const payload = JSON.stringify({ cnpj });
      await axios.post("/avaliacoes-mensais/finalizar", payload, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      await buscarAvaliacoes(pageInfo.number, pageInfo.size);
    } catch (err) {
      console.error("Erro ao finalizar avaliação", err);
      setError(err.response?.data?.message || "Erro ao finalizar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const deletarAvaliacao = async (id) => {
    const confirmar = window.confirm(
      "Deseja realmente deletar esta avaliação?"
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
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EDEEE8" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E3F0E6] border-t-[#6E8F76] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium text-lg" style={{ color: "#5C7D63" }}>
            Carregando avaliações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full min-h-screen flex flex-col items-center p-4 md:p-8"
      style={{ backgroundColor: "#EDEEE8", colorScheme: "light" }}
    >
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
          color: #3A423E;
          border: 1px solid #D8D6CB;
        }
        .psy-btn-secondary:hover { background-color: #F3F1E9; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div 
          className="psy-shell w-full p-8 md:p-12 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}>
                📊
              </span>
              <p className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: "#5C7D63" }}>
                Administração
              </p>
            </div>
            <h1 className="psy-display text-4xl md:text-5xl" style={{ color: "#1F2A27" }}>
              Avaliações Mensais
            </h1>
            <p className="mt-3 text-base" style={{ color: "#6B7570" }}>
              Gerencie todas as avaliações da sua empresa
            </p>
          </div>
        </div>

        {error && (
          <div className="psy-shell w-full p-4 rounded-xl text-center" style={{ border: "1px solid rgba(201,123,107,0.4)", backgroundColor: "rgba(201,123,107,0.1)", color: "#8a3e31" }}>
            <p className="font-bold">⚠️ Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className="psy-shell w-full p-4 rounded-xl flex items-center gap-3" style={{ border: "1px solid rgba(110,143,118,0.4)", backgroundColor: "rgba(110,143,118,0.1)", color: "#1E3835" }}>
            <span className="text-xl">✅</span>
            <p className="font-medium">{message}</p>
          </div>
        )}

        <div 
          className="psy-shell w-full p-8 md:p-10 rounded-3xl"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 20px 40px -20px rgba(24,42,40,0.25)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: "#E3F0E6", color: "#2F5C3E" }}>
              📝
            </div>
            <h2 className="psy-display text-2xl" style={{ color: "#1F2A27" }}>
              Criar Nova Avaliação
            </h2>
          </div>

          <form onSubmit={criarAvaliacao} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#3a423e" }}>
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="12345678000195"
                  className="psy-input w-full px-4 py-3 rounded-xl sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="psy-btn px-8 py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Processando..." : "Criar Avaliação"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="psy-btn-secondary px-8 py-3.5 rounded-xl font-semibold transition-colors"
              >
                Voltar ao Menu
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="psy-display text-3xl" style={{ color: "#1F2A27" }}>
                Lista de Avaliações
              </h2>
              <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#E3F0E6", color: "#2F5C3E" }}>
                {pageInfo.totalElements} registros
              </span>
            </div>
          </div>

          {pageInfo.empty ? (
            <div className="psy-shell bg-white rounded-3xl p-16 border text-center" style={{ backgroundColor: "#FCFBF7", borderColor: "#DCD9CC" }}>
              <div className="text-5xl mb-4">📋</div>
              <p className="text-lg font-medium" style={{ color: "#6B7570" }}>
                Nenhuma avaliação criada ainda
              </p>
              <p className="text-sm mt-2" style={{ color: "#8B9188" }}>
                Crie a primeira avaliação usando o formulário acima
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="psy-shell rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col"
                  style={{ borderColor: "#DCD9CC", boxShadow: "0 10px 25px -10px rgba(24,42,40,0.15)" }}
                >
                  <div className="p-6 text-white" style={{ background: "linear-gradient(135deg, #1E3835, #152826)" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#B9C4B7" }}>
                          Criado em:
                        </p>
                        <p className="text-2xl font-bold" style={{ color: "#F3F1E9" }}>
                          {new Date(avaliacao.criadoEm).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${
                          avaliacao.status
                            ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            avaliacao.status ? "bg-emerald-400" : "bg-gray-400"
                          }`}
                        ></span>
                        {avaliacao.status ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between" style={{ backgroundColor: "#FCFBF7" }}>
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#8B9188" }}>
                        CNPJ:
                      </p>
                      <p className="font-mono text-sm break-all font-semibold" style={{ color: "#1F2A27" }}>
                        {avaliacao.cnpj}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "#E4E1D3" }}>
                      <button
                        onClick={() => navigate(`/avaliacoes/${avaliacao.id}`)}
                        className="flex-1 min-w-[30%] px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{ backgroundColor: "rgba(110,143,118,0.15)", color: "#1E3835" }}
                      >
                        Visualizar
                      </button>

                      {avaliacao.status && (
                        <button
                          onClick={() => finalizarAvaliacao(avaliacao.cnpj)}
                          className="flex-1 min-w-[30%] px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                          style={{ backgroundColor: "rgba(199,167,107,0.2)", color: "#5C4A21" }}
                        >
                          Finalizar
                        </button>
                      )}

                      <button
                        onClick={() => deletarAvaliacao(avaliacao.id)}
                        className="flex-1 min-w-[30%] px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{ backgroundColor: "rgba(201,123,107,0.15)", color: "#8A3E31" }}
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

        {!pageInfo.empty && pageInfo.totalPages > 1 && (
          <div className="psy-shell rounded-3xl p-6 shadow-lg border" style={{ backgroundColor: "#FCFBF7", borderColor: "#DCD9CC" }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    buscarAvaliacoes(pageInfo.number - 1, pageInfo.size)
                  }
                  disabled={pageInfo.first}
                  className="psy-btn-secondary px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <button
                  onClick={() =>
                    buscarAvaliacoes(pageInfo.number + 1, pageInfo.size)
                  }
                  disabled={pageInfo.last}
                  className="psy-btn-secondary px-5 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima →
                </button>
              </div>

              <div className="text-center md:text-right">
                <p className="font-medium" style={{ color: "#3A423E" }}>
                  Página{" "}
                  <span className="font-bold" style={{ color: "#1E3835" }}>
                    {pageInfo.number + 1}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold" style={{ color: "#1E3835" }}>
                    {pageInfo.totalPages}
                  </span>
                </p>
                <p className="text-xs mt-1" style={{ color: "#8B9188" }}>
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