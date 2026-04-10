"use client";

import { useOnboarding } from "@/lib/hooks/use-onboarding";
import { OnboardingModal } from "./onboarding-modal";

export function OnboardingTrigger() {
  const { showOnboarding, completeOnboarding } = useOnboarding();

  if (!showOnboarding) return null;

  return <OnboardingModal onComplete={completeOnboarding} />;
}
