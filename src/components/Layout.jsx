import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 font-mono bg-gradient-to-br from-green-50 to-green-100">
      <Outlet />
    </main>
  );
};

export default Layout;
