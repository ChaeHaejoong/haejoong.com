import ProfileCard from "@/entities/user/ui/profile-card/ProfileCard";
import OrangeButton from "@/shared/ui/button/OrangeButton";
import { Link } from "react-router-dom";
import { logout } from "@/entities/user/api/logout";
import type { UserResponseDto } from "@haejoong.com/shared";

interface MyPageProfileSectionProps {
  user: UserResponseDto;
  isAdmin: boolean;
}
export default function MyInfo({ user, isAdmin }: MyPageProfileSectionProps) {
  return (
    <div className="space-y-5 border-b border-divider pb-7 sm:pb-9">
      <p className="text-sm font-medium text-subtle">내 정보</p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <ProfileCard user={user} />

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center lg:justify-end">
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-divider px-4 text-sm font-medium text-title transition-colors hover:border-primary/50 hover:text-primary"
            >
              관리자
            </Link>
          )}
          <OrangeButton onClick={logout} className="h-9 px-4">
            로그아웃
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}
