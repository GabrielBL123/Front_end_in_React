import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post("/auth/refresh");
    const payload = response?.data?.data || response?.data;
    const newAccessToken = payload?.accessToken;

    setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
    return newAccessToken;
  };

  return refresh;
};

export default useRefreshToken;
