// ✨ 1. Importe o useParams aqui em cima!
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

const VideoExemplo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ✨ 2. Puxe o token da URL para dentro do componente
  const { token } = useParams(); 

  const userLogin = searchParams.get("login");
  const userCargo = searchParams.get("cargo");
  const userSetor = searchParams.get("setor");
  const userEmpresa = searchParams.get("empresa");
  const userJornada = searchParams.get("jornada");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-7xl min-h-[80vh] flex bg-white p-8 md:p-14 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 leading-tight">
              Bem-vindo ao Sistema Cuida+
            </h2>

            {userLogin && (
              <div className="bg-green-600 text-white p-6 rounded-2xl shadow-md border-l-8 border-yellow-400 animate-fade-in-down mt-2">
                <h3 className="text-2xl font-bold mb-2">Olá, {userLogin}!</h3>
                <p className="text-green-50 text-lg mb-4">
                  Sua conta corporativa foi configurada com sucesso. Confira
                  seus dados:
                </p>

                <div className="bg-green-700/50 p-5 rounded-xl grid grid-cols-2 gap-4 mb-4 border border-green-500/30">
                  <div>
                    <span className="block text-green-200 text-xs uppercase tracking-wider font-bold mb-1">
                      Cargo
                    </span>
                    <span className="font-semibold text-yellow-300 text-lg">
                      {userCargo}
                    </span>
                  </div>
                  <div>
                    <span className="block text-green-200 text-xs uppercase tracking-wider font-bold mb-1">
                      Setor
                    </span>
                    <span className="font-semibold text-white">
                      {userSetor}
                    </span>
                  </div>
                  <div>
                    <span className="block text-green-200 text-xs uppercase tracking-wider font-bold mb-1">
                      Empresa (CNPJ)
                    </span>
                    <span className="font-semibold text-white">
                      {userEmpresa}
                    </span>
                  </div>
                  <div>
                    <span className="block text-green-200 text-xs uppercase tracking-wider font-bold mb-1">
                      Jornada Semanal
                    </span>
                    <span className="font-semibold text-white">
                      {userJornada}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-green-100 font-medium">
                  Use sua senha temporária enviada pelo administrador para
                  acessar o sistema no botão abaixo.
                </p>
              </div>
            )}

            <div className="text-gray-600 text-lg md:text-xl leading-relaxed space-y-5 mt-2">
              <p>
                Assista ao vídeo ao lado para entender a importância da saúde
                mental no ambiente de trabalho e como o nosso mapeamento
                funciona.
              </p>

              <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 space-y-3">
                <h3 className="font-bold text-green-800 text-xl">
                  Por que a Saúde Mental é importante?
                </h3>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>
                    <strong>Ambiente Seguro:</strong> Identificamos riscos de
                    estresse e esgotamento.
                  </li>
                  <li>
                    <strong>Confidencialidade:</strong> Suas respostas são
                    sigilosas e focadas em melhorias.
                  </li>
                  <li>
                    <strong>Qualidade de Vida:</strong> Um clima organizacional
                    saudável reflete na sua vida pessoal.
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-2 italic">
                  * Tati: Aqui você pode expandir esse texto com as políticas
                  específicas da empresa ou mais detalhes sobre o programa.
                </p>
              </div>
            </div>

            <div className="flex justify-start mt-6">
              <button
                // ✨ 3. Agora o token existe e será repassado corretamente!
                onClick={() => navigate(`/questionario/${token}`)}
                className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                Começar Questionário
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center items-center w-full h-full">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl border-4 border-green-100">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/arUK3hEy6l8?si=vNZogxFVJUdw7HfR"
                title="Vídeo do YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoExemplo;