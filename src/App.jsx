import { Routes, Route } from "react-router-dom";
// Remova a importação do Layout:
// import Layout from "./components/Layout";
import Login from "./components/Login";
import Menu from "./components/Menu";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Users from "./components/Users";
import Perfil from "./components/Perfil";
import Questionario from "./components/Questionario";
import HomeScreen from "./components/HomeScreen";
import Cadastrofuncionarios from "./components/CadastroFuncionarios";
import CadastroRH from "./components/CadastroRH";
import CriaSetores from "./components/CriaSetores";
import Status from "./components/Status";
import CriarAvaliacao from "./components/CriarAvaliacao";
import AvaliacaoDetalhe from "./components/AvaliacaoDetalhe";
import VerEmpresas from "./components/VerEmpresas";
import ListarAvaliacoesRH from "./components/ListarAvaliacoesRH";

const Roles = {
  User: "ROLE_USER",
  Rh: "ROLE_RH",
  Admin: "ROLE_ADMIN",
};

function App() {
  return (
    // 👇 ESTA DIV SUBSTITUI O LAYOUT PARA NÃO QUEBRAR A FORMATAÇÃO 👇
    // (Se o seu Layout tinha uma cor de fundo específica, coloque aqui)
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Routes>
        <Route path="/" element={<Login />} />

        {/* =========================================
            ROTAS PÚBLICAS (Acesso livre)
            ========================================= */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="home-screen/:token" element={<HomeScreen />} />
        <Route path="questionario/:token" element={<Questionario />} />

        {/* ///////////////////////////////////ADMIN E RH////////////////////////////////////////////////// */}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh, Roles.Admin]} />}>
          <Route
            path="cadastro-funcionarios"
            element={<Cadastrofuncionarios />}
          />
          <Route path="cadastro-rh" element={<CadastroRH />} />
          <Route path="ver-empresas" element={<VerEmpresas />} />
          <Route path="users" element={<Users />} />
          <Route path="status" element={<Status />} />
          <Route
            path="avaliacoes/:avaliacaoId"
            element={<AvaliacaoDetalhe />}
          />
          <Route path="menu" element={<Menu />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="avaliacoes" element={<ListarAvaliacoesRH />} />
        </Route>

        {/* ///////////////////////////////ADMIN/////////////////////////////////////////////////  */}
        <Route element={<RequireAuth allowedRoles={[Roles.Admin]} />}>
          <Route path="criar-avaliacao" element={<CriarAvaliacao />} />
        </Route>

        {/* ///////////////////////////////RH///////////////////////////////////////////////// */}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh]} />}>
          <Route path="criar-setores" element={<CriaSetores />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
