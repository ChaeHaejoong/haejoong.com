import type { UserResponseDto } from "@haejoong.com/shared";

type AdminUserSectionProps = {
  users: UserResponseDto[];
  isLoading: boolean;
  isPending: boolean;
  currentUserId?: string;
  onRename: (user: UserResponseDto) => void;
  onDelete: (user: UserResponseDto) => void;
};

export default function AdminUserSection({
  users,
  isLoading,
  isPending,
  currentUserId,
  onRename,
  onDelete,
}: AdminUserSectionProps) {
  return (
    <section className="rounded-2xl border border-divider p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-title">유저 관리</h2>
        </div>
        <div className="rounded-lg border border-divider bg-bg px-3 py-1.5 text-xs text-subtle">
          {users.length}
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-subtle">불러오는 중</div>
      ) : (
        <div className="space-y-2">
          {users.map((targetUser) => {
            const isCurrentUser = targetUser.id === currentUserId;

            return (
              <article
                key={targetUser.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-divider p-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-title">
                      {targetUser.nickname}
                    </h3>
                    <span className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs text-subtle">
                      {targetUser.userId}
                    </span>
                    <span className="rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary">
                      {targetUser.role}
                    </span>
                    {isCurrentUser && (
                      <span className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs text-subtle">
                        현재 계정
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-subtle">
                    {new Date(targetUser.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onRename(targetUser)}
                    disabled={isPending}
                    className="rounded-lg border border-divider px-3 py-1.5 text-xs text-body disabled:opacity-50"
                  >
                    닉네임 수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(targetUser)}
                    disabled={isPending || isCurrentUser}
                    className="rounded-lg border border-divider px-3 py-1.5 text-xs text-error disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
