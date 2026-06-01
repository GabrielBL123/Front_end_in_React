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
    competencia: "",
    cnpj: "",
  });

  const [editingId, setEditingId] = useState(null);
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
        "/avaliacoes-mensais/iniciar",
        JSON.stringify(formData),
        {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      setFormData({
        competencia: "",
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

  const atualizarAvaliacao = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axios.put(`/avaliacoes-mensais/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
        withCredentials: true,
      });

      setEditingId(null);
      setFormData({
        competencia: "",
        cnpj: "",
      });

      await buscarAvaliacoes(pageInfo.number, pageInfo.size);
    } catch (err) {
      console.error("Erro ao atualizar avaliação", err);
      setError(err.response?.data?.message || "Erro ao atualizar avaliação.");
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

  const editarAvaliacao = (avaliacao) => {
    setEditingId(avaliacao.id);
    setFormData({
      competencia: "",
      cnpj: "",
    });

    navigate(`/avaliacoes/${avaliacao.id}`);
  };

  return (
    <div className="p-6 *bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Avaliações Mensais</h1>

      {message && <p className="mb-4 text-gray-600">{message}</p>}
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form
        onSubmit={editingId ? atualizarAvaliacao : criarAvaliacao}
        className="mb-6 space-y-4 border p-4 rounded"
      >
        <div>
          <label className="block mb-1 font-medium">Competência</label>
          <input
            type="text"
            name="competencia"
            value={formData.competencia}
            onChange={handleChange}
            placeholder="YYYYMMDD"
            className="border rounded px-3 py-2 w-full text-black"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cnpj</label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="12345678000199"
            className="border rounded px-3 py-2 w-full text-black"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editingId ? "Atualizar" : "Criar"}
          </button>
          /
        </div>
      </form>

      {!loading && !error && (
        <>
          <div className="space-y-3">
            {avaliacoes.map((avaliacao) => (
              <div
                key={avaliacao.id}
                className="border rounded-lg p-4 shadow-sm bg-green-700"
              >
                <p>
                  <strong>Competência:</strong> {avaliacao.competencia}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {avaliacao.status ? "Ativa" : "Inativa"}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => editarAvaliacao(avaliacao)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deletarAvaliacao(avaliacao.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() =>
                buscarAvaliacoes(pageInfo.number - 1, pageInfo.size)
              }
              disabled={pageInfo.first}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            <span>
              Página {pageInfo.number + 1} de {pageInfo.totalPages}
            </span>

            <button
              onClick={() =>
                buscarAvaliacoes(pageInfo.number + 1, pageInfo.size)
              }
              disabled={pageInfo.last}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Total de registros: {pageInfo.totalElements}
          </p>
        </>
      )}
    </div>
  );
};

export default CriarAvaliacao;
