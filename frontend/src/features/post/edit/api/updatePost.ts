import type { UpdatePostDto, PostResponseDto } from "@haejoong.com/shared";
import { api } from "@/shared/api";

export async function updatePost(
  postId: string,
  dto: UpdatePostDto,
): Promise<PostResponseDto> {
  try {
    const res = await api.put<PostResponseDto>(`/posts/${postId}`, dto);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        (dto.published
          ? "게시글 저장에 실패했습니다"
          : "임시저장에 실패했습니다"),
    );
  }
}
