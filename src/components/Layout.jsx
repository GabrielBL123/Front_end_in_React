import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ backgroundColor: "#EDEEE8", colorScheme: "light" }}
    >
      <Outlet />
    </main>
  );
};

export default Layout;