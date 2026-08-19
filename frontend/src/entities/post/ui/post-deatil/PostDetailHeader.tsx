import { formatDate } from "@/shared/lib/formatDate";
import { FiClock, FiEye, FiMessageCircle, FiEdit } from "react-icons/fi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import type { TagDto } from "@haejoong.com/shared";

export type PostDetailHeaderProps = {
  title: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  comments: number;
  createdAt: Date;
  contentUpdatedAt: Date | null;
  tags?: TagDto[];
};

export default function PostDetailHeader({
  title,
  views,
  likes,
  isLiked = false,
  comments,
  createdAt,
  contentUpdatedAt,
  tags,
}: PostDetailHeaderProps) {
  return (
    <header className="flex flex-col pt-3 md:pt-6 gap-1 pb-2 md:pb-4 border-b-2 border-divider">
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <span key={tag.id} className="text-xs md:text-sm px-1 text-subtle">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-title mb-5 mt-1">
        {title}
      </h1>

      <div className="flex items-center justify-between sm:gap-4 text-[10px] sm:text-sm text-subtle">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-0.5 md:gap-1">
            <FiClock className="shrink-0 icon-align" />
            <span>{formatDate(createdAt)}</span>
          </div>
          {contentUpdatedAt && (
            <div className="flex items-center gap-0.5 md:gap-1">
              <FiEdit className="shrink-0 icon-align" />
              <span>수정 {formatDate(contentUpdatedAt)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] md:text-sm">
          <div className="flex items-center gap-0.5 md:gap-1">
            <FiEye className="icon-align" />
            <span>{views}</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-0.5 md:gap-1 transition-colors hover:text-red-500"
          >
            {isLiked ? (
              <AiFillHeart className="text-red-500 icon-align" />
            ) : (
              <AiOutlineHeart className="icon-align" />
            )}
            <span>{likes}</span>
          </button>

          <div className="flex items-center gap-0.5 md:gap-1">
            <FiMessageCircle className="icon-align" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
