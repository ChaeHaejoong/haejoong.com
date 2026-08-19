import { queryClient } from "@/app/queryClient";
import { getMe } from "@/entities/user/api/getMe";
import { redirect } from "react-router-dom";

// 로그인 여부를 확인하고 사용자 정보를 캐시에 적재합니다.
// 비로그인 상태이면 홈으로 리다이렉트합니다.
export async function myPageLoader() {
  try {
    const user = await getMe();
    queryClient.setQueryData(["me"], user);
    return { user };
  } catch {
    throw redirect("/");
  }
}
