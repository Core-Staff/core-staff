import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface SocialAuthButtonProps {
  provider: string;
  icon?: React.ReactNode;
}

export function SocialAuthButton({ provider, icon }: SocialAuthButtonProps) {
  return (
    <Button variant="outline" className="w-full" type="button">
      {icon || <Chrome className="mr-2 h-4 w-4" />}
      Continue with {provider}
    </Button>
  );
}
