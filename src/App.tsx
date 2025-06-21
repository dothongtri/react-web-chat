// App.jsx
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/LoginForm";
import Home from "./pages/Home";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅
import { LoadingProvider } from "./context/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";

function AppRoutes() {
  const { token } = useAuth(); // ✅ lấy từ context

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={token ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/home" /> : <Login />}
      />

      {/* Private route */}
      <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />

      {/* Default route */}
      <Route path="*" element={<Navigate to={token ? "/home" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <LoadingProvider> {/* ✅ Bọc ngoài cùng */}
      <AuthProvider> {/* ✅ Bọc tiếp theo */}
        <Router>
          <LoadingOverlay /> {/* ✅ Đặt ở đây để overlay luôn lắng nghe global loading */}
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LoadingProvider>
  );
}


export default App;
