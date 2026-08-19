import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

type AdminHeroProps = {
  draftCount: number;
  publishedCount: number;
  userCount: number;
};

export default function AdminHero({
  draftCount,
  publishedCount,
  userCount,
}: AdminHeroProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-divider pb-6">
      <h1 className="text-xl font-semibold text-title">Admin</h1>

      <div className="flex flex-wrap items-center gap-5 text-sm text-subtle">
        <span>
          임시저장 <span className="font-medium text-title">{draftCount}</span>
        </span>
        <span>
          게시글{" "}
          <span className="font-medium text-title">{publishedCount}</span>
        </span>
        <span>
          유저 <span className="font-medium text-title">{userCount}</span>
        </span>
        <Link
          to="/posts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm text-white"
        >
          새 글 작성
          <FiArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
