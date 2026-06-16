import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Como não há login, você deve importar a instância normal do Axios (ajuste o caminho se necessário)
import { axiosPrivate as axios } from "../api/axios";

const fatoresQuestionario = [
  {
    fator: "FATOR 1 – SOBRECARGA DE TRABALHO",
    perguntas: [
      {
        id: "F1_P1",
        tipo: "Percepção",
        texto: "1. Sinto que tenho mais tarefas do que consigo realizar",
      },
      {
        id: "F1_P2",
        tipo: "Percepção",
        texto: "2. Frequentemente me sinto sobrecarregado no trabalho",
      },
      {
        id: "F1_P3",
        tipo: "Condição real",
        texto: "3. As demandas são compatíveis com o tempo disponível",
      },
      {
        id: "F1_P4",
        tipo: "Condição real",
        texto: "4. Existe controle ou acompanhamento do excesso de trabalho",
      },
    ],
  },
  {
    fator: "FATOR 2 – RITMO INTENSO / PRESSÃO",
    perguntas: [
      {
        id: "F2_P1",
        tipo: "Percepção",
        texto:
          "5. Sinto que preciso trabalhar em ritmo acelerado constantemente",
      },
      {
        id: "F2_P2",
        tipo: "Percepção",
        texto: "6. Me sinto pressionado por prazos ou produtividade",
      },
      {
        id: "F2_P3",
        tipo: "Condição real",
        texto: "7. O ritmo de trabalho permite pausas adequadas",
      },
      {
        id: "F2_P4",
        tipo: "Condição real",
        texto: "8. As metas são realistas e alcançáveis",
      },
    ],
  },
  {
    fator: "FATOR 3 – LIDERANÇA",
    perguntas: [
      {
        id: "F3_P1",
        tipo: "Percepção",
        texto: "9. Minha liderança me trata com respeito",
      },
      {
        id: "F3_P2",
        tipo: "Percepção",
        texto: "10. Sinto apoio da minha liderança",
      },
      {
        id: "F3_P3",
        tipo: "Condição real",
        texto: "11. Existem critérios claros de cobrança e gestão",
      },
      {
        id: "F3_P4",
        tipo: "Condição real",
        texto: "12. A liderança recebe preparo para gestão de pessoas",
      },
    ],
  },
  {
    fator: "FATOR 4 – ASSÉDIO / AMBIENTE TÓXICO",
    perguntas: [
      {
        id: "F4_P1",
        tipo: "Percepção",
        texto: "13. Já me senti desrespeitado ou constrangido no trabalho",
      },
      {
        id: "F4_P2",
        tipo: "Percepção",
        texto: "14. Existe um clima de medo ou tensão no ambiente",
      },
      {
        id: "F4_P3",
        tipo: "Condição real",
        texto: "15. Existe canal seguro para denúncias",
      },
      {
        id: "F4_P4",
        tipo: "Condição real",
        texto: "16. Há políticas claras contra assédio",
      },
    ],
  },
  {
    fator: "FATOR 5 – FALTA DE AUTONOMIA",
    perguntas: [
      {
        id: "F5_P1",
        tipo: "Percepção",
        texto: "17. Tenho pouca liberdade para organizar meu trabalho",
      },
      {
        id: "F5_P2",
        tipo: "Percepção",
        texto: "18. Sinto que não tenho controle sobre minhas tarefas",
      },
      {
        id: "F5_P3",
        tipo: "Condição real",
        texto: "19. Existe autonomia para tomada de decisão dentro da função",
      },
      {
        id: "F5_P4",
        tipo: "Condição real",
        texto: "20. As responsabilidades estão claramente definidas",
      },
    ],
  },
  {
    fator: "FATOR 6 – FALTA DE RECONHECIMENTO",
    perguntas: [
      {
        id: "F6_P1",
        tipo: "Percepção",
        texto: "21. Sinto que meu trabalho não é valorizado",
      },
      {
        id: "F6_P2",
        tipo: "Percepção",
        texto: "22. Meu esforço raramente é reconhecido",
      },
      {
        id: "F6_P3",
        tipo: "Condição real",
        texto: "23. Existem práticas de reconhecimento na empresa",
      },
      {
        id: "F6_P4",
        tipo: "Condição real",
        texto: "24. Há critérios claros para crescimento e valorização",
      },
    ],
  },
  {
    fator: "FATOR 7 – COMUNICAÇÃO INEFICAZ",
    perguntas: [
      {
        id: "F7_P1",
        tipo: "Percepção",
        texto: "25. Recebo informações confusas ou incompletas",
      },
      {
        id: "F7_P2",
        tipo: "Percepção",
        texto: "26. Tenho dificuldade de entender o que é esperado de mim",
      },
      {
        id: "F7_P3",
        tipo: "Condição real",
        texto: "27. Existem canais formais de comunicação",
      },
      {
        id: "F7_P4",
        tipo: "Condição real",
        texto: "28. As orientações de trabalho são claras e registradas",
      },
    ],
  },
  {
    fator: "FATOR 8 – INJUSTIÇA ORGANIZACIONAL",
    perguntas: [
      {
        id: "F8_P1",
        tipo: "Percepção",
        texto: "29. Sinto que há tratamento desigual na empresa",
      },
      {
        id: "F8_P2",
        tipo: "Percepção",
        texto: "30. Percebo favoritismo ou injustiça",
      },
      {
        id: "F8_P3",
        tipo: "Condição real",
        texto: "31. Existem critérios claros para decisões internas",
      },
      {
        id: "F8_P4",
        tipo: "Condição real",
        texto: "32. As regras são aplicadas de forma igual",
      },
    ],
  },
  {
    fator: "FATOR 9 – RELAÇÕES INTERPESSOAIS",
    perguntas: [
      {
        id: "F9_P1",
        tipo: "Percepção",
        texto: "33. Existem conflitos frequentes entre colegas",
      },
      {
        id: "F9_P2",
        tipo: "Percepção",
        texto: "34. O ambiente de trabalho é tenso",
      },
      {
        id: "F9_P3",
        tipo: "Condição real",
        texto: "35. Existem ações para mediação de conflitos",
      },
      {
        id: "F9_P4",
        tipo: "Condição real",
        texto: "36. Há regras de convivência bem definidas",
      },
    ],
  },
  {
    fator: "FATOR 10 – JORNADA DE TRABALHO",
    perguntas: [
      {
        id: "F10_P1",
        tipo: "Percepção",
        texto: "37. Trabalho além do meu horário com frequência",
      },
      {
        id: "F10_P2",
        tipo: "Percepção",
        texto: "38. Sinto dificuldade de descansar",
      },
      {
        id: "F10_P3",
        tipo: "Condição real",
        texto: "39. A jornada é controlada adequadamente",
      },
      {
        id: "F10_P4",
        tipo: "Condição real",
        texto: "40. Os intervalos são respeitados",
      },
    ],
  },
  {
    fator: "FATOR 11 – CONFLITO TRABALHO × VIDA",
    perguntas: [
      {
        id: "F11_P1",
        tipo: "Percepção",
        texto: "41. O trabalho interfere na minha vida pessoal",
      },
      {
        id: "F11_P2",
        tipo: "Percepção",
        texto: "42. Tenho dificuldade de me desconectar do trabalho",
      },
      {
        id: "F11_P3",
        tipo: "Condição real",
        texto: "43. A empresa respeita horários fora do expediente",
      },
      {
        id: "F11_P4",
        tipo: "Condição real",
        texto: "44. Existe equilíbrio entre trabalho e vida pessoal",
      },
    ],
  },
  {
    fator: "FATOR 12 – EXIGÊNCIA EMOCIONAL",
    perguntas: [
      {
        id: "F12_P1",
        tipo: "Percepção",
        texto: "45. Meu trabalho me causa desgaste emocional",
      },
      {
        id: "F12_P2",
        tipo: "Percepção",
        texto: "46. Sinto cansaço mental frequente",
      },
      {
        id: "F12_P3",
        tipo: "Condição real",
        texto: "47. Existe apoio emocional ou psicológico",
      },
      {
        id: "F12_P4",
        tipo: "Condição real",
        texto: "48. Há ações de cuidado com a saúde mental",
      },
    ],
  },
  {
    fator: "FATOR 13 – SUPORTE ORGANIZACIONAL",
    perguntas: [
      {
        id: "F13_P1",
        tipo: "Percepção",
        texto: "49. Sinto falta de apoio para realizar meu trabalho",
      },
      {
        id: "F13_P2",
        tipo: "Percepção",
        texto: "50. Me sinto desamparado em situações difíceis",
      },
      {
        id: "F13_P3",
        tipo: "Condição real",
        texto: "51. Existe suporte da empresa quando necessário",
      },
      {
        id: "F13_P4",
        tipo: "Condição real",
        texto: "52. Há orientação e acompanhamento das atividades",
      },
    ],
  },
];

