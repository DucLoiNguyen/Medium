import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading_spinner from "~/components/partial/Loading_spinner/loading_spinner.component";
import axios from "axios";

function CheckAuthenticate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3030/api/auth/check-auth", { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Lỗi kiểm tra xác thực:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading_spinner />;
  }

  console.log(isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default CheckAuthenticate;