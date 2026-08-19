import ModalOverlay from "@/shared/ui/overlay/ModalOverlay";
import useLogin from "../hooks/useLogin";
import { useLoginModalStore } from "../store/useLoginModalStore";
import { Link } from "react-router-dom";

export default function LoginModal() {
  const { close } = useLoginModalStore();
  const { form, loading, onChange, onSubmit } = useLogin(close);

  return (
    <ModalOverlay modalClose={close}>
      <div className="w-full max-w-sm rounded-xl p-5 sm:p-8 shadow-xl bg-bg flex flex-col items-center border border-divider">
        <img src="/imgs/logo.png" className="w-8 sm:w-10 mb-6 sm:mb-10" />

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
          <input
            type="text"
            value={form.userId}
            name="userId"
            placeholder="아이디"
            onChange={onChange}
            className="w-full border border-divider rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={form.password}
            name="password"
            placeholder="비밀번호"
            onChange={onChange}
            className="w-full border border-divider rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary rounded-lg py-2 font-medium hover:opacity-90 transition text-white disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex gap-3 text-xs md:text-sm text-muted mt-4">
          <Link to="/register" onClick={close} className="hover:underline">
            3초 회원가입
          </Link>
          <span>|</span>
          <button className="hover:underline">비밀번호 찾기</button>
        </div>
      </div>
    </ModalOverlay>
  );
}
