import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../tailwind.css";
import { useParams, useNavigate } from "react-router";

const AvaliacaoDetalhe = () => {
  const { avaliacaoId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const isAdmin =
    auth?.roles?.includes("ADMIN") ||
    auth?.roles?.includes("ROLE_ADMIN") ||
    auth?.role === "ADMIN" ||
    auth?.role === "ROLE_ADMIN";

  const [avaliacao, setAvaliacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const buscarAvaliacao = useCallback(async () => {
    const tokenAvaliacaoAtual = auth?.avaliacaoAtivaId || avaliacaoId;

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
      setAvaliacao(data);
    } catch (err) {
      console.error("Erro ao buscar avaliação", err);
      setError("Não foi possível carregar os detalhes da avaliação.");
    } finally {
      setLoading(false);
    }
  }, [avaliacaoId, auth?.accessToken, auth?.avaliacaoAtivaId]);

  useEffect(() => {
    buscarAvaliacao();
  }, [buscarAvaliacao]);

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

  const baixarRelatorioExcel = async () => {
    const tokenAvaliacaoAtual = auth?.avaliacaoAtivaId || avaliacaoId;

    try {
      setDownloading(true);
      setError("");

      const response = await axios.get(
        `/avaliacoes-mensais/${tokenAvaliacaoAtual}/exportar-excel`,
        {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
          withCredentials: true,
          responseType: "blob", 
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Relatorio_Avaliacao_${tokenAvaliacaoAtual}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Erro ao baixar o relatório Excel", err);
      setError("Não foi possível baixar o relatório. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR").replace(",", " às");
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
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EDEEE8" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E3F0E6] border-t-[#6E8F76] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium text-lg" style={{ color: "#5C7D63" }}>
            A carregar avaliação...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#EDEEE8" }}>
        <div className="psy-shell max-w-xl w-full p-8 rounded-3xl text-center shadow-lg" style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}>
          <p className="font-medium text-lg mb-6" style={{ color: "#8A3E31" }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="psy-btn px-6 py-2.5 rounded-xl font-semibold transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#EDEEE8" }}>
        <div className="psy-shell max-w-xl w-full p-8 rounded-3xl text-center shadow-lg" style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}>
          <p className="font-medium text-lg" style={{ color: "#6B7570" }}>
            Avaliação não encontrada.
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

      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div 
          className="psy-shell w-full p-8 md:p-12 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}>
                📋
              </span>
              <p className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: "#5C7D63" }}>
                Gerenciamento
              </p>
            </div>
            <h1 className="psy-display text-4xl md:text-5xl" style={{ color: "#1F2A27" }}>
              Detalhes da Avaliação
            </h1>
            <p className="mt-2 text-base" style={{ color: "#6B7570" }}>
              Visualize as informações da avaliação mensal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="psy-btn-secondary px-5 py-2.5 rounded-xl transition-colors font-medium text-sm"
            >
              Voltar
            </button>
            <button
              onClick={() => buscarAvaliacao()}
              className="psy-btn px-4 py-2.5 rounded-xl transition-colors font-medium text-sm shadow-sm"
            >
              Atualizar
            </button>
            
            {isAdmin && (
              <button
                onClick={baixarRelatorioExcel}
                disabled={downloading}
                className="px-4 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm"
                style={{ backgroundColor: "#2F5C3E", color: "#F3F1E9" }}
              >
                {downloading ? (
                  "Baixando..."
                ) : (
                  <>
                    <span className="text-lg">📥</span> Baixar Excel
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="psy-shell rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}
          >
            <div>
              <h2 className="psy-display text-2xl mb-6 pb-3 border-b" style={{ color: "#1E3835", borderBottomColor: "#E4E1D3" }}>
                Informações da Avaliação
              </h2>
              <ul className="space-y-4">
                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-semibold text-sm uppercase tracking-wider min-w-[120px]" style={{ color: "#8B9188" }}>
                    Criado em:
                  </span>
                  <span className="font-medium px-3 py-2 rounded-xl flex-1 flex items-center" style={{ backgroundColor: "#EDEEE8", color: "#1F2A27" }}>
                    {formatarData(avaliacao.criadoEm)}
                  </span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-semibold text-sm uppercase tracking-wider min-w-[120px]" style={{ color: "#8B9188" }}>
                    Ativa:
                  </span>
                  <div className="flex-1 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${avaliacao.isActive ? "bg-emerald-500/20 text-emerald-800 border border-emerald-500/30" : "bg-red-500/20 text-red-800 border border-red-500/30"}`}
                    >
                      {avaliacao.isActive ? "Sim" : "Não"}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t" style={{ borderColor: "#E4E1D3" }}>
              <button
                onClick={() => gerarLinkAvaliacao()}
                className="psy-btn px-6 py-2.5 font-medium rounded-xl transition-colors w-full sm:w-auto text-sm shadow-sm"
              >
                Gerar Link
              </button>
              {linkCopiado && (
                <p className="mt-3 break-all font-mono text-xs p-3 rounded-xl border" style={{ backgroundColor: "#E3F0E6", color: "#2F5C3E", borderColor: "rgba(110,143,118,0.3)" }}>
                  Link gerado: {linkCopiado}
                </p>
              )}
            </div>
          </div>

          <div 
            className="psy-shell rounded-3xl p-8 shadow-sm flex flex-col"
            style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}
          >
            <h2 className="psy-display text-2xl mb-6 pb-3 border-b" style={{ color: "#1E3835", borderBottomColor: "#E4E1D3" }}>
              Empresa
            </h2>
            <ul className="space-y-3 flex-1">
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-sm uppercase tracking-wider min-w-[100px]" style={{ color: "#8B9188" }}>
                  Nome:
                </span>
                <span className="font-medium break-all px-3 py-2 rounded-xl flex-1 flex items-center" style={{ backgroundColor: "#EDEEE8", color: "#1F2A27" }}>
                  {avaliacao.empresa?.nome || "-"}
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-sm uppercase tracking-wider min-w-[100px]" style={{ color: "#8B9188" }}>
                  CNPJ:
                </span>
                <span className="font-medium break-all px-3 py-2 rounded-xl flex-1 flex items-center font-mono text-sm" style={{ backgroundColor: "#EDEEE8", color: "#1F2A27" }}>
                  {avaliacao.empresa?.cnpj || "-"}
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-sm uppercase tracking-wider min-w-[100px]" style={{ color: "#8B9188" }}>
                  E-mail:
                </span>
                <span className="font-medium break-all px-3 py-2 rounded-xl flex-1 flex items-center" style={{ backgroundColor: "#EDEEE8", color: "#1F2A27" }}>
                  {avaliacao.empresa?.email || "-"}
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-semibold text-sm uppercase tracking-wider min-w-[100px]" style={{ color: "#8B9188" }}>
                  Telefone:
                </span>
                <span className="font-medium break-all px-3 py-2 rounded-xl flex-1 flex items-center" style={{ backgroundColor: "#EDEEE8", color: "#1F2A27" }}>
                  {avaliacao.empresa?.telefone || "-"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="psy-shell rounded-3xl p-8 shadow-sm" style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}>
          <h2 className="psy-display text-2xl mb-6" style={{ color: "#1E3835" }}>
            Setores Cadastrados
          </h2>
          {avaliacao.empresa?.setores?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {avaliacao.empresa.setores.map((setor) => (
                <div
                  key={setor.id}
                  className="rounded-2xl p-4 shadow-sm flex flex-col gap-1 border"
                  style={{ backgroundColor: "#EDEEE8", borderColor: "#D8D6CB" }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5C7D63" }}>
                    Nome do Setor
                  </span>
                  <span className="font-semibold text-base" style={{ color: "#1F2A27" }}>
                    {setor.nome}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed text-center" style={{ borderColor: "#D8D6CB" }}>
              <p className="font-medium text-sm" style={{ color: "#8B9188" }}>
                Nenhum setor cadastrado encontrado.
              </p>
            </div>
          )}
        </div>

        <div className="psy-shell rounded-3xl p-8 shadow-sm" style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}>
          <h2 className="psy-display text-2xl mb-6" style={{ color: "#1E3835" }}>
            Respostas dos Funcionários por Setor
          </h2>
          {avaliacao.funcionario?.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(
                avaliacao.funcionario.reduce((grupos, func) => {
                  const setorNome = func.setor || "Setor Não Especificado";
                  if (!grupos[setorNome]) grupos[setorNome] = [];
                  grupos[setorNome].push(func);
                  return grupos;
                }, {}),
              ).map(([nomeDoSetor, funcionariosDoSetor]) => (
                <div
                  key={nomeDoSetor}
                  className="overflow-hidden rounded-2xl border shadow-sm bg-white"
                  style={{ borderColor: "#DCD9CC" }}
                >
                  <div className="p-4 font-bold text-lg flex justify-between items-center text-white" style={{ background: "linear-gradient(135deg, #1E3835, #152826)" }}>
                    <span>Setor: {nomeDoSetor}</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                      {funcionariosDoSetor.length}{" "}
                      {funcionariosDoSetor.length === 1
                        ? "respondente"
                        : "respondentes"}
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b" style={{ backgroundColor: "#EDEEE8", borderColor: "#E4E1D3" }}>
                          <th className="p-4 font-semibold whitespace-nowrap" style={{ color: "#3A423E" }}>
                            Login
                          </th>
                          <th className="p-4 font-semibold whitespace-nowrap" style={{ color: "#3A423E" }}>
                            Nome
                          </th>
                          <th className="p-4 font-semibold whitespace-nowrap" style={{ color: "#3A423E" }}>
                            Cargo
                          </th>
                          <th className="p-4 font-semibold whitespace-nowrap" style={{ color: "#3A423E" }}>
                            Tempo de Trabalho
                          </th>
                          <th className="p-4 font-semibold whitespace-nowrap" style={{ color: "#3A423E" }}>
                            Jornada
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {funcionariosDoSetor.map((func, index) => (
                          <tr
                            key={`${func.login}-${index}`}
                            className="border-b last:border-0 transition-colors hover:bg-gray-50"
                            style={{ borderColor: "#E4E1D3" }}
                          >
                            <td className="p-4 font-mono text-xs" style={{ color: "#6B7570" }}>
                              {func.login}
                            </td>
                            <td className="p-4 font-medium" style={{ color: "#1F2A27" }}>
                              {func.nome}
                            </td>
                            <td className="p-4" style={{ color: "#6B7570" }}>{func.cargo}</td>
                            <td className="p-4" style={{ color: "#6B7570" }}>
                              {formatarData(func.tempoDeTrabalho)}
                            </td>
                            <td className="p-4" style={{ color: "#6B7570" }}>
                              {formatarDuracao(func.jornada)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed text-center" style={{ borderColor: "#D8D6CB", backgroundColor: "#EDEEE8" }}>
              <p className="font-medium text-sm" style={{ color: "#6B7570" }}>
                Nenhum funcionário respondeu ao questionário desta competência até
                o momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoDetalhe;