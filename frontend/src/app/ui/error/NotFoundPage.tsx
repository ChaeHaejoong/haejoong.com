import OrangeButton from "@/shared/ui/button/OrangeButton";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-body px-6 text-center">
      <img src="/imgs/logo.png" alt="logo" className="w-24 mb-20" />

      <h1 className="text-5xl font-bold text-title mb-4">404 NotFoundError</h1>

      <p className="text-secondary mb-8">
        요청한 페이지를 찾을 수 없어요.
        <br />
        아래 버튼을 누르면 오리가 돌아가는 길을 알려줄거에요.
      </p>

      <Link to="/">
        <OrangeButton>홈으로 돌아가기</OrangeButton>
      </Link>
    </div>
  );
}
