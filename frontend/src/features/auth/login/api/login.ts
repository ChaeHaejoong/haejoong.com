import { api, setAccessToken } from "@/shared/api";
import type { LoginDto, TokenResponseDto } from "@haejoong.com/shared";

export async function login(data: LoginDto) {
  const res = await api.post<TokenResponseDto>("/auth/login", data);
  setAccessToken(res.data.accessToken);
  return res.data;
}
