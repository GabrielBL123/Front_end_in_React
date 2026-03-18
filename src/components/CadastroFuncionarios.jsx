import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SEND_MAIL_URL = "/auth/enviar_link_email";

const CadastroFuncionarios = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef();
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = JSON.stringify({ email: email });

      await axios.post(SEND_MAIL_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.accessToken}`, // Perfeito, o RH precisa estar logado!
        },
      });

      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sem resposta do servidor.");
      } else if (err.response?.status === 409) {
        setErrMsg("E-mail já cadastrado.");
      } else if (err.response?.status === 400) {
        setErrMsg("Erro 400");
      } else if (err.response?.status === 403) {
        setErrMsg("Você não tem permissão para convidar funcionários.");
      } else {
        setErrMsg("Falha ao enviar o convite.");
      }
    }
  };

  const resetForm = () => {
    setSuccess(false);
  };

  return (
    <>
      {success ? (
        <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl my-8 text-center mx-auto">
          <h1 className="text-4xl font-extrabold text-green-700 mb-6">
            Convite Enviado!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            O link de acesso para o sistema foi enviado para <b>{email}</b>.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-green-100 hover:bg-green-200 text-green-800 text-lg font-bold rounded-lg shadow-sm transition-all border border-green-300"
            >
              Convidar Outro
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-lg font-bold rounded-lg shadow-md transition-all"
            >
              Voltar ao Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white p-10 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto">
          <div className="flex items-center justify-between mb-8 border-b-2 border-green-100 pb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-700">
              Convidar Funcionário
            </h2>
          </div>

          <p className="text-gray-600 mb-6 text-lg">
            Digite o e-mail do funcionário. Enviaremos um link
          </p>

          <p
            className={
              errMsg
                ? "block w-full bg-red-100 border border-red-300 text-red-700 font-bold p-4 rounded-lg text-center mb-6"
                : "hidden"
            }
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-semibold text-gray-700 text-lg"
              >
                E-mail do Funcionário:
              </label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Ex: joao@empresa.com.br"
                className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg shadow-md transition-all"
              >
                Enviar Link de Acesso
              </button>
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-bold rounded-lg transition-all border border-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CadastroFuncionarios;
