import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#e91e8c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px"
    }}>
      <img
        src="/logo.png"
        alt="logo"
        style={{ width: "80px", height: "80px", objectFit: "contain" }}
      />
      <span style={{
        color: "white",
        fontSize: "1.6rem",
        fontWeight: 700,
        letterSpacing: "-0.5px"
      }}>
        foodpanda
      </span>
    </div>
  );
}
