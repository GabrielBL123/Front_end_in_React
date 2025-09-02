import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import "../tailwind.css";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [emial, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit } = useForm();

  function handleSingIn(data) {
    console.log(data);
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center font-mono 
        bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 via-50% to-sky-500 to-100%"
    >
      <form
        onSubmit={handleSubmit(handleSingIn)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <input type="hidden" name="remember" defaultValue={true} />
        <div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address:
            </label>
            <input
              {...register("email")}
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              required
              onChange={(e) => setUser(e.target.value)}
              value={emial}
            />

            <div>
              <label htmlFor="password" className="">
                Password:
              </label>
              <input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
              />
            </div>

            <div>
              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Sign in
              </button>
            </div>
            <p>
              Need an Account?
              <br />
              <span className="line">
                {/*put router link here*/}
                <a href="#">Sign Up</a>
              </span>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;
