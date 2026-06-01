import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../tailwind.css";
import { useParams, useNavigate } from "react-router-dom";

const AvaliacaoDetalhe = () => {
  const { avaliacaoId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [avaliacao, setAvaliacao] = useState(null);
  const [formData, setFormData] = useState({
    competencia: "",
    isActive: false,
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  

  useEffect(() => {
    buscarAvaliacao();
  }, [avaliacaoId]);

  const buscarAvaliacao = async () => {
    try {
      const response = await axios.get(`/avaliacoes-mensais/${avaliacaoId}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
        withCredentials: true,
      });
      const { data } = response.data?.data || response.data;
      setAvaliacao(data);
    } catch (err) {
      console.error("Erro ao buscar avaliação", err);
    }
  };

  return (
    <div class="w-full max-w-6xl bg-white p-8 md:p-14 rounded-3xl shadow-2xl my-8 mx-auto"></div>
  );
};

export default AvaliacaoDetalhe;
