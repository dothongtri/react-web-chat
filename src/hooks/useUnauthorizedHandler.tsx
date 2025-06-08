import { useNavigate } from "react-router-dom";

export const useUnauthorizedHandler = () => {
  const navigate = useNavigate();

  return (status: number): boolean => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true });
      return true;
    }
    return false;
  };
};
