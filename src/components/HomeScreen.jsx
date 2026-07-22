import { useNavigate, useSearchParams, useParams } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams();

  const userLogin = searchParams.get("login");
  const userCargo = searchParams.get("cargo");
  const userSetor = searchParams.get("setor");
  const userEmpresa = searchParams.get("empresa");
  const userJornada = searchParams.get("jornada");

  const irParaQuestionario = () => navigate(`/questionario/${token}`);

  const steps = [
    {
      n: "01",
      icon: "📝",
      title: "Faça seu cadastro",
      text: "Seus dados corporativos já vêm preenchidos a partir do convite enviado pelo RH da sua empresa.",
    },
    {
      n: "02",
      icon: "🎬",
      title: "Assista à introdução",
      text: "Veja o vídeo no final desta página para entender como funciona o mapeamento de saúde mental.",
    },
    {
      n: "03",
      icon: "📋",
      title: "Responda o questionário",
      text: "Use sua senha temporária para entrar e preencher o formulário com sinceridade e calma.",
    },
    {
      n: "04",
      icon: "💬",
      title: "Receba o acompanhamento",
      text: "Suas respostas são sigilosas e ajudam a construir um ambiente de trabalho mais saudável.",
    },
  ];

  return (
    <div
      className="psy-shell w-full min-h-screen flex flex-col"
      style={{
        backgroundColor: "#EDEEE8",
        colorScheme: "light",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
        .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
        .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .psy-nav-link { transition: color 0.2s; }
        .psy-nav-link:hover { color: #1E3835 !important; }
        .psy-cta {
          background-color: #1E3835;
          color: #F3F1E9;
        }
        .psy-cta:hover { background-color: #254440; }
        .psy-step-card {
          background-color: #FFFFFF;
          border: 1px solid #E4E1D3;
        }
      `}</style>

      {/* Nav - 100% da largura */}
      <nav
        className="sticky top-0 z-50 w-full flex items-center justify-between px-6 md:px-12 py-4 shadow-sm"
        style={{ backgroundColor: "#FCFBF7", borderBottom: "1px solid #E4E1D3" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}
          >
            ✚
          </span>
          <span className="psy-display text-xl" style={{ color: "#1F2A27" }}>
            Cuida+
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#inicio" className="psy-nav-link" style={{ color: "#3A423E" }}>Início</a>
          <a href="#como-funciona" className="psy-nav-link" style={{ color: "#3A423E" }}>Como funciona</a>
          <a href="#video" className="psy-nav-link" style={{ color: "#3A423E" }}>Vídeo introdutório</a>
        </div>

        <button onClick={irParaQuestionario} className="psy-cta px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          Começar Questionário
        </button>
      </nav>

      {/* Hero com Imagem de Fundo Esticada */}
      <section 
        id="inicio" 
        className="w-full flex-1 bg-cover bg-center bg-no-repeat relative flex flex-col justify-center min-h-[75vh]"
        style={{
          // Troque a URL pela sua imagem caso tenha baixado alguma
          backgroundImage: `linear-gradient(rgba(237, 238, 232, 0.75), rgba(237, 238, 232, 0.95)), url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 flex flex-col items-center text-center relative z-10">
          <p className="text-xs tracking-[0.25em] uppercase font-bold mb-4" style={{ color: "#5C7D63" }}>
            Programa de Saúde Mental Corporativa
          </p>
          <h1 className="psy-display text-5xl md:text-6xl leading-tight max-w-3xl mb-8" style={{ color: "#1F2A27" }}>
            Bem-vindo ao Sistema Cuida+
          </h1>

          {userLogin && (
            <div
              className="w-full max-w-3xl p-6 md:p-8 rounded-2xl text-left shadow-2xl mb-12"
              style={{
                background: "linear-gradient(135deg, #1E3835, #152826)",
                borderLeft: "8px solid #C7A76B",
              }}
            >
              <h3 className="text-2xl font-semibold mb-2" style={{ color: "#F3F1E9" }}>
                Olá, {userLogin}!
              </h3>
              <p className="text-lg mb-6" style={{ color: "#D9D6C8" }}>
                Sua conta corporativa foi configurada com sucesso. Confira seus dados:
              </p>

              <div
                className="p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(199,167,107,0.25)" }}
              >
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "#B9C4B7" }}>
                    Cargo
                  </span>
                  <span className="font-semibold text-lg" style={{ color: "#C7A76B" }}>
                    {userCargo}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "#B9C4B7" }}>
                    Setor
                  </span>
                  <span className="font-semibold text-lg" style={{ color: "#F3F1E9" }}>
                    {userSetor}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "#B9C4B7" }}>
                    Empresa (CNPJ)
                  </span>
                  <span className="font-semibold text-lg" style={{ color: "#F3F1E9" }}>
                    {userEmpresa}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "#B9C4B7" }}>
                    Jornada Semanal
                  </span>
                  <span className="font-semibold text-lg" style={{ color: "#F3F1E9" }}>
                    {userJornada}
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium" style={{ color: "#B9C4B7" }}>
                Use sua senha temporária enviada pelo administrador para acessar o sistema no botão abaixo.
              </p>
            </div>
          )}

          <div className="w-full max-w-3xl text-lg leading-relaxed space-y-6 text-center" style={{ color: "#4B534F" }}>
            <p>
              Role a página para entender a importância da saúde mental no ambiente de trabalho, como funciona
              nosso mapeamento e assista ao vídeo de introdução.
            </p>

            <div
              className="p-8 rounded-2xl space-y-4 shadow-lg text-left"
              style={{ backgroundColor: "#FFFFFF", borderLeft: "6px solid #6E8F76" }}
            >
              <h3 className="font-semibold text-2xl" style={{ color: "#1E3835" }}>
                Por que a Saúde Mental é importante?
              </h3>
              <ul className="list-none space-y-3" style={{ color: "#4B534F" }}>
                <li>
                  <strong style={{ color: "#1F2A27" }}>Ambiente Seguro:</strong> Identificamos riscos de
                  estresse e esgotamento.
                </li>
                <li>
                  <strong style={{ color: "#1F2A27" }}>Confidencialidade:</strong> Suas respostas são sigilosas
                  e focadas em melhorias.
                </li>
                <li>
                  <strong style={{ color: "#1F2A27" }}>Qualidade de Vida:</strong> Um clima organizacional
                  saudável reflete na sua vida pessoal.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={irParaQuestionario}
              className="psy-cta px-12 py-5 text-xl font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-2xl"
            >
              Começar Questionário Agora
            </button>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="w-full" style={{ backgroundColor: "#FCFBF7", borderTop: "1px solid #E4E1D3", borderBottom: "1px solid #E4E1D3" }}>
        <div className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 text-center">
          <p className="text-xs tracking-[0.25em] uppercase font-bold mb-3" style={{ color: "#5C7D63" }}>
            Como funciona
          </p>
          <h2 className="psy-display text-4xl md:text-5xl mb-14" style={{ color: "#1F2A27" }}>
            Do cadastro ao questionário, em 4 passos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {steps.map((step) => (
              <div key={step.n} className="psy-step-card rounded-2xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="flex items-center gap-4">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-sm"
                    style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}
                  >
                    {step.n}
                  </span>
                  <span
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gray-50"
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-bold text-xl" style={{ color: "#1F2A27" }}>
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "#6B7570" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-base font-medium" style={{ color: "#6B7570" }}>
            Ficou com alguma dúvida? Fale com o RH da sua empresa antes de começar.
          </p>
        </div>
      </section>

      {/* Vídeo */}
      <section id="video" className="w-full flex-1 bg-white">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-20 text-center">
          <p className="text-xs tracking-[0.25em] uppercase font-bold mb-3" style={{ color: "#5C7D63" }}>
            Vídeo introdutório
          </p>
          <h2 className="psy-display text-4xl md:text-5xl mb-10" style={{ color: "#1F2A27" }}>
            Assista antes de começar
          </h2>

          <div
            className="w-full overflow-hidden rounded-3xl mx-auto bg-gray-100"
            style={{ boxShadow: "0 40px 80px -20px rgba(24,42,40,0.4)", border: "6px solid #FFFFFF" }}
          >
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/arUK3hEy6l8?si=vNZogxFVJUdw7HfR"
              title="Vídeo do YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <button
            onClick={irParaQuestionario}
            className="psy-cta mt-14 px-12 py-5 text-xl font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-2xl"
          >
            Começar Questionário
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-sm font-medium" style={{ color: "#8B9188", borderTop: "1px solid #E4E1D3", backgroundColor: "#FCFBF7" }}>
        Cuida+ · Cuidando da saúde mental no ambiente de trabalho.
      </footer>
    </div>
  );
};

export default HomeScreen;