interface CommentReplyFormProps {
  value: string;
  onChange: (value: string) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export default function CommentReplyForm({
  value,
  onChange,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: CommentReplyFormProps) {
  return (
    <div
      className="flex w-full flex-col gap-2 sm:flex-row"
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        placeholder="답글 달기..."
        className="h-10 max-h-28 min-h-10 w-full rounded-2xl border border-divider bg-bg px-3 py-2 text-sm text-body resize-none outline-none transition-colors focus:border-primary sm:flex-1"
        rows={1}
      />

      <div className="flex items-center justify-end gap-2 sm:flex-none">
        {onCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            onDoubleClick={(e) => e.stopPropagation()}
            className="h-8 md:h-10 rounded-xl border border-divider px-3 text-sm text-subtle transition-colors hover:text-title"
          >
            취소
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSubmit?.();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          disabled={isSubmitting || !value.trim()}
          className="h-8 md:h-10 rounded-xl bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? "작성 중" : "확인"}
        </button>
      </div>
    </div>
  );
}
