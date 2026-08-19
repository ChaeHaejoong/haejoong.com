import PostDetailBody from "@/entities/post/ui/post-deatil/PostDeatilBody";
import PostDetailHeader from "@/entities/post/ui/post-deatil/PostDetailHeader";
import PostDetailThumbnail from "@/entities/post/ui/post-deatil/PostDetailThumbnail";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { usePost } from "@/entities/post/model/usePost";
import { usePostLikeAction } from "@/features/post/like/hooks/usePostLikeAction";
import { recordView } from "@/entities/post/api/recordView";
import type { PostResponseDto } from "@haejoong.com/shared";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import usePostDetailScrollProgress from "./model/usePostDetailScrollProgress";
import useHideDetailScrollbar from "./model/useHideDetailScrollbar";

export default function PostDetailPage() {
  const { id } = useParams();
  // loader가 캐시를 미리 적재하므로 usePost는 즉시 데이터를 반환합니다.
  useLoaderData() as PostResponseDto;
  const { data: post } = usePost(id!);
  // 좋아요 클릭 로직(로그인 체크, 모달, 뮤테이션)은 features/post/like가 담당합니다.
  const { handleLikeClick, isLikePending } = usePostLikeAction(id!);
  const navigate = useNavigate();
  const scrollProgress = usePostDetailScrollProgress();
  useHideDetailScrollbar();

  // 조회수는 PostDetailPage 마운트 시 한 번만 기록합니다.
  // strictMode에서 두 번 실행되어도 백엔드 dedup(Redis NX)이 중복을 막습니다.
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    void recordView(id!);
  }, [id]);

  if (!post) return null;

  const {
    thumbnail,
    title,
    content,
    views,
    likes,
    isLiked,
    comments,
    createdAt,
    contentUpdatedAt,
    tags,
  } = post;

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-60 h-0.5 w-full bg-primary/20">
        <div
          className="h-full bg-primary transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-0 sm:px-0">
        <PostDetailHeader
          title={title}
          views={views}
          comments={comments}
          likes={likes}
          isLiked={isLiked}
          createdAt={createdAt}
          contentUpdatedAt={contentUpdatedAt}
          tags={tags}
        />
        <PostDetailThumbnail thumbnail={thumbnail} />
        <PostDetailBody content={content} />

        <section className="flex justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}/comments`)}
            className="flex items-center gap-2 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-title shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <IoChatbubbleOutline className="w-4 h-4 sm:w-5 sm:h-5 icon-align" />
            <span className="text-xs sm:text-sm font-medium">{comments}</span>
          </button>

          <button
            type="button"
            onClick={handleLikeClick}
            disabled={isLikePending}
            className="flex gap-2 rounded-full border border-red-500 px-4 sm:px-5 py-2 sm:py-2.5 text-title shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {isLiked ? (
              <AiFillHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-heartBeat icon-align" />
            ) : (
              <AiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 icon-align" />
            )}
            <span className="text-xs sm:text-sm font-medium">{likes}</span>
          </button>
        </section>
      </div>
    </>
  );
}
