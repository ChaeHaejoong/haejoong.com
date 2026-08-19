import { useState } from "react";
import { useCreateComment } from "@/entities/comment/model/useComments";
import { createCommentSchema } from "@haejoong.com/shared";
import type { CreateCommentDto } from "@haejoong.com/shared";

export function useCommentWrite(postId: string) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateComment(postId);

  const handleSubmit = async (parentId?: string) => {
    setError(null);

    const dto: CreateCommentDto = {
      content: content.trim(),
      parentId: parentId ?? null,
    };

    // 클라이언트 검증
    const result = createCommentSchema.safeParse(dto);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "입력 값을 확인해 주세요");
      return;
    }

    await createMutation.mutateAsync(dto);
    setContent("");
  };

  return {
    content,
    setContent,
    error,
    handleSubmit,
    isLoading: createMutation.isPending,
  };
}
