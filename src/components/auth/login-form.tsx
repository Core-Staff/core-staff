import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "./form-field";
import { SocialAuthButton } from "./social-auth-button";
import { AuthSeparator } from "./auth-separator";
import { Chrome, Github } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  return (
    <form className="space-y-4">
      {/* Social Login Options */}
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

      {/* Email Field */}
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="name@company.com"
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Sign In
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
