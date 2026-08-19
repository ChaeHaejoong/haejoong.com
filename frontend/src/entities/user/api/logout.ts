import { queryClient } from "@/app/queryClient";
import { api, setAccessToken } from "@/shared/api";

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
    queryClient.removeQueries();
    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({ type: "info", message: "로그아웃 성공" }),
    );
    window.location.replace("/");
  }
};
