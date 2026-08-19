export default function CommentListHeader({
  comments,
  title,
}: {
  comments: number;
  title: string;
}) {
  return (
    <div className="py-1 min-w-0">
      <p className="font-semibold text-title text-lg sm:text-2xl flex gap-1">
        댓글
        <span>{comments}</span>
      </p>
      <h1 className="text-xs sm:text-sm text-muted truncate">{title}</h1>
    </div>
  );
}
