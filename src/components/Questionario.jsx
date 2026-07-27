import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate as axios } from "../api/axios";
import "../tailwind.css";

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
 
  const { token: tokenId } = useParams();

  const [setores, setSetores] = useState([]);
  const [etapa, setEtapa] = useState(1);

  const [dadosFuncionario, setDadosFuncionario] = useState({
    nome: "",
    email: "",
    cargo: "",
    setor: "",
    dataAdmissao: "",
    jornada: "PT8H",
  });

  const estadoInicialRespostas = {
    F1_P1: "", F1_P2: "", F1_P3: "", F1_P4: "",
    F2_P1: "", F2_P2: "", F2_P3: "", F2_P4: "",
    F3_P1: "", F3_P2: "", F3_P3: "", F3_P4: "",
    F4_P1: "", F4_P2: "", F4_P3: "", F4_P4: "",
    F5_P1: "", F5_P2: "", F5_P3: "", F5_P4: "",
    F6_P1: "", F6_P2: "", F6_P3: "", F6_P4: "",
    F7_P1: "", F7_P2: "", F7_P3: "", F7_P4: "",
    F8_P1: "", F8_P2: "", F8_P3: "", F8_P4: "",
    F9_P1: "", F9_P2: "", F9_P3: "", F9_P4: "",
    F10_P1: "", F10_P2: "", F10_P3: "", F10_P4: "",
    F11_P1: "", F11_P2: "", F11_P3: "", F11_P4: "",
    F12_P1: "", F12_P2: "", F12_P3: "", F12_P4: "",
    F13_P1: "", F13_P2: "", F13_P3: "", F13_P4: "",
  };

  const [respostas, setRespostas] = useState(estadoInicialRespostas);
  const [msgErro, setMsgErro] = useState("");

  useEffect(() => {
    const buscarSetoresDaAvaliacao = async () => {
      try {
        const response = await axios.get(`/resposta/responder/${tokenId}`);
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
    setMsgErro("");

    const arrayDeRespostas = [];
    fatoresQuestionario.forEach((bloco) => {
      bloco.perguntas.forEach((pergunta) => {
        arrayDeRespostas.push(parseInt(respostas[pergunta.id], 10) || 0);
      });
    });

    const dataFormatadaJava = dadosFuncionario.dataAdmissao
      ? `${dadosFuncionario.dataAdmissao}T00:00:00`
      : new Date().toISOString().split(".")[0];

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
      await axios.post(
        `/resposta/responder/${tokenId}`,
        JSON.stringify(payloadDTO),
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // ✨ Em vez de setMsgSucesso e Navigate, mudamos para a Etapa 3 (Tela de Sucesso)
      setEtapa(3);
      window.scrollTo(0, 0);

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

      <div 
        className="psy-shell w-full max-w-4xl p-8 md:p-12 rounded-3xl shadow-xl my-8"
        style={{ backgroundColor: "#FCFBF7", border: "1px solid #DCD9CC" }}
      >
        
        {/* Só exibe o Breadcrumb e o Título se não estiver na etapa de sucesso (3) */}
        {etapa < 3 && (
          <>
            {/* Breadcrumb de Progresso */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors ${etapa === 1 ? "bg-[#1E3835] text-[#F3F1E9] shadow-sm" : "bg-[#EDEEE8] text-[#5C7D63]"}`}
                >
                  1. Identificação
                </span>
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#E4E1D3" }}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${etapa === 2 ? "bg-[#6E8F76] w-full" : "w-0"}`}
                  ></div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-colors ${etapa === 2 ? "bg-[#1E3835] text-[#F3F1E9] shadow-sm" : "bg-[#EDEEE8] text-[#8B9188]"}`}
                >
                  2. Questionário
                </span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="psy-display text-3xl md:text-4xl mb-3" style={{ color: "#1F2A27" }}>
                Mapeamento de Saúde Organizacional
              </h2>
              <p className="text-base" style={{ color: "#6B7570" }}>
                {etapa === 1
                  ? "Preencha seus dados para iniciar a avaliação."
                  : "Responda com sinceridade. Suas respostas são sigilosas."}
              </p>
            </div>
          </>
        )}

        {msgErro && (
          <div className="mb-6 p-4 rounded-xl text-center font-medium text-sm" style={{ border: "1px solid rgba(201,123,107,0.4)", backgroundColor: "rgba(201,123,107,0.1)", color: "#8A3E31" }}>
            {msgErro}
          </div>
        )}

        {/* ==================== ETAPA 1: CADASTRO ==================== */}
        {etapa === 1 && (
          <form
            onSubmit={avancarEtapa}
            className="p-8 rounded-2xl border shadow-inner space-y-6 animate-fade-in"
            style={{ backgroundColor: "#EDEEE8", borderColor: "#D8D6CB" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={dadosFuncionario.nome}
                  onChange={handleDadosChange}
                  className="psy-input px-4 py-3 rounded-xl sm:text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  name="email"
                  value={dadosFuncionario.email}
                  onChange={handleDadosChange}
                  className="psy-input px-4 py-3 rounded-xl sm:text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Cargo *
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={dadosFuncionario.cargo}
                  onChange={handleDadosChange}
                  className="psy-input px-4 py-3 rounded-xl sm:text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Setor *
                </label>
                <select
                  name="setor"
                  value={dadosFuncionario.setor}
                  onChange={handleDadosChange}
                  className="psy-input px-4 py-3 rounded-xl sm:text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled style={{ color: "#9ca39c" }}>
                    {setores.length > 0
                      ? "Selecione o setor..."
                      : "Carregando setores..."}
                  </option>

                  {setores.map((setor, idx) => (
                    <option key={idx} value={setor} style={{ color: "#1F2A27" }}>
                      {setor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: "#3a423e" }}>
                  Data de Admissão *
                </label>
                <input
                  type="date"
                  name="dataAdmissao"
                  value={dadosFuncionario.dataAdmissao}
                  onChange={handleDadosChange}
                  className="psy-input px-4 py-3 rounded-xl sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="psy-btn px-8 py-3.5 font-semibold rounded-xl transition-all shadow-sm text-sm"
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
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: "#EDEEE8", borderColor: "#D8D6CB" }}>
              <h3 className="text-center font-bold mb-4 uppercase tracking-wider text-xs" style={{ color: "#5C7D63" }}>
                Escala de Resposta
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-medium text-center text-xs">
                <span className="bg-white px-3 py-2.5 rounded-xl border shadow-sm" style={{ borderColor: "#D8D6CB", color: "#3A423E" }}>
                  1 – Nunca / Não Existe
                </span>
                <span className="bg-white px-3 py-2.5 rounded-xl border shadow-sm" style={{ borderColor: "#D8D6CB", color: "#3A423E" }}>
                  2 – Raramente
                </span>
                <span className="bg-white px-3 py-2.5 rounded-xl border shadow-sm" style={{ borderColor: "#D8D6CB", color: "#3A423E" }}>
                  3 – Às vezes
                </span>
                <span className="bg-white px-3 py-2.5 rounded-xl border shadow-sm" style={{ borderColor: "#D8D6CB", color: "#3A423E" }}>
                  4 – Frequentemente
                </span>
                <span className="bg-white px-3 py-2.5 rounded-xl border shadow-sm" style={{ borderColor: "#D8D6CB", color: "#3A423E" }}>
                  5 – Sempre / Totalmente
                </span>
              </div>
            </div>

            {fatoresQuestionario.map((bloco, index) => (
              <div
                key={index}
                className="flex flex-col gap-6 border-b pb-10 last:border-none"
                style={{ borderColor: "#E4E1D3" }}
              >
                <h3 className="psy-display text-2xl border-l-4 pl-4 py-1" style={{ color: "#1E3835", borderLeftColor: "#C7A76B" }}>
                  {bloco.fator}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bloco.perguntas.map((pergunta) => (
                    <div
                      key={pergunta.id}
                      className="flex flex-col justify-between gap-3 p-5 rounded-2xl border bg-white shadow-sm"
                      style={{ borderColor: "#D8D6CB" }}
                    >
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider w-fit px-2.5 py-1 rounded-full border mb-2 inline-block ${
                            pergunta.tipo === "Percepção" 
                              ? "bg-blue-50 text-blue-700 border-blue-200" 
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {pergunta.tipo}
                        </span>
                        <label className="font-semibold text-sm block leading-relaxed" style={{ color: "#1F2A27" }}>
                          {pergunta.texto}
                        </label>
                      </div>
                      
                      <select
                        name={pergunta.id}
                        value={respostas[pergunta.id]}
                        onChange={handleRespostaChange}
                        className="psy-input w-full px-3.5 py-2.5 rounded-xl sm:text-sm cursor-pointer shadow-sm"
                        required
                      >
                        <option value="" style={{ color: "#9ca39c" }}>
                          Selecione...
                        </option>
                        <option value="1" style={{ color: "#1F2A27" }}>1</option>
                        <option value="2" style={{ color: "#1F2A27" }}>2</option>
                        <option value="3" style={{ color: "#1F2A27" }}>3</option>
                        <option value="4" style={{ color: "#1F2A27" }}>4</option>
                        <option value="5" style={{ color: "#1F2A27" }}>5</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t" style={{ borderColor: "#E4E1D3" }}>
              <button
                type="button"
                onClick={() => {
                  setEtapa(1);
                  window.scrollTo(0, 0);
                }}
                className="psy-btn-secondary w-full md:w-1/3 py-4 px-6 font-semibold rounded-xl transition-all text-sm shadow-sm"
              >
                &larr; Voltar
              </button>
              <button
                type="submit"
                className="psy-btn w-full md:w-2/3 py-4 px-6 font-bold rounded-xl transition-all shadow-lg text-sm"
              >
                Finalizar e Enviar
              </button>
            </div>
          </form>
        )}

        {/* ==================== ETAPA 3: SUCESSO ==================== */}
        {etapa === 3 && (
          <div className="text-center py-16 animate-fade-in">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-sm border-4" 
              style={{ backgroundColor: "#E3F0E6", color: "#2F5C3E", borderColor: "rgba(110,143,118,0.2)" }}
            >
              ✓
            </div>
            <h2 className="psy-display text-4xl md:text-5xl mb-4" style={{ color: "#1F2A27" }}>
              Muito obrigado!
            </h2>
            <p className="text-xl font-medium" style={{ color: "#5C7D63" }}>
              Sua resposta foi enviada com sucesso.
            </p>
            <p className="text-sm mt-6" style={{ color: "#8B9188" }}>
              Você já pode fechar esta página.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionario;