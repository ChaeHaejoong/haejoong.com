import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

type OverlayProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Overlay({ children, onClick }: OverlayProps) {
  useLockBodyScroll();

  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay animate-modal-in"
    >
      {children}
    </div>
  );
}
