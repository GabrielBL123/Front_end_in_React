import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../tailwind.css";
import { useParams, useNavigate } from "react-router-dom";

const AvaliacaoDetalhe = () => {
  const { avaliacaoId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [avaliacao, setAvaliacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [linkCopiado, setLinkCopiado] = useState(false);

  useEffect(() => {
    buscarAvaliacao();
  }, [avaliacaoId]);

  const buscarAvaliacao = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/avaliacoes-mensais/avaliacao/${avaliacaoId}`,
        {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
          withCredentials: true,
        },
      );

      const data = response.data?.data || response.data;
      setAvaliacao(data);
    } catch (err) {
      console.error("Erro ao buscar avaliação", err);
      setError("Não foi possível carregar os detalhes da avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const gerarLinkAvaliacao = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        "/avaliacoes-mensais/gerar-link",
        JSON.stringify({ cnpj: avaliacao.empresa?.cnpj, horasValidade: 24 }),
        {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
          withCredentials: true,
        },
      );
      const linkgerado = response.data?.data || response.data;
      setLinkCopiado(linkgerado);
    } catch (err) {
      console.error("Erro ao gerar link da avaliação", err);
      setError("Não foi possível gerar o link da avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  };

  const formatarDuracao = (duracao) => {
    if (!duracao) return "-";

    // caso venha como string do Java Duration: PT8H30M
    return duracao
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m")
      .replace("S", "s");
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-gray-600 text-lg">Carregando avaliação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-gray-600 text-lg">Avaliação não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Detalhes da Avaliação
          </h1>
          <p className="text-gray-500 mt-2">
            Visualize as informações da avaliação mensal.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700"
        >
          Voltar
        </button>

        <button
          onClick={() => buscarAvaliacao(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Atualizar
        </button>
      </div>

      {/* Informações gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-green-700 rounded-2xl p-5 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informações da Avaliação
          </h2>

          <div className="space-y-3">
            <p>
              <span className="font-semibold text-gray-700">ID:</span>{" "}
              {avaliacao.id}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Competência:</span>{" "}
              {avaliacao.competencia}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Criado em:</span>{" "}
              {formatarData(avaliacao.criadoEm)}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Ativa:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  avaliacao.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {avaliacao.isActive ? "Sim" : "Não"}
              </span>
            </p>
            <button
              onClick={() => gerarLinkAvaliacao()}
              className="px-4 py-2 bg-green-600 text-white rounded-xl p-5 border"
            >
              Gerar Link
            </button>
            {linkCopiado && (
              <p className="text-green-600 mt-2 break-all">
                Link gerado: {linkCopiado}
              </p>
            )}
          </div>
        </div>

        {/* Empresa */}
        <div className="bg-green-700 rounded-2xl p-5 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Empresa</h2>

          <div className="space-y-3">
            <p>
              <span className="font-semibold text-gray-700">ID:</span>{" "}
              {avaliacao.empresa?.id || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Nome:</span>{" "}
              {avaliacao.empresa?.nome || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">CNPJ:</span>{" "}
              {avaliacao.empresa?.cnpj || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">E-mail:</span>{" "}
              {avaliacao.empresa?.email || "-"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Telefone:</span>{" "}
              {avaliacao.empresa?.telefone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Setores */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Setores</h2>

        {avaliacao.empresa?.setores?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avaliacao.empresa.setores.map((setor) => (
              <div
                key={setor.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                <p>
                  <span className="font-semibold">Nome:</span> {setor.nome}
                </p>
                <p>
                  <span className="font-semibold">ID:</span> {setor.id}
                </p>
                <p>
                  <span className="font-semibold">Empresa:</span>{" "}
                  {setor.empresaNome}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum setor encontrado.</p>
        )}
      </div>

      {/* Funcionários */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Funcionários
        </h2>

        {avaliacao.funcionarios?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-2xl shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold text-gray-700">Login</th>
                  <th className="p-4 font-semibold text-gray-700">Nome</th>
                  <th className="p-4 font-semibold text-gray-700">Setor</th>
                  <th className="p-4 font-semibold text-gray-700">Cargo</th>
                  <th className="p-4 font-semibold text-gray-700">
                    Tempo de Trabalho
                  </th>
                  <th className="p-4 font-semibold text-gray-700">Jornada</th>
                </tr>
              </thead>
              <tbody>
                {avaliacao.funcionario.map((func, index) => (
                  <tr
                    key={`${func.login}-${index}`}
                    className="border-t border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <td className="p-4">{func.login}</td>
                    <td className="p-4">{func.nome}</td>
                    <td className="p-4">{func.setor}</td>
                    <td className="p-4">{func.cargo}</td>
                    <td className="p-4">
                      {formatarData(func.tempoDeTrabalho)}
                    </td>
                    <td className="p-4">{formatarDuracao(func.jornada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            Nenhum funcionário respondeu o questionário.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvaliacaoDetalhe;
