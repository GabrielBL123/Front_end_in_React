import axios from "axios";
const BASE_URL = "http://localhost:8080/"; //base para nao repetir

export default axios.create({
  //base criada
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  //quando for usar cookies,para manter usuario logado
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
