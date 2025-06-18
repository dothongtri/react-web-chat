import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useUnauthorizedHandler = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // ✅ lấy từ context

    return (status: number): boolean => {
        if (status === 401 || status === 403) {
            logout();
            navigate("/login", { replace: true });
            return true;
        }
        return false;
    };
};
