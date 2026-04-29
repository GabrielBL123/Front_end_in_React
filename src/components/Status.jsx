import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const Status = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarStatusRespostas = async () => {
      try {
        // Rota que busca o username e o booleano 'respondeu'
        const response = await axios.get("/avalicao_mensal/dashboard", {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
        });

        // O Java deve retornar algo como: [{ email: "...", respondeu: true }, ...]
        setUsuarios(response.data.statusFuncionarios || []);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao buscar status", err);
        setCarregando(false);
      }
    };

    if (auth?.accessToken) buscarStatusRespostas();
  }, [auth]);

  return (
    <div className="w-full max-w-5xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl my-8 mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-green-700">
          Status de Resposta
        </h1>
        <button
          onClick={() => navigate("/menu")}
          className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
        >
          Menu
        </button>
      </div>

      {carregando ? (
        <p className="text-center animate-pulse text-green-600 font-bold">
          Buscando informações...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-gray-600 font-bold">
                  Nome de Usuário (E-mail)
                </th>
                <th className="p-4 text-gray-600 font-bold text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800 font-medium">
                    {user.email}
                  </td>
                  <td className="p-4 text-center">
                    {user.respondeu ? (
                      <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black border border-green-200 uppercase">
                        Respondido
                      </span>
                    ) : (
                      <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-xs font-black border border-red-200 uppercase">
                        Pendente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && (
            <p className="p-10 text-center text-gray-400">
              Nenhum dado encontrado para o mês atual.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Status;
