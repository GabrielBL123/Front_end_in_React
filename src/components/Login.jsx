import { useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
const LOGIN_URL = "/auth/login";
import "../tailwind.css";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/menu";

  // const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg /*setErrMsg*/] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ login: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles || [];
      setAuth({ user, pwd, roles, accessToken });

      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      /*
      if (err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
      */
    }
  };
  // ---------------------------------------------

  return (
    <section>
      <p ref={errRef} className="text-red-500" aria-live="assertive">
        {errMsg}
      </p>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="remember" defaultValue={true} />
        <div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email address:
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300  rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              required
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />

            <div>
              <label htmlFor="password" className="block text-sm font-medium ">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-300  rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                <a href="/register">Sign Up</a>
              </span>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Login;
