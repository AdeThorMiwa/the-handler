import { Navigate, useNavigate } from "react-router-dom";
import LoginCard from "@/components/auth/LoginCard";
import { useAuth } from "@/contexts/auth/useAuth";

export default function LoginPage() {
  const { isAuthenticated, isOnboarded, login } = useAuth();
  const navigate = useNavigate();

  // Already authenticated – skip login
  if (isAuthenticated) {
    return <Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} replace />;
  }

  const handleSuccess = () => {
    login();
    navigate("/onboarding");
  };

  return <LoginCard onSuccess={handleSuccess} />;
}
