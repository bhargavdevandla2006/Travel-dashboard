import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import url from "../services/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch(`${url}/profile`,
          {
            credentials: "include",
          }
        );

        setIsAuth(response.ok);
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