import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Menu = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [linkCopiado, setLinkCopiado] = useState(false);

  // Rota da Home Screen
  const ROTA_HOME_SCREEN = "/home";

  // Apenas RH pode acessar
  const isRH =
    auth?.roles?.includes("RH") ||
    auth?.roles?.includes("ROLE_RH") ||
    auth?.role === "RH" ||
    auth?.role === "ROLE_RH";

  const handleLogout = () => {
    setAuth({});
    navigate("/login", { replace: true });
  };

  const handleCopiarLink = () => {
    const linkHomeScreen = `${window.location.origin}${ROTA_HOME_SCREEN}`;

    navigator.clipboard
      .writeText(linkHomeScreen)
      .then(() => {
        setLinkCopiado(true);
        setTimeout(() => setLinkCopiado(false), 3000);
      })
      .catch((err) => {
        console.error("Erro ao copiar o link: ", err);
      });
  };

  if (!isRH) {
    return (
      <div className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-2xl my-8 mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Acesso não autorizado
        </h1>

        <p className="text-gray-500 mt-3">
          Apenas usuários do RH podem acessar este menu.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
        >
          Voltar para Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-green-100 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
            Menu Principal
          </h1>

          <p className="text-xl text-gray-500 mt-2">
            Bem-vindo(a),{" "}
            <span className="font-bold text-green-600">
              {auth?.user || "RH"}
            </span>
            .
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
        >
          Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MenuCard
          title="Ver Perfil"
          description="Veja e edite suas informações pessoais."
          icon="👤"
          onClick={() => navigate("/perfil")}
        />

        <MenuCard
          title="Questionário"
          description="Acesse o questionário de avaliação."
          icon="📋"
          onClick={() => navigate("/questionario")}
        />

        <MenuCard
          title="Criar Setores"
          description="Cadastre e gerencie os setores da empresa."
          icon="🏢"
          onClick={() => navigate("/criar-setores")}
        />

        <MenuCard
          title="Status de Resposta"
          description="Veja o andamento das respostas dos funcionários."
          icon="📊"
          onClick={() => navigate("/status")}
        />

        <MenuCard
          title={linkCopiado ? "Link Copiado! ✅" : "Enviar Link"}
          description={
            linkCopiado
              ? "Agora é só colar no WhatsApp ou E-mail."
              : "Copiar link da Home Screen para enviar aos funcionários."
          }
          icon="🔗"
          onClick={handleCopiarLink}
          copied={linkCopiado}
        />
      </div>
    </div>
  );
};

const MenuCard = ({ title, description, icon, onClick, copied }) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-start relative overflow-hidden ${
        copied
          ? "bg-green-500 hover:shadow-green-500/30"
          : "bg-gradient-to-br from-green-600 to-green-800 hover:shadow-green-900/30"
      }`}
    >
      <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full">
        RH
      </span>

      <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm text-3xl">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>

      <p className="text-green-50 leading-relaxed">{description}</p>
    </div>
  );
};

export default Menu;