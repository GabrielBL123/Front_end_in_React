import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const Menu = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // Rota da Home Screen
  const ROTA_HOME_SCREEN = "/home";

  // Apenas RH pode acessar
  const isRH =
    auth?.roles?.includes("RH") ||
    auth?.roles?.includes("ROLE_RH") ||
    auth?.role === "RH" ||
    auth?.role === "ROLE_RH";

  const isAdmin =
    auth?.roles?.includes("ADMIN") ||
    auth?.roles?.includes("ROLE_ADMIN") ||
    auth?.role === "ADMIN" ||
    auth?.role === "ROLE_ADMIN";

  const handleLogout = () => {
    setAuth({});
    try {
      // Clear the refresh token cookie by making a request to the logout endpoint
      axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
    navigate("/login", { replace: true });
  };

  const fontStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap');
      .psy-shell { font-family: 'Public Sans', system-ui, sans-serif; }
      .psy-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      .psy-logout {
        background-color: rgba(201,123,107,0.1);
        color: #8a3e31;
        border: 1px solid rgba(201,123,107,0.35);
      }
      .psy-logout:hover { background-color: rgba(201,123,107,0.18); }
    `}</style>
  );

  if (isAdmin) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        {fontStyles}
        <div
          className="psy-shell w-full max-w-6xl p-8 md:p-14 rounded-3xl"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div
            className="flex flex-col md:flex-row justify-between items-center mb-12 pb-6 gap-4"
            style={{ borderBottom: "2px solid #E4E1D3" }}
          >
            <div>
              <p
                className="text-xs tracking-[0.25em] uppercase font-medium mb-1"
                style={{ color: "#5C7D63" }}
              >
                Painel administrativo
              </p>
              <h1
                className="psy-display text-4xl md:text-5xl"
                style={{ color: "#1F2A27" }}
              >
                Menu Principal
              </h1>

              <p className="text-lg mt-2" style={{ color: "#6B7570" }}>
                Bem-vindo(a),{" "}
                <span className="font-semibold" style={{ color: "#1E3835" }}>
                  {auth?.user || "Admin"}
                </span>
                .
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="psy-logout px-6 py-3 font-semibold rounded-lg transition-colors"
            >
              Sair da Conta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MenuCard
              title="Criar Empresa e RH"
              description="Cadastre e gerencie empresas e usuários RH."
              icon="👤"
              onClick={() => navigate("/cadastro-rh")}
            />

            <MenuCard
              title="Ver Empresas"
              description="Acesse a lista de empresas cadastradas"
              icon="📋"
              onClick={() => navigate("/ver-empresas")}
            />

            <MenuCard
              title="Criar/Ver Avaliações"
              description="Cadastre e gerencie as avaliações da empresa."
              icon="🏢"
              onClick={() => navigate("/criar-avaliacao")}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isRH) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        {fontStyles}
        <div
          className="psy-shell w-full max-w-6xl p-8 md:p-14 rounded-3xl"
          style={{
            backgroundColor: "#FCFBF7",
            boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
            border: "1px solid #DCD9CC",
          }}
        >
          <div
            className="flex flex-col md:flex-row justify-between items-center mb-12 pb-6 gap-4"
            style={{ borderBottom: "2px solid #E4E1D3" }}
          >
            <div>
              <p
                className="text-xs tracking-[0.25em] uppercase font-medium mb-1"
                style={{ color: "#5C7D63" }}
              >
                Recursos Humanos
              </p>
              <h1
                className="psy-display text-4xl md:text-5xl"
                style={{ color: "#1F2A27" }}
              >
                Menu Principal
              </h1>

              <p className="text-lg mt-2" style={{ color: "#6B7570" }}>
                Bem-vindo(a),{" "}
                <span className="font-semibold" style={{ color: "#1E3835" }}>
                  {auth?.user || "RH"}
                </span>
                .
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="psy-logout px-6 py-3 font-semibold rounded-lg transition-colors"
            >
              Sair da Conta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MenuCard
              title="Ver Perfil e Empresa"
              description="Veja e edite suas informações pessoais."
              icon="👤"
              onClick={() => navigate("/perfil")}
            />

            <MenuCard
              title="Criar Setores"
              description="Cadastre e gerencie os setores da empresa."
              icon="🏢"
              onClick={() => navigate("/criar-setores")}
              disabled={auth?.avaliacaoAtivaId != null}
            />

            {/* MenuCard for "Ver Avaliação" is only shown if the user is RH and has access */}

            <MenuCard
              title="Ver Avaliação"
              description="Acesse a lista e os detalhes da avaliação."
              icon="📊"
              onClick={() => navigate(`/avaliacoes/${auth?.avaliacaoAtivaId}`)}
              disabled={auth?.avaliacaoAtivaId == null}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 md:p-8">
      {fontStyles}
      <div
        className="psy-shell w-full max-w-3xl p-8 rounded-3xl text-center"
        style={{
          backgroundColor: "#FCFBF7",
          boxShadow: "0 30px 60px -25px rgba(24,42,40,0.35)",
          border: "1px solid #DCD9CC",
        }}
      >
        <h1 className="psy-display text-3xl" style={{ color: "#8A3E31" }}>
          Acesso não autorizado
        </h1>

        <p className="mt-3" style={{ color: "#6B7570" }}>
          Apenas usuários do RH ou Administradores podem acessar este menu.
        </p>

        <button
          onClick={handleLogout}
          className="psy-logout mt-6 px-6 py-3 font-semibold rounded-lg transition-colors"
        >
          Voltar para Login
        </button>
      </div>
    </div>
  );
};

const MenuCard = ({ title, description, icon, onClick, disabled, copied }) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`psy-shell group rounded-2xl p-8 transition-all duration-300 flex flex-col items-start relative overflow-hidden ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:-translate-y-2"
      }`}
      style={{
        backgroundColor: disabled ? "#9A9C93" : undefined,
        background: !disabled
          ? copied
            ? "linear-gradient(135deg, #6E8F76, #4E6B56)"
            : "linear-gradient(135deg, #1E3835, #152826)"
          : undefined,
        boxShadow: disabled
          ? "0 10px 20px -10px rgba(24,42,40,0.25)"
          : "0 15px 30px -12px rgba(21,40,38,0.45)",
      }}
    >
      <span
        className="absolute top-4 right-4 text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full"
        style={{ backgroundColor: "#C7A76B", color: "#1F2A27" }}
      >
        RH
      </span>

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform backdrop-blur-sm text-3xl ${
          !disabled ? "group-hover:scale-110" : ""
        }`}
        style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#F3F1E9" }}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-semibold mb-2" style={{ color: "#F3F1E9" }}>
        {title}
      </h3>

      <p className="leading-relaxed" style={{ color: "#D9D6C8" }}>
        {description}
      </p>

      {disabled && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <p className="font-semibold text-sm" style={{ color: "#F3F1E9" }}>
            Indisponível, avalição ativa.
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
