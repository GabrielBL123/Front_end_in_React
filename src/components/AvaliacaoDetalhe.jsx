import navigate from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import "../tailwind.css";

const AvaliacaoDetalhe = () => {
  const [avaliacao, setAvaliacao] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const buscarAvaliacao = async (id) => {};

  return <div className="container mx-auto p-4">/</div>;
};
