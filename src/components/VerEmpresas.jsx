import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const VerEmpresas = () => {
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let isMounted = true;

    const buscarEmpresas = async () => {
      try {
        const response = await axios.get("/empresa");
        
        // Pega o que está dentro do seu ResponseDTO
        const dadosDoJava = response.data?.data || response.data;

        if (isMounted) {
          // O GRANDE TRUQUE: Se for uma página do Spring, pega o '.content'
          // Se não for, usa o próprio objeto que veio
          let listaReal = dadosDoJava.content ? dadosDoJava.content : dadosDoJava;

          console.log("Lista extraída pronta para a tela:", listaReal);
          
          // Garante que o React vai tratar isso como um Array (lista)
          setEmpresas(Array.isArray(listaReal) ? listaReal : [listaReal]);
          setCarregando(false);
        }
      } catch (err) {
        console.error("ERRO DETECTADO:", err);
        if (isMounted) {
          setErro("Não foi possível carregar a lista de empresas.");
          setCarregando(false);
        }
      }
    };

    buscarEmpresas();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-purple-600 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Empresas Cadastradas
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Visualize todas as empresas e seus respectivos setores.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Voltar
          </button>
        </div>

        {/* Mensagens de Feedback */}
        {carregando && (
          <div className="text-center py-12">
            <p className="text-purple-600 font-bold text-xl animate-pulse">
              Carregando empresas...
            </p>
          </div>
        )}

        {erro && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
            <p className="font-bold">Erro</p>
            <p>{erro}</p>
          </div>
        )}

        {/* Grid de Empresas */}
        {!carregando && !erro && empresas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl shadow">
            <p className="text-gray-500 text-xl">Nenhuma empresa encontrada no sistema.</p>
          </div>
        )}

        {!carregando && !erro && empresas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empresas.map((empresa, index) => (
              <div 
                key={empresa.id || index} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-t-4 border-purple-500 p-6 flex flex-col"
              >
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {empresa.nome || empresa.nomeEmpresa || "Nome não informado"}
                  </h2>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="font-bold w-16">CNPJ:</span>
                      <span className="text-sm">{empresa.cnpj || "Não informado"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-bold w-16">E-mail:</span>
                      <span className="text-sm truncate" title={empresa.email || empresa.emailEmpresa}>
                        {empresa.email || empresa.emailEmpresa || "Não informado"}
                      </span>
                    </div>
                    {/* ✨ Novo Campo de Telefone Adicionado Aqui ✨ */}
                    <div className="flex items-center text-gray-600">
                      <span className="font-bold w-16">Tel:</span>
                      <span className="text-sm">
                        {empresa.telefone || empresa.telefoneEmpresa || "Não informado"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-5 border-gray-100" />

                  {/* Sessão de Setores */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Setores Cadastrados ({empresa.setores ? empresa.setores.length : 0})
                    </h3>
                    
                    {empresa.setores && empresa.setores.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {empresa.setores.map((setor, idx) => (
                          <span 
                            key={setor.id || idx} 
                            className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full"
                          >
                            {setor.nome || setor.nomeSetor}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Nenhum setor cadastrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerEmpresas;