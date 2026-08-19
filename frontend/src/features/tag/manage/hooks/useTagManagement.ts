import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTags } from "@/entities/tag/model/useTags";
import { createTag } from "@/entities/tag/api/createTag";
import { deleteTag } from "@/entities/tag/api/deleteTag";
import { toast } from "@/shared/store/useToastStore";

export function useTagManagement() {
  const queryClient = useQueryClient();
  const { data: tags = [], isLoading } = useTags();

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("태그가 추가되었어요");
    },
    onError: () => {
      toast.error("태그 추가에 실패했어요");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("태그가 삭제되었어요");
    },
    onError: () => {
      toast.error("태그 삭제에 실패했어요");
    },
  });

  return {
    tags,
    isLoading,
    createTag: createMutation.mutate,
    deleteTag: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
