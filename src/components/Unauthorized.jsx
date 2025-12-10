import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="mb-4">You do not have access to the requested page.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="text-blue-600 underline">
            Home
          </Link>
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
