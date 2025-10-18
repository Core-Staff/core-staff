import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./form-field";
import { SocialAuthButton } from "./social-auth-button";
import { AuthSeparator } from "./auth-separator";
import { Chrome, Github } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  return (
    <form className="space-y-4">
      {/* Social Sign Up Options */}
      <div className="grid gap-2">
        <SocialAuthButton
          provider="Google"
          icon={<Chrome className="mr-2 h-4 w-4" />}
        />
        <SocialAuthButton
          provider="GitHub"
          icon={<Github className="mr-2 h-4 w-4" />}
        />
      </div>

      <AuthSeparator />

      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="John"
          required
        />
        <FormField id="lastName" label="Last Name" placeholder="Doe" required />
      </div>

      {/* Email Field */}
      <FormField
        id="email"
        label="Work Email"
        type="email"
        placeholder="name@company.com"
        required
      />

      {/* Company Field */}
      <FormField
        id="company"
        label="Company Name"
        placeholder="Acme Inc."
        required
      />

      {/* Password Field */}
      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
      />

      {/* Confirm Password Field */}
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        required
      />

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" required />
        <label
          htmlFor="terms"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Create Account
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
