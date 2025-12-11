import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Menu from "./components/Menu";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Users from "./components/Users";

const Roles = {
  User: "USER",
  Editor: "1984",
  Admin: "ADMIN",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes for USER */}
        <Route element={<RequireAuth allowedRoles={[Roles.User]} />}>
          <Route path="menu" element={<Menu />} />
        </Route>
        {/* protected routes for ADMIN */}
        <Route element={<RequireAuth allowedRoles={[Roles.Admin]} />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
