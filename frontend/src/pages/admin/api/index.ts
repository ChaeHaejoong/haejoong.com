import type {
  PostResponseDto,
  UpdatePostDto,
  UpdateUserDto,
  UserResponseDto,
} from "@haejoong.com/shared";
import { api } from "@/shared/api";

export async function fetchDraftPosts(): Promise<PostResponseDto[]> {
  const { data } = await api.get("/posts/drafted");
  return data;
}

export async function fetchPublishedPosts(): Promise<PostResponseDto[]> {
  const { data } = await api.get("/posts/published");
  return data;
}

export async function updateAdminPost(
  postId: string,
  dto: UpdatePostDto,
): Promise<PostResponseDto> {
  const { data } = await api.put(`/posts/${postId}`, dto);
  return data;
}

export async function deleteAdminPost(postId: string): Promise<void> {
  await api.delete(`/posts/${postId}`);
}

export async function fetchAdminUsers(): Promise<UserResponseDto[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function updateAdminUser(
  userId: string,
  dto: UpdateUserDto,
): Promise<UserResponseDto> {
  const { data } = await api.patch(`/users/${userId}`, dto);
  return data;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}
