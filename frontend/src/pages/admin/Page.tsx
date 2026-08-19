import AdminCommentSection from "@/widgets/admin/AdminCommentSection";
import AdminHero from "@/widgets/admin/AdminHero";
import AdminPostSection from "@/widgets/admin/AdminPostSection";
import AdminTagSection from "@/widgets/admin/AdminTagSection";
import AdminUserSection from "@/widgets/admin/AdminUserSection";
import { useAdminPage } from "./model/useAdminPage";

// loader가 권한 확인 및 데이터 캐시 적재를 담당하므로
// 여기서는 isLoading / isAdmin 분기가 필요 없습니다.
export default function AdminPage() {
  const {
    user,
    draftPosts,
    publishedPosts,
    users,
    filteredComments,
    commentAuthors,
    selectedCommentPostId,
    selectedNickname,
    setSelectedCommentPostId,
    setSelectedNickname,
    isDraftsLoading,
    isPublishedPostsLoading,
    isUsersLoading,
    isCommentsLoading,
    isPostsPending,
    isUsersPending,
    isCommentsPending,
    handleEditPost,
    handleTogglePublish,
    handleDeletePost,
    handleRenameUser,
    handleDeleteUser,
    handleEditComment,
    handleDeleteComment,
  } = useAdminPage();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <AdminHero
        draftCount={draftPosts.length}
        publishedCount={publishedPosts.length}
        userCount={users.length}
      />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AdminPostSection
          title="임시저장"
          emptyMessage="임시저장된 글이 없습니다."
          posts={draftPosts}
          isLoading={isDraftsLoading}
          isPending={isPostsPending}
          primaryActionLabel="게시"
          onPrimaryAction={(post) => handleTogglePublish(post, true)}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />

        <AdminPostSection
          title="게시중"
          emptyMessage="게시된 글이 없습니다."
          posts={publishedPosts}
          isLoading={isPublishedPostsLoading}
          isPending={isPostsPending}
          primaryActionLabel="임시전환"
          onPrimaryAction={(post) => handleTogglePublish(post, false)}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <AdminUserSection
          users={users}
          isLoading={isUsersLoading}
          isPending={isUsersPending}
          currentUserId={user?.id}
          onRename={handleRenameUser}
          onDelete={handleDeleteUser}
        />

        <AdminCommentSection
          posts={publishedPosts}
          selectedPostId={selectedCommentPostId}
          selectedNickname={selectedNickname}
          authors={commentAuthors}
          comments={filteredComments}
          isLoading={isCommentsLoading}
          isPending={isCommentsPending}
          onSelectPost={setSelectedCommentPostId}
          onSelectNickname={setSelectedNickname}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      </div>

      <div className="mt-8">
        <AdminTagSection />
      </div>
    </div>
  );
}
