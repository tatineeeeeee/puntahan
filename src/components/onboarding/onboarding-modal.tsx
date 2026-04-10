"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface OnboardingModalProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: "🌴",
    title: "Welcome to puntahan!",
    description:
      "Your community-powered travel guide for the Philippines. Discover destinations with honest tips and real peso breakdowns from fellow travelers.",
  },
  {
    icon: "🗺️",
    title: "Discover Destinations",
    description:
      "Browse by region, filter by budget, search by name, or explore the map. Find your next adventure with ratings and photos from the community.",
  },
  {
    icon: "💬",
    title: "Share Your Tips",
    description:
      "Been somewhere amazing? Share your experience, budget breakdown, and photos. Upvote helpful tips so the best advice rises to the top.",
  },
  {
    icon: "📋",
    title: "Plan Your Trip",
    description:
      "Create itineraries, invite your barkada to vote on destinations, and organize your travel plans with checklists and journals.",
  },
];

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog on mount for accessibility
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Escape key closes
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onComplete();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const current = steps[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50"
      onClick={onComplete}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Onboarding walkthrough"
        tabIndex={-1}
        className="w-full max-w-md rounded-xl bg-warm-white p-6 shadow-lg mx-4 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step content */}
        <div
          key={step}
          style={{ animation: "onboarding-slide 0.3s ease-out" }}
        >
          <div className="flex h-28 items-center justify-center">
            <span className="text-6xl" role="img" aria-hidden="true">
              {current.icon}
            </span>
          </div>
          <h2 className="mt-2 text-center text-xl font-bold text-charcoal">
            {current.title}
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-charcoal/80">
            {current.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? "bg-coral" : "bg-warm-gray/30"
              }`}
              aria-label={`Step ${i + 1} of ${steps.length}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onComplete}>
            Skip
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleNext}>
              {step === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
