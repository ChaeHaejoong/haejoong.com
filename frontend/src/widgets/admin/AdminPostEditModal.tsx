import { useState } from "react";
import type { PostResponseDto } from "@haejoong.com/shared";
import { useTags } from "@/entities/tag/model/useTags";
import ModalOverlay from "@/shared/ui/overlay/ModalOverlay";

interface AdminPostEditModalProps {
  post: PostResponseDto;
  onConfirm: (title: string, tagIds: string[]) => void;
  onClose: () => void;
}

export default function AdminPostEditModal({
  post,
  onConfirm,
  onClose,
}: AdminPostEditModalProps) {
  const [title, setTitle] = useState(post.title);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post.tags?.map((t) => t.id) ?? [],
  );
  const { data: tags = [] } = useTags();

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onConfirm(trimmed, selectedTagIds);
  };

  return (
    <ModalOverlay modalClose={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-bg p-6 shadow-lg">
        <h2 className="mb-5 text-base font-semibold text-title">게시글 수정</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-title">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full rounded-xl border border-divider bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {tags.length > 0 && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-title">
              태그
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-bg-subtle text-subtle hover:bg-bg-primary"
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-divider px-4 py-2 text-sm text-body hover:bg-bg-subtle"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-xl bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
