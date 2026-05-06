import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AvaliacoesMensais = () => {
  const navigate = useNavigate();

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const buscarAvaliacoes = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const response = await fetch(
          `http://localhost:8080/avaliacoesMensal?page=${page}&size=${size}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        if (isMounted) {
          const pageData = data.data;
          setAvaliacoes(pageData.content);
          setTotalPages(pageData.totalPages);
          setTotalElements(pageData.totalElements);
          setCarregando(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Erro ao buscar avaliações:", err);
          setErro("Erro ao carregar avaliações. Tente novamente.");
          setCarregando(false);
        }
      }
    };

    buscarAvaliacoes();

    return () => {
      isMounted = false;
    };
  }, [page, size]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-green-600 py-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white">Avaliações Mensais</h2>
        <p className="text-green-100 mt-1 text-sm">
          Total: {totalElements} avaliações | Página {page + 1} de {totalPages}
        </p>
      </div>

      <div className="p-8 flex flex-col gap-6">
        {carregando ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-green-600 font-bold animate-pulse">
              Buscando avaliações...
            </p>
          </div>
        ) : erro ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-red-500 font-bold">{erro}</p>
          </div>
        ) : (
          <>
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="border p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="border p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nota
                  </th>
                  <th className="border p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {avaliacoes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center p-6 text-gray-400 font-medium"
                    >
                      Nenhuma avaliação encontrada.
                    </td>
                  </tr>
                ) : (
                  avaliacoes.map((avaliacao) => (
                    <tr
                      key={avaliacao.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="border p-3 text-gray-700">
                        {avaliacao.id}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {avaliacao.nome}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {avaliacao.nota}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg 
                           disabled:bg-gray-300 disabled:cursor-not-allowed 
                           hover:bg-green-700 transition-all duration-300"
              >
                ← Anterior
              </button>

              <span className="text-gray-600 font-medium">
                {page + 1} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
                }
                disabled={page + 1 >= totalPages}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg 
                           disabled:bg-gray-300 disabled:cursor-not-allowed 
                           hover:bg-green-700 transition-all duration-300"
              >
                Próxima →
              </button>
            </div>
          </>
        )}

        <hr className="border-gray-200 mt-2 mb-2" />

        <button
          onClick={() => navigate("/menu")}
          className="w-full py-4 px-4 bg-gray-100 hover:bg-gray-200 
                     text-gray-700 font-bold rounded-lg transition-all 
                     duration-300 hover:-translate-y-1"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
};

export default AvaliacoesMensais;
