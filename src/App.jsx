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
import Cadastrofuncionarios from "./components/CadastroFuncionarios";
import CadastroRH from "./components/CadastroRH";
import CriaSetores from "./components/CriaSetores";
import Status from "./components/Status";
import CriaQuestionario from "./components/CriaQuestionario";

import AvaliacoesMensais from "./components/AvaliacoesMensais";
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

        <Route index element={<HomeScreen />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/*///////////////////////////////////ADMIN E RH//////////////////////////////////////////////////*/}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh, Roles.Admin]} />}>
          <Route path="CadastroFuncionarios" element={<Cadastrofuncionarios />} />
          <Route path="cadastro-rh" element={<CadastroRH />} />
          <Route path="ver-empresas" element={<VerEmpresas />} />
          <Route path="users" element={<Users />} />
          <Route path="status" element={<Status />} />
          <Route path="criar-avaliacoes" element={<CriaQuestionario />} />
          <Route path="avaliacoes" element={<AvaliacoesMensais />} />
          <Route path="menu" element={<Menu />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        {/* ///////////////////////////////RH///////////////////////////////////////////////// */}
        <Route element={<RequireAuth allowedRoles={[Roles.Rh]} />}>
          <Route path="criar-setores" element={<CriaSetores />} />
        </Route>
              
        {/* ///////////////////////////////FUNCIONÁRIO///////////////////////////////////////////////// */}
        <Route element={<RequireAuth allowedRoles={[Roles.User]} />}>
          <Route path="questionario" element={<Questionario />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;