import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import Connect from "./connect";

const AuthenticationIndex = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useMoralis();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isInitialized && !isAuthenticated && pathname === "/") {
      navigate("/connect");
    }
  }, [pathname, navigate, isAuthenticated, isInitialized]);

  return (
    <Routes>
      <Route path="/connect" element={<Connect />} />
    </Routes>
  );
};

export default AuthenticationIndex;
