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
          "Não é possível gerenciar setores enquanto uma avaliação estiver ativa.",
        );
      }

      const response = await axios.get(`/setores/${auth?.empresaId}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      const todosSetores = response.data?.data?.content || [];

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
          cnpj: auth?.empresaId,
        },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } },
      );

      setMensagem("Setor criado com sucesso!");
      setNomeSetor("");
      buscarSetores();

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

      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div 
          className="psy-shell w-full p-8 md:p-12 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}>
                🏢
              </span>
              <p className="text-xs tracking-[0.25em] uppercase font-bold" style={{ color: "#5C7D63" }}>
                Recursos Humanos
              </p>
            </div>
            <h1 className="psy-display text-4xl md:text-5xl" style={{ color: "#1F2A27" }}>
              Gerenciamento de Setores
            </h1>
            <p className="mt-2 text-base" style={{ color: "#6B7570" }}>
              Cadastre ou remova setores da empresa{" "}
              <span className="font-bold" style={{ color: "#1E3835" }}>{auth?.empresaNome}</span>
            </p>
          </div>
          
          <button
            onClick={() => navigate("/menu")}
            className="psy-btn-secondary px-8 py-3.5 font-semibold rounded-xl transition-all shadow-sm w-full md:w-auto text-sm"
          >
            Voltar ao Menu
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {mensagem && (
          <div className="psy-shell w-full p-4 rounded-xl text-center font-bold text-sm" style={{ border: "1px solid rgba(110,143,118,0.4)", backgroundColor: "rgba(110,143,118,0.1)", color: "#1E3835" }}>
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="psy-shell w-full p-4 rounded-xl text-center font-bold text-sm" style={{ border: "1px solid rgba(201,123,107,0.4)", backgroundColor: "rgba(201,123,107,0.1)", color: "#8A3E31" }}>
            {erro}
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form
          onSubmit={handleSalvar}
          className="psy-shell p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-end gap-6 shadow-sm"
          style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}
        >
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="nomeSetor"
              className="text-sm font-semibold"
              style={{ color: "#3a423e" }}
            >
              Nome do Novo Setor:
            </label>
            <input
              type="text"
              id="nomeSetor"
              value={nomeSetor}
              onChange={(e) => setNomeSetor(e.target.value)}
              placeholder="Ex: Tecnologia da Informação, RH, Comercial..."
              className="psy-input w-full px-4 py-3 rounded-xl sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="psy-btn w-full md:w-auto py-3.5 px-8 h-fit font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap text-sm"
          >
            Salvar Setor
          </button>
        </form>

        {/* Lista de Setores */}
        <div className="psy-shell p-8 rounded-3xl shadow-sm" style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 pb-3 border-b" style={{ color: "#5C7D63", borderColor: "#E4E1D3" }}>
            Setores Cadastrados 
            <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: "#E3F0E6" }}>
              {setores.length}
            </span>
          </h3>

          {setores.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {setores.map((setor, idx) => (
                <span
                  key={setor.id || idx}
                  className="text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 border shadow-sm transition-all"
                  style={{ 
                    backgroundColor: "rgba(199,167,107,0.1)", 
                    color: "#1F2A27",
                    borderColor: "rgba(199,167,107,0.3)"
                  }}
                >
                  {setor.nome || setor.nomeSetor || setor.setor}

                  {setor.id && (
                    <button
                      type="button"
                      onClick={() => handleDeletar(setor.id)}
                      className="flex items-center justify-center w-5 h-5 rounded-full transition-colors focus:outline-none ml-1 text-xs"
                      style={{ color: "#8A3E31", backgroundColor: "rgba(201,123,107,0.15)" }}
                      title="Deletar setor"
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic" style={{ color: "#8B9188" }}>
              Nenhum setor cadastrado para esta empresa.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriaSetores;
