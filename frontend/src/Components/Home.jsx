import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FinanceHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
};

export default FinanceHome;
