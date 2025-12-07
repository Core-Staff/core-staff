import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="/brand/icon_color.svg"
            alt="Effeciency"
            width={64}
            height={64}
            className="dark:hidden"
            priority
          />
          <Image
            src="/brand/icon_white.svg"
            alt="Effeciency"
            width={64}
            height={64}
            className="hidden dark:block"
            priority
          />
          <h1 className="text-2xl font-bold">Effeciency</h1>
          <p className="text-sm text-muted-foreground">
            HR Management Platform
          </p>
        </div>

        {/* Auth Form Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
