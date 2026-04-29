import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { axiosPrivate } from "../api/axios";

const CompanyForm = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cnpj: "",
    nome: "",
    email: "",
    telefone: "",
  });

  const [msgErro, setMsgErro] = useState("");

  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgErro("");

    try {
      await axiosPrivate.post(
        "auth/registrar_empresa",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        },
      );

      setSucesso(true);

      setTimeout(() => {
        navigate("/menu", { replace: true });
      }, 3000);
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        setMsgErro("Servidor não respondeu. Verifique sua conexão.");
      } else if (err.response?.status === 400) {
        setMsgErro(
          "Esta empresa já está cadastrada ou os dados são inválidos!",
        );
      } else if (err.response?.status === 403) {
        setMsgErro(
          "Você não tem permissão de Administrador para cadastrar empresas.",
        );
      } else {
        setMsgErro("Falha ao cadastrar empresa. Verifique os dados.");
      }
    }
  };

  return (
    <>
      {sucesso ? (
        <div className="w-full max-w-2xl bg-white p-12 rounded-3xl shadow-2xl my-8 text-center animate-pulse">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-green-700 mb-4">
            Sucesso!
          </h1>
          <p className="text-xl text-gray-700">
            A empresa <strong>{formData.nome}</strong> foi cadastrada com
            sucesso.
          </p>
          <p className="text-sm text-gray-400 mt-8">
            Redirecionando de volta ao Menu Principal
          </p>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white p-10 md:p-14 rounded-3xl shadow-2xl my-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-green-700">
              Cadastro de Empresa
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Registre uma nova filial ou unidade no sistema.
            </p>
          </div>

          {msgErro && (
            <p className="block w-full bg-red-100 border border-red-300 text-red-700 font-bold p-4 rounded-lg text-center mb-6">
              {msgErro}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cnpj"
                className="font-semibold text-gray-700 text-lg"
              >
                CNPJ:
              </label>
              <input
                id="cnpj"
                type="text"
                name="cnpj"
                placeholder="Ex: 00.000.000/0001-00"
                value={formData.cnpj}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="nome"
                className="font-semibold text-gray-700 text-lg"
              >
                Razão Social (Nome):
              </label>
              <input
                id="nome"
                type="text"
                name="nome"
                placeholder="Nome oficial da empresa"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  E-mail de Contato:
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="contato@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="telefone"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Telefone:
                </label>
                <input
                  id="telefone"
                  type="tel"
                  name="telefone"
                  placeholder="(00) 0000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="w-full md:w-1/3 py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-lg transition-all duration-300"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="w-full md:w-2/3 py-4 px-6 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                Cadastrar Empresa
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CompanyForm;
