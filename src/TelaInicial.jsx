import "./index.css";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit } = useForm();

  function handleSingIn(data) {
    console.log(data);
  }
  return (
    <section
      className="min-h-screen flex items-center justify-center font-mono 
      bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100%"
    >
      <div className="flex shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2x1 rounded-2xl">
          <h1 className="text-5xl font-bold">welcome</h1>

          <div
            className="flex flex-col text-2x1 text-left gap-1"
            onSubmit={handleSubmit(handleSingIn())}
          >
            <span>Username</span>
            <input
              type="text"
              className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
            />
          </div>
          <div className="flex flex-col text-2x1 text-left gap-1">
            <span>Password</span>
            <input
              type="password"
              className="rounded-md p-1 border-2 outline-none focus:border-cyan-400 focus:bg-slate-50"
            />
          </div>
          <div>
            <button
              type="submit"
              className="
              px-10 py-2 text-2xl rounded-md bg-gradient-to-tr from-green-400 to-blue-500
              hover:from-pink-500hover:to-yellow-500 text-white"
            >
              Login
            </button>

            <p className="font-semibold">
              <br /> Don't have an account?
              <a href="#" className="text-blue-400 hover:underline">
                <br />
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
