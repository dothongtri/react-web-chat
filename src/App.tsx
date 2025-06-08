// App.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/LoginForm";
import "./index.css";
import Home from "./pages/Home";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
      setToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={token ? <Navigate to="/home" /> : <Login setToken={setToken} />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/home" /> : <Login setToken={setToken} />}
        />

        {/* Private route */}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
