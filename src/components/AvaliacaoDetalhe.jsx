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
    var tokenAvaliacaoAtual = "";
    tokenAvaliacaoAtual = auth?.avaliacaoAtivaId || avaliacaoId;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/avaliacoes-mensais/avaliacao/${tokenAvaliacaoAtual}`,
        {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
          withCredentials: true,
        },
      );

      const data = response.data?.data || response.data;
      console.log("DADOS QUE CHEGARAM DA API:", data);
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
    return duracao
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m")
      .replace("S", "s");
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-gray-600 text-lg font-medium">A carregar avaliação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
        <p className="text-gray-600 text-lg font-medium">Avaliação não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Detalhes da Avaliação</h1>
          <p className="text-gray-500 mt-2">Visualize as informações da avaliação mensal.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors font-medium"
          >
            Voltar
          </button>
          <button
            onClick={() => buscarAvaliacao(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-2">
            Informações da Avaliação
          </h2>
          <ul className="space-y-3 flex-1">
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">ID:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.id}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">Competência:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.competencia}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">Criado em:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {formatarData(avaliacao.criadoEm)}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">Ativa:</span>
              <div className="flex-1 min-h-[40px] flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${avaliacao.isActive ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                  {avaliacao.isActive ? "Sim" : "Não"}
                </span>
              </div>
            </li>
          </ul>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={() => gerarLinkAvaliacao()}
              className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              Gerar Link
            </button>
            {linkCopiado && (
              <p className="text-green-700 mt-3 break-all font-mono text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                Link gerado: {linkCopiado}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-100 pb-2">Empresa</h2>
          <ul className="space-y-3 flex-1">
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[100px]">ID:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.empresa?.id || "-"}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[100px]">Nome:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.empresa?.nome || "-"}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[100px]">CNPJ:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.empresa?.cnpj || "-"}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[100px]">E-mail:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.empresa?.email || "-"}
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-semibold text-gray-700 min-w-[100px]">Telefone:</span>
              <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex-1 min-h-[40px] flex items-center">
                {avaliacao.empresa?.telefone || "-"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Setores Cadastrados</h2>
        {avaliacao.empresa?.setores?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {avaliacao.empresa.setores.map((setor) => (
              <div key={setor.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nome</span>
                  <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 min-h-[40px] flex items-center">
                    {setor.nome}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID</span>
                  <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 min-h-[40px] flex items-center">
                    {setor.id}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Empresa</span>
                  <span className="text-gray-900 font-medium break-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 min-h-[40px] flex items-center">
                    {setor.empresaNome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-gray-500 font-medium">Nenhum setor cadastrado encontrado.</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Respostas dos Funcionários por Setor</h2>
        {avaliacao.funcionario?.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(
              avaliacao.funcionario.reduce((grupos, func) => {
                const setorNome = func.setor || "Setor Não Especificado";
                if (!grupos[setorNome]) grupos[setorNome] = [];
                grupos[setorNome].push(func);
                return grupos;
              }, {})
            ).map(([nomeDoSetor, funcionariosDoSetor]) => (
              <div key={nomeDoSetor} className="overflow-hidden rounded-2xl shadow-sm border border-gray-200 bg-white">
                <div className="bg-gray-800 text-white p-4 font-bold text-lg flex justify-between items-center">
                  <span>Setor: {nomeDoSetor}</span>
                  <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
                    {funcionariosDoSetor.length} {funcionariosDoSetor.length === 1 ? 'respondente' : 'respondentes'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Login</th>
                        <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Nome</th>
                        <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Cargo</th>
                        <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Tempo de Trabalho</th>
                        <th className="p-4 font-semibold text-gray-700 whitespace-nowrap">Jornada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funcionariosDoSetor.map((func, index) => (
                        <tr key={`${func.login}-${index}`} className="border-b last:border-0 border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-mono text-sm text-gray-700">{func.login}</td>
                          <td className="p-4 font-medium text-gray-900">{func.nome}</td>
                          <td className="p-4 text-gray-700">{func.cargo}</td>
                          <td className="p-4 text-gray-700">{formatarData(func.tempoDeTrabalho)}</td>
                          <td className="p-4 text-gray-700">{formatarDuracao(func.jornada)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-gray-600 font-medium">Nenhum funcionário respondeu ao questionário desta competência até o momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvaliacaoDetalhe;