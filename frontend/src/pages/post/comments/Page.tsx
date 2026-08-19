import CommentListHeader from "@/entities/comment/ui/CommentListHeader";
import CommentWriteForm from "@/features/comment/write/ui/CommentWriteForm";
import CommentList from "@/widgets/comment/ui/CommentList";
import { useNavigate, useParams } from "react-router-dom";
import { usePost } from "@/entities/post/model/usePost";
import { IoArrowBack } from "react-icons/io5";

export default function PostCommentsPage() {
  const { id } = useParams();
  const { data: post } = usePost(id!);
  const navigate = useNavigate();

  if (!post) return null;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-4xl grow flex-col overflow-hidden">
      <header className="flex flex-none items-center gap-2 py-1 md:gap-3 md:py-4">
        <button
          type="button"
          onClick={() => navigate(`/posts/${post.id}`)}
          className="p-1.5 sm:p-2 rounded-full hover:bg-bg-subtle transition-colors text-title cursor-pointer shrink-0"
        >
          <IoArrowBack className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <CommentListHeader comments={post.comments} title={post.title} />
      </header>

      <main className="min-h-0 grow overflow-y-auto">
        <CommentList postId={id!} />
      </main>

      <div className="mt-auto flex-none md:py-3">
        <CommentWriteForm postId={id!} />
      </div>
    </div>
  );
}
