import { useTogglePostLike } from "@/entities/post/model/usePost";
import { useMe } from "@/entities/user/model/useMe";
import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";
import { useModalStore } from "@/shared/store/useModalStore";

// 좋아요 클릭 시 로그인 여부 체크, 모달 안내, 뮤테이션 실행까지
// features/post/like의 관심사로 캡슐화합니다.
export function usePostLikeAction(postId: string) {
  const toggleLikeMutation = useTogglePostLike(postId);
  const { isLoggedIn } = useMe();
  const openModal = useModalStore((state) => state.openModal);
  const openLoginModal = useLoginModalStore((state) => state.open);

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      openModal({
        message: "로그인 하면 좋아요를 누를 수 있어요",
        onConfirm: () => openLoginModal(),
      });
      return;
    }
    toggleLikeMutation.mutate();
  };

  return { handleLikeClick, isLikePending: toggleLikeMutation.isPending };
}
