import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/entities/user/api/getMe";
import { UserRole, type UserResponseDto } from "@haejoong.com/shared";

export function useMe() {
  const { data: user, isLoading } = useQuery<UserResponseDto>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    isAdmin: user?.role === UserRole.ADMIN,
    avatar: user?.avatarUrl ?? "/imgs/icon.png",
  };
}
