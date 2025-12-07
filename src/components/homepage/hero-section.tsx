"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, BarChart3, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/8 blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-accent/8 blur-3xl opacity-60 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 h-60 w-60 rounded-full bg-secondary/5 blur-3xl opacity-40" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6">
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
        </div>
        {/* Animated top badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-1.5 backdrop-blur-md shadow-lg hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group">
          <Sparkles className="h-3.5 w-3.5 text-primary group-hover:animate-spin" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome to Effeciency
          </span>
        </div>

        {/* Main Heading with better styling */}
        <div className="w-full max-w-4xl space-y-8 text-center">
          <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl md:text-8xl leading-tight">
            Modern HR Management,
            <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
              Simplified
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Streamline employee management, leave requests, and analytics all in
            one powerful platform designed for modern teams.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4 pt-6">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all group"
              >
                Sign In
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group"
              >
                Create Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/leave-request">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group"
              >
                → Submit Leave Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          <FeatureCard
            icon={Users}
            title="Employee Management"
            description="Manage employee data, profiles, and organizational structure effortlessly"
          />
          <FeatureCard
            icon={Calendar}
            title="Leave Management"
            description="Streamlined leave request workflow with easy approval and tracking"
          />
          <FeatureCard
            icon={BarChart3}
            title="Analytics"
            description="Comprehensive insights into workforce metrics and performance data"
          />
        </div>

        {/* Secondary CTA with better styling */}
        <div className="mt-24 text-center max-w-2xl">
          <p className="mb-6 text-sm text-muted-foreground font-semibold uppercase tracking-widest">
            Explore the platform
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/reports">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                View Analytics Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-primary/25 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur" />

      {/* Card background with enhanced gradient */}
      <div className="relative bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl border border-border/40 rounded-2xl p-8 h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-2xl">
        {/* Inner gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex w-fit rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-4 group-hover:from-primary/40 group-hover:via-primary/30 group-hover:to-primary/20 transition-all duration-300 shadow-lg group-hover:shadow-xl">
            <Icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/95 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
