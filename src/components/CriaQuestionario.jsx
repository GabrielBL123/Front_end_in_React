import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CriaQuestionario = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [message, setMessage] = useState("");
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
  const { auth } = useAuth();
  //const navigate = useNavigate();

  // Busca avaliaçôes existentes ao carregar
  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  const buscarAvaliacoes = async (page = 0, size = 10) => {
    try {
      // Ajuste a rota conforme seu Back-end (Ex: /registrar/setor ou /setores)
      const response = await axios.get("/avaliacoes-mensais", {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
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
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Avaliações Mensais</h1>

      {message && <p className="mb-4 text-gray-600">{message}</p>}
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600">{error}</p>}

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
export default CriaQuestionario;
