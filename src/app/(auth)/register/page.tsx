import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Get started with Core Staff and streamline your HR operations"
    >
      <RegisterForm />
    </AuthCard>
  );
}
