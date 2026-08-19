import useMyPage from "./model/useMyPage";
import MyPageCommentsSection from "./ui/MyPageCommentsSection";
import MyPageProfileSection from "./ui/MyPageProfileSection";

export default function MyPage() {
  const {
    user,
    isAdmin,
    page,
    setPage,
    myComments,
    totalPages,
    total,
    isCommentsFetching,
    handleEditMyComment,
    handleDeleteMyComment,
  } = useMyPage();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <MyPageProfileSection user={user} isAdmin={isAdmin} />
      <div className="mt-12">
        <MyPageCommentsSection
          comments={myComments}
          total={total}
          totalPages={totalPages}
          page={page}
          isCommentsFetching={isCommentsFetching}
          onPageChange={setPage}
          onEditComment={handleEditMyComment}
          onDeleteComment={handleDeleteMyComment}
        />
      </div>
    </div>
  );
}
