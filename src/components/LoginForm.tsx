import { GoogleLogin } from "@react-oauth/google";
import telegramLogo from "../assets/256px-Telegram_2019_Logo.svg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";

interface CredentialResponse {
    credential?: string;
    select_by?: string;
    clientId?: string;
}

interface LoginData {
    email: string;
    password: string;
}

// interface LoginProps {
//     setToken: (token: string) => void;
// }

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {loading, setLoading} = useLoading();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginWithGoogle = async (
        credentialResponse: CredentialResponse
    ) => {
        if (!credentialResponse?.credential) {
            setError("Invalid Google login response");
            return;
        }

        const idToken = credentialResponse.credential;

        try {
            setLoading(true);
            setError("");

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            if (!res.ok) {
                throw new Error(`Google Auth failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log(data);
            login(data.token, data.user); // 👈 lưu vào context + localStorage
            // localStorage.setItem("accessToken", data.token);
            //setToken(data.token); // Update token in parent component
            navigate("/home", { replace: true });
        } catch (error) {
            console.error("Google login error:", error);
            setError(
                error instanceof Error ? error.message : "Google login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async ({ email, password }: LoginData) => {
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `Login failed with status ${res.status}`
                );
            }

            const data = await res.json();
            localStorage.setItem("accessToken", data.token);
            login(data.token, data.user); // 👈 lưu vào context + localStorage
            //setToken(data.token); // Update token in parent component
            // connectWebSocket(data.token); // Kết nối WebSocket với token
            navigate("/home", { replace: true });
        } catch (error) {
            console.error("Email login error:", error);
            setError(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginWithEmail({ email, password });
    };

    // const connectWebSocket = (token: string) => {
    //     // Tạo STOMP client
    //     const client = new Client({
    //         brokerURL: "ws://localhost:8080/ws-chat",
    //         connectHeaders: {
    //             Authorization: "Bearer " + token, // Gửi JWT tại đây
    //         },
    //         onConnect: () => {
    //             console.log("Đã kết nối WebSocket");
    //             // Gọi subscribe, gửi message, v.v...
    //         },
    //     });

    //     client.activate(); // ✅ Gọi khi cần kết nối WebSocket
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-sm text-center">
                <img
                    src={telegramLogo}
                    alt="Telegram"
                    className="w-16 h-16 mx-auto mb-6"
                />
                <h2 className="text-2xl font-semibold mb-2">Telegram</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Please confirm your email and enter your password.
                </p>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            Your email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            Your password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="checkbox"
                            id="keep-signed-in"
                            className="h-4 w-4"
                            defaultChecked
                            disabled={loading}
                        />
                        <label
                            htmlFor="keep-signed-in"
                            className="text-sm text-gray-600"
                        >
                            Keep me signed in
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white rounded-lg py-2 mt-4 hover:bg-blue-600 transition-colors ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6">
                    <GoogleLogin
                        onSuccess={handleLoginWithGoogle}
                        onError={() => {
                            setError("Google login failed");
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
