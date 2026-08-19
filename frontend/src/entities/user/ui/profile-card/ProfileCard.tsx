import { getImageUrl } from "@/shared/lib/getImageUrl";
import type { UserResponseDto } from "@haejoong.com/shared";

export default function ProfileCard({ user }: { user: UserResponseDto }) {
  const joinedAt = new Date(user.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <img
        src={getImageUrl(user.avatarUrl) || "/imgs/icon.png"}
        alt={`${user.nickname} 아바타`}
        className="h-20 w-20 rounded-full border border-divider object-cover sm:h-24 sm:w-24"
      />

      <div className="min-w-0 space-y-2">
        <h1 className="truncate text-2xl font-bold tracking-tight text-title sm:text-3xl">
          {user.nickname}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-subtle">
          <span>@{user.userId}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{joinedAt} 가입</span>
        </div>
      </div>
    </div>
  );
}
