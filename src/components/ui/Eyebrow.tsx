import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn("block", className)}
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--fg-muted)",
      }}
    >
      {children}
    </span>
  );
}
