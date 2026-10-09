import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Agar React Router hai: import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      // Token nahi hai -> Direct Login Page par bhejo
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;