import { useCommentWrite } from "../hooks/useCommentWrite";
import { useMe } from "@/entities/user/model/useMe";
import { useModalStore } from "@/shared/store/useModalStore";
import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";

interface CommentWriteFormProps {
  postId: string;
}

export default function CommentWriteForm({ postId }: CommentWriteFormProps) {
  const { content, setContent, handleSubmit, isLoading } =
    useCommentWrite(postId);
  const { user } = useMe();
  const openModal = useModalStore((state) => state.openModal);
  const openLoginModal = useLoginModalStore((state) => state.open);

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!user) {
      openModal({
        message: "로그인하면 댓글을 작성할 수 있어요",
        onConfirm: () => openLoginModal(),
      });
      return;
    }
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 px-1 sm:gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글 달기..."
        className="h-10 max-h-28 min-h-10 flex-1 rounded-2xl border border-divider bg-bg px-3 py-2 text-sm text-body resize-none outline-none transition-colors focus:border-primary"
        rows={1}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="h-10 rounded-xl bg-primary px-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        {isLoading ? "작성 중" : "확인"}
      </button>
    </form>
  );
}
