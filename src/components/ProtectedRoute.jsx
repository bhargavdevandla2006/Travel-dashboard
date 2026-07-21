import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../services/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const data = await getProfile();
        setIsAuth(Boolean(data));
      } catch {
        setIsAuth(false);
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}