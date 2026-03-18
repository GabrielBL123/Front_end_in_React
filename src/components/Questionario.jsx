import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";

const fatoresQuestionario = [
  {
    fator: "FATOR 1 – CARGA DE TRABALHO",
    perguntas: [
      {
        id: "F1_P1",
        texto:
          "1. A quantidade de trabalho é excessiva para o tempo disponível.",
      },
      {
        id: "F1_P2",
        texto: "2. Costumo acumular funções além da minha responsabilidade.",
      },
    ],
  },
  {
    fator: "FATOR 2 – RITMO E INTENSIDADE",
    perguntas: [
      { id: "F2_P1", texto: "3. Trabalho sob pressão constante por prazos." },
      { id: "F2_P2", texto: "4. O ritmo de trabalho é acelerado demais." },
    ],
  },
  {
    fator: "FATOR 3 – CLAREZA DE PAPEL",
    perguntas: [
      {
        id: "F3_P1",
        texto: "5. Tenho clareza sobre minhas responsabilidades.",
      },
      { id: "F3_P2", texto: "6. Recebo demandas contraditórias." },
    ],
  },
  {
    fator: "FATOR 4 – AUTONOMIA",
    perguntas: [
      {
        id: "F4_P1",
        texto: "7. Tenho liberdade para organizar minhas tarefas.",
      },
      {
        id: "F4_P2",
        texto:
          "8. Tenho pouca influência sobre decisões que afetam meu trabalho.",
      },
    ],
  },
  {
    fator: "FATOR 5 – LIDERANÇA",
    perguntas: [
      {
        id: "F5_P1",
        texto: "9. Minha liderança trata os colaboradores com respeito.",
      },
      {
        id: "F5_P2",
        texto: "10. Sinto medo da forma como erros são tratados.",
      },
    ],
  },
  {
    fator: "FATOR 6 – RECONHECIMENTO",
    perguntas: [
      { id: "F6_P1", texto: "11. Meu esforço é reconhecido." },
      { id: "F6_P2", texto: "12. Sinto que meu trabalho é invisível." },
    ],
  },
  {
    fator: "FATOR 7 – COMUNICAÇÃO",
    perguntas: [
      { id: "F7_P1", texto: "13. As informações chegam com clareza." },
      { id: "F7_P2", texto: "14. Mudanças são comunicadas de forma confusa." },
    ],
  },
  {
    fator: "FATOR 8 – JUSTIÇA ORGANIZACIONAL",
    perguntas: [
      { id: "F8_P1", texto: "15. Todos são tratados de forma justa." },
      { id: "F8_P2", texto: "16. Há favorecimentos ou desigualdades." },
    ],
  },
  {
    fator: "FATOR 9 – RELAÇÕES INTERPESSOAIS",
    perguntas: [
      { id: "F9_P1", texto: "17. O clima entre colegas é saudável." },
      { id: "F9_P2", texto: "18. Existem conflitos frequentes." },
    ],
  },
  {
    fator: "FATOR 10 – ASSÉDIO MORAL",
    perguntas: [
      { id: "F10_P1", texto: "19. Já sofri humilhações no trabalho." },
      {
        id: "F10_P2",
        texto: "20. Já presenciei constrangimentos recorrentes.",
      },
    ],
  },
  {
    fator: "FATOR 11 – JORNADA E PAUSAS",
    perguntas: [
      { id: "F11_P1", texto: "21. Consigo fazer pausas adequadas." },
      { id: "F11_P2", texto: "22. Trabalho além do horário com frequência." },
    ],
  },
  {
    fator: "FATOR 12 – TRABALHO × VIDA PESSOAL",
    perguntas: [
      { id: "F12_P1", texto: "23. O trabalho invade minha vida pessoal." },
      {
        id: "F12_P2",
        texto: "24. Tenho dificuldade de desconectar fora do expediente.",
      },
    ],
  },
  {
    fator: "FATOR 13 – IMPACTOS NA SAÚDE MENTAL",
    perguntas: [
      { id: "F13_P1", texto: "25. Sinto ansiedade relacionada ao trabalho." },
      { id: "F13_P2", texto: "26. Sinto esgotamento emocional." },
      {
        id: "F13_P3",
        texto:
          "27. Já pensei em me afastar do trabalho por motivos emocionais.",
      },
    ],
  },
];

