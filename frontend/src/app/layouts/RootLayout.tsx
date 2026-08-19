import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";
import LoginModal from "@/features/auth/login/ui/LoginModal";
import { Outlet, useNavigation } from "react-router-dom";
import Loading from "@/app/ui/loading/Loading";

// 라우트 전환 시 단 하나의 전역 로딩 스피너를 렌더링합니다.
export default function RootLayout() {
  const { isOpen } = useLoginModalStore();
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <>
      {isNavigating && <Loading />}
      {isOpen && <LoginModal />}
      <Outlet />
    </>
  );
}
