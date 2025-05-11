import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ContainerId() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("logs", { replace: true });
  }, [navigate]);

  return null;
}