const Questionario = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Pega o token de login do usuário

  const estadoInicial = {
    F1_P1: "",
    F1_P2: "",
    F2_P1: "",
    F2_P2: "",
    F3_P1: "",
    F3_P2: "",
    F4_P1: "",
    F4_P2: "",
    F5_P1: "",
    F5_P2: "",
    F6_P1: "",
    F6_P2: "",
    F7_P1: "",
    F7_P2: "",
    F8_P1: "",
    F8_P2: "",
    F9_P1: "",
    F9_P2: "",
    F10_P1: "",
    F10_P2: "",
    F11_P1: "",
    F11_P2: "",
    F12_P1: "",
    F12_P2: "",
    F13_P1: "",
    F13_P2: "",
    F13_P3: "",
  };

  const [respostas, setRespostas] = useState(estadoInicial);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState(""); // Adicionado estado para mensagens de erro

  const handleChange = (e) => {
    setRespostas({
      ...respostas,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgSucesso("");
    setMsgErro("");

    try {
      // 2. Chamada Axios para o Back-end
      // IMPORTANTE: Ajuste a rota "/questionario" caso o seu Controller no Spring Boot tenha outro nome
      const response = await axiosPrivate.post(
        "/questionario",
        JSON.stringify(respostas),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.accessToken}`, // Envia o token para autorizar
          },
        },
      );

      console.log("Salvo no banco:", response.data);
      setMsgSucesso("Questionário salvo com sucesso!");

      // Limpa o formulário após salvar
      setRespostas(estadoInicial);

      // Redireciona para o menu
      setTimeout(() => {
        navigate("/menu");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        setMsgErro(
          "Servidor não respondeu. Verifique se o back-end está rodando.",
        );
      } else {
        setMsgErro("Falha ao enviar o questionário. Tente novamente.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl p-10 shadow-2xl my-8">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-4">
        Mapeamento de Saúde Organizacional
      </h2>
      <p className="text-center text-gray-500 text-lg mb-6">
        Responda com sinceridade para avaliarmos o clima e bem-estar no ambiente
        de trabalho.
      </p>

      {/* LEGENDA DA ESCALA */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-10">
        <h3 className="text-center font-bold text-green-800 mb-3 uppercase tracking-wide">
          Escala de Resposta
        </h3>
        <div className="flex flex-wrap justify-center gap-4 text-green-900 font-medium">
          <span className="bg-white px-3 py-1 rounded shadow-sm">
            1 – Nunca
          </span>
          <span className="bg-white px-3 py-1 rounded shadow-sm">
            2 – Raramente
          </span>
          <span className="bg-white px-3 py-1 rounded shadow-sm">
            3 – Às vezes
          </span>
          <span className="bg-white px-3 py-1 rounded shadow-sm">
            4 – Frequentemente
          </span>
          <span className="bg-white px-3 py-1 rounded shadow-sm">
            5 – Sempre
          </span>
        </div>
      </div>

      {/* Mensagens de Sucesso e Erro */}
      {msgSucesso && (
        <p className="mb-6 text-green-600 text-xl font-bold text-center">
          {msgSucesso}
        </p>
      )}
      {msgErro && (
        <p className="mb-6 text-red-600 text-xl font-bold text-center">
          {msgErro}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {fatoresQuestionario.map((bloco, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 border-b border-gray-100 pb-8 last:border-none"
          >
            <h3 className="text-2xl font-bold text-green-700 border-l-4 border-green-500 pl-3">
              {bloco.fator}
            </h3>

            {bloco.perguntas.map((pergunta) => (
              <div key={pergunta.id} className="flex flex-col gap-2 mt-2">
                <label className="font-semibold text-gray-700 text-lg">
                  {pergunta.texto}
                </label>
                <select
                  name={pergunta.id}
                  value={respostas[pergunta.id]}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg cursor-pointer hover:bg-white transition-colors"
                  required
                >
                  <option value="">Selecione uma resposta...</option>
                  <option value="1">1 – Nunca</option>
                  <option value="2">2 – Raramente</option>
                  <option value="3">3 – Às vezes</option>
                  <option value="4">4 – Frequentemente</option>
                  <option value="5">5 – Sempre</option>
                </select>
              </div>
            ))}
          </div>
        ))}

        {/* Botões */}
        <div className="flex flex-row gap-6 mt-6">
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="w-1/2 py-4 px-6 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 text-xl font-bold rounded-lg transition-all duration-300"
          >
            Voltar ao Menu
          </button>
          <button
            type="submit"
            className="w-1/2 py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg transition-all duration-300 hover:-translate-y-1"
          >
            Enviar Respostas
          </button>
        </div>
      </form>
    </div>
  );
};

export default Questionario;
