import { queryClient } from "@/app/queryClient";
import { getMe } from "@/entities/user/api/getMe";
import {
  fetchAdminUsers,
  fetchDraftPosts,
  fetchPublishedPosts,
} from "@/pages/admin/api";
import { UserRole } from "@haejoong.com/shared";
import { redirect } from "react-router-dom";

// 관리자 권한 확인 후 데이터를 병렬로 프리패치해 React Query 캐시에 적재합니다.
// 비관리자는 홈으로 리다이렉트됩니다.
export async function adminPageLoader() {
  let user;
  try {
    user = await getMe();
  } catch {
    throw redirect("/");
  }

  if (user.role !== UserRole.ADMIN) {
    throw redirect("/");
  }

  // 사용자 정보 캐시 적재
  queryClient.setQueryData(["me"], user);

  // 관리자 데이터를 병렬로 프리패치
  const [draftPosts, publishedPosts, users] = await Promise.all([
    fetchDraftPosts(),
    fetchPublishedPosts(),
    fetchAdminUsers(),
  ]);

  queryClient.setQueryData(["admin", "draft-posts"], draftPosts);
  queryClient.setQueryData(["admin", "published-posts"], publishedPosts);
  queryClient.setQueryData(["admin", "users"], users);

  return { user };
}
