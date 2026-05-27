import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const CriaSetores = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [nomeSetor, setNomeSetor] = useState("");
  const [cnpj, setCnpj] = useState(""); 

  const [setores, setSetores] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarSetores();
  }, []);

  const buscarSetores = async () => {
    try {
      const response = await axios.get("/setores", {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });
      setSetores(response.data?.data?.content || []);
    } catch (err) {
      console.error("Erro ao buscar setores", err);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!nomeSetor.trim() || !cnpj.trim()) {
      setErro("Por favor, preencha o nome do setor e o CNPJ da empresa.");
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await axios.post(
        "/setores/criar",
        { 
          setor: nomeSetor, 
          cnpj: cnpj 
        },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      setMensagem("Setor criado com sucesso!");
      setNomeSetor("");
      setCnpj(""); 
      buscarSetores();
      
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      if (err.response?.status === 409) setErro("Setor já cadastrado.");
      else if (err.response?.status === 403) setErro("Sem permissão para criar setores.");
      else setErro("Erro ao salvar setor.");
    }
  };

  // ✨ NOVA FUNÇÃO: Deletar Setor
  const handleDeletar = async (idSetor) => {
    if (!idSetor) {
      setErro("Não foi possível identificar o ID do setor.");
      return;
    }

    // Pede confirmação antes de deletar
    const confirmar = window.confirm("Tem certeza que deseja deletar este setor?");
    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      // ⚠️ ATENÇÃO: Verifique se a rota de deletar no seu Java é essa mesma
      await axios.delete(`/setores/${idSetor}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      setMensagem("Setor deletado com sucesso!");
      buscarSetores(); // Atualiza a lista na tela
      
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      if (err.response?.status === 403) setErro("Sem permissão para deletar setores.");
      else setErro("Erro ao deletar setor. Verifique se ele já está em uso.");
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-10 border-b-2 border-green-100 pb-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700">Gerenciamento de Setores</h1>
          <p className="text-gray-500 mt-1 text-base">Cadastre ou remova setores vinculando-os ao CNPJ da empresa correspondente.</p>
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

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSalvar} className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 mb-12 flex flex-col gap-6 shadow-inner">
        <h2 className="text-xl font-bold text-gray-800 mb-2 border-l-4 border-green-600 pl-3">Novo Cadastro</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="nomeSetor" className="font-semibold text-gray-700 text-base md:text-lg">
              Nome do Setor:
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

          <div className="flex flex-col gap-2">
            <label htmlFor="cnpj" className="font-semibold text-gray-700 text-base md:text-lg">
              CNPJ da Empresa vinculada:
            </label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Ex: 00.000.000/0001-00"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg transition-all shadow-sm"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full md:w-48 md:self-end mt-2 py-4 px-6 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 hover:shadow-lg active:scale-95 transition-all shadow-md"
        >
          Salvar Setor
        </button>
      </form>

      {/* Lista de Setores */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-700 pl-3">Setores Cadastrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setores.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 italic">
              Nenhum setor encontrado no sistema.
            </p>
          ) : (
            setores.map((s, index) => (
              <div 
                key={s.id || index} 
                className="relative p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-green-200 transition-all flex flex-col justify-between group"
              >
                {/* ✨ NOVO: Botão de Deletar (Lixeira) */}
                {s.id && (
                  <button
                    onClick={() => handleDeletar(s.id)}
                    className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    title="Deletar este setor"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <span className="text-green-800 font-extrabold text-xl mb-3 block pr-8">
                  {s.nomeSetor || s.setor || s.nome || "Sem nome"}
                </span>
                
                {s.empresaCnpj && (
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span className="font-semibold uppercase tracking-wider text-gray-400">Vínculo:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">{s.empresaCnpj}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CriaSetores;