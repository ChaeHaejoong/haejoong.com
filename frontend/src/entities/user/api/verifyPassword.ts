import { api } from "@/shared/api";

export async function verifyPassword(password: string) {
  const { data } = await api.post<{ verified: boolean }>(
    "/auth/verify-password",
    {
      password,
    },
  );

  return data;
}
