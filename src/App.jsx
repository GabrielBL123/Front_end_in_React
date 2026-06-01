import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Menu from "./components/Menu";

import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Users from "./components/Users";
import Perfil from "./components/Perfil";
import Questionario from "./components/Questionario";
import HomeScreen from "./components/HomeScreen";
// ✨ CORREÇÃO 1: Faltava importar o Cadastro de Funcionários!
import Cadastrofuncionarios from "./components/CadastroFuncionarios"; 
import CadastroRH from "./components/CadastroRH";
import CriaSetores from "./components/CriaSetores";
import Status from "./components/Status";
import CriarAvaliacao from "./components/CriarAvaliacao";
import AvaliacaoDetalhe from "./components/AvaliacaoDetalhe";
import VerEmpresas from "./components/VerEmpresas";

const Roles = {
  User: "USER",
  Rh: "RH",
  Admin: "ADMIN",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* =========================================
            ROTAS PÚBLICAS (Acesso livre para testes)
            ========================================= */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="home-screen/:token" element={<HomeScreen />} />
        <Route path="questionario/:token" element={<Questionario />} />

        {/*///////////////////////////////////ADMIN E RH//////////////////////////////////////////////////*/}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh, Roles.Admin]} />}>
          <Route
            path="CadastroFuncionarios"
            element={<Cadastrofuncionarios />}
          />
          <Route path="cadastro-rh" element={<CadastroRH />} />
          <Route path="ver-empresas" element={<VerEmpresas />} />
          <Route path="users" element={<Users />} />
          <Route path="status" element={<Status />} />

          <Route path="avaliacoes/:id" element={<AvaliacaoDetalhe />} />
          <Route path="menu" element={<Menu />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        {/* ///////////////////////////////ADMIN/////////////////////////////////////////////////  */}
        <Route element={<RequireAuth allowedRoles={[Roles.Admin]} />}>
          <Route path="criar-avaliacao" element={<CriarAvaliacao />} />
        </Route>

        {/* ///////////////////////////////RH///////////////////////////////////////////////// */}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh]} />}>
          <Route path="criar-setores" element={<CriaSetores />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;