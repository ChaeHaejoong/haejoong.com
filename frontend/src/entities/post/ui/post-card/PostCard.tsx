import { Link } from "react-router-dom";
import { FiClock, FiEye, FiHeart, FiMessageCircle } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { formatDate } from "@/shared/lib/formatDate";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import type { TagDto } from "@haejoong.com/shared";

export type PostCardProps = {
  id: string;
  thumbnail: string;
  title: string;
  createdAt: Date;
  contentUpdatedAt: Date | null;
  views: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
  tags?: TagDto[];
};

export default function PostCard({
  id,
  thumbnail,
  title,
  createdAt,
  views,
  likes,
  comments,
  isLiked,
  tags,
}: PostCardProps) {
  const displayDate = createdAt;
  const displayThumbnail = getImageUrl(thumbnail);

  return (
    <Link to={`/posts/${id}`}>
      <div className="flex gap-4 py-2 md:py-4 border-b border-divider cursor-pointer">
        {displayThumbnail && (
          <div className="shrink-0 w-24 h-24 md:w-35 md:h-35 rounded-lg overflow-hidden">
            <img
              src={displayThumbnail}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <h2 className="text-lg md:text-2xl font-semibold text-title line-clamp-2 leading-snug">
            {title}
          </h2>

          <div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[10px] md:text-xs px-1 py-0.5 rounded-md bg-bg-subtle text-subtle"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 text-[10px] md:text-sm text-muted mt-2">
              <div className="flex items-center gap-0.5 md:gap-1">
                <FiClock className="-translate-y-0.5" />
                <span>{formatDate(displayDate)}</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-0.5 md:gap-1">
                  <FiEye className="-translate-y-0.5" />
                  <span>{views}</span>
                </div>

                <div className="flex items-center gap-0.5 md:gap-1">
                  {isLiked ? (
                    <AiFillHeart
                      className="-translate-y-0.5 text-red-500"
                    />
                  ) : (
                    <FiHeart className="-translate-y-0.5" />
                  )}
                  <span>{likes}</span>
                </div>

                <div className="flex items-center gap-0.5 md:gap-1">
                  <FiMessageCircle className="-translate-y-0.5" />
                  <span>{comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
