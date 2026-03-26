import { Navigate, useNavigate } from "react-router-dom";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useAuth } from "@/contexts/auth/useAuth";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboarded, completeOnboarding } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isOnboarded) return <Navigate to="/dashboard" replace />;

  const handleComplete = () => {
    completeOnboarding();
    navigate("/dashboard", { replace: true });
  };

  return <OnboardingWizard onComplete={handleComplete} />;
}
