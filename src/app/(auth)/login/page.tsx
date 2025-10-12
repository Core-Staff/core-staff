import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Core Staff account to continue"
    >
      <LoginForm />
    </AuthCard>
  );
}
