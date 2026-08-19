import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface PostLikeCtaProps {
  likes: number;
  isLiked?: boolean;
  onLikeClick?: () => void;
  isLoading?: boolean;
}

export default function PostLikeCta({
  likes,
  isLiked = false,
  onLikeClick,
  isLoading = false,
}: PostLikeCtaProps) {
  return (
    <section className="mt-10 mb-8 rounded-2xl flex justify-between">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-title mb-1">
              글을 다 읽었다면 좋아요를 눌러보세요
            </h3>
            <p className="text-sm text-subtle">
              주인장이 어렵게 만든 좋아요 클릭 애니메이션을 볼 수 있어요
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onLikeClick}
        disabled={isLoading}
        className="group flex items-center gap-2 rounded-full border  px-4 text-title shadow-sm transition-all hover:-translate-y-0.5 border-red-500 hover:shadow-md "
      >
        {isLiked ? (
          <AiFillHeart className="h-5 w-5 animate-heartBeat -translate-y-0.5" />
        ) : (
          <AiOutlineHeart className="h-5 w-5 transition-colors text-red-500 -translate-y-0.5" />
        )}
        <span className="text-sm font-medium">{likes}</span>
      </button>
    </section>
  );
}
