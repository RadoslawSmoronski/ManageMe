import { Button } from "react-bootstrap";
import type { ButtonProps } from "react-bootstrap";

type AppButtonIntent = "primary" | "secondary" | "danger" | "ghost";

interface AppButtonProps extends Omit<ButtonProps, "variant"> {
  intent?: AppButtonIntent;
}

const INTENT_TO_VARIANT: Record<AppButtonIntent, NonNullable<ButtonProps["variant"]>> = {
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  ghost: "outline-secondary",
};

export default function AppButton({ intent = "primary", className, ...props }: AppButtonProps) {
  const intentClassName = intent === "primary" ? "app-btn-primary" : "";
  const mergedClassName = [intentClassName, className].filter(Boolean).join(" ");

  return (
    <Button
      variant={INTENT_TO_VARIANT[intent]}
      className={mergedClassName}
      {...props}
    />
  );
}
