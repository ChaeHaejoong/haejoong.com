import { refreshAccessToken, setAccessToken } from "@/shared/api";
import { queryClient } from "../queryClient";

export async function initAuth(): Promise<void> {
  try {
    const newToken = await refreshAccessToken();
    setAccessToken(newToken);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  } catch {
    // 비로그인(Guest) 상태 — 토큰 없음
  }
}
