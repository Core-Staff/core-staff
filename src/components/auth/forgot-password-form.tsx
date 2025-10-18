import { Button } from "@/components/ui/button";
import { FormField } from "./form-field";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ForgotPasswordForm() {
  return (
    <form className="space-y-4">
      {/* Back to Login */}
      <Link
        href="/login"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      {/* Email Field */}
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="name@company.com"
        required
      />

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Send Reset Link
      </Button>

      {/* Additional Help */}
      <p className="text-center text-sm text-muted-foreground">
        Need help?{" "}
        <Link
          href="/support"
          className="font-medium text-primary hover:underline"
        >
          Contact support
        </Link>
      </p>
    </form>
  );
}
