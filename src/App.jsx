import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Menu from "./components/Menu";

import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Users from "./components/Users";
import CompanyForm from "./components/CompanyForm";
import Perfil from "./components/Perfil";
import Questionario from "./components/Questionario";
import HomeScreen from "./components/HomeScreen";
import Cadastrofuncionarios from "./components/CadastroFuncionarios";
import CadastroRH from "./components/CadastroRH";
import CriaSetores from "./components/CriaSetores";
import Status from "./components/Status";
import CriaQuestionario from "./components/CriaQuestionario";
import TelaAdmin from "./components/TelaAdmin";
import AvaliacoesMensais from "./components/AvaliacoesMensais";

const Roles = {
  User: "USER",
  Owner: "OWNER",
  Admin: "ADMIN",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* =========================================
            ROTAS PÚBLICAS (Acesso livre para testes)
            ========================================= */}
        <Route index element={<TelaAdmin />} />
        <Route path="home" element={<HomeScreen />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* MOVEMOS PARA CÁ: Agora você pode clicar no botão da TelaAdmin e entrar aqui direto */}
        <Route path="cadastro-rh" element={<CadastroRH />} />

        <Route
          element={<RequireAuth allowedRoles={[Roles.Owner, Roles.Admin]} />}
        >
          <Route
            path="CadastroFuncionarios"
            element={<Cadastrofuncionarios />}
          />
          <Route path="empresa" element={<CompanyForm />} />
          <Route path="users" element={<Users />} />
          <Route path="criar-setores" element={<CriaSetores />} />
          <Route path="status" element={<Status />} />
          <Route path="cria-questionario" element={<CriaQuestionario />} />
          <Route path="/avaliacoes" element={<AvaliacoesMensais />} />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={[Roles.User, Roles.Admin, Roles.Owner]}
            />
          }
        >
          <Route path="menu" element={<Menu />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="questionario" element={<Questionario />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
