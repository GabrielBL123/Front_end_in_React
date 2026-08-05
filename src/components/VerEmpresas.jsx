import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const VerEmpresas = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let isMounted = true;

    const buscarEmpresas = async () => {
      try {
        const response = await axios.get("/empresa", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`, // Adiciona o token de acesso no cabeçalho
          },
        });

        // Pega o que está dentro do seu ResponseDTO
        const dadosDoJava = response.data?.data || response.data;

        if (isMounted) {
          // O GRANDE TRUQUE: Se for uma página do Spring, pega o '.content'
          // Se não for, usa o próprio objeto que veio
          let listaReal = dadosDoJava.content
            ? dadosDoJava.content
            : dadosDoJava;

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
    <div
      className="w-full min-h-screen flex flex-col items-center p-4 md:p-8"
      style={{ backgroundColor: "#EDEEE8", colorScheme: "light" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');
        .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
        .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .psy-btn-secondary {
          background-color: transparent;
          color: #3A423E;
          border: 1px solid #D8D6CB;
        }
        .psy-btn-secondary:hover { background-color: #F3F1E9; }
      `}</style>

      {/* Cabeçalho */}
      <div
        className="psy-shell w-full max-w-7xl p-8 md:p-12 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{
          backgroundColor: "#FCFBF7",
          boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
          border: "1px solid #DCD9CC",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}
            >
              🏢
            </span>
            <p
              className="text-xs tracking-[0.25em] uppercase font-bold"
              style={{ color: "#5C7D63" }}
            >
              Administração
            </p>
          </div>
          <h1
            className="psy-display text-4xl md:text-5xl"
            style={{ color: "#1F2A27" }}
          >
            Empresas Cadastradas
          </h1>
          <p className="mt-3 text-base" style={{ color: "#6B7570" }}>
            Visualize todas as empresas e seus respectivos setores.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="psy-btn-secondary px-8 py-3.5 font-semibold rounded-xl transition-all shadow-sm w-full md:w-auto"
        >
          Voltar
        </button>
      </div>

      {/* Mensagens de Feedback */}
      <div className="w-full max-w-7xl">
        {carregando && (
          <div
            className="psy-shell w-full p-12 text-center rounded-3xl"
            style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}
          >
            <div
              className="w-12 h-12 border-4 border-t-[#6E8F76] rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: "#E3F0E6", borderTopColor: "#6E8F76" }}
            ></div>
            <p className="font-semibold text-lg" style={{ color: "#5C7D63" }}>
              Carregando empresas...
            </p>
          </div>
        )}

        {erro && (
          <div
            className="psy-shell w-full p-6 rounded-2xl mb-8 text-center"
            style={{
              backgroundColor: "rgba(201,123,107,0.1)",
              border: "1px solid rgba(201,123,107,0.4)",
            }}
          >
            <p className="font-bold text-lg mb-1" style={{ color: "#8A3E31" }}>
              ⚠️ Atenção
            </p>
            <p style={{ color: "#8A3E31" }}>{erro}</p>
          </div>
        )}

        {!carregando && !erro && empresas.length === 0 && (
          <div
            className="psy-shell w-full p-16 text-center rounded-3xl"
            style={{ backgroundColor: "#FCFBF7", border: "1px dashed #DCD9CC" }}
          >
            <span className="text-4xl mb-4 block opacity-50">📋</span>
            <p className="text-xl font-medium" style={{ color: "#6B7570" }}>
              Nenhuma empresa encontrada no sistema.
            </p>
          </div>
        )}

        {/* Grid de Empresas */}
        {!carregando && !erro && empresas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empresas.map((empresa, index) => (
              <div
                key={empresa.id || index}
                className="psy-shell flex flex-col p-8 rounded-3xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "#FCFBF7",
                  border: "1px solid #DCD9CC",
                  boxShadow: "0 15px 30px -12px rgba(21,40,38,0.15)",
                }}
              >
                {/* Borda superior de destaque */}
                <div
                  className="absolute top-0 left-0 w-full h-2"
                  style={{ backgroundColor: "#6E8F76" }}
                ></div>

                <div className="flex-grow mt-2">
                  <h2
                    className="psy-display text-2xl mb-5"
                    style={{ color: "#1E3835" }}
                  >
                    {empresa.nome ||
                      empresa.nomeEmpresa ||
                      "Nome não informado"}
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex flex-col">
                      <span
                        className="text-xs uppercase tracking-wider font-bold mb-1"
                        style={{ color: "#8B9188" }}
                      >
                        CNPJ
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "#3A423E" }}
                      >
                        {empresa.cnpj || "Não informado"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-xs uppercase tracking-wider font-bold mb-1"
                        style={{ color: "#8B9188" }}
                      >
                        E-mail
                      </span>
                      <span
                        className="font-medium truncate"
                        style={{ color: "#3A423E" }}
                        title={empresa.email || empresa.emailEmpresa}
                      >
                        {empresa.email ||
                          empresa.emailEmpresa ||
                          "Não informado"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-xs uppercase tracking-wider font-bold mb-1"
                        style={{ color: "#8B9188" }}
                      >
                        Telefone
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "#3A423E" }}
                      >
                        {empresa.telefone ||
                          empresa.telefoneEmpresa ||
                          "Não informado"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-5" style={{ borderColor: "#E4E1D3" }} />

                  {/* Sessão de Setores */}
                  <div>
                    <h3
                      className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                      style={{ color: "#5C7D63" }}
                    >
                      Setores Cadastrados
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px]"
                        style={{ backgroundColor: "#E3F0E6" }}
                      >
                        {empresa.setores ? empresa.setores.length : 0}
                      </span>
                    </h3>

                    {empresa.setores && empresa.setores.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {empresa.setores.map((setor, idx) => (
                          <span
                            key={setor.id || idx}
                            className="text-xs font-bold px-3 py-1.5 rounded-full border"
                            style={{
                              backgroundColor: "rgba(199,167,107,0.1)",
                              color: "#1F2A27",
                              borderColor: "rgba(199,167,107,0.3)",
                            }}
                          >
                            {setor.nome || setor.nomeSetor}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="text-sm italic"
                        style={{ color: "#8B9188" }}
                      >
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
