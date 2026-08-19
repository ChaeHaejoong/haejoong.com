import { useLoginModalStore } from "@/features/auth/login/store/useLoginModalStore";
import ThemeToggle from "@/features/dark-mode/ui/ThemeToggle";
import { Link } from "react-router-dom";
import { useMe } from "../../entities/user/model/useMe";
import MyPageButton from "@/entities/user/ui/my-page-button/MyPageButton";
import { FiUser } from "react-icons/fi";

export default function Nav() {
  const open = useLoginModalStore((state) => state.open);
  const isOpen = useLoginModalStore((state) => state.isOpen);
  const { isLoggedIn } = useMe();

  return (
    <div className="whitespace-nowrap border-b px-layout border-divider flex place-items-center select-none h-13 md:h-20 gap-5">
      <Link to={"/"}>
        <div className="flex place-items-center cursor-pointer">
          <img src="/imgs/logo.png" className="h-6 md:h-8" />
          <p className="md:text-xl ml-2 font-semibold">해중.com</p>
        </div>
      </Link>
      <div className="flex-1" />
      <ThemeToggle />

      {isLoggedIn ? (
        <MyPageButton />
      ) : (
        <button
          onClick={open}
          className={`flex items-center gap-1.5 text-sm font-medium border rounded-full px-3 py-1.5 ${isOpen ? "border-primary text-primary" : "text-subtle border-divider"} active:scale-95 cursor-pointer`}
        >
          <FiUser className="w-4 h-4" />
          <span>로그인</span>
        </button>
      )}
    </div>
  );
}
