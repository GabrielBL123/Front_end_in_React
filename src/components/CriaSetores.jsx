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

  // Busca setores existentes ao carregar
  useEffect(() => {
    buscarSetores();
  }, []);

  const buscarSetores = async () => {
    try {
      // Ajuste a rota conforme seu Back-end (Ex: /registrar/setor ou /setores)
      const response = await axios.get("/empresa", {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });
      // Filtre ou mapeie os dados conforme sua estrutura de retorno
      setSetores(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar setores", err);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!nomeSetor) return;

    try {
      await axios.post(
        "/registrar/setor",
        { nome: nomeSetor },
        {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
        },
      );

      setMensagem("Setor criado com sucesso!");
      setNomeSetor("");
      buscarSetores(); // Atualiza a lista
      setTimeout(() => setMensagem(""), 3000);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao salvar setor.");
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl my-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-green-700">
          Criar Setores
        </h1>
        <button
          onClick={() => navigate("/menu")}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          Voltar
        </button>
      </div>

      <form onSubmit={handleSalvar} className="flex gap-4 mb-10">
        <input
          type="text"
          value={nomeSetor}
          onChange={(e) => setNomeSetor(e.target.value)}
          placeholder="Nome do novo setor (ex: TI, RH...)"
          className="flex-1 p-4 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition-all"
        />
        <button
          type="submit"
          className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
        >
          Salvar Setor
        </button>
      </form>

      {mensagem && (
        <p className="mb-4 text-center font-bold text-green-600">{mensagem}</p>
      )}

      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Setores Cadastrados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {setores.map((s, index) => (
          <div
            key={index}
            className="p-6 bg-green-50 border-2 border-green-100 rounded-2xl shadow-sm flex flex-col items-center"
          >
            <span className="text-green-700 font-bold text-lg text-center">
              {s.nome || s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriaSetores;
