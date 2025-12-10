import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main
      className="App min-h-screen flex items-center justify-center font-mono 
        bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100%"
    >
      <Outlet />
    </main>
  );
};

export default Layout;
