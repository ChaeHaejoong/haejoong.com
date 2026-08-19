import type { ComponentPropsWithoutRef } from "react";

interface OrangeButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
}

export default function OrangeButton({
  children,
  className,
  ...props
}: OrangeButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl cursor-pointer border border-primary bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
