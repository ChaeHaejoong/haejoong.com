import { api } from "@/shared/api";
import type { RegisterDto } from "@haejoong.com/shared";

export async function register(data: RegisterDto) {
  return api.post("/auth/register", data);
}
