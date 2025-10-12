import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="We'll send you instructions to reset your password"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
