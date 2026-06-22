import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const CriaSetores = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [nomeSetor, setNomeSetor] = useState("");
  const [setores, setSetores] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarSetores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscarSetores = async () => {
    try {
      if (auth?.avaliacaoAtivaId) {
        setErro(
          "Nâo é possivel gerenciar setores enquanto uma avaliação estiver ativa.",
        );
      }

      const response = await axios.get(`/setores/${auth?.empresaId}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      const todosSetores = response.data?.data?.content || [];

      // ✨ FILTRO MÁGICO: Pega apenas os setores onde o ID da empresa bate com o ID da empresa do usuário logado
      const setoresDaEmpresa = todosSetores.filter(
        (s) => s.empresaId === auth?.empresaId,
      );

      setSetores(setoresDaEmpresa);
    } catch (err) {
      console.error("Erro ao buscar setores", err);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!nomeSetor.trim()) {
      setErro("Por favor, preencha o nome do setor.");
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await axios.post(
        "/setores/criar",
        {
          setor: nomeSetor,
          // Enviamos o empresaId no campo cnpj caso o seu RegistrarSetorDTO exija esse campo para não dar erro 400
          cnpj: auth?.empresaId,
        },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } },
      );

      setMensagem("Setor criado com sucesso!");
      setNomeSetor("");
      buscarSetores(); // Atualiza a lista na tela automaticamente

      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      if (err.response?.status === 409) setErro("Setor já cadastrado.");
      else if (err.response?.status === 403)
        setErro("Sem permissão para criar setores.");
      else setErro("Erro ao salvar setor.");
    }
  };

  const handleDeletar = async (idSetor) => {
    if (!idSetor) {
      setErro("Não foi possível identificar o ID do setor.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar este setor?",
    );
    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      await axios.delete(`/setores/${idSetor}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      setMensagem("Setor deletado com sucesso!");
      buscarSetores();

      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      if (err.response?.status === 403)
        setErro("Sem permissão para deletar setores.");
      else setErro("Erro ao deletar setor. Verifique se ele já está em uso.");
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-10 border-b-2 border-green-100 pb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700">
            Gerenciamento de Setores
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Cadastre ou remova setores da empresa{" "}
            <span className="font-bold text-gray-700">{auth?.empresaNome}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/menu")}
          className="px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-300 shadow-sm text-sm"
        >
          Voltar ao Menu
        </button>
      </div>

      {/* Mensagens de Feedback */}
      {mensagem && (
        <p className="w-full bg-green-100 border border-green-300 text-green-800 font-bold p-4 rounded-xl text-center mb-6 animate-fade-in">
          {mensagem}
        </p>
      )}
      {erro && (
        <p className="w-full bg-red-100 border border-red-300 text-red-700 font-bold p-4 rounded-xl text-center mb-6 animate-fade-in">
          {erro}
        </p>
      )}

      {/* Formulário de Cadastro (Sem a caixa de CNPJ) */}
      <form
        onSubmit={handleSalvar}
        className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 mb-12 flex flex-col md:flex-row items-end gap-6 shadow-inner"
      >
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="nomeSetor"
            className="font-semibold text-gray-700 text-base md:text-lg"
          >
            Nome do Novo Setor:
          </label>
          <input
            type="text"
            id="nomeSetor"
            value={nomeSetor}
            onChange={(e) => setNomeSetor(e.target.value)}
            placeholder="Ex: Tecnologia da Informação, RH, Comercial..."
            className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg transition-all shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto py-4 px-8 h-fit bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 hover:shadow-lg active:scale-95 transition-all shadow-md whitespace-nowrap"
        >
          Salvar Setor
        </button>
      </form>

      {/* Lista de Setores (Layout Div / Tags Roxas) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-l-4 border-purple-500 pl-3">
          Setores Cadastrados ({setores.length})
        </h3>

        {setores.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {setores.map((setor, idx) => (
              <span
                key={setor.id || idx}
                className="bg-purple-100 border border-purple-200 text-purple-700 text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transition-all hover:bg-purple-200"
              >
                {setor.nome || setor.nomeSetor || setor.setor}

                {setor.id && (
                  <button
                    type="button"
                    onClick={() => handleDeletar(setor.id)}
                    className="flex items-center justify-center w-5 h-5 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-colors focus:outline-none ml-1"
                    title="Deletar setor"
                  >
                    &times;
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Nenhum setor cadastrado para esta empresa.
          </p>
        )}
      </div>
    </div>
  );
};

export default CriaSetores;
