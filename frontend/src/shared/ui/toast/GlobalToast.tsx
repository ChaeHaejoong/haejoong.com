import { useToastStore } from "../../store/useToastStore";
import type { Toast, ToastType } from "../../store/useToastStore";
import { FiCheck, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi"; // 아이콘 조금 더 얇은 것으로 교체
import { useEffect } from "react";

const STYLES = {
  success: {
    icon: <FiCheck className="w-4 h-4 text-white" />,
    iconBg: "bg-green-500",
  },
  error: {
    icon: <FiAlertTriangle className="w-4 h-4 text-white" />,
    iconBg: "bg-red-500",
  },
  info: {
    icon: <FiInfo className="w-4 h-4 text-white" />,
    iconBg: "bg-primary",
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon, iconBg } = STYLES[toast.type];

  return (
    <div
      role="alert"
      className={`
        group relative flex items-center gap-4 w-full sm:min-w-[320px] sm:max-w-md
        backdrop-blur-md bg-bg-secondary
        px-4 py-4 rounded-2xl
        duration-300
        overflow-hidden pointer-events-auto
      `}
    >
      {/* 1. 아이콘을 원형 배경 안에 넣어 심볼릭하게 강조 */}
      <div
        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${iconBg} shadow-lg`}
      >
        {icon}
      </div>

      {/* 2. 텍스트 가독성 향상 */}
      <div className="flex-1 min-w-0">
        <p className="mt-0.5 text-[13px] text-body/80 wrap-break-word">
          {toast.message}
        </p>
      </div>

      {/* 3. 닫기 버튼을 좀 더 작고 깔끔하게 */}
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        className="shrink-0 p-1 rounded-lg text-subtle/40 hover:text-title hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        aria-label="닫기"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function GlobalToast() {
  const toasts = useToastStore((s) => s.toasts);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingToast");
    if (!raw) return;
    sessionStorage.removeItem("pendingToast");
    try {
      const { type, message } = JSON.parse(raw) as {
        type: ToastType;
        message: string;
      };
      push(message, type);
    } catch {
      /* ignore */
    }
  }, [push]);

  if (toasts.length === 0) return null;

  return (
    // 모바일에서는 상단 중앙, 데스크탑에서는 우측 하단 배치
    <div className="fixed top-6 left-1/2 z-100 flex w-[calc(100%-3rem)] -translate-x-1/2 flex-col items-center gap-3 sm:top-auto sm:right-8 sm:bottom-8 sm:left-auto sm:w-auto sm:translate-x-0 sm:items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
