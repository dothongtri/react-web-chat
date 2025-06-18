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
    <AuthProvider> {/* ✅ Bọc app bằng context */}
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
