import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Menu from "./components/Menu";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";

const Roles = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[Roles.User]} />}>
          <Route path="/" element={<Menu />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