const Questionario = () => {
  const navigate = useNavigate();
  const { token: tokenId } = useParams(); // ✨ Extrai o token gerado da URL

  // Estado para armazenar os setores trazidos da API
  const [setores, setSetores] = useState([]);

  // Controle das Etapas do Formulário (1 = Cadastro, 2 = Questionário)
  const [etapa, setEtapa] = useState(1);

  // Estado para armazenar os dados do DTO de resposta
  const [dadosFuncionario, setDadosFuncionario] = useState({
    nome: "",
    email: "",
    cargo: "",
    setor: "",
    dataAdmissao: "",
    jornada: "PT8H",
  });

  const estadoInicialRespostas = {
    F1_P1: "",
    F1_P2: "",
    F1_P3: "",
    F1_P4: "",
    F2_P1: "",
    F2_P2: "",
    F2_P3: "",
    F2_P4: "",
    F3_P1: "",
    F3_P2: "",
    F3_P3: "",
    F3_P4: "",
    F4_P1: "",
    F4_P2: "",
    F4_P3: "",
    F4_P4: "",
    F5_P1: "",
    F5_P2: "",
    F5_P3: "",
    F5_P4: "",
    F6_P1: "",
    F6_P2: "",
    F6_P3: "",
    F6_P4: "",
    F7_P1: "",
    F7_P2: "",
    F7_P3: "",
    F7_P4: "",
    F8_P1: "",
    F8_P2: "",
    F8_P3: "",
    F8_P4: "",
    F9_P1: "",
    F9_P2: "",
    F9_P3: "",
    F9_P4: "",
    F10_P1: "",
    F10_P2: "",
    F10_P3: "",
    F10_P4: "",
    F11_P1: "",
    F11_P2: "",
    F11_P3: "",
    F11_P4: "",
    F12_P1: "",
    F12_P2: "",
    F12_P3: "",
    F12_P4: "",
    F13_P1: "",
    F13_P2: "",
    F13_P3: "",
    F13_P4: "",
  };

  const [respostas, setRespostas] = useState(estadoInicialRespostas);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");

  useEffect(() => {
    const buscarSetoresDaAvaliacao = async () => {
      try {
        const response = await axios.get(`/resposta/responder/${tokenId}`);

        // Pega os dados com base na estrutura do seu backend ({ message, data })
        const avaliacao = response.data.data || response.data;

        setSetores(avaliacao.nomeSetor);
      } catch (err) {
        console.error("Erro ao carregar a avaliação e os setores:", err);
      }
    };

    if (tokenId) {
      buscarSetoresDaAvaliacao();
    }
  }, [tokenId]);

  const handleDadosChange = (e) => {
    setDadosFuncionario({
      ...dadosFuncionario,
      [e.target.name]: e.target.value,
    });
  };

  const handleRespostaChange = (e) => {
    setRespostas({ ...respostas, [e.target.name]: e.target.value });
  };

  const avancarEtapa = (e) => {
    e.preventDefault();
    if (
      !dadosFuncionario.nome ||
      !dadosFuncionario.email ||
      !dadosFuncionario.cargo ||
      !dadosFuncionario.setor ||
      !dadosFuncionario.dataAdmissao
    ) {
      setMsgErro(
        "Por favor, preencha todos os campos obrigatórios antes de avançar.",
      );
      return;
    }
    setMsgErro("");
    window.scrollTo(0, 0);
    setEtapa(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgSucesso("");
    setMsgErro("");

    const arrayDeRespostas = [];
    fatoresQuestionario.forEach((bloco) => {
      bloco.perguntas.forEach((pergunta) => {
        arrayDeRespostas.push(parseInt(respostas[pergunta.id], 10) || 0);
      });
    });

    // Formatação EXATA para o LocalDateTime do Java
    const dataFormatadaJava = dadosFuncionario.dataAdmissao
      ? `${dadosFuncionario.dataAdmissao}T00:00:00`
      : new Date().toISOString().split(".")[0];

    // Objeto DTO impecável para casar com RespostaDTO
    const payloadDTO = {
      nome: dadosFuncionario.nome,
      login: dadosFuncionario.email,
      cargo: dadosFuncionario.cargo,
      setor: dadosFuncionario.setor,
      tempoDeTrabalho: dataFormatadaJava,
      jornada: dadosFuncionario.jornada,
      resposta: arrayDeRespostas,
    };

    try {
      // ⚠️ Aponta diretamente para o seu RespostaController!
      await axios.post(
        `/resposta/responder/${tokenId}`,
        JSON.stringify(payloadDTO),
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      setMsgSucesso("Seus dados e avaliação foram salvos com sucesso!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setMsgErro(
          "Erro ao salvar: Algum dado obrigatório não foi preenchido.",
        );
      } else {
        setMsgErro(
          "Falha de conexão com o servidor. Verifique o link e tente novamente.",
        );
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl p-8 md:p-10 shadow-2xl my-8 mx-auto">
      {/* Breadcrumb de Progresso */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <span
            className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${etapa === 1 ? "bg-green-600 text-white shadow-md" : "bg-green-100 text-green-700"}`}
          >
            1. Identificação
          </span>
          <div className="w-10 h-1 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${etapa === 2 ? "bg-green-500 w-full" : "w-0"}`}
            ></div>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${etapa === 2 ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-500"}`}
          >
            2. Questionário
          </span>
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-4">
        Mapeamento de Saúde Organizacional
      </h2>
      <p className="text-center text-gray-500 text-lg mb-8">
        {etapa === 1
          ? "Preencha seus dados para iniciar a avaliação."
          : "Responda com sinceridade. Suas respostas são sigilosas."}
      </p>

      {msgErro && (
        <p className="mb-6 text-red-600 font-bold text-center bg-red-50 p-4 rounded-xl">
          {msgErro}
        </p>
      )}
      {msgSucesso && (
        <p className="mb-6 text-green-600 font-bold text-center bg-green-50 p-4 rounded-xl animate-pulse">
          {msgSucesso}
        </p>
      )}

      {/* ==================== ETAPA 1: CADASTRO ==================== */}
      {etapa === 1 && (
        <form
          onSubmit={avancarEtapa}
          className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-semibold mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={dadosFuncionario.nome}
                onChange={handleDadosChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black bg-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-semibold mb-1">
                E-mail Corporativo *
              </label>
              <input
                type="email"
                name="email"
                value={dadosFuncionario.email}
                onChange={handleDadosChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black bg-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-semibold mb-1">
                Cargo *
              </label>
              <input
                type="text"
                name="cargo"
                value={dadosFuncionario.cargo}
                onChange={handleDadosChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black bg-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-semibold mb-1">
                Setor *
              </label>
              <select
                name="setor"
                value={dadosFuncionario.setor}
                onChange={handleDadosChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black bg-white outline-none cursor-pointer"
                required
              >
                <option value="" disabled className="text-gray-500">
                  {setores.length > 0
                    ? "Selecione o setor..."
                    : "Carregando setores..."}
                </option>

                {setores.map((setor, idx) => (
                  <option key={idx} value={setor} className="text-gray-900">
                    {setor}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 font-semibold mb-1">
                Data de Admissão *
              </label>
              <input
                type="date"
                name="dataAdmissao"
                value={dadosFuncionario.dataAdmissao}
                onChange={handleDadosChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-black bg-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Avançar para Questionário &rarr;
            </button>
          </div>
        </form>
      )}

      {/* ==================== ETAPA 2: QUESTIONÁRIO ==================== */}
      {etapa === 2 && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 animate-fade-in"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-center font-bold text-green-800 mb-4 uppercase tracking-wide">
              Escala de Resposta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-green-900 font-medium text-center text-sm">
              <span className="bg-white px-2 py-2 rounded shadow-sm">
                1 – Nunca / Não Existe
              </span>
              <span className="bg-white px-2 py-2 rounded shadow-sm">
                2 – Raramente
              </span>
              <span className="bg-white px-2 py-2 rounded shadow-sm">
                3 – Às vezes
              </span>
              <span className="bg-white px-2 py-2 rounded shadow-sm">
                4 – Frequentemente
              </span>
              <span className="bg-white px-2 py-2 rounded shadow-sm">
                5 – Sempre / Totalmente
              </span>
            </div>
          </div>

          {fatoresQuestionario.map((bloco, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 border-b border-gray-200 pb-10 last:border-none"
            >
              <h3 className="text-2xl font-extrabold text-green-800 border-l-4 border-green-500 pl-3">
                {bloco.fator}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                {bloco.perguntas.map((pergunta) => (
                  <div
                    key={pergunta.id}
                    className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <span
                      className={`text-xs font-bold uppercase w-fit px-2 py-1 rounded ${pergunta.tipo === "Percepção" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                    >
                      {pergunta.tipo}
                    </span>
                    <label className="font-semibold text-gray-800 text-base flex-1">
                      {pergunta.texto}
                    </label>
                    <select
                      name={pergunta.id}
                      value={respostas[pergunta.id]}
                      onChange={handleRespostaChange}
                      className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-sm"
                      required
                    >
                      <option value="" className="text-gray-500">
                        Selecione...
                      </option>
                      <option value="1" className="text-gray-900">
                        1
                      </option>
                      <option value="2" className="text-gray-900">
                        2
                      </option>
                      <option value="3" className="text-gray-900">
                        3
                      </option>
                      <option value="4" className="text-gray-900">
                        4
                      </option>
                      <option value="5" className="text-gray-900">
                        5
                      </option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-4 mt-6 pt-4">
            <button
              type="button"
              onClick={() => {
                setEtapa(1);
                window.scrollTo(0, 0);
              }}
              className="w-full md:w-1/3 py-4 px-6 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition-all"
            >
              &larr; Voltar
            </button>
            <button
              type="submit"
              className="w-full md:w-2/3 py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-xl transition-all shadow-lg hover:-translate-y-1"
            >
              Finalizar e Enviar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Questionario;
