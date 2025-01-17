import { cn } from "@/lib/utils";

interface StepContainerProps {
  step: "members" | "details";
  isActive: boolean;
  children: React.ReactNode;
}
export const StepContainer = ({
  step,
  isActive,
  children,
}: StepContainerProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 p-4",
        "transition-all duration-300",
        isActive
          ? "opacity-100 translate-x-0"
          : "opacity-0 pointer-events-none",
        !isActive && step === "members" ? "translate-x-full" : "translate-x-0"
      )}
    >
      {children}
    </div>
  );
};
