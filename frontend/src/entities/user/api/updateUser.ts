import { api } from "@/shared/api";
import type { UpdateUserDto } from "@haejoong.com/shared";

export async function updateUser(userId: string, body: UpdateUserDto) {
  const { data } = await api.patch(`/users/${userId}`, body);
  return data;
}
