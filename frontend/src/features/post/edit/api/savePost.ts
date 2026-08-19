import type { CreatePostDto, PostResponseDto } from "@haejoong.com/shared";
import { api } from "@/shared/api";

export async function savePost({
  title,
  content,
  thumbnail,
  published = false,
  tagIds,
}: CreatePostDto) {
  try {
    const res = await api.post<PostResponseDto>("/posts", {
      title,
      content,
      thumbnail,
      published,
      tagIds,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        (published ? "게시글 저장에 실패했습니다" : "임시저장에 실패했습니다"),
    );
  }
}
