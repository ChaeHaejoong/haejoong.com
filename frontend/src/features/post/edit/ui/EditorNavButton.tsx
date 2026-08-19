import type { ReactNode } from "react";

type EditorButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

export default function EditorNavButton({
  children,
  onClick,
}: EditorButtonProps) {
  return (
    <button
      className="border border-divider rounded-xl p-2 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
